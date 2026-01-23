---
layout: post
title: Functional Interface in Java
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
published: false
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

Functional Interface 

```java
@FunctionalInterface
public interface Customizer {
    void print(int a);
}
```

Functional interface are interface that have only one abstract method. Can they have other non abstract methods?

how to use it ? 

```java
Customerizer customizer = (a) -> System.out.println(a);
customizer.print();
```

So the idea is to use lambda with interface.