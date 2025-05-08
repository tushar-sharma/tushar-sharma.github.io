---
layout: post
title: Understanding Hot and Cold Streams in Reactor
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
published: false
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

## Cold Stream

- what's a cold stream?

- start emitting on subscription

- Each subscriber gets full data sequence

- Use case: database queries, HTTP request

```java
Flux.just()
Flux.fromIterable()
```

## Hot Stream

- Emit regardles of subscriber

- share data between multiple subscriber

- use case : real time notification

```java
Flux.share()

ConnectableFlux
```

## Mono.defer

- defers execution unitl subscription

- creates fresh mono for each subscriber
