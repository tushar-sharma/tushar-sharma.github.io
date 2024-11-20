---
layout: post
title: Immutability in java
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
tags:
 - java
---

Understand mutability and mutable objects in Java.<!-- truncate_here -->

Understand mutability and mutable objects in Java.

**String** is immutable in Java.

```java
String s = "foo"; 
s = "foo" + "bar"; // This is a new object. They wont point to same memory address
```

### String vs StringBuilder

**StringBuilder** is mutable. This class has methods that change the value of the object, rather than just returning new values:

```java
StringBuilder sb = new StringBuilder("a");
sb.append("b");
//sb points to same memory address
```

We can see this like 

```
String t = s;
t = t + "c";
System.out.println(s); // s is not affected

StringBuilder tb = sb;
tb.append("c");
System.out.println(sb.toString()); 
//sb is also affected
```

Which one to prefer? For concatation for large number of strings

```java
String s = "";
for (int i = 0 ; i < n; i++){
    s += i;
}
// This will be memory expensive
// Using immutable strings, this makes a lot of temporary copies — the first number of the string ("0") is actually copied n times in the course of building up the final string, the second number is copied n-1 times, and so on. It actually costs O(n2) time just to do all that copying, even though we only concatenated n elements.



StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) {
    sb.append(String.valueOf(i));
}
//StringBuilder is designed to minimize this copying. It uses a simple but clever internal data structure to avoid doing any copying at all until the very end, when you ask for the final String with a toString() call 
```
### When to use immutable types?

Immutable types are safer from bugs, easier to understand, and more ready for change. Mutability makes it harder to understand what your program is doing, and much harder to enforce contracts.

### Example 1

Let’s start with a simple method that sums the integers in a list:

```java
public static int sum(List<Integer> list) {
    int sum = 0; 
    for (int x : list) 
        sum += x;
    return sum;
}
```

A method that sums the absolute values by mutating the list itself

```java
public static int sumAbsolute(List<Integer> list) {
    // lets reuse sum(), because DRY principle
    for (int i = 0;  i < list.size(); i++) {
        list.set(i, Math.abs(list.get(i)));
    }

    return sum(list);
}
```

However we could see unexpected behavior

```java
public static void main(String[] args) {
    List<Integer> myData = Arrays.asList(-5, -3, -2);

    System.out.println(sumAbsolute(myData)); // 10

    System.out.println(sum(myData)); // 10 

    //sum(myData) should print -10 but since list is mutated it's now only print sum of positive numbers
}
```

### Example 2

Write a method that determines the first day of spring

```java
/** @return the first day of spring this year */
public static Date startOfSpring() {
    return askGroundHog();
}
```

Clients start using this method, for example to plan their big parties:

```java
public static void partyPlanning() {
    Date partyDate = startOfSpring();
}
```

If `Groundhog` is cached like 

```java
/** @return the first day of spring this year */
public static Date startOfSpring() {
    if (groundhogAnswer == null) 
        groundhogAnswer = askGroundhog();
    return groundhogAnswer;
}

private static Date groundhogAnswer = null;
```
