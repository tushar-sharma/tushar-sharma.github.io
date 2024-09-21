---
layout: post
title: Understanding final vs Static final in Java
image: https://unsplash.com/photos/hgFY1mZY-Y0/download?w=437
thumb: https://unsplash.com/photos/hgFY1mZY-Y0/download?w=437
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

{% template customCode.html %}
---
id: 4222e65309873ad070e54a467871ec68
file: MyClass.java
---
{% endtemplate %}

### Methods

A final method cannot be overridden in subclasses. This is useful when you want to lock the behavior of a method, ensuring that no subclass can change its implementation.

{% template customCode.html %}
---
id: 4222e65309873ad070e54a467871ec68
file: ChildClass.java
---
{% endtemplate %}

### Classes

A final class cannot be subclassed. This is often done for security reasons or to ensure the design integrity of a class.

{% template customCode.html %}
---
id: 4222e65309873ad070e54a467871ec68
file: FinalClass.java
---
{% endtemplate %}

## Static Final

### Variables

A static final variable belongs to the class and not any specific instance. It's also immutable. Value can only be assigned at point of declaration or within a static initizlizer block. An initializer block is a chunk of code that runs when the class is first loaded into memory. It runs only once, regardless of how many instance of the class.

{% template customCode.html %}
---
id: 4222e65309873ad070e54a467871ec68
file: StaticFinal.java
---
{% endtemplate %}
