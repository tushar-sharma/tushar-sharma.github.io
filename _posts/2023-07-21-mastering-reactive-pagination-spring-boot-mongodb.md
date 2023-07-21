---
layout: post
date: 2023-07-21
title: Mastering Reactive Pagination with Spring Boot and MongoDB
image: /img/girl-coding-rain.jpeg
thumb: /img/girl-coding-rain.jpeg
author: Tushar Sharma;
category: blog
mutipleTab: true
tags:
 - spring boot
 - java
 - mongodb
---
As we delve into the realms of sophisticated data management, we will be harnessing the strengths of Spring Boot, the agility of MongoDB, and the responsiveness of reactive programming to implement an efficient pagination system. Pagination is a critical feature, instrumental in enhancing user experience and application performance. By the end of this guide, you'll have a deep understanding of reactive pagination, equipping you with the skills to manage large data sets with ease and proficiency. Let's get started.<!-- truncate_here -->

As we delve into the realms of sophisticated data management, we will be harnessing the strengths of Spring Boot, the agility of MongoDB, and the responsiveness of reactive programming to implement an efficient pagination system. Pagination is a critical feature, instrumental in enhancing user experience and application performance. By the end of this guide, you'll have a deep understanding of reactive pagination, equipping you with the skills to manage large data sets with ease and proficiency. Let's get started.

###  Create a New Spring Boot Application

Go to [Start Initializr](https://start.spring.io/) and create a new Spring Boot Application.

Select the following : 


| Project      | Gradle - Groovy |
| Spring Boot  | 3.1.2           |
| Packaging    | Jar             |
| Java         | 17              |


{% template  customTab.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
files:
  - file: build.gradle
    language: build.gradle
---
{% endtemplate %}

Build the project and then open it in your favourite editor.

```sh
$ gradle build
```

### Setup MongoDB locallly

We'll use `docker-compose` to spin up a local instance of MongoDB


{% template  customTab.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
files:
  - file: docker-compose.yml
    language: docker-compose.yml
---
{% endtemplate %}


{% template  customTab.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
files:
  - file: init-mongo.js
    language: init-mongo.js
---
{% endtemplate %}


To start the cluster: 

```
$ docker-compose up
```

### Configure MongDB

Create an `application-local.properties` file in the resources folder with the following configuration. We have to add `-Dspring.profiles.active=local` to vm options to use this config file.


```java
spring.data.mongodb.uri=mongodb://localhost:27017/testdb
```


### Create an Entity

Create a Product entity in the model.

{% template  customTab.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
files:
  - file: Product.java
    language: Product.java
---
{% endtemplate %}

###  Create a Repository

Create a ProductRepository in the repository package which extends ReactiveSortingRepository.

{% template  customTab.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
files:
  - file: ProductRepository.java
    language: ProductRepository.java
---
{% endtemplate %}


### Create a Service

Create a ProductService class in the service package to interact with the repository.

{% template  customTab.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
files:
  - file: ProductService.java
    language: ProductService.java
---
{% endtemplate %}


### Create a Controller

Create a ProductController in the controller package to handle HTTP requests.


{% template  customTab.html %}
---
id: 6e037d6c7261350abe5772eb6f196435
files:
  - file: ProductController.java
    language: ProductController.java
---
{% endtemplate %}


### Running the Application


Create a `GET` request for pagination entries: `http://localhost:8080/paginaged-products?page=0&size=2` 

```json
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

Create a `GET` request for getting all entries: `http://localhost:8080/products`


<div style="display: none;">
<!-- build.gradle -->
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
<!-- docker-compose.yml -->
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - '27017:27017'
    volumes:
      - ./init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
<!-- init-mongo.js -->
db = db.getSiblingDB('testdb');
db.createUser(
    {
        user: "root",
        pwd: "password",
        roles: [{role: "readWrite", db: "testdb"}]
    }
);
<!-- Product.java -->
package com.example.demoPagination.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
@Data
@AllArgsConstructor
public class Product {
    @Id
    private int id;
    private String name;
}
<!-- ProductRepository.java -->
package com.example.demoPagination.repository;

import com.example.demoPagination.model.Product;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.data.repository.reactive.ReactiveSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository  extends ReactiveCrudRepository<Product, String> {
}
<!-- ProductService.java -->
package com.example.demoPagination.service;

import com.example.demoPagination.model.Product;
import com.example.demoPagination.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import org.springframework.data.domain.Pageable;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository){
        this.productRepository = productRepository;
    }

    public Flux<Product> findAll(){
        return productRepository.findAll();
    }

    public Flux<Product> findPaginated(Pageable pageable){
        return productRepository.findAll()
                .skip(pageable.getPageNumber() * pageable.getPageSize())
                .take(pageable.getPageSize());
    }
}
<!-- ProductController.java -->

package com.example.demoPagination.api;

import com.example.demoPagination.model.Product;
import com.example.demoPagination.service.ProductService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.Optional;

@RestController
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping("/products")
    public Flux<Product> getProduct(){
        return productService.findAll();
    }

    @GetMapping("/paginaged-products")
    public Flux<Product> getProducts(
            @RequestParam Optional<Integer> page,
            @RequestParam Optional<Integer> size
    ){
        return productService.findPaginated(
                PageRequest.of(page.orElse(0), size.orElse(2)));
    }
}
</div>