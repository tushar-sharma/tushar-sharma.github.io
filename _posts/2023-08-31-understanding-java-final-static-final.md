---
layout: post
title: Understanding final vs Static final in Java
image: https://unsplash.com/photos/hgFY1mZY-Y0/download?w=800
thumb: https://unsplash.com/photos/hgFY1mZY-Y0/download?w=800
author: Tushar Sharma
tags:
  - java
category: blog
---

Java provides various modifiers to control the behavior of classes, methods, and variables. Two such modifiers are final and static final. Let's delve deeper into their significance and differences.<!-- truncate_here -->

Java provides various modifiers to control the behavior of classes, methods, and variables. Two such modifiers are final and static final. Let's delve deeper into their significance and differences.


## Final modifier

When you come across the final keyword in Java, think of it as a way to make something unchangeable or immutable.

### Variables 

When the final keyword is applied to variables, it ensures that once a variable is assigned a value, it cannot be reassigned. Every instance of the class will have its own separate copy of this final variable.


```java
class MyClass {
  final int finalVar;
  final int secondVar = 10;
  
  public MyClass(int finalVar, int secondVar){
    this.finalVar = finalVar; // This is allowed
    this.secondVar = secondVar; // This is an error as it's already assigend
  }
  
  void setFinalVar(int finalVar){
    this.finalVar = finalVar; // This is an error
  }
}
```
### Methods

A final method cannot be overridden in subclasses. This is useful when you want to lock the behavior of a method, ensuring that no subclass can change its implementation.

```java
class ParentClass {
    final void show() {
        System.out.println("This is a final method.");
    }
}

class ChildClass extends ParentClass {
    // void show() {}  // This would be an error since show() is declared as final in ParentClass
}
```

### Classes

A final class cannot be subclassed. This is often done for security reasons or to ensure the design integrity of a class.

```java
final class FinalClass {
    // Some code here
}

// class DerivedClass extends FinalClass {}  // This would be an error
```

## Static Final

### Variables

A static final variable belongs to the class and not any specific instance. It's also immutable. Value can only be assigned at point of declaration or within a static initizlizer block. An initializer block is a chunk of code that runs when the class is first loaded into memory. It runs only once, regardless of how many instance of the class.

```java
class MyClass {
  static final int CONSTANT_VAL; 
  
  public MyClass(int val){
    CONSTANT_VAL = val;  // this is an error
  }
  
  static {
    CONSTANT_VAL = 100;
  }
}
```