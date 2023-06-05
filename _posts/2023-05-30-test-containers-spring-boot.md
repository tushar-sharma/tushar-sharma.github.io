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
prismYaml: true
tags:
  - java
  - spring boot
---

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It's a useful tool for testing applications that rely on external dependencies like databases or message queues.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Testcontainers is a Java library that provides lightweight, disposable containers for running integration tests. It's a useful tool for testing applications that rely on external dependencies like databases or message queues.

Setup a `demo` Spring boot project

### Gradle Dependencies

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

### gradle terminologies

1. **testImplementation**: This configuration is used for dependencies that are required only for the tests in your project. These dependencies will be available during the test compilation and execution phases, but they won't be included in the runtime classpath of your main application. This is useful when you have testing-specific libraries or frameworks that are not needed in the production code.

2. **compileOnly**: This configuration is used for dependencies that are required only during the compilation phase but not at runtime. These dependencies will be available during the compilation of your main application code but won't be included in the final runtime classpath. This is often used for dependencies that are used for compile-time only, such as annotation processors or libraries used for generating code.

3. **implementation**: This configuration is used for dependencies that are required during both the compilation and runtime phases of your application. These dependencies will be included in both the compilation classpath and the runtime classpath of your application. This is typically used for the main dependencies of your project that are required for the functionality of your application.

### Define repository layer

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


### Test using actual database

We can spin up database using `docker`

{% template customBash.html %}
version: '3'

services:
  db:
    image: postgres:latest
    container_name: postgress-image
    restart: always
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: bk
{% endtemplate %}

Also define `application.yaml` as


{% template customBash.html %}
spring.sql.init.mode=always
spring.datasource.url=jdbc:postgresql://localhost/database
spring.datasource.username=user
spring.datasource.password=password
{% endtemplate %}

We also need to define a `resources/schema.sql`

{% template customSQL.html %}
create table  customer(
    id serial primary key,
    name varchar(255) not null
);
{% endtemplate  %}


We can write our test as 

{% template customJava.html %}

import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
class JdbcApplicationTests {

	@Autowired
	public CustomerRepository customerRepository;

	@Test
	void contextLoads() throws Exception {
		Assertions.assertFalse(customerRepository.findAll().iterator().hasNext(), () -> "there should be no data");
		customerRepository.save(new Customer(null, "Tushar"));
		Assertions.assertTrue(customerRepository.findAll().iterator().hasNext(), () -> "there should be some data");
		for (Customer customer : customerRepository.findAll()){
			Assertions.assertTrue(customer.name().equals("Tushar"));
		}
	}

}

{% endtemplate %}

You can verify this by loging to your `postgres` database as 

{% template customBash.html %}
$ docker exec -it <CONTAINER_ID> -U user -d database -W
{% endtemplate %}

### Test using TestContainers

Intead of running actual database everytime, it's much more convenient to use `TestContainers`

{% template customJava.html %}
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@Testcontainers
class JdbcApplicationTests {

	@Container
	public static PostgreSQLContainer<?> pgsql = new PostgreSQLContainer(DockerImageName.parse("postgres:latest"));

	@DynamicPropertySource
	static void configTestcontainersProperties(DynamicPropertyRegistry registry){
		  registry.add("spring.datasource.url", pgsql::getJdbcUrl);
		  registry.add("spring.datasource.username", pgsql::getUsername);
		  registry.add("spring.datasource.password", pgsql::getPassword);
	}

	@Autowired
	public CustomerRepository customerRepository;

	@Test
	void contextLoads() throws Exception {
		Assertions.assertFalse(customerRepository.findAll().iterator().hasNext(), () -> "there should be no data");
		customerRepository.save(new Customer(null, "Tushar"));
		Assertions.assertTrue(customerRepository.findAll().iterator().hasNext(), () -> "there should be some data");
		for (Customer customer : customerRepository.findAll()){
			Assertions.assertTrue(customer.name().equals("Tushar"));
		}
	}
}
{% endtemplate %}

* `@Testcontainers`: Integrates Testcontainers library with JUnit 5 to manage Docker containers for testing

* `@Container`: Indicates the usage of a Docker container for testing.

* `@DynamicPropertySource`: Allows the dynamic configuration of properties used in the Spring application context.

* `public static PostgreSQLContainer<?> pgsql = new PostgreSQLContainer(DockerImageName.parse("postgres:latest"))`: Declares a static field pgsql of type PostgreSQLContainer that represents a PostgreSQL Docker container. The container uses the postgres:latest image