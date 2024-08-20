---
layout: post
title: Understanding Object References in JavaScript
image: /img/
thumb: /img/
author: tushar sharma
tags:
 - javascript
category: blog
---

When working with JavaScript, it's important to understand that objects are reference types. This means that when you assign an object to a new variable, you're not creating a new copy of the object—instead, both variables reference the same object in memory. This can lead to some unexpected behavior if you're not careful.<!-- truncate_here -->

When working with JavaScript, it's important to understand that objects are reference types. This means that when you assign an object to a new variable, you're not creating a new copy of the object—instead, both variables reference the same object in memory. This can lead to some unexpected behavior if you're not careful.

### JavaScript Object References

Let's start with a simple example:

{% template  customCode.html %}
---
id: 9dac8e798dac9501d4426ded1fb023fb
file: ex1.js
---
{% endtemplate %}

In this case, **x** and **y** are primitive types (numbers), changing it doesn't change value since it's copied to different memory location.

However, objects in JavaScript work differently:


{% template  customCode.html %}
---
id: 9dac8e798dac9501d4426ded1fb023fb
file: ex2.js
---
{% endtemplate %}

**Explanation:** 
- Here, `originalObj` and `newObj` reference the same object in memory. When you modify the `age` property using `newObj`, the change is reflected in `originalObj` as well, because both variables point to the same memory location.

### Shallow Copy with the Spread Operator

If you want to create a copy of an object without affecting the original, you might consider using the spread operator `...`:

{% template  customCode.html %}
---
id: 9dac8e798dac9501d4426ded1fb023fb
file: ex3.js
---
{% endtemplate %}

**Explanation:** 
- The spread operator creates a **shallow copy** of the object. In this example, `originalObj` and `newObj` are separate objects. Changing `newObj` does not affect `originalObj`.

However, since the copy is shallow, nested objects within the original object are still shared between the original and the copied object:

{% template  customCode.html %}
---
id: 9dac8e798dac9501d4426ded1fb023fb
file: ex4.js
---
{% endtemplate %}

**Explanation:**
- While **newObj.a** is independent of **originalObj.a**, the nested object **b** is still shared. Thus, changes to **newObj.b.c** affect **originalObj.b.c**.

### Deep Copy with `structuredClone`

To avoid the pitfalls of shallow copying, you can use `structuredClone`, which creates a deep copy of the object, including all nested objects:

{% template  customCode.html %}
---
id: 9dac8e798dac9501d4426ded1fb023fb
file: ex5.js
---
{% endtemplate %}

**Explanation:**
- The `structuredClone` method ensures that `newObj` is a completely independent copy of `originalObj`, with no shared references.

### Comparing JavaScript with Java

The concept of references in JavaScript is similar to how Java handles data types, particularly when comparing primitive types and reference types.

#### Primitive Types in Java

Primitive types in Java (e.g., `int`, `float`, `char`) store their values directly. When you assign one primitive variable to another, the value is copied:

{% template  customCode.html %}
---
id: 9dac8e798dac9501d4426ded1fb023fb
file: Ex6.java
---
{% endtemplate %}

**Explanation:** 
- Here, `a` and `b` are independent of each other after the assignment.

#### Reference Types in Java

Reference types in Java (e.g., objects, arrays) work similarly to JavaScript objects. They store a reference to the actual data in memory:

{% template  customCode.html %}
---
id: 9dac8e798dac9501d4426ded1fb023fb
file: Ex7.java
---
{% endtemplate %}

**Explanation:** 
- Both `list1` and `list2` reference the same ArrayList object in memory. Changes made through `list2` are reflected when accessing `list1`.