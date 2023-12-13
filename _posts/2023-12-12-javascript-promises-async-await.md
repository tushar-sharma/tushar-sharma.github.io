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


"Callback Hell" is a phrase referring to a situation where callbacks are nested within callbacks, leading to complex and potentially unreadable code. This is a common issue in JavaScript, particularly with Node.js, where callbacks are frequently used for asynchronous operations.

Let's consider a hypothetical example to illustrate callback hell:

```js
fs.readdir(source, function (err, files) {
  if (err) {
    console.log('Error finding files: ' + err)
  } else {
    files.forEach(function (filename, fileIndex) {
      console.log(filename)
      fs.readFile(filename, 'utf8', function (err, content) {
        if (err) {
          console.log('Error reading file: ' + err)
        } else {
          console.log(content)
        }
      })
    })
  }
})
```


In the above code, we first read a directory. For each file in the directory, we then read the file. This leads to callbacks nested within callbacks, which can quickly become difficult to manage as the complexity of the operations increases.
To mitigate callback hell, there are several strategies that we can use:
Modularization: Break down callbacks into independent functions. This makes the code easier to read and manage.

Use Promises: Promises in JavaScript represent the eventual completion or failure of an asynchronous operation. They can be used to avoid callback hell by chaining .then() calls.
Async/Await: This is a special syntax in JavaScript built on top of promises. It makes asynchronous code look and behave like synchronous code, which can greatly improve readability.
Here is an example of how the previous code can be improved using async/await:

```js
const fs = require('fs').promises;

async function printFileContent() {
  try {
    const files = await fs.readdir(source);
    for(let file of files) {
      const content = await fs.readFile(file, 'utf8');
      console.log(content);
    }
  } catch (err) {
    console.log('Error: ', err);
  }
}
printFileContent();
```

In this version of the code, each operation is performed sequentially with the await keyword, and errors are handled with a try/catch block. This results in code that is much easier to read and understand.