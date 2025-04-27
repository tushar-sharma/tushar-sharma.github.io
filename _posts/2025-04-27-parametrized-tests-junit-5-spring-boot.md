---
layout: post
title: Mastering Parameterized Tests in JUnit 5 with Spring Boot
image: https://unsplash.com/photos/nr7oBrntJog/download?w=437
thumb: https://unsplash.com/photos/nr7oBrntJog/download?w=437
author: tushar sharma
category: blog
tags:
 - java
 - spring boot
mutipleTab: true
---

Want to test smarter, not harder? Parameterized tests let you run the same test with multiple inputs. In this guide, we'll dive into JUnit's `@ParameterizedTest` using `@MethodSource` and `@CsvSource`, plus how to hook it all into Spring Boot.<!-- truncate_here -->

Want to test smarter, not harder? Parameterized tests let you run the same test with multiple inputs. In this guide, we'll dive into JUnit's `@ParameterizedTest` using `@MethodSource` and `@CsvSource`, plus how to hook it all into Spring Boot.

### Set up a Spring Boot project

Using the Spring Initializr:

* Go to [https://start.spring.io/](https://start.spring.io/)


* Download the project and open it in your IDE with following dependencies 

{% template  customTab.html %}
---
id: 92db9792cc48780e72938fd978bbf5bd
files:
  - file: build.gradle
    language: Gradle
  - file: pom.xml
    language: Maven
---
{% endtemplate %}

## Creating a Simple Service

This service contains a method isPalindrome that determines if a given string reads the same backward as forward, ignoring spaces and case sensitivity.

{% template  customCode.html %}
---
id: 92db9792cc48780e72938fd978bbf5bd
file: StringService.java
---
{% endtemplate %}

## Parameterized Tests with `@MethodSource`

Instead of writing multiple @Test methods, we’ll use @ParameterizedTest with @MethodSource to provide a stream of test cases.

{% template  customCode.html %}
---
id: 92db9792cc48780e72938fd978bbf5bd
file: StringServiceTest.java
---
{% endtemplate %}

- **`@ParameterizedTest`:** This tells JUnit that this test method will run multiple times with different parameters.

- **`@MethodSource("palindromeProvider")`**: This annotation links to a static method (palindromeProvider) that supplies a stream of arguments.

- **`palindromeProvider`**: Returns a Stream<Arguments> where each Arguments.of() represents a test case. For example:

> "madam" → true<br>
  "hello" → false<br>
  "A man a plan a canal Panama" → true (after ignoring spaces and case)<br><br>
  Test Logic:<br>
  For each set of inputs, the testIsPalindrome method creates an instance of StringService and checks if the output of isPalindrome matches the expected result.

## CSV Source 

For simpler test cases where you don't need complex data providers, @CsvSource offers a cleaner syntax. You can define your test data directly in the annotation.

{% template  customCode.html %}
---
id: 92db9792cc48780e72938fd978bbf5bd
file: CSVsource.java
---
{% endtemplate %}

How `@CsvSource` Works:

- Each line inside the annotation represents a test case.

- Values are comma-separated and automatically mapped to method parameters.

- It's ideal for small, readable test data without needing to write a separate provider method.