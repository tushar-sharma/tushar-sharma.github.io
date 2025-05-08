---
layout: post
title: Building Reactive File Upload with Spring Boot WebFlux and Swagger
image: https://unsplash.com/photos/BfPUTEMXw2A/download?w=437
thumb: https://unsplash.com/photos/BfPUTEMXw2A/download?w=437
author: tushar sharma
category: blog
tags: [spring boot, reactive programming, swagger]
---


How do you upload multiple PDF file in reactive REST API?.<!-- truncate_here -->

How do you upload multiple PDF file in reactive REST API?

## Project Overview

- Spring Boot WebFlux (Reactive Web)
- SpringDoc OpenAPI 3 documentation
- Project Reactor
- Java 21

## Project Setup (`build.gradle`)


{% template  customCode.html %}
---
id: 2d7962ae629f4b5c8cc1ed4c45bb9846
file: build.gradle
---
{% endtemplate %}

### Key Dependencies

* **webflux:** Enables reactive web programming

* **springdoc-openapi:** Generates OpenAPI 3 documentation

* **reactor-test:** Provides testing utilities for reactive streams

## Main Application Class

{% template  customCode.html %}
---
id: 2d7962ae629f4b5c8cc1ed4c45bb9846
file: DemoUploadApplication.java
---
{% endtemplate %}

### Key Annotations:

* **@OpenAPIDefinition:** Enables Swagger/OpenAPI documentation

* Customizes API metadata through `@Info`

## Reactive File Upload Controller

{% template  customCode.html %}
---
id: 2d7962ae629f4b5c8cc1ed4c45bb9846
file: FileUploaderController.java
---
{% endtemplate %}

### Why FilePart instead of MultipartFile?

* **Reactive Paradigm:**
  - Flux handles streams of data asynchronously
  - Processes files as they arrive without buffering entire request

* **Memory Efficiency:**
  - Handles large files without memory overload
  - Backpressure-aware (controls data flow rate)

* **Non-Blocking I/O:**
  - Works with WebFlux's event-loop model
  - Maintains high concurrency with minimal threads