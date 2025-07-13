---
layout: post
title: Review Modern Java in Action
image: https://i.pinimg.com/originals/69/32/87/6932874aa3191cf229e0443f85de8850.jpg
thumb: https://i.pinimg.com/originals/69/32/87/6932874aa3191cf229e0443f85de8850.jpg
author: tushar sharma
category: blog
skipImage: true
tags:
 - books
---

Review Modern Java in Action.<!-- truncate_here -->

<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<!-- disclaimer -->
<div style="margin: 0 auto" class="cl disclaimer">
  <i class="icon-star"></i>
    <span style="color:black"> &nbsp;&nbsp;This post is in progress. It will be updated continuously</span>
</div>
<br>


## What is OOP?

OOP (Object-Oriented Programming) is a paradigm where **everything is treated as an object** — encapsulating state (fields) and behavior (methods) together.

## Stream processing

A stream is a sequence of data items that are conceptually produced one at a time. 

### Parallelism vs Concurrency

- **Parallelism**: Tasks are split and executed **simultaneously across multiple CPU cores**. Great for **CPU-bound tasks**.
- **Concurrency**: Tasks are **interleaved** on one or more threads, often on a **single core*

Parallelism vs Concurrency. Parallelism is executing the code across multiple GPU cores. However Concurrency is running various code accross single core.  You want to use paralleism for CPU bound work. Concurrency for I/O bound work or slow task.

### Functional Programming in Java

Functional programming focuses on:
1. **Avoiding shared mutable state**
2. **Using higher-order functions** — passing functions as parameters or returning them

### Functional vs Imperative Styles

- In **imperative programming**, you define **how** something is done step by step.
  - Values are **first-class** (you can pass them around).
  - **Methods/classes are not** — they can’t be easily passed or composed.

- In **functional programming**, functions are first-class citizens too.


## Method refernce

**Method references** are a shorthand for lambda expressions that simply call a method. They make your code cleaner and easier to read.


```java
File[] hiddenFiles = new File(".").listFiles(file -> file.isHidden());
```

You can use a method reference:


```java
File[] hiddenFiles = new File(".").listFiles(File::isHidden);
```

