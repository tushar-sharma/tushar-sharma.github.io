---
layout: post
title: Handling Kafka Poison Pills in Reactive Spring Boot Applications
image: https://unsplash.com/photos/h1xOm9iffKQ/download?w=437
thumb: https://unsplash.com/photos/h1xOm9iffKQ/download?w=437
author: tushar sharma
tags:
 - kafka
 - spring-boot
 - reactive
category: blog
---

A single malformed Kafka message can silently halt your entire consumer group. If you've ever been paged at 2 AM because messages stopped processing and your consumer lag was climbing, there's a good chance you were dealing with a poison pill. Here's how to handle it in a reactive Spring Boot application.<!-- truncate_here -->

A single malformed Kafka message can silently halt your entire consumer group. If you've ever been paged at 2 AM because messages stopped processing and your consumer lag was climbing, there's a good chance you were dealing with a poison pill. Here's how to handle it in a reactive Spring Boot application.

## What's a Kafka Poison Pill?

A poison pill is a message that a consumer can never successfully process. The most common cause is a deserialization failure — a producer sends a message in a format the consumer doesn't expect (malformed JSON, an incompatible schema version, or raw bytes where structured data was expected).

Here's what makes it dangerous: Kafka's offset commit model means a consumer won't advance past a message it can't process. The consumer retries the same broken message indefinitely, blocking every subsequent message in that partition. Meanwhile, consumer lag grows, alerts fire, and downstream systems starve.

## The Failure Mode

Consider a consumer expecting JSON messages conforming to this record:

```java
public record KafkaMessage(String name, int id) {}
```

A producer sends this malformed payload (note the trailing comma):

```json
{"id": 1, "name": "Tushar", }
```

The consumer's `JsonDeserializer` throws a `RecordDeserializationException` *before* your application code ever sees the message. Since the record never reaches your `doOnNext` handler, the offset is never acknowledged. The consumer re-fetches the same record, fails again, and you're stuck in an infinite loop:

```
ERROR RecordDeserializationException: Error deserializing VALUE
      for partition my-topic-0 at offset 243.
      If needed, please seek past the record to continue consumption.
Caused by: JsonParseException: Unexpected character ('}' (code 125)):
      was expecting double-quote to start field name
```

This blocks the entire partition — not just one message.

## The Solution: `ErrorHandlingDeserializer`

Spring Kafka's `ErrorHandlingDeserializer` wraps your actual deserializer and catches any exception it throws. Instead of propagating the error, it:

1. Returns `null` as the deserialized value
2. Stores the original exception in the record's headers (under `springDeserializationException`)

This means your consumer code *always* receives the record, even when deserialization fails. You can then inspect the value, detect the `null`, extract error details from headers, and route the poison pill to a dead-letter topic (DLT) for later investigation.

## Demo: A Reproducible Example

Let's build a reactive Spring Boot application that demonstrates this end to end.

### 1. Project Setup

Create a new project from [Spring Initializr](https://start.spring.io/) with:

*   Spring Reactive Web
*   Spring for Apache Kafka
*   Reactor Kafka

### 2. Docker Compose

Run Kafka locally with this `docker-compose.yml`:

```yaml
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

```bash
docker-compose up -d
```

### 3. Application Configuration

```yaml
spring:
  main:
    web-application-type: reactive
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: my-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.value.delegate.class: org.springframework.kafka.support.serializer.JsonDeserializer
        spring.json.trusted.packages: com.example.poisonpills.model
        spring.json.value.default.type: com.example.poisonpills.model.KafkaMessage

server:
  port: 8080

app:
  kafka:
    topic: my-topic
```

Two things to note:

- The `value-deserializer` is set to `ErrorHandlingDeserializer`, which delegates to `JsonDeserializer` via the `spring.deserializer.value.delegate.class` property.
- `spring.json.trusted.packages` and `spring.json.value.default.type` tell the `JsonDeserializer` which class to deserialize into and which packages to trust. Without these, you'll get a different class of deserialization errors.

### 4. The Code

**`KafkaMessage.java`** — the message model:

```java
package com.example.poisonpills.model;

public record KafkaMessage(String name, int id) {
}
```

**`ReactiveKafkaConfig.java`** — wires up the `ReactiveKafkaConsumerTemplate`:

```java
package com.example.poisonpills.config;

import com.example.poisonpills.model.KafkaMessage;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import reactor.kafka.receiver.ReceiverOptions;

import java.util.Collections;

@Configuration
public class ReactiveKafkaConfig {

    @Bean
    public ReceiverOptions<String, KafkaMessage> receiverOptions(KafkaProperties kafkaProperties) {
        return ReceiverOptions.<String, KafkaMessage>create(
                        kafkaProperties.buildConsumerProperties()
                )
                .subscription(Collections.singletonList(
                        kafkaProperties.getConsumer().getGroupId() != null
                                ? "my-topic" : "my-topic"
                ));
    }

    @Bean
    public ReactiveKafkaConsumerTemplate<String, KafkaMessage> reactiveKafkaConsumerTemplate(
            ReceiverOptions<String, KafkaMessage> receiverOptions) {
        return new ReactiveKafkaConsumerTemplate<>(receiverOptions);
    }
}
```

**`KafkaConsumerService.java`** — the consumer with poison pill detection and header inspection:

```java
package com.example.poisonpills.service;

import com.example.poisonpills.model.KafkaMessage;
import org.apache.kafka.common.header.Header;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.kafka.core.reactive.ReactiveKafkaConsumerTemplate;
import org.springframework.stereotype.Service;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
    private static final String DESERIALIZATION_EXCEPTION_HEADER =
            "springDeserializationException";

    private final ReactiveKafkaConsumerTemplate<String, KafkaMessage> consumerTemplate;

    public KafkaConsumerService(
            ReactiveKafkaConsumerTemplate<String, KafkaMessage> consumerTemplate) {
        this.consumerTemplate = consumerTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void consumeMessages() {
        consumerTemplate
                .receive()
                .doOnNext(record -> {
                    if (record.value() == null) {
                        handlePoisonPill(record);
                    } else {
                        processMessage(record.value());
                    }
                    record.receiverOffset().acknowledge();
                })
                .doOnError(error -> logger.error("Error in consumer pipeline", error))
                .retryWhen(Retry.backoff(Long.MAX_VALUE, Duration.ofSeconds(1))
                        .maxBackoff(Duration.ofSeconds(60)))
                .subscribe();
    }

    private void handlePoisonPill(
            org.apache.kafka.clients.consumer.ConsumerRecord<String, KafkaMessage> record) {
        logger.error("Poison pill detected: topic={}, partition={}, offset={}",
                record.topic(), record.partition(), record.offset());

        // Extract deserialization error details from headers
        Header exceptionHeader = record.headers()
                .lastHeader(DESERIALIZATION_EXCEPTION_HEADER);
        if (exceptionHeader != null) {
            logger.error("Deserialization error: {}",
                    new String(exceptionHeader.value()));
        }

        // In production, send to a dead-letter topic:
        // deadLetterProducer.send("my-topic.DLT", record.key(),
        //     new String(record.headers().lastHeader("spring
        //         DeserializationExceptionValue").value()));
    }

    private void processMessage(KafkaMessage message) {
        logger.info("Processing message: {}", message);
    }
}
```

**`KafkaProducerController.java`** — a simple REST endpoint to produce test messages:

```java
package com.example.poisonpills.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KafkaProducerController {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Value("${app.kafka.topic}")
    private String topic;

    public KafkaProducerController(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping("/messages")
    public void sendMessage(@RequestBody String message) {
        kafkaTemplate.send(topic, message);
    }
}
```

### 5. Running the Demo

Start Kafka and the application, then test both scenarios:

**Send a valid message:**

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Tushar"}' \
  http://localhost:8080/messages
```

```
Processing message: KafkaMessage[name=Tushar, id=1]
```

**Send a poison pill:**

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"id": 1, "name": "Tushar", }' \
  http://localhost:8080/messages
```

```
ERROR Poison pill detected: topic=my-topic, partition=0, offset=1
ERROR Deserialization error: <exception details>
```

You can also use `kcat` to produce messages directly to the broker, which is useful for simulating poison pills that bypass your application's producer:

```bash
# Valid message
echo '{"id": 1, "name": "Tushar"}' | kcat -b localhost:9092 -t my-topic -P

# Poison pill
echo 'not-even-json' | kcat -b localhost:9092 -t my-topic -P
```

The consumer processes the valid message, logs the poison pill with its error details, acknowledges both offsets, and moves on. No infinite loop.

## Production Considerations

In a real system, you'll want to go beyond just logging:

**Dead-letter topics (DLT):** Route poison pills to a `<topic>.DLT` topic. This preserves the original message for debugging and lets you replay it once the bug is fixed. Spring Kafka's `DefaultErrorHandler` supports this natively for non-reactive consumers; for reactive consumers, you'll need to publish to the DLT manually.

**Monitoring:** Track poison pill counts as a metric (via Micrometer/Prometheus). A spike in poison pills usually means a producer deployed a breaking schema change — you want to catch this fast, not discover it in logs hours later.

**Schema validation:** Consider using Avro or Protobuf with a Schema Registry instead of raw JSON. Schema evolution rules (backward/forward compatibility) prevent most poison pills at the producer side before they ever hit your consumer.

**Alerting on consumer lag:** Even with proper poison pill handling, monitor consumer lag. It's the most reliable signal that something is wrong with your pipeline.

## Conclusion

Poison pills are one of Kafka's sharpest edges. A single malformed message can block an entire partition indefinitely, and the default behavior gives you no indication of *why* messages stopped flowing — just growing consumer lag.

The `ErrorHandlingDeserializer` fixes this by turning a fatal deserialization error into a `null` value with error metadata in the headers. Combined with dead-letter topics and monitoring, you can build a consumer pipeline that degrades gracefully instead of grinding to a halt.