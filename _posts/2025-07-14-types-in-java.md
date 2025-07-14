---
layout: post
title: Types in Java
image: /img/error_wallpaper.jpg
thumb: /img/error_wallpaper.jpg
author: tushar sharma
category: blog
tags: 
 - java

skipImage: true
---

Java is a statically typed language , which means that every variable, method parameter, and expression must have a defined type known at compile time. This helps catch errors early and improves code reliability.<!-- truncate_here -->Java is a statically typed language , which means that every variable, method parameter, and expression must have a defined type known at compile time. This helps catch errors early and improves code reliability.

A type in Java defines: the kind of value a variable can hold and what operations that can be performed on it.

```java
int count = 42;       // int: arithmetic allowed
String name = "Ana";  // String: you can call name.length()
```

All types in Java fall into two broad categories:

## Primitive vs Reference Types

| | Type Category       | Examples                      | Stored In                  | Can be null? |
| ------------------- | ----------------------------- | -------------------------- | ------------ |
| **Primitive Types** | `int`, `double`, `boolean`    | Stack                      | ❌ No         |
| **Reference Types** | `String`, `int[]`, `Runnable` | Stack (ref) + Heap (value) | ✅ Yes        |

## Primitive Types

Java has 8 primitive types:int, long, double, float, boolean, char, byte, short.

1. Fast and memory-efficient

2. Cannot be null — so never throw NullPointerException

3. Not objects — you cannot call methods on them (x.length() ❌)

## Reference Types

Reference types refer to objects stored on the heap.

Examples include:

**Classes (String, Scanner, custom types)**

**Interfaces (Runnable, Function<T,R>)**

**Arrays (int[], String[])**

**Lambdas (assigned to functional interfaces)**

**Enums**

```java
String s = "Hello";
Runnable r = () -> System.out.println("Hi");
int[] arr = new int[] {1, 2, 3};
```

These variables hold references, not actual data. The data lives in the heap, while the reference lives on the stack.

## Everything Reference-Type Extends Object

Yes — even arrays and lambdas:

```java
Object o1 = "Hello";              // String is a subclass of Object
Object o2 = new int[] {1, 2};     // Arrays extend Object
Object o3 = (Runnable) () -> {};  // Lambdas are compiled into classes implementing interfaces
```

* All reference types can be upcast to Object

* They all have methods like .toString(), .equals(), and .hashCode()

## Boxing and Unboxing (When Primitives Become Objects)

Java allows primitives to be wrapped in object form via boxing:

```java
int x = 5;
Integer boxed = x;       // Autoboxing (int → Integer)
int unboxed = boxed;     // Auto-unboxing (Integer → int)
```

##  Why You Should NOT Use Object in Generics

###  Anti-Pattern:

```java
public class Box {
    private Object value;

    public void set(Object value) { this.value = value; }
    public Object get() { return value; }
}

Box b = new Box();
b.set("hello");

String s = (String) b.get(); // Manual cast required
```

### Problems

1. No compile-time type safety

2. Must cast manually (error-prone)

3. Can easily throw ClassCastException

## Use Generics for Type-Safe Code

```java
public class Box<T> {
    private T value;

    public void set(T value) { this.value = value; }
    public T get() { return value; }
}

Box<String> b = new Box<>();
b.set("hello");
String s = b.get(); // no cast needed
```
### Advantages:

1. Type-safe at compile time

2. Easier to read and maintain

3. Prevents runtime errors

## Wildcards (<?>)

Use wildcards when you're writing generic code for flexible input types, but you don’t need to know or change the exact type.

```java
public void printBox(Box<?> box) {
    System.out.println(box.get()); // value is safely treated as Object
}
```

## Summary 

| Technique | Type Safe? | Cast Required? | Can Read? | Can Write? | Use When...                          |
| --------- | ---------- | -------------- | --------- | ---------- | ------------------------------------ |
| `Object`  | ❌ No       | ✅ Yes          | ✅ Yes     | ✅ Yes      | Avoid unless truly generic or legacy |
| `<T>`     | ✅ Yes      | ❌ No           | ✅ Yes     | ✅ Yes      | You know the type ahead of time      |
| `<?>`     | ✅ Yes      | ❌ No           | ✅ Yes     | ❌ No       | You don’t know the exact type        |

