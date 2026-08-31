---
layout: post
title: Understanding Kafka Poison Pills
image: https://unsplash.com/photos/EIo9tWYAFc4/download?w=437
thumb: https://unsplash.com/photos/EIo9tWYAFc4/download?w=437
author: tushar sharma
category: blog
tags: 
 - kafka
 - java
 - reactive
---

Imagine publishing a message to Kafka topic A. Suddenly, your consumer crashes. It hit a deserialization error. Because the client never successfully processes the record, it never commits the offset. Upon restarting, it reads the exact same record again, failing repeatedly in an infinite loop. This bad record is called a poison pill.<!-- truncate_here -->

Imagine publishing a message to Kafka topic A. Suddenly, your consumer crashes. It hit a deserialization error. Because the client never successfully processes the record, it never commits the offset. Upon restarting, it reads the exact same record again, failing repeatedly in an infinite loop. This bad record is called a poison pill.

## Kafka client

Let's look at a standard reactive Kafka consumer setup

```java
reactiveKafkaConsumer
    .receive()
    .flatMap(record -> {
        // 1. Deserialization happens here (under the hood)
        Message msg = record.value(); 
        // 2. Processing
        processMessage(msg);
        // 3. Commit offset
        return commitOffset(record);
    });
```


And `application.yaml` is:

```yaml
spring:
  kafka:
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer 
      properties:
        spring.json.value.default.type: com.example.Message
        spring.json.trusted.packages: com.example
```


This can get stuck in a loop:

1. Kafka sends the same record again.
2. The client tries to deserialize it inside .receive().
3. Deserialization throws an exception before commitOffset is ever reached.
4. The offset is not committed
5. The consumer restarts and Kafka sends the exact same record again.

> Committing an offset is how a client acknowledges to the Kafka broker that a record was consumed successfully. Next time, the client reads from offset + 1.

## A Quick Kafka Refresher

(If you already know how partitions and offsets work, skip this section)

Kafka does not identify records by offset alone. It reads by **Topic + Partition + Offset**.

```
Topic: A

Partition 0: offset 0 -> msg-a, offset 1 -> msg-b
Partition 1: offset 0 -> msg-c, offset 1 -> msg-d
```

So if a consumer wants to read msg-a, it must be assigned to partition 0 and read offset 0 from that partition.

Partitions are not copies of each other; they split the data to allow parallel processing.

```
Partition 0 -> Consumer A
Partition 1 -> Consumer B
```

Replicas are copies of a partition kept on a different broker purely for fault tolerance.

## The Solution

Spring Kafka provides the ErrorHandlingDeserializer exactly for this purpose.

It acts as a wrapper around your actual deserializer. Instead of throwing an exception and killing the consumer, it catches the error, sets the record value to null, and attaches the error details to the record headers.


Updated `application.yaml` is:

```yaml
spring:
  kafka:
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.value.delegate.class: org.springframework.kafka.support.serializer.JsonDeserializer
        spring.json.value.default.type: com.example.Message
        spring.json.trusted.packages: com.example
```

Now, when the poison pill arrives, your reactive stream won't crash. However, record.value() will be null. You must handle that null in your stream to prevent NullPointerExceptions:


```java
reactiveKafkaConsumer
    .receive()
    .flatMap(record -> {
        if (record.value() == null) {
            // Log the error, ignore the record, and commit the offset to move past it
            log.error("Failed to deserialize record at offset {}", record.offset());
            return commitOffset(record);
        }
        return processMessage(record.value()).then(commitOffset(record));
    });
```

## Advanced: Creating a Fallback Object

Returning null works, but it makes your stream logic messy. A cleaner approach is to provide a fallback function. Instead of returning null, Spring Kafka can instantiate a default "bad message" object that you can handle cleanly downstream (or route straight to a Dead Letter Topic).


Create the Fallback Provider

```java
import org.springframework.kafka.support.serializer.FailedDeserializationInfo;
import java.util.function.Function;

class BadMessageProvider implements Function<FailedDeserializationInfo, Message> {
    @Override
    public Message apply(FailedDeserializationInfo info) {
        // Create a placeholder object containing the raw, unparsed bytes
        return Message.badRecord(info.getData());
    }
}
```

Register it in your YAML


```yaml
spring:
  kafka:
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.value.delegate.class: org.springframework.kafka.support.serializer.JsonDeserializer
        # Tell Spring to use your fallback function instead of returning null
        spring.deserializer.value.function: com.example.BadMessageProvider
        spring.json.value.default.type: com.example.Message
        spring.json.trusted.packages: com.example
```

Handle it in your Reactive Stream

Now your stream receives an object every time, but you can use pattern matching or an isBadRecord() flag to route it safely:

```java
reactiveKafkaConsumer
    .receive()
    .flatMap(record -> {
        Message msg = record.value();
        
        if (msg.isBadRecord()) {
            // Safely route to a Dead Letter Topic (DLT) or log for manual review
            return sendToDeadLetterTopic(msg).then(commitOffset(record));
        }
        
        return processMessage(msg).then(commitOffset(record));
    });
```