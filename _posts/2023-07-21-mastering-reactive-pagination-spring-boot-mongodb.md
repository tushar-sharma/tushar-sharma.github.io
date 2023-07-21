---
layout: post
date: 2023-07-21
title: Mastering Reactive Pagination with Spring Boot and MongoDB
image: /img/
thumb: /img/
author: Tushar Sharma;
category: blog
---

.<!-- truncate_here -->

###  Create a New Spring Boot Application

Go to [https://start.spring.io/](https://start.spring.io/) and create a new Spring Boot Application.

For this tutorial, below are the selections: 

Project : Gradle - Groovy
Spring Boot : 3.1.2
Packaging: Jar
Java: 17

Below is the `build.gradle`

```
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.1.2'
	id 'io.spring.dependency-management' version '1.1.2'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
	sourceCompatibility = '17'
}

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-mongodb-reactive'
	implementation 'org.springframework.boot:spring-boot-starter-webflux'
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'io.projectreactor:reactor-test'
}

tasks.named('test') {
	useJUnitPlatform()
}
```

Build the project and then open it in your favourite Editor (I'm using IntelliJ)

```bash
$ gradle build
```


### Configure MongDB

Create an application.properties file in the resources folder with the following configuration.


```java
spring.data.mongodb.uri=mongodb://localhost:27017/testdb
```


### Mongodb

```
docker-compose up
```

### Create an Entity

Create a Product entity in the model.

{% template  customCode.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
file: Product.java
---
{% endtemplate %}

###  Create a Repository

Create a ProductRepository in the repository package which extends ReactiveSortingRepository.

{% template  customCode.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
file: ProductRepository.java
---
{% endtemplate %}


### Create a Service

Create a ProductService class in the service package to interact with the repository.

{% template  customCode.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
file: ProductRepository.java
---
{% endtemplate %}
```

### Create a Controller

Create a ProductController in the controller package to handle HTTP requests.



### Unit Testing

Create a test class for ProductService in your test directory.



### Running the Application

Add `-Dspring.profiles.active=local` to vm options to run your spring boot application locally.


http://localhost:8080/paginaged-products?page=0&size=2

```
[
    {
        "id": 1,
        "name": "Product1"
    },
    {
        "id": 4,
        "name": "Product4"
    }
]
```