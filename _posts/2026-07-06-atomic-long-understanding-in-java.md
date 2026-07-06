---
layout: post
title: Understanding Atomic Long in Java
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
tags: 
- java
---

<!-- truncate_here -->


Atomic Long is a wrapper over long data type in java. It makes the long thread safe. To understand this lets understand a simple increment operations

```
count++
```

This is not a single statment. It actually encompass three operations: 

1. read count 
2. add 1 to count 
3. write count 

If both threads are reading `count` simuleneously, it can have stale read and write operations and can lead to race condition.

Atomic ensures only one thread occupies a soft lock on the value till it updates it. It's not a kernel lock since locks are expensive. It uses compare and swap ? 

It has following methods

1. getAndIncrement() : returns an old value and then add # 
2. IncrementAndGet() : adds 1 and return old value 
3. get() it can have read side effects
4. set() it can have write side effects 

Java code on how to use it? 
