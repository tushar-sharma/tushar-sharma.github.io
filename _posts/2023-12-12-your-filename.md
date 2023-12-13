---
published: false
---

Javascript Promises and Async Await


Lets's say you have the following code which executes sequentially

```js
let foo = 'The quick brown fox jumps over the lazy dog'
let bar = '9'
console.log(`${foo} has ${bar} words.`)
```

**Promise** is a special type of object that represents eventual completion (or failure) of a asynchronous operations and its resulting value.

lets say we now make an API request like this 


```js
const axiosRequest = require('axios')
let response = axiosRequest.get(URL)
console.log(`${response.data}`)
```

This will fail since the data element still doesn't exist.

One option is to use `then` and `catch`. Then is called when the taks is finished and catch when anything goes wrong.

```js
const axiosRequest = require('axios')
axiosRequest
  .get(URL)
  .then(response => {
  console.log(`${response.data}`)
})
  .catch(error => {
});
```

Await operations is use to wait on a promise. It can only be used inside a async function

```js
async function getActivity() {
   let response = await axiosRequet.get(URL)
}
getActivity()
```

### How is async functions different. Do I have to use await inside async

### Call back hell 

