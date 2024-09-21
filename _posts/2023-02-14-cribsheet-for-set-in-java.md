---
layout: post
title: Cribsheet for Set in Java
category: blog
tags:
  - java
  - interview
thumb: https://unsplash.com/photos/xZTScJvolYk/download?w=437
image: https://unsplash.com/photos/xZTScJvolYk/download?w=437
author: Tushar Sharma
published: true
---

A set in Java is a collection that stores a unique set of elements. This means that there are no duplicates in a set. You can define set using HashSet, TreeSet, or LinkedHashSet.<!-- truncate_here -->

A set in Java is a collection that stores a unique set of elements. This means that there are no duplicates in a set. You can define set using HashSet, TreeSet, or LinkedHashSet.

 <div>
 <script src="https://gist.github.com/tushar-sharma/6550255e0cf551112a494f4920727a9c.js?file=Set1.java"></script></div>

If you don't care about the order of your elements and want the best performance, use HashSet. If you need your elements to be in sorted order, use TreeSet. If you want to maintain the order in which elements were added, use LinkedHashSet.

### Time Complexity

| Method | HashSet | TreeSet | LinkedHashSet |
| ------ | ------- | ------- | ------------- |
| `add(E e)` | O(1) | O(log n) | O(1) |
| `remove(Object o)` | O(1) | O(log n) | O(1) |
| `contains(Object o)` | O(1) | O(log n) | O(1) |
| `size()` | O(1) | O(1) | O(1) |
| `iterator()` | O(1) | O(1) | O(1) |
| `clear()` | O(n) | O(n) | O(n) |

### Using APIs

 <div>
 <script src="https://gist.github.com/tushar-sharma/6550255e0cf551112a494f4920727a9c.js?file=Set2.java"></script></div>

 Interestingly we can use `int` primitive data type instead of Integer like

 ```java
 for (int element : mySet){
    System.out.println("element is: " + element);
 }
 ```

We are iterating over the set and extracting each Integer object, which we can then use in our code. If we were to use for (int element : mySet) instead, we would be attempting to extract int primitives from the set, which is not possible since sets can only contain objects. However this will not throw error because the int values in the Set are automatically boxed into Integer objects by the compiler. This process is called autoboxing and has performance cost.