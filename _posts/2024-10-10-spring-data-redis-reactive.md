---
layout: post
title: An Introduction to Spring Data Redis Reactive
image: https://unsplash.com/photos/w1K9Ug_pjXw/download?w=437
thumb: https://unsplash.com/photos/w1K9Ug_pjXw/download?w=437
author: tushar sharma
tags:
 - redis
 - java
category: blog
---

Spring Data Redis Reactive offers a powerful solution for working with Redis in a non-blocking, reactive manner. Let's dive into the key components and how to use them effectively.<!-- truncate_here -->

Spring Data Redis Reactive offers a powerful solution for working with Redis in a non-blocking, reactive manner. Let's dive into the key components and how to use them effectively.


### Setting Up Dependencies

To get started with Spring Data Redis Reactive, you need to include the appropriate dependency in your project. If you're using Maven, add the following to your pom.xml:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>
```

For Gradle users, add this to your build.gradle:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-redis-reactive'
```

This starter dependency brings in everything you need for reactive Redis operations, including the Lettuce driver, which is the preferred client for reactive Redis usage in Spring.

Spring Data Redis Reactive provides three main components for interacting with Redis:

* ReactiveRedisConnectionFactory

* ReactiveRedisOperations

* ReactiveRedisTemplate

### ReactiveRedisConnectionFactory

ReactiveRedisConnectionFactory is the cornerstone of Redis interactions in a reactive Spring application. It's responsible for creating and managing reactive Redis connections.

#### Key Features

* Manages connection lifecycle

* Provides low-level access to Redis commands

* Supports connection pooling and custom configurations

#### When to Use

Use ReactiveRedisConnectionFactory when you need:

* Fine-grained control over Redis connections

* To execute raw Redis commands

* To implement custom Redis protocols or operations

### Code Example

<div style="display:none;" markdown="1">
@Service
public class LowLevelRedisService {
    private final ReactiveRedisConnectionFactory connectionFactory;

    public LowLevelRedisService(ReactiveRedisConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public Mono<String> executeCustomCommand(String key) {
        return connectionFactory.getReactiveConnection()
            .stringCommands()
            .get(ByteBuffer.wrap(key.getBytes()))
            .map(ByteBuffer::array)
            .map(String::new);
    }
}
</div>

{% template  customCode.html %}
---
id: 4ebb9c09b2596714a50d94bbf9202d3c
file: ReactiveRedisConnectionFactory.java
---
{% endtemplate %}


### ReactiveRedisOperations

ReactiveRedisOperations is an interface that defines a set of reactive Redis operations. It provides a higher-level abstraction compared to ReactiveRedisConnectionFactory.

#### Key Features

* Defines operations for various Redis data structures (Strings, Lists, Sets, etc.)

* Provides type-safe operations

* Allows for easy mocking in unit tests

#### When to Use

Use ReactiveRedisOperations when you:

* Want to code against interfaces for better testability

* Need type-safe Redis operations

* Prefer a higher-level abstraction than raw connections

#### Code Example

<div style="display:none;" markdown="1">
@Service
public class UserService {
    private final ReactiveRedisOperations<String, User> redisOperations;

    public UserService(ReactiveRedisOperations<String, User> redisOperations) {
        this.redisOperations = redisOperations;
    }

    public Mono<User> saveUser(User user) {
        return redisOperations.opsForValue().set(user.getId(), user)
            .thenReturn(user);
    }

    public Mono<User> getUser(String id) {
        return redisOperations.opsForValue().get(id);
    }
}
</div>

{% template  customCode.html %}
---
id: 4ebb9c09b2596714a50d94bbf9202d3c
file: ReactiveRedisOperations.java
---
{% endtemplate %}

### ReactiveRedisTemplate

#### Key Features

Implements ReactiveRedisOperations interface

* Handles serialization/deserialization of objects

* Provides exception translation

* Supports Redis transactions

#### When to Use

Use ReactiveRedisTemplate when you:

* Want a convenient, high-level API for Redis operations

* Need automatic serialization of complex objects

* Require support for Redis transactions


#### Code Example


<div style="display:none;" markdown="1">
@Service
public class CacheService {
    private final ReactiveRedisTemplate<String, User> redisTemplate;

    public CacheService(ReactiveRedisTemplate<String, User> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Mono<User> cacheUser(User user) {
        return redisTemplate.opsForValue().set(user.getId(), user, Duration.ofMinutes(30))
            .thenReturn(user);
    }

    public Mono<User> getCachedUser(String id) {
        return redisTemplate.opsForValue().get(id);
    }
}
</div>

{% template  customCode.html %}
---
id: 4ebb9c09b2596714a50d94bbf9202d3c
file: ReactiveRedisTemplate.java
---
{% endtemplate %}


All these `Beans` are autoconfigured by spring based on the dependency.