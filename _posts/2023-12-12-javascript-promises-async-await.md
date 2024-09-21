---
layout: post
title: Getting started with Javascript Promises and Async Await
image: https://unsplash.com/photos/EWqwxi9He04/download?w=437
thumb: https://unsplash.com/photos/EWqwxi9He04/download?w=437
author: Tushar Sharma
category: blog
published: true
tags:
  - javascript
---

Getting started with Javascript Promises and Async Await<!-- truncate_here -->


Getting started with Javascript Promises and Async Await.

### The Sequential Code Limitation

Lets's say you have the following code which executes sequentially

{% template  customCode.html %}
---
id: 786d3bcfa40b6232e2c5ec24d1264ffd
file: seq.js
---
{% endtemplate %}

This code executes sequentially. But what if you need to perform an operation that depends on data from a server or an API?

### Introducing Promises

A Promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.

Consider the following example where we make an API request using the `axios` library:

{% template  customCode.html %}
---
id: 786d3bcfa40b6232e2c5ec24d1264ffd
file: promise1.js
---
{% endtemplate %}

This code will fail because the data property does not exist at the time of the console.log() statement. The `axios.get()` method returns a Promise, which is an asynchronous operation.

The beauty of Promises is in their methods: `.then()` and `.catch()`. The .then() method is used for handling successful responses, while .catch() is used for handling errors.

{% template  customCode.html %}
---
id: 786d3bcfa40b6232e2c5ec24d1264ffd
file: promise2.js
---
{% endtemplate %}

### Simplifying with Async/Await

Async/Await is syntactic sugar over Promises, making asynchronous code easier to write and read. An async function returns a Promise, and the await keyword is used to wait for a Promise to resolve or reject.

{% template  customCode.html %}
---
id: 786d3bcfa40b6232e2c5ec24d1264ffd
file: promise3.js
---
{% endtemplate %}

This code is more readable and looks synchronous, even though it’s handling asynchronous operations.


Async functions are different from regular JavaScript functions in the sense that they can contain await expressions, allowing the function to pause and wait for the Promise to resolve or reject, before resuming execution and returning the resolved value. You don't have to use await inside an async function, but it's the primary reason for declaring a function as async.

### Callback hell

Callback Hell typically occurs when you have several nested callbacks, creating a complex and hard-to-read code structure. This often happens when dealing with multiple asynchronous operations that need to be performed in sequence.

{% template  customCode.html %}
---
id: 786d3bcfa40b6232e2c5ec24d1264ffd
file: callbackHell.js
---
{% endtemplate %}

### Resolving Callback Hell

Promises provide a cleaner way to handle asynchronous operations. Let’s refactor the above example using Promises:

{% template  customCode.html %}
---
id: 786d3bcfa40b6232e2c5ec24d1264ffd
file: callbackHell1.js
---
{% endtemplate %}

Async/Await further simplifies asynchronous code, making it even more readable:

{% template  customCode.html %}
---
id: 786d3bcfa40b6232e2c5ec24d1264ffd
file: callbackHell2.js
---
{% endtemplate %}