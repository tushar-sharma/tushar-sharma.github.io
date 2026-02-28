---
layout: post
title: Handling Kafka Poison Pills in Reactive Spring Boot Applications
image: 'https://unsplash.com/photos/h1xOm9iffKQ/download?w=437'
thumb: 'https://unsplash.com/photos/h1xOm9iffKQ/download?w=437'
author: tushar sharma
tags:
  - kafka
  - spring-boot
  - reactive
category: blog
---
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
published: true
---

A single malformed Kafka message can silently halt your entire consumer group. If you've ever been paged at 2 AM because messages stopped processing and your consumer lag was climbing, there's a good chance you were dealing with a poison pill. Here's how to handle it in a reactive Spring Boot 4.x application.<!-- truncate_here -->

A single malformed Kafka message can silently halt your entire consumer group. If you've ever been paged at 2 AM because messages stopped processing and your consumer lag was climbing, there's a good chance you were dealing with a poison pill. Here's how to handle it in a reactive Spring Boot application.

## What's a Kafka Poison Pill?

A poison pill is a message that a consumer can never successfully process. The most common cause is a **deserialization failure** — a producer sends malformed JSON, an incompatible schema version, or raw bytes where structured data was expected.

Here's what makes it deadly: Kafka's offset commit model means a consumer won't advance past a message it can't process. The deserializer throws an exception **before** the reactive stream even starts, so your reactive error handlers (`doOnError`, `onErrorResume`) never trigger. The consumer re-fetches the same broken message indefinitely, blocking every subsequent message in that partition. Consumer lag climbs, alerts fire, and your pipeline is effectively dead.


## Project Setup

Let's understand this by creating a simple Spring Boot application from [Spring Initializr](https://start.spring.io/). 


```gradle
plugins {
	id 'java'
	id 'org.springframework.boot' version '4.0.3'
	id 'io.spring.dependency-management' version '1.1.7'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
description = 'Test poisonPill for Kafka'

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-webflux'
	implementation 'org.springframework.boot:spring-boot-starter-kafka'
	implementation 'io.projectreactor.kafka:reactor-kafka:1.3.25'

	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'

	testImplementation 'org.springframework.boot:spring-boot-starter-webflux-test'
	testImplementation 'org.springframework.kafka:spring-kafka-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

tasks.named('test') {
	useJUnitPlatform()
}

```

## Model the Kafka Message

Create a **KafkaMessage** record that we will be receiving from Kafka:

```java
package com.example.poisonPill.model;

public record KafkaMessage(String message, Integer id) {}
```

Next, define the `application.yaml` configuration for Kafka:

```yaml
spring:
  application:
    name: poisonPill

  profiles:
    active: basic

  kafka:
    bootstrap-servers: localhost:9092,localhost:9093,localhost:9094
    consumer:
      group-id: poison-pill-demo
      auto-offset-reset: earliest
      properties:
        topics: test-topic
        security.protocol: PLAINTEXT


logging:
  level:
    com.example.poisonPill: INFO
    reactor.kafka: INFO
```

We need two additional profile-specific YAML files. First, create `application-basic.yaml`: 

```yaml
# Profile: basic
# Demonstrates POISON PILL problem - consumer will STOP on malformed messages
# This configuration will FAIL when receiving invalid JSON

spring:
  kafka:
    consumer:
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer

logging:
  level:
    com.example.poisonPill: DEBUG
    reactor.kafka: INFO
```

Next, create `application-errorhandling.yaml`:

```yaml
# Profile: errorhandling
# SOLUTION to poison pill problem using error handling in application code
# Consumer will continue processing even with malformed messages

spring:
  kafka:
    consumer:
      # Use StringDeserializer for value - we'll deserialize manually with error handling
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer

logging:
  level:
    com.example.poisonPill: DEBUG
    reactor.kafka: INFO
    org.springframework.kafka.support.serializer: DEBUG
```

## Kafka Configuration

Create a configuration class to set up the Kafka receiver options:

```java
package com.example.poisonPill.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.kafka.autoconfigure.KafkaProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.kafka.receiver.ReceiverOptions;

import java.util.Collections;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.consumer.properties.topics}")
    private String topic;

    @Bean
    public ReceiverOptions<String, String> receiverOptions(KafkaProperties kafkaProperties) {
        return ReceiverOptions.<String, String>create(kafkaProperties.buildConsumerProperties())
                .subscription(Collections.singleton(topic));
    }
}
```

## Basic Consumer Service (Demonstrates the Problem)

First, let's create a consumer service for the `basic` profile that demonstrates the poison pill problem: 

```java
package com.example.poisonPill.service;

import com.example.poisonPill.model.KafkaMessage;
import tools.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

/**
 * Simple Kafka consumer to demonstrate the POISON PILL problem.
 *
 * PROBLEM: When a malformed message arrives that cannot be deserialized,
 * the consumer stream will STOP and never recover, even though we have
 * doOnError() and onErrorResume() error handlers.
 *
 * WHY: Deserialization errors happen BEFORE the reactive stream starts,
 * so reactive error handlers cannot catch them. The deserializer throws
 * an exception during record fetching, killing the consumer.
 *
 * To test:
 * 1. Send a valid JSON: {"message": "hello", "id": 123}
 * 2. Send invalid JSON: {bad json}
 * 3. Observe: Consumer stops, doOnError never triggers
 * 4. Send another valid message - it won't be processed!
 */
@Service
@Slf4j
@Profile("basic")
public class KafkaService {

    private final ReceiverOptions<String, String> receiverOptions;

    private final ObjectMapper objectMapper;

    public KafkaService(ReceiverOptions<String, String> receiverOptions, ObjectMapper objectMapper) {
        this.receiverOptions = receiverOptions;
        this.objectMapper = objectMapper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void listen() {
        log.info("Starting Kafka consumer...");

        KafkaReceiver.create(receiverOptions)
                .receive()  // Returns Flux<ReceiverRecord<String, String>>
                .flatMap(record -> {
                    // Deserialize JSON string to KafkaMessage
                    return deserializeMessage(record.value())
                            .flatMap(message -> processMessage(record.key(), message))
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                })
                // NOTE: These error handlers ONLY catch errors INSIDE the reactive stream!
                //
                // WILL CATCH:
                // - Exceptions thrown during processMessage() execution
                // - Runtime errors in business logic (NPE, IllegalArgumentException, etc.)
                // - Errors during offset acknowledgment
                // - Any exception within the flatMap reactive chain
                //
                // WILL NOT CATCH:
                // - Deserialization errors (happen BEFORE stream, during record fetch)
                // - Kafka consumer poll() failures
                // - Network errors fetching from Kafka brokers
                //
                // For deserialization errors, you need ErrorHandlingDeserializer!
                .doOnError(error -> log.error("doOnError caught: ", error))
                .onErrorResume(error -> {
                    log.error("onErrorResume caught: ", error);
                    return Mono.empty();
                })
                .subscribe();
    }

    private Mono<KafkaMessage> deserializeMessage(String json) {
        return Mono.fromCallable(() -> objectMapper.readValue(json, KafkaMessage.class));
    }

    private Mono<Void> processMessage(String key, KafkaMessage message) {
        return Mono.fromRunnable(() ->
            log.info("Received: key={}, message={}, id={}", key, message.message(), message.id())
        );
    }
}
```

## Consumer Service with Error Handling (The Solution)

Now let's create the solution that properly handles poison pills: 

```java
package com.example.poisonPill.service;

import com.example.poisonPill.model.KafkaMessage;
import tools.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import reactor.core.publisher.Mono;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

/**
 * SOLUTION: Handling deserialization errors in application code.
 *
 * This service demonstrates how to properly handle deserialization errors
 * by catching them in the reactive stream and continuing processing.
 *
 * HOW IT WORKS:
 * 1. Use StringDeserializer to receive raw JSON strings
 * 2. Manually deserialize using ObjectMapper in the reactive stream
 * 3. Catch deserialization errors with onErrorResume
 * 4. Log the error and skip the poison pill, keeping the stream alive
 *
 * To activate this service, run with: --spring.profiles.active=errorhandling
 */
@org.springframework.stereotype.Service
@Slf4j
@Profile("errorhandling")
public class KafkaServiceWithErrorHandling {

    private final ReceiverOptions<String, String> receiverOptions;

    private final ObjectMapper objectMapper;

    public KafkaServiceWithErrorHandling(ReceiverOptions<String, String> receiverOptions, ObjectMapper objectMapper) {
        this.receiverOptions = receiverOptions;
        this.objectMapper = objectMapper;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void listen() {
        log.info("Starting Kafka consumer with error handling...");

        KafkaReceiver.create(receiverOptions)
                .receive()
                .flatMap(record -> {
                    // Try to deserialize JSON string to KafkaMessage
                    return deserializeMessage(record.value())
                            .flatMap(message -> processMessage(record.key(), message))
                            // If deserialization fails, handle as poison pill
                            .onErrorResume(error -> handlePoisonPill(record, error))
                            .doOnSuccess(v -> record.receiverOffset().acknowledge());
                })
                .doOnError(error -> log.error("Stream error: ", error))
                .onErrorResume(error -> {
                    log.error("Recovering from stream error", error);
                    return Mono.empty();
                })
                .subscribe();
    }

    private Mono<KafkaMessage> deserializeMessage(String json) {
        return Mono.fromCallable(() -> objectMapper.readValue(json, KafkaMessage.class));
    }

    private Mono<Void> handlePoisonPill(ReceiverRecord<String, String> record, Throwable error) {
        return Mono.fromRunnable(() -> {
            log.error("POISON PILL detected at offset {}, partition {}: {}",
                    record.offset(), record.partition(), error.getMessage());
            log.error("Raw message: {}", record.value());
            log.info("Skipping poison pill and continuing...");
        });
    }

    private Mono<Void> processMessage(String key, KafkaMessage message) {
        return Mono.fromRunnable(() -> {
            log.info("Received: key={}, message={}, id={}", key, message.message(), message.id());
        });
    }
}
```

## Testing the Basic Profile (Problem Demonstration)

First, let's start the application with the `basic` profile to see the poison pill problem in action:

```bash
./gradlew bootRun --args='--spring.profiles.active=basic'
```

Send a valid JSON message:

```bash
echo '{"message": "Hello World", "id": 1}' | \
  kcat -P -b localhost:9092 -t test-topic
```

The message is processed successfully. Now send a malformed JSON with a trailing comma:

```bash
echo '{"message": "Hello World", "id": 2,}' | \
  kcat -P -b localhost:9092 -t test-topic
```

You'll see an error like this:

```
tools.jackson.core.exc.StreamReadException: Unexpected character ('}' (code 125)):
was expecting double-quote to start property name
 at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled);
 byte offset: #UNKNOWN]
```

**The critical issue**: try sending another valid message:

```bash
echo '{"message": "Hello World", "id": 3}' | \
  kcat -P -b localhost:9092 -t test-topic
```

**The consumer is now stuck**. This valid message won't be processed because the consumer keeps retrying the poison pill at offset 2. Your consumer lag will start climbing, and no subsequent messages will be consumed.

## Testing with Error Handling (The Solution)

Now let's test the solution. Restart the application with the `errorhandling` profile:

```bash
./gradlew bootRun --args='--spring.profiles.active=errorhandling'
```

Send the same malformed message:

```bash
echo '{"message": "Hello World", "id": 2,}' | \
  kcat -P -b localhost:9092 -t test-topic
```

This time, you'll see the error handler in action:

```
2026-02-28T17:51:55.716-05:00 ERROR 61935 --- [poisonPill] [on-pill-demo-1]
c.e.p.s.KafkaServiceWithErrorHandling : POISON PILL detected at offset 2,
partition 0: Unexpected character ('}' (code 125)): was expecting double-quote
to start property name

2026-02-28T17:51:55.716-05:00 ERROR 61935 --- [poisonPill] [on-pill-demo-1]
c.e.p.s.KafkaServiceWithErrorHandling : Raw message: {"message": "Hello World", "id": 2,}

2026-02-28T17:51:55.716-05:00  INFO 61935 --- [poisonPill] [on-pill-demo-1]
c.e.p.s.KafkaServiceWithErrorHandling : Skipping poison pill and continuing...
```

Send valid messages after the poison pill:

```bash
echo '{"message": "Hello World", "id": 3}' | \
  kcat -P -b localhost:9092 -t test-topic

echo '{"message": "Hello World", "id": 4}' | \
  kcat -P -b localhost:9092 -t test-topic

echo '{"message": "Hello World", "id": 5}' | \
  kcat -P -b localhost:9092 -t test-topic
```

**Success!** All subsequent messages are processed normally:

```
2026-02-28T17:51:55.716-05:00  INFO 61935 --- [poisonPill] [on-pill-demo-1]
c.e.p.s.KafkaServiceWithErrorHandling : Received: key=null, message=Hello World, id=3

2026-02-28T17:51:55.716-05:00  INFO 61935 --- [poisonPill] [on-pill-demo-1]
c.e.p.s.KafkaServiceWithErrorHandling : Received: key=null, message=Hello World, id=4

2026-02-28T17:51:55.716-05:00  INFO 61935 --- [poisonPill] [on-pill-demo-1]
c.e.p.s.KafkaServiceWithErrorHandling : Received: key=null, message=Hello World, id=5
```

## Key Takeaways

1. **Reactive error handlers only catch errors inside the stream**: `doOnError()` and `onErrorResume()` won't catch deserialization failures that occur before the reactive stream starts.

2. **The solution: manual deserialization**: By using `StringDeserializer` and deserializing manually within the reactive stream, you can catch and handle deserialization errors gracefully.

3. **Always acknowledge the offset**: Even when skipping poison pills, remember to acknowledge the offset so the consumer can move forward.

4. **Production considerations**: In production, you might want to:
   - Send poison pills to a dead-letter queue for later analysis
   - Add metrics to track poison pill frequency
   - Alert when poison pills are detected
   - Implement a retry mechanism with exponential backoff for transient errors
