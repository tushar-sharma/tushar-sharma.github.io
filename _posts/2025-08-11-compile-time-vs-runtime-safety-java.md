---
layout: post
title: [draft] Compile Time vs Runtime Safety in Java
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
published: false
---

We can write a simple code in java to print a list of integers

```java
List<Integer> myList = List.of(1, 2, 3, 4, 5);

myList
  .stream()
  .forEach(System.out::println);

// this prints 1, 2, 3, 4, 5
```

We can rewrite this as : 

```java

Object myList = List.of(1, 2, 3, 4, 5);

((List<Integer> myList)
  .stream()
  .forEach(System.out::println);

// this also prints 1, 2, 3, 4, 5

```

So why not use Object all the time? 


Imagine bad data like 

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
class cast exception */
```
This will throw runtime exception. We usually want to fail fast. Object casting defers errors at runtime.
