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

A single malformed Kafka message can silently halt your entire consumer group. If you've ever been paged at 2 AM because messages stopped processing and your consumer lag was climbing, there's a good chance you were dealing with a poison pill. Here's how to handle it in a reactive Spring Boot application.!-- truncate_here -->

A single malformed Kafka message can silently halt your entire consumer group. If you've ever been paged at 2 AM because messages stopped processing and your consumer lag was climbing, there's a good chance you were dealing with a poison pill. Here's how to handle it in a reactive Spring Boot application.

## What's a Kafka Poison Pill?

A poison pill is a message that a consumer can never successfully process. The most common cause is a **deserialization failure** — a producer sends malformed JSON, an incompatible schema version, or raw bytes where structured data was expected.

Here's what makes it deadly: Kafka's offset commit model means a consumer won't advance past a message it can't process. The deserializer throws an exception **before** the reactive stream even starts, so your reactive error handlers (`doOnError`, `onErrorResume`) never trigger. The consumer re-fetches the same broken message indefinitely, blocking every subsequent message in that partition. Consumer lag climbs, alerts fire, and your pipeline is effectively dead.


## Project Setup

Let's understand this by creating a simple Spring Boot application from [Spring Initializr](https://start.spring.io/). 

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: build.gradle
---
{% endtemplate %}

## Model the Kafka Message

Create a **KafkaMessage** record that we will be receiving from Kafka:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaMessage.java
---
{% endtemplate %}


Next, define the `application.yaml` configuration for Kafka:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: application.yaml
---
{% endtemplate %}

We need two additional profile-specific YAML files. First, create `application-basic.yaml`: 

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: application-basic.yaml
---
{% endtemplate %}


Next, create `application-errorhandling.yaml`:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: application-errorhandling.yaml
---
{% endtemplate %}

## Kafka Configuration

Create a configuration class to set up the Kafka receiver options:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaConfig.java
---
{% endtemplate %}

## Basic Consumer Service (Demonstrates the Problem)

First, let's create a consumer service for the `basic` profile that demonstrates the poison pill problem: 

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaService.java
---
{% endtemplate %}

## Consumer Service with Error Handling (The Solution)

Now let's create the solution that properly handles poison pills: 

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaServiceWithErrorHandling.java
---
{% endtemplate %}


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
