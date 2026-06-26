---
layout: post
title: Boolean vs Boolean in Java
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
published: false
category: blog
tags:
 - java
---

What's the difference between **boolean** and **Boolean** in java?

## Primitive type

booleans are primite type in java. Primitive means it's not an object. Java compiler reserves the memory for primite at compile time. It's not in Java Heap. Also it's more fast since it's memory is allocated at compile time.

```java
boolean foo = true; 
```

It only has two values. The default value is always false. So If you have DTO that receives a payload, if it has missing field 

```json 
{
    "bar": "23"
}
```

the DTO if it's 

```java
record Payload (foo, bar) {
}
```

The output would be 

```json
{
      "bar": "23",
      "T"
}
```

## Boolean object

it's a wrapper on primitive. I'ts an object. so it can be used in collections. like 

```
Boolean foo;
Set<Boolean> list; 
list.add(foo);
```

It has mainly three values, true, false and null.

One good use case is when you are patching a request , if ther's a missing filed, this can result in passing null so it does't update it . we can handle nulls and it doens't accidentally update exisintg pass state. for example

```java
```

