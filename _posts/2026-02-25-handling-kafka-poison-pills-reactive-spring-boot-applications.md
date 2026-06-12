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
published: false
---

A single malformed Kafka message can silently halt your entire consumer group. If you've been paged at 2 AM because messages stopped processing and consumer lag was climbing, you've likely dealt with a poison pill. Here's how to handle it properly in reactive Spring Boot using `ErrorHandlingDeserializer`.<!-- truncate_here -->

## What's a Kafka Poison Pill?

A poison pill is a message that a consumer can never successfully process. The most common cause is a **deserialization failure** — a producer sends malformed JSON, an incompatible schema version, or raw bytes where structured data was expected.

Here's what makes it deadly: With the default `JsonDeserializer`, deserialization happens **before** your reactive stream starts. The deserializer throws an exception, your reactive error handlers (`doOnError`, `onErrorResume`) never trigger, and the consumer re-fetches the same broken message indefinitely. Every subsequent message in that partition is blocked. Consumer lag climbs, alerts fire, and your pipeline is dead.

## Two Solutions

There are two ways to handle poison pills in reactive Kafka consumers. We'll implement both and compare them.

### Solution 1: Manual Deserialization (StringDeserializer + ObjectMapper)

The naive approach: deserialize as String, then parse JSON manually in your reactive stream. This works but has drawbacks.

### Solution 2: ErrorHandlingDeserializer (Production Pattern)

Spring's built-in solution: wrap `JsonDeserializer` with `ErrorHandlingDeserializer`. When deserialization fails, it returns `null` instead of throwing. Cleaner and more maintainable.

We'll build both to understand the tradeoffs.


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

## Configuration: Three Approaches

We'll create three Spring profiles to demonstrate each approach.

### Approach 1: Basic (The Problem)

`application-basic.yaml`:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: application-basic.yaml
---
{% endtemplate %}

With `JsonDeserializer`, deserialization errors crash the consumer before your reactive stream starts.

### Approach 2: Manual Deserialization

`application-manual.yaml`:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: application-manual.yaml
---
{% endtemplate %}

Uses `StringDeserializer` so messages arrive as raw strings. You parse JSON manually in the reactive stream, catching errors there.

### Approach 3: ErrorHandlingDeserializer (Production)

`application-errorhandling.yaml`:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: application-errorhandling.yaml
---
{% endtemplate %}

Key features:
- `ErrorHandlingDeserializer` wraps `JsonDeserializer` (the delegate)
- When delegate throws, `ErrorHandlingDeserializer` returns `null` instead
- Your reactive stream receives the record with null value, allowing graceful handling

## Kafka Configuration

Create a configuration class to set up the Kafka receiver options:

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaConfig.java
---
{% endtemplate %}

## Implementation: Three Consumer Services

### Service 1: Basic (Demonstrates the Problem)

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaServiceBasic.java
---
{% endtemplate %}

**The problem**: When a poison pill arrives, `JsonDeserializer` throws before `flatMap`. Your reactive error handlers never see it. Consumer gets stuck.

### Service 2: Manual Deserialization

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaServiceManual.java
---
{% endtemplate %}

**How it works**:
1. Messages arrive as raw `String` (no deserialization yet)
2. Inside `flatMap`, manually parse JSON with `ObjectMapper`
3. Catch `JsonProcessingException` and handle it
4. Log poison pill, skip it, consumer continues

**Pros**:
- Full control over deserialization and error handling
- Can log the raw string for debugging
- Errors happen inside reactive stream, so you can handle them

**Cons**:
- Mixes deserialization with business logic
- Need to inject and configure `ObjectMapper`
- More boilerplate code
- Loses Spring's type safety

### Service 3: ErrorHandlingDeserializer (Production)

{% template  customCode.html %}
---
id: 7587b587e54e745365eb89f31b45cc76
file: KafkaServiceErrorHandling.java
---
{% endtemplate %}

**How it works**:
1. `ErrorHandlingDeserializer` wraps `JsonDeserializer`
2. When deserialization fails, it returns `null` instead of throwing
3. `Mono.justOrEmpty(record.value())` creates empty Mono if null
4. `switchIfEmpty()` detects poison pill, logs it, moves on
5. Consumer acknowledges offset automatically

**Pros**:
- Clean separation: deserialization stays in deserializer layer
- Spring-idiomatic
- Less code, easier to maintain
- No `ObjectMapper` injection needed
- Type-safe throughout

**Cons**:
- Can't access raw bytes for debugging (but `ErrorHandlingDeserializer` logs them automatically)

## Which Should You Use?

**Use ErrorHandlingDeserializer (Approach 3)** unless you have a specific reason not to:
- It's what Spring recommends
- It's what we run in production
- It's cleaner and less error-prone
- It keeps concerns separated

**Use manual deserialization (Approach 2)** only if:
- You need custom deserialization logic
- You must access raw bytes for debugging
- You're integrating with non-Spring Kafka clients


## Testing Locally

You can run this project locally to see each approach in action. First, start Kafka:

```bash
# Start Kafka with Docker
docker run -d --name kafka -p 9092:9092 \
  -e KAFKA_ENABLE_KRAFT=yes \
  -e KAFKA_CFG_NODE_ID=1 \
  -e KAFKA_CFG_PROCESS_ROLES=broker,controller \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  bitnami/kafka:latest

# Create topic
docker exec -it kafka kafka-topics.sh \
  --create --topic test-topic --bootstrap-server localhost:9092
```

### Test 1: The Problem (Basic)

Start with the basic profile:

```bash
./gradlew bootRun --args='--spring.profiles.active=basic'
```

Send messages using `kcat` (or `kafkacat`):

```bash
# Valid message - works
echo '{"message": "Hello World", "id": 1}' | \
  kcat -P -b localhost:9092 -t test-topic

# Poison pill - malformed JSON
echo '{"message": "Bad", "id": 2,}' | \
  kcat -P -b localhost:9092 -t test-topic

# Valid message - but won't process
echo '{"message": "After poison", "id": 3}' | \
  kcat -P -b localhost:9092 -t test-topic
```

**Observe**: Application crashes with `JsonParseException`. Message #3 never processes. Consumer is stuck.

```
ERROR: com.fasterxml.jackson.core.JsonParseException: Unexpected character ('}' (code 125))
```

### Test 2: Manual Deserialization

Stop the app (Ctrl+C) and restart with the manual profile:

```bash
./gradlew bootRun --args='--spring.profiles.active=manual'
```

Send the same poison pill:

```bash
echo '{"message": "Valid", "id": 10}' | \
  kcat -P -b localhost:9092 -t test-topic

echo '{"message": "Bad", "id": 11,}' | \
  kcat -P -b localhost:9092 -t test-topic

echo '{"message": "After poison", "id": 12}' | \
  kcat -P -b localhost:9092 -t test-topic
```

**Observe**: Poison pill is caught in the reactive stream and logged:

```
INFO  Processing: Valid
ERROR Failed to parse JSON: {"message": "Bad", "id": 11,}
ERROR POISON PILL at offset 1 partition 0
INFO  Processing: After poison
```

Consumer continues! Manual deserialization works but adds complexity.

### Test 3: ErrorHandlingDeserializer (Production)

Restart with the production pattern:

```bash
./gradlew bootRun --args='--spring.profiles.active=errorhandling'
```

Send the same sequence:

```bash
echo '{"message": "Valid", "id": 20}' | \
  kcat -P -b localhost:9092 -t test-topic

echo '{"message": "Bad", "id": 21,}' | \
  kcat -P -b localhost:9092 -t test-topic

echo '{"message": "After poison", "id": 22}' | \
  kcat -P -b localhost:9092 -t test-topic
```

**Observe**: Cleanest output, poison pill handled gracefully:

```
INFO  Processing: Valid
ERROR POISON PILL - Skipping corrupted record at offset 1 partition 0
INFO  Processing: After poison
```

Same result as manual deserialization, but cleaner code and better separation of concerns.

## Real-World Production Pattern

Here's what we actually deployed to production at a financial services company (simplified from the real implementation handling rating dissemination to blockchain):

```java
@Service
@Slf4j
@RequiredArgsConstructor
public class FigRatingDisseminationService implements SmartLifecycle {

    private final ReactiveKafkaReceiver<String, DisseminationMessage> kafkaReceiver;
    private final RatingsRepository ratingsRepository;
    private final BlockchainRepository blockchainRepository;
    private final AtomicReference<Disposable> subscription = new AtomicReference<>();

    @PostConstruct
    public void startListening() {
        Disposable disposable = kafkaReceiver
            .receiveAutoAck()
            .flatMap(consumerRecord ->
                Mono.justOrEmpty(consumerRecord.value())  // Null if deserialization failed
                    .flatMap(value -> processRatingUpdate(consumerRecord))
                    .switchIfEmpty(Mono.fromRunnable(() ->
                        log.error("POISON PILL - Skipping corrupted record at offset {} partition {}",
                            consumerRecord.offset(), consumerRecord.partition())
                    ))
                    .onErrorResume(error -> {
                        log.warn("Failed to process Kafka message: {} - Skipping record",
                            consumerRecord.value(), error);
                        return Mono.empty();
                    })
            )
            .doOnError(error -> log.error("Kafka consumer stream error, will retry", error))
            .retry()      // Retry on stream-level errors
            .repeat()     // Keep consuming after completion
            .subscribe();

        subscription.set(disposable);
    }

    private Mono<Void> processRatingUpdate(ConsumerRecord<String, DisseminationMessage> record) {
        String entityId = record.value().getEntityId();

        return ratingsRepository
            .getRatingsSnapshot(entityId)
            .flatMap(snapshot -> blockchainRepository.disseminateToBlockchain(snapshot))
            .doOnSuccess(result -> log.info("Successfully disseminated rating for entity {}", entityId))
            .then();
    }

    @Override
    public void stop() {
        Optional.ofNullable(subscription.getAndSet(null))
            .ifPresent(Disposable::dispose);
    }

    @Override
    public boolean isRunning() {
        return Optional.ofNullable(subscription.get())
            .map(s -> !s.isDisposed())
            .orElse(false);
    }
}
```

**Configuration used**:

```yaml
spring:
  kafka:
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.ErrorHandlingDeserializer
      properties:
        spring.deserializer.value.delegate.class: org.springframework.kafka.support.serializer.JsonDeserializer
```

**Why this works in production**:
- `Mono.justOrEmpty(record.value())` filters out nulls (poison pills from failed deserialization)
- `switchIfEmpty()` logs the poison pill with offset/partition for debugging
- `onErrorResume()` catches processing errors (separate from deserialization errors)
- `retry()` + `repeat()` keeps the stream alive indefinitely
- Consumer acknowledges offset automatically, moving past poison pills
- `SmartLifecycle` integration for graceful shutdown

**Production stats**: This has been running for months handling thousands of messages daily without getting stuck on poison pills. When malformed messages arrive (about 2-3 per week), they're logged and skipped automatically.

## Key Takeaways

### Two Working Approaches

**Manual Deserialization** (`StringDeserializer` + `ObjectMapper`):
- Deserialize as String, parse JSON in reactive stream
- Full control, can log raw bytes
- More boilerplate, mixes concerns

**ErrorHandlingDeserializer** (Recommended):
- Wraps `JsonDeserializer`, returns `null` on failure
- Clean separation of concerns
- Spring-idiomatic, less code

### The Pattern (ErrorHandlingDeserializer)

```java
.flatMap(record ->
    Mono.justOrEmpty(record.value())  // Null if deserialization failed
        .flatMap(this::processMessage)
        .switchIfEmpty(logPoisonPill(record))
)
```

### Why ErrorHandlingDeserializer Wins

1. **Cleaner code**: Deserialization stays in deserializer layer
2. **Less error-prone**: No manual `ObjectMapper` configuration
3. **Spring-idiomatic**: Uses Spring's built-in error handling
4. **Production-tested**: This is what we deployed at scale
5. **Type-safe**: Full type safety throughout the pipeline

### Production Checklist

When deploying to production, consider:

✅ Send poison pills to dead-letter topic for analysis
✅ Add metrics to track poison pill frequency
✅ Set up alerts for poison pill detection
✅ Log offset and partition for debugging
✅ Monitor consumer lag
✅ Test with actual malformed messages before deploying

### Both Approaches Work

The manual deserialization approach is valid if you need custom logic or must debug raw bytes. But for most use cases, `ErrorHandlingDeserializer` is the better choice.

**Clone the repo and try both locally** to understand the tradeoffs. The code is fully reproducible.

## Running the Complete Example

All three implementations are included in the tutorial code. Here's how to run it:

### Prerequisites

```bash
# Install required tools
brew install kcat  # macOS
# or
apt-get install kafkacat  # Linux

# Ensure Java 17+ and Gradle installed
java -version
gradle -version
```

### Quick Start

```bash
# 1. Clone the repo (or create from Spring Initializr)
git clone https://github.com/your-repo/kafka-poison-pill-demo
cd kafka-poison-pill-demo

# 2. Start Kafka
docker run -d --name kafka -p 9092:9092 \
  -e KAFKA_ENABLE_KRAFT=yes \
  -e KAFKA_CFG_NODE_ID=1 \
  -e KAFKA_CFG_PROCESS_ROLES=broker,controller \
  -e KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \
  -e KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \
  -e KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  bitnami/kafka:latest

# Wait for Kafka to start (30 seconds)
sleep 30

# 3. Create topic
docker exec -it kafka kafka-topics.sh \
  --create --topic test-topic \
  --bootstrap-server localhost:9092

# 4. Run the app with different profiles
./gradlew bootRun --args='--spring.profiles.active=basic'        # See the problem
./gradlew bootRun --args='--spring.profiles.active=manual'       # Manual solution
./gradlew bootRun --args='--spring.profiles.active=errorhandling'  # Production solution

# 5. In another terminal, send test messages
echo '{"message": "Valid", "id": 1}' | kcat -P -b localhost:9092 -t test-topic
echo '{"message": "Bad", "id": 2,}' | kcat -P -b localhost:9092 -t test-topic
echo '{"message": "After", "id": 3}' | kcat -P -b localhost:9092 -t test-topic
```

### Cleanup

```bash
docker stop kafka
docker rm kafka
```

This hands-on approach lets you see exactly how each pattern behaves with real poison pills.
