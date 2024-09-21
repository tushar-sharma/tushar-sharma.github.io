---
layout: post
title: Understanding Liskov Substitution Principle
image: https://unsplash.com/photos/lUaaKCUANVI/download?w=437
thumb: https://unsplash.com/photos/lUaaKCUANVI/download?w=437
author: Tushar Sharma
tags:
  - oop
  - java
category: blog
published: true
---

The Liskov Substitution Principle, named after Barbara Liskov who introduced it in 1987, is one of the five SOLID principles of object-oriented design and programming. It states that<!-- truncate_here -->


The Liskov Substitution Principle, named after Barbara Liskov who introduced it in 1987, is one of the five SOLID principles of object-oriented design and programming. It states that:

> "Objects of a superclass shall be replaceable with objects of a subclass without affecting the correctness of the program."

In simple terms, if a program is using a base class, it should be able to switch to a derived class without any unexpected behavior.



### Why is LSP Important?

LSP emphasizes the importance of ensuring that a derived class doesn't just inherit the properties and behaviors of its base class but also adheres to its intended contract or behavior. By following LSP, developers can write more maintainable and scalable code, making it easier to add or modify subclasses without breaking existing functionality.

### LSP Violated

Imagine you're modeling a simple zoo management software and decide to use a basic inheritance hierarchy for birds.


```java
class Bird {
  void fly() {
        System.out.println("I can fly");
  }
}

class Ostrich extends Bird {
  @Override
  void fly() {
    throw new UnsupportedOperationException("Ostriches can't fly");
  }
}
```

In this case, Ostrich is a subtype of Bird. However, since not all birds can fly (like the ostrich), our current design violates the Liskov Substitution Principle. If a function is designed to operate on a Bird, it might mistakenly call the fly method, causing an unexpected exception when an Ostrich object is passed.


### A Better Design

To adhere to the LSP, we can refactor our design to ensure that every subtype of Bird can be replaced seamlessly.

```java

abstract class Bird {
    abstract void move();
}

class Sparrow extends Bird {
    @Override
    void move() {
        System.out.println("I fly");
    }
}

class Ostrich extends Bird {
    @Override
    void move() {
        System.out.println("I run");
    }
}

````
With this design, each bird defines its own move method. So, when a function expects a Bird, it can safely call the move method without any unexpected behavior.


```java
public void makeBirdMove(Bird bird) {
    bird.move();
}

Sparrow mySparrow = new Sparrow();
Ostrich myOstrich = new Ostrich();

makeBirdMove(mySparrow);  // Outputs: "I fly"
makeBirdMove(myOstrich);  // Outputs: "I run"

```

