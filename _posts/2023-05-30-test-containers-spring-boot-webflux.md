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

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It’s a useful tool for testing applications that rely on external dependencies like databases or message queues.

Create a Spring Boot project with following `gradle` dependencies 

{% template customGradle %}
plugins {
	id ‘java’
	id ‘org.springframework.boot’ version ‘3.1.0’
	id ‘io.spring.dependency-management’ version ‘1.1.0’
}

group = ‘com.example’
version = ‘0.0.1-SNAPSHOT’
sourceCompatibility = ‘17’

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation ‘org.springframework.boot:spring-boot-starter-webflux’
	implementation ‘org.springframework.boot:spring-boot-starter-data-jpa’
	compileOnly ‘org.projectlombok:lombok’
	annotationProcessor ‘org.projectlombok:lombok’
	testImplementation ‘org.springframework.boot:spring-boot-starter-test’
	testImplementation ‘org.springframework.boot:spring-boot-testcontainers’
	testImplementation ‘io.projectreactor:reactor-test’
	testImplementation ‘org.testcontainers:junit-jupiter’
	testImplementation ‘org.testcontainers:testcontainers:1.17.6’
	testImplementation “org.testcontainers:mongodb:1.17.6”
	testImplementation “org.testcontainers:postgresql:1.17.6”
}

tasks.named(‘test’) {
	useJUnitPlatform()
}
{% endtemplate %}