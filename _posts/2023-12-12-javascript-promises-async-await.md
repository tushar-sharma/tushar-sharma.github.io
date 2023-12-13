---
published: false
---

Javascript Promises and Async Await


Lets's say you have the following code which executes sequentially

```js
let foo = 'The quick brown fox jumps over the lazy dog';
let bar = '9';
console.log(`${foo} has ${bar} words.`);
```

In this snippet, we define a sentence and count the words manually. However, in practical applications, we may need to fetch data from external sources, which leads us to asynchronous operations.

A Promise is a special JavaScript object representing the eventual completion or failure of an asynchronous operation and its resulting value.

Consider the following example where we make an API request using the `axios` library:

```js
const axios = require('axios');

let response = axios.get('URL');
console.log(`${response.data}`);
```

This code will fail because the data property does not exist at the time of the console.log() statement. The `axios.get()` method returns a Promise, which is an asynchronous operation.

We can handle this using then and catch methods provided by the Promise object. The then method is invoked when the Promise is fulfilled, and catch is invoked when the Promise is rejected:

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

The `await` keyword is used to pause and wait for a Promise to resolve or reject. It can only be used inside an async function:

```js
const axios = require('axios');

async function fetchActivity() {
   let response = await axios.get('URL');
   console.log(response.data);
}

fetchActivity();
```

Async functions are different from regular JavaScript functions in the sense that they can contain await expressions, allowing the function to pause and wait for the Promise to resolve or reject, before resuming execution and returning the resolved value. You don't have to use await inside an async function, but it's the primary reason for declaring a function as async.
