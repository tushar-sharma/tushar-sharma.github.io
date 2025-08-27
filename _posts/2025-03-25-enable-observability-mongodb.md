---
layout: post
title: Enable Observability at MongoDB
image: https://unsplash.com/photos/DSeVfl4CnZg/download?w=437
thumb: https://unsplash.com/photos/DSeVfl4CnZg/download?w=437
author: tushar sharma
category: blog
tags: [spring-boot, mongodb, observability]
---

Implementing Observability in Reactive MongoDB with Spring Boot and Testcontainers. <!-- truncate_here -->

Implementing Observability in Reactive MongoDB with Spring Boot and Testcontainers

## Introduction to Observability

Observability is the cornerstone of modern distributed systems, enabling developers to:
- **Trace** request flows through microservices

- **Measure** system performance via metrics

- **Diagnose** issues using structured logs

In reactive MongoDB applications, observability becomes crucial due to:

- Non-blocking nature complicating request tracing

- Connection pooling challenges

- Complex query performance analysis


## The Three Observability Pillars

1. **Metrics**: Quantitative measurements (e.g., query duration)

2. **Traces**: Distributed request context propagation

3. **Logs**: Contextual event records

## AutoConfigure class

Let’s create an **autoconfigure** class that will be loaded automatically when the dependency is added in `build.gradle`:


{% template  customCode.html %}
---
id: 012eda6dae0f2bbcaa188b7e0f5f94d2
file: build.gradle
---
{% endtemplate %}

Make sure to register this class in **META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports** for Spring Boot to pick it up automatically.
<br>


{% template  customCode.html %}
---
id: 012eda6dae0f2bbcaa188b7e0f5f94d2
file: CustomMongoReactiveAutoConfiguration.java
---
{% endtemplate %}

**Key Components**:

- **AutoConfigureAfter:** Ensures proper configuration ordering

- **MongoClientSettingsBuilderCustomizer:** Injects observability instrumentation

- **ContextProvider:** Propagates tracing context through reactive pipelines

## Integration Testing

We can use **Testcontainers** for testing traces.


{% template  customCode.html %}
---
id: 012eda6dae0f2bbcaa188b7e0f5f94d2
file: CustomMongoReactiveAutoConfigurationIntegrationTest.java
---
{% endtemplate %}
