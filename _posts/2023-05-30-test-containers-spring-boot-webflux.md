---
layout: post
date: 2023-05-30
title: TestContainers with Spring Boot Webflux
image: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
thumb: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
author: Tushar Sharma
java: true
prismjs: true
gradle: true
tags:
  - java
  - spring boot
---

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It's a useful tool for testing applications that rely on external dependencies like databases or message queues.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It's a useful tool for testing applications that rely on external dependencies like databases or message queues.

Create a Spring Boot project with following `gradle` dependencies 

{% template customGradle.html %}
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.1.0'
    id 'io.spring.dependency-management' version '1.1.0'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jdbc'
    implementation 'org.projectlombok:lombok:1.18.26'
    runtimeOnly 'org.postgresql:postgresql'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.boot:spring-boot-testcontainers'
    testImplementation "org.testcontainers:postgresql"
    testImplementation 'org.testcontainers:junit-jupiter'
}

tasks.named('test') {
    useJUnitPlatform()
}

{% endtemplate %}

For Gradle terminology:

1. **testImplementation**: This configuration is used for dependencies that are required only for the tests in your project. These dependencies will be available during the test compilation and execution phases, but they won't be included in the runtime classpath of your main application. This is useful when you have testing-specific libraries or frameworks that are not needed in the production code.

2. **compileOnly**: This configuration is used for dependencies that are required only during the compilation phase but not at runtime. These dependencies will be available during the compilation of your main application code but won't be included in the final runtime classpath. This is often used for dependencies that are used for compile-time only, such as annotation processors or libraries used for generating code.

3. **implementation**: This configuration is used for dependencies that are required during both the compilation and runtime phases of your application. These dependencies will be included in both the compilation classpath and the runtime classpath of your application. This is typically used for the main dependencies of your project that are required for the functionality of your application.

Create `repository/Customer.java`

{% template customJava.html %}
import org.springframework.data.annotation.Id;

public record Customer(@Id Integer id, String name){}
{% endtemplate %}

Create `repository/CustomerRepository.java`


{% template customJava.html %}
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepository extends CrudRepository<Customer, Integer> {}
{% endtemplate %}