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
- **Concurrency**: Tasks are **interleaved** on one or more threads, often on a **single core**

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

## Some practice problems

**Double a list using stream**

```java
import java.util.*;
import java.util.stream.Collectors;

public class Test {
    public static void main(String[] args) {
      List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

	    numbers
		  .stream()
		  .map(x -> x * x)
      .collect(Collectors.toList())
      .forEach(System.out::println);
    }
}
```
Here **collect** is a terminal operation. It is eager—it triggers the processing of the stream and gathers the results.  **map** is lazy, meaning it doesn’t process elements until a terminal operation (like collect) is called.

## First class vs Second class citizens

In programming language theory, the concept of first-class citizens (or first-class objects) refers to entities that can be used freely in all standard ways that other values can be used in a language.

1. Being passed as an argument to a function

2. Being returned from a function

3. Being assigned to a variable

4. Being stored in data structures

**Functions Are Not First-Class Citizens (Before Java 8)**

1. You couldn't pass a method directly as an argument to another method.

2. You couldn't assign a method to a variable.

3. You couldn't return a method from another method.

**Functions are now first class citizens**

Starting with Java 8 , functions became first-class citizens thanks to the introduction of:

1. Lambda expressions

2. Method references

3. Functional interfaces

4. The `java.util.function` package

```java
// Assigning a lambda to a variable
Function<Integer, Integer> square = x -> x * x;

// Invoke it
int result = square.apply(5);

// Passing a function as an argument
List<Integer> numbers = Arrays.asList(1, 2, 3, 4);
numbers.forEach(n -> System.out.println(n));

// Returning a function from a method
public Function<Integer, Integer> getMultiplier(int factor) {
    return x -> x * factor;
}
```

**Classes Are Also Not First-Class Citizens**

1. Pass a class definition directly as a parameter

2. Return a class definition from a method (though you can return a Class<?> reference, which is metadata, not the class body itself)

```java
public static void printClassName(Class<?> clazz) {
    System.out.println("Class name: " + clazz.getName());
}

printClassName(String.class); // Passing metadata, not the class itself
```

## Method Reference

A method reference allows you to refer to a method without executing it. 

Before Java 8, if you wanted to list only the hidden files in a directory, you might write:


```java
File[] hiddenFiles = new File(".").listFiles(new FileFilter() {
    public boolean accept(File file) {
        return file.isHidden();
    }
});
```

Using **Method Reference**


```java
File[] hiddenFiles = new File(".").listFiles(File::isHidden);
```

Here, `File::isHidden` is a method reference to the `isHidden()` method of the File class. It’s equivalent to this lambda expression:


```java
file -> file.isHidden()
```