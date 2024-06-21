---
layout: post
date: 2023-05-30
title: TestContainers with Spring Boot
image: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
thumb: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
author: Tushar Sharma
tags:
  - java
  - spring boot
  - testcontainers
category: blog
---

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It's a useful tool for testing applications that rely on external dependencies like databases or message queues.<!-- truncate_here -->

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It's a useful tool for testing applications that rely on external dependencies like databases or message queues.

Setup a `demo` Spring boot project

### Gradle Dependencies

{% template customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: build.gradle
---
{% endtemplate %}

### gradle terminologies

1. **testImplementation**: This configuration is used for dependencies that are required only for the tests in your project. These dependencies will be available during the test compilation and execution phases, but they won't be included in the runtime classpath of your main application. This is useful when you have testing-specific libraries or frameworks that are not needed in the production code.

2. **compileOnly**: This configuration is used for dependencies that are required only during the compilation phase but not at runtime. These dependencies will be available during the compilation of your main application code but won't be included in the final runtime classpath. This is often used for dependencies that are used for compile-time only, such as annotation processors or libraries used for generating code.

3. **implementation**: This configuration is used for dependencies that are required during both the compilation and runtime phases of your application. These dependencies will be included in both the compilation classpath and the runtime classpath of your application. This is typically used for the main dependencies of your project that are required for the functionality of your application.

### Define repository layer

Create `repository/Customer.java`

{% template customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: Customer.java
---
{% endtemplate %}

Create `repository/CustomerRepository.java`

{% template customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: CustomerRepository.java
---
{% endtemplate %}


### Test using actual database

We can spin up database using `docker`

{% template customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: docker-compose.yaml
---
{% endtemplate %}

Also define `application.yaml` as


{% template customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: application.yaml
---
{% endtemplate %}

We also need to define a `resources/schema.sql`

{% template customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: schema.sql
---
{% endtemplate  %}


We can write our test as 

{% template  customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: Test1.java
---
{% endtemplate %}

You can verify this by loging to your `postgres` database as 


```bash
$ docker exec -it <CONTAINER_ID> -U user -d database -W
```

### Test using TestContainers

Intead of running actual database everytime, it's much more convenient to use `TestContainers`

{% template customCode.html %}
---
id: b74d54089885e9d1301ada9696e7d470
file: Test2.java
---
{% endtemplate %}

* `@Testcontainers`: Integrates Testcontainers library with JUnit 5 to manage Docker containers for testing

* `@Container`: Indicates the usage of a Docker container for testing.

* `@DynamicPropertySource`: Allows the dynamic configuration of properties used in the Spring application context.

* `public static PostgreSQLContainer<?> pgsql = new PostgreSQLContainer(DockerImageName.parse("postgres:latest"))`: Declares a static field pgsql of type PostgreSQLContainer that represents a PostgreSQL Docker container. The container uses the postgres:latest image