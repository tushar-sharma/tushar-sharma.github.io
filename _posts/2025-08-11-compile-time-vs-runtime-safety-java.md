---
layout: post
title: Compile Time vs Runtime Safety in Java
image: https://unsplash.com/photos/we4enFZr0aA/download?w=437
thumb: https://unsplash.com/photos/we4enFZr0aA/download?w=437
author: tushar sharma
category: blog
tags:
 - java
---

When writing Java code, ensuring correctness and reliability is a key concern. One way to achieve this is by leveraging the type system to catch errors early—ideally at compile time rather than at runtime. Let's explore this concept through a simple example.<!-- truncate_here -->

When writing Java code, ensuring correctness and reliability is a key concern. One way to achieve this is by leveraging the type system to catch errors early—ideally at compile time rather than at runtime. Let's explore this concept through a simple example.

Consider the following code that prints a list of integers:

```java
List<Integer> myList = List.of(1, 2, 3, 4, 5);

myList
  .stream()
  .forEach(System.out::println);

// Output: 1, 2, 3, 4, 5
```

This is straightforward and type-safe. The variable myList is explicitly declared as a List<Integer>, so the compiler guarantees that only integer values are present.

Now, consider a modified version of the same code using the Object type:

```java
Object myList = List.of(1, 2, 3, 4, 5);

((List<Integer>) myList)
  .stream()
  .forEach(System.out::println);

// Output: 1, 2, 3, 4, 5
```

At runtime, this behaves identically. However, the use of Object introduces a critical weakness: type safety is no longer enforced by the compiler.

To illustrate the risk, imagine the list contains invalid data:

```java
Object myList = List.of(1, 2, 3, 4, 5, "string");

((List<Integer> myList)
  .stream()
  .forEach(System.out::println);

/*
1
2
3
4
5
Exception in thread "main": java.lang.ClassCastException: class java.lang.String cannot be cast to class java.lang.Integer*/
```

The error occurs only when the stream processes the String value, meaning the application fails after deployment rather than during development or build.

Using raw `Object` references and relying on explicit casting shifts error detection from compile time to runtime. This violates the principle of failing fast—a best practice in software engineering where issues should be exposed as early as possible.

Compile-time safety, enabled by Java’s generics and strong typing, allows the compiler to validate type correctness before the program runs. In contrast, runtime safety checks introduce unpredictable failures, harder debugging, and increased risk in production environments.