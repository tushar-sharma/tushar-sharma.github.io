---
layout: post
title: Why Math.max() is Less Than Math.min() in JavaScript
image: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
thumb: https://pubkgroup.com/wp-content/uploads/2021/03/computer-problems.jpg
author: Tushar Sharma
category: blog
published: true
tags:
  - javascript
---

JavaScript is full of surprises and unexpected behaviors that often leave developers scratching their heads. One of those strange behaviors is the fact that Math.max() < Math.min() is true in JavaScript. In this blog, we'll delve into the underlying reasons for this seemingly paradoxical result.<!-- truncate_here -->

JavaScript is full of surprises and unexpected behaviors that often leave developers scratching their heads. One of those strange behaviors is the fact that Math.max() < Math.min() is true in JavaScript. In this blog, we'll delve into the underlying reasons for this seemingly paradoxical result.

### A Tale of Two Functions

The `Math` object in JavaScript provides a collection of properties and methods for performing mathematical operations. Two of the most commonly used methods are Math.max() and Math.min().

1. `Math.max()` returns the largest of zero or more numbers.

2. `Math.min()` returns the smallest of zero or more numbers.

At first glance, it would seem impossible for the maximum of a set of numbers to be less than the minimum of the same set. But, as we will see, there's a catch when we don't provide any arguments to these functions.

### Dealing with No Arguments

When you call `Math.max()` with no arguments, it returns -Infinity, which represents negative infinity in JavaScript. Similarly, when you call Math.min() with no arguments, it returns Infinity, which represents positive infinity in JavaScript.

These results might seem counterintuitive, but they're based on the behavior of these functions when dealing with an empty set of numbers.

### Why Does This Happen?

The logic behind this behavior lies in the definition of the functions:

1. `Math.max()`: When given an empty set, it assumes that every real number is smaller than the largest number in the set. Since there are no numbers in the set, it defaults to -Infinity.

2. `Math.min()`: When given an empty set, it assumes that every real number is larger than the smallest number in the set. Since there are no numbers in the set, it defaults to Infinity.

### The Inequality in Question

As a result, the following inequality is indeed true in JavaScript:

```js
Math.max() < Math.min() // evaluates to true
```

This is because -Infinity < Infinity is a valid statement in the world of mathematics.