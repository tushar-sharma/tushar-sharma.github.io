---
layout: post
date: 2023-07-21
title: Mastering Reactive Pagination with Spring Boot and MongoDB
image: /img/girl-coding-rain.jpeg
thumb: /img/girl-coding-rain.jpeg
author: tushar sharma
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

### Login to MongoDB

You can also verify the data inside mongoDB

```bash
$ docker ps 
<CONTAINER_ID> mongo:latest

$ docker exec -it <CONTAINER_ID> bash
# mongosh -u username -p password
# use testdb
# show collections

```