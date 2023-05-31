---
layout: post
date: 2023-05-30
title: TestContainers with Spring Boot Webflux
image: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
thumb: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
author:
java: true
prismjs: true
gradle: true
tags:
  - java
  - spring boot
---

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It’s a useful tool for testing applications that rely on external dependencies like databases or message queues.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It's a useful tool for testing applications that rely on external dependencies like databases or message queues.

Gradle dependencies are

{% template customGradle.html %}
dependencies {
	compile "org.springframework.boot:spring-boot-starter-webflux:*"
	testCompile "org.testcontainers:testcontainers:1.16.0"
	testCompile "org.testcontainers:postgresql:1.16.0"
}
{% endtemplate %}


Next, let's create a simple Spring Boot Reactive application that we can test. Create a new Java class, `GreetingController`, in the location `src/main/java/com/example/demoTestContainer/api`.

{% template customJava.html %}
package com.example.demoTestContainer.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class GreetingController {
    
    @GetMapping("/greet")
    public Mono<String> greet() {
        return Mono.just("Hello, world!");
    }
}
{% endtemplate %}

Now, let's create an integration test that uses Testcontainers to spin up a PostgreSQL container and test our Spring Boot Reactive application. Create a new Java class, for example, GreetingControllerIntegrationTest, in the src/test/java directory:

{% template customJava.html %}
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWebTestClient
@Testcontainers
public class GreetingControllerIntegrationTest {

    @Container
    public static PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:13");

    @Autowired
    private WebTestClient webTestClient;

    @Test
    public void testGreet() {
        webTestClient.get().uri("/greet")
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .isEqualTo("Hello, world!");
    }
}
{% endtemplate %}

In this integration test, we're using Testcontainers' PostgreSQLContainer to start a PostgreSQL container before running the test. The @Container annotation marks the container as a JUnit test container. We're using the latest version of PostgreSQL (postgres:13), but you can use any other version that suits your needs.

The @SpringBootTest annotation is used to start the Spring Boot application with a random port for testing. The @AutoConfigureWebTestClient annotation sets up the WebTestClient to make requests to our application.

The testGreet() method is a simple test that sends a GET request to the /greet endpoint and verifies that the response status is 200 (OK) and the response body matches the expected greeting message.
