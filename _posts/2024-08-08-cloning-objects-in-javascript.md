---
layout: post
title: Cloning Objects in Javascript
image: /img/
thumb: /img/
author: tushar sharma;
category: blog
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

Objects in javascript are references to the same memory location


```javascript

  let x = 10;
  let y = x;
  
  y = 20; // 'x' remains 10

 const originalObj = {
       name: "Tushar",
       age: 100,
       date: new Date(),
       nested: {
           a: 1,
           b: 2
       },
       set: new Set([1, 2, 3]),
       map: new Map([['key1', 'value1']])
   };


const newObj = originalObj; 

newObj.age = 200

console.log("originalObj\n", originalObj);

console.log("newObj\n", newObj);
```

However if we use the spread, it creates a shallow copy.

```javascript
const originalObj = { a : 1, b : 2};

const newObj = { ...originalObj };

newObj.b = 3;

console.log(originalObj); // {a : 1, b : 2}
```

Shallow clone means that if a object has nested objects, they will be shared between original and the clone


```javascript
const originalObj = { a : 1 ,
                      b : { 
                          c : 3, 
                          d : 4
                      }};

const newObj = { ...originalObj };

newObj.a = 2; 
newObj.b.c = 9;

console.log(originalObj); // { a : 1 : b : { c : 9, d : 4}};
```

However , we can use `structuredClone`. It handles dates, sets and maps and other objects correctly

```javascript
const originalObj = { a : 1 ,
                      b : { 
                          c : 3, 
                          d : 4
                      }};

const newObj = structuredClone(originalObj);

newObj.a = 2; 
newObj.b.c = 9;

console.log(originalObj); // { a : 1 : b : { c : 3, d : 4}};
```

## Similarities with Java

**Primitive types** (e.g., int, float, char) hold their values directly. When you assign one primitive variable to another, Java copies the value from one variable to the other. Each variable operates independently after this assignm
```java
  int a = 2;
  int b = a;
  
  b = 9; // 'a' remains 2


```

- **Reference types** (e.g., objects, arrays) work differently. A reference type variable holds a reference (or pointer) to the object in memory, not the object itself. When you assign one reference type variable to another, both variables now refer to the same object in memory. Modifying the object through one reference will affect the other.

```java

  ArrayList<Integer> list1 = new ArrayList<>();
  list1.add(1);
  
  ArrayList<Integer> list2 = list1;
  list2.add(2);
  
  System.out.println(list1); // Output: [1, 2]
```
