---
layout: post
title: Building Reactive File Upload with Spring Boot WebFlux and Swagger
image: https://unsplash.com/photos/BfPUTEMXw2A/download?w=437
thumb: https://unsplash.com/photos/BfPUTEMXw2A/download?w=437
author: tushar sharma
category: blog
tags: [spring boot, reactive programming, swagger]
---


This solution implements a reactive REST API for handling multiple file uploads using.<!-- truncate_here -->

## Project Overview

This solution implements a reactive REST API for handling multiple file uploads using:
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

### Why Flux<FilePart> instead of MultipartFile?

* **Reactive Paradigm:**
  - Flux handles streams of data asynchronously
  - Processes files as they arrive without buffering entire request

* **Memory Efficiency:**
  - Handles large files without memory overload
  - Backpressure-aware (controls data flow rate)

* **Non-Blocking I/O:**
  - Works with WebFlux's event-loop model
  - Maintains high concurrency with minimal threads

## Testing with Swagger UI

Access the API documentation at:

```
http://localhost:8080/swagger-ui/index.html
```

### Sample Request

```
POST /fileUploader/upload
Content-Type: multipart/form-data
```

### Request Body

* Form field name: files
* Attach multiple files


### Sample Response

```
"Received files: 1.pdf, 2.pdf"
```

## Understanding Documentation Components

### OpenAPI Specification (openapi.json)

* Machine-readable API contract

* Generated at runtime via `/v3/api-docs` endpoint

* Contains endpoints, schemas, and examples

### Swagger UI (index.html)

* Human-friendly documentation interface

* Auto-generated from `openapi.json`

* Accessible via `/swagger-ui.html`

```mermaid!
sequenceDiagram
    User->>Swagger UI: Access /swagger-ui.html
    Swagger UI->>SpringDoc: GET /v3/api-docs
    SpringDoc->>Swagger UI: openapi.json
    Swagger UI->>User: Rendered Documentation
```