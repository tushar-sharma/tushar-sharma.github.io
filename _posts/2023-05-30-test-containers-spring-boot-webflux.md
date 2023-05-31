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

Let's create gradle dependencies

{% template customGradle.html %}
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.1.0'
	id 'io.spring.dependency-management' version '1.1.0'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'
sourceCompatibility = '17'

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-webflux'
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.boot:spring-boot-testcontainers'
	testImplementation 'io.projectreactor:reactor-test'
	testImplementation 'org.testcontainers:junit-jupiter'
	testImplementation 'org.testcontainers:testcontainers:1.17.6'
	testImplementation "org.testcontainers:mongodb:1.17.6"
	testImplementation "org.testcontainers:postgresql:1.17.6"
}

tasks.named('test') {
	useJUnitPlatform()
}
{% endtemplate %}


Lets create `Consultants.java` in `src/main/java/com/example/demoTestContainer/repository`

{% template customJava.html %}
package com.example.demoTestContainer.repository;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultants {
    @Id
    private UUID id;
    private String name;
    private int grade;
    private String technology;
}
{% endtemplate %}

We will also create `ConsultantsRepository.java`in `src/main/java/com/example/demoTestContainer/repository`

{% template customJava.html %}
package com.example.demoTestContainer.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ConsultantsRepository extends CrudRepository<Consultants, UUID> {
    @Query(value = "SELECT * FROM Consultant c where c.grade = 2 and c.techology = :tech", nativeQuery = true)
    List<Consultants> getSeniorConsultantsByTechnology(@Param("tech") String technology);
}

{% endtemplate %}

Now we can test it `ConsultantsRepositoryTest.java` in `src/test/java/com/example/demoTestContainer`


{% template customJava.html %}
package com.example.demoTestContainer;

import com.example.demoTestContainer.repository.ConsultantsRepository;
import com.example.demoTestContainer.repository.Consultants;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // deactivate the default behaviour
@DataJpaTest
public class ConsultantsRepositoryTest {
    @Container
    static PostgreSQLContainer postgreSQLContainer = new PostgreSQLContainer("postgres:11.1")
            .withDatabaseName("test")
            .withUsername("sa")
            .withPassword("sa");

    @DynamicPropertySource
    static void setProperties(DynamicPropertySource registry){
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);
    }

    @Autowired
    private ConsultantsRepository consultantsRepository;

    @Test
    public void should_be_able_to_get_senior_consultant_by_technology(){
        //arrange
        Consultants consultants1 = new Consultants(UUID.randomUUID(), "Adam Smith", 2, "Java");
        Consultants consultants2 = new Consultants(UUID.randomUUID(), name="Kim James", 2, ".NET");
        //act
        List<Consultants> consultants = new ArrayList<>();
        consultantsRepository.getSeniorConsultantsByTechnology("Java").forEach(c -> consultants.add(c));

        Assertions.assertThat(consultants).hasSize(1);
        Assertions.assertThat(consultants.get(0).getName()).isEqualTo("Adam Smith");
    }
}

{% endTemplate %}