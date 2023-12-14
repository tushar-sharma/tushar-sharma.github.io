---
layout: post
title: Getting started with Javascript Promises and Async Await
image: https://unsplash.com/photos/EWqwxi9He04/download?w=800
thumb: https://unsplash.com/photos/EWqwxi9He04/download?w=800
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

```js
let foo = 'The quick brown fox jumps over the lazy dog';
let bar = '9';
console.log(`${foo} has ${bar} words.`);
```

This code executes sequentially. But what if you need to perform an operation that depends on data from a server or an API?

### Introducing Promises

A Promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.

Consider the following example where we make an API request using the `axios` library:

```js
const axios = require('axios');

let response = axios.get('URL');
console.log(`${response.data}`);
```

This code will fail because the data property does not exist at the time of the console.log() statement. The `axios.get()` method returns a Promise, which is an asynchronous operation.

The beauty of Promises is in their methods: `.then()` and `.catch()`. The .then() method is used for handling successful responses, while .catch() is used for handling errors.


```js
const axios = require('axios')

axios
  .get('URL')
  .then(response => {
    console.log(`${response.data}`);
  })
  .catch(error => {
    console.error(`Error: ${error}`);
  });
```

### Simplifying with Async/Await

Async/Await is syntactic sugar over Promises, making asynchronous code easier to write and read. An async function returns a Promise, and the await keyword is used to wait for a Promise to resolve or reject.

```js
const axios = require('axios');

async function fetchAndDisplayData() {
  try {
    let response = await axios.get('https://api.example.com/data');
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchAndDisplayData();
```

This code is more readable and looks synchronous, even though it’s handling asynchronous operations.


Async functions are different from regular JavaScript functions in the sense that they can contain await expressions, allowing the function to pause and wait for the Promise to resolve or reject, before resuming execution and returning the resolved value. You don't have to use await inside an async function, but it's the primary reason for declaring a function as async.

### Callback hell

Callback Hell typically occurs when you have several nested callbacks, creating a complex and hard-to-read code structure. This often happens when dealing with multiple asynchronous operations that need to be performed in sequence.

```js
// Simulated asynchronous operations using setTimeout

function getUser(userId, callback) {
    setTimeout(() => {
        console.log("Fetched user");
        callback({ id: userId, name: "Tushar Sharma" });
    }, 1000);
}

function getUserPosts(userId, callback) {
    setTimeout(() => {
        console.log(`Fetched posts for user ${userId}`);
        callback(["Post 1", "Post 2", "Post 3"]);
    }, 1000);
}

function getPostComments(postId, callback) {
    setTimeout(() => {
        console.log(`Fetched comments for post ${postId}`);
        callback(["Comment 1", "Comment 2"]);
    }, 1000);
}

// Callback Hell
getUser(1, user => {
    getUserPosts(user.id, posts => {
        getPostComments(posts[0], comments => {
            console.log(comments); // Finally, we get the comments
        });
    });
});
```
### Resolving Callback Hell

Promises provide a cleaner way to handle asynchronous operations. Let’s refactor the above example using Promises:

```js
function getUser(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Fetched user");
            resolve({ id: userId, name: "John Doe" });
        }, 1000);
    });
}

function getUserPosts(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Fetched posts for user ${userId}`);
            resolve(["Post 1", "Post 2", "Post 3"]);
        }, 1000);
    });
}

function getPostComments(postId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Fetched comments for post ${postId}`);
            resolve(["Comment 1", "Comment 2"]);
        }, 1000);
    });
}

getUser(1)
    .then(user => getUserPosts(user.id))
    .then(posts => getPostComments(posts[0]))
    .then(comments => console.log(comments))
    .catch(error => console.error(error));
```

Async/Await further simplifies asynchronous code, making it even more readable:

```js
async function displayPostComments() {
    try {
        const user = await getUser(1);
        const posts = await getUserPosts(user.id);
        const comments = await getPostComments(posts[0]);
        console.log(comments);
    } catch (error) {
        console.error(error);
    }
}

displayPostComments();
```