---
layout: post
title:  How to Listen to a Kafka Consumer in Spring Boot (Reactive & Non-Reactive)
image: https://unsplash.com/photos/7LNatQYMzm4/download?w=437
thumb: https://unsplash.com/photos/7LNatQYMzm4/download?w=437
author: tushar sharma
category: blog
tags:
 - java
 - spring boot
 - kafka
---

Listening to a kafka consumer varies in both servlet and reactive application.<!-- truncate_here --><!-- truncate_here -->

In a traditional servlet based Spring boot, you can use `KafkaListener` annotation

```java
@Service
public class MyService {
    @KafkaListener(topics = "myTopic") 
    public void listen(ConsumerRecord<String, String> record) {
        // process the record
    }
}
```

✅ **Pros**:
  * Simple, declarative, and well-documented.
  * Supports message deserialization, error handling, retries, and DLQ out of the box.
  * Integrates seamlessly with Spring’s dependency injection.

❌ **Cons**:
  * Blocking I/O: Each message is processed synchronously.
  * Not suitable for high-throughput reactive pipelines.
  * Threads are tied up during processing (limited scalability under load).


## Reactive Kafka Consumer with Project Reactor

### ApplicationEventListener

```java
@Service
public class MyService {
    @Autowired
    private ReactiveKakfaConsumer<String, String> ReactiveKakfaConsumer;


    @EventListener(ApplicationReadyEvent.class)
    public void listen() {
        ReactiveKakfaConsumer
          .reactive()
            .subscribe( record -> {
                // process the message
            }, error -> {

            });
    }
}
```


## PostConstruct 

```java
@Service
public class MyService {
    @Autowired
    private ReactiveKakfaConsumer<String, String> ReactiveKakfaConsumer;


    @PostConstruct
    public void listen() {
        ReactiveKakfaConsumer
          .reactive()
            .subscribe( record -> {
                // process the message
            }, error -> {

            });
    }
}
```

## CommanLineRunner

```java
@Service
public class MyService implements CommanLineRunner {
    @Autowired
    private ReactiveKakfaConsumer<String, String> ReactiveKakfaConsumer;


    @Override
    public void run(String... args) {
        ReactiveKakfaConsumer
          .reactive()
            .subscribe( record -> {
                // process the message
            }, error -> {

            });
    }
}
```

## When to use Each Approach

| PostConstruct | When you need initialization right after bean creation | Triggered immediately after bean construction and dependency injection |
| CommnadLineRunner | When you need to run code after the application context is fully started | Executes after the application context is ready but before the application start |
| ApplicationReadyEvent | When you need to ensure all aspects of application are ready | Trigger after the application is started and ready to server the request | 

