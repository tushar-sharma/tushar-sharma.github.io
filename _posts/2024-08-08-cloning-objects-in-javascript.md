---
layout: post
title: Understanding Object References in JavaScript
image: /img/
thumb: /img/
author: tushar sharma
tags:
 - javascript
category: blog
published: false
---

When working with JavaScript, it's important to understand that objects are reference types. This means that when you assign an object to a new variable, you're not creating a new copy of the object—instead, both variables reference the same object in memory. This can lead to some unexpected behavior if you're not careful.<!-- truncate_here -->

When working with JavaScript, it's important to understand that objects are reference types. This means that when you assign an object to a new variable, you're not creating a new copy of the object—instead, both variables reference the same object in memory. This can lead to some unexpected behavior if you're not careful.

### JavaScript Object References

Let's start with a simple example:

```javascript
let x = 10;
let y = x;

y = 20;

console.log(x); // 'x' remains 10
```

In this case, `x` and `y` are primitive types (numbers), so when you assign `x` to `y`, you're copying the value. Changing `y` later does not affect `x`.

However, objects in JavaScript work differently:

```javascript
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

newObj.age = 200;

console.log ("originalObj is :\n" , originalObj); 

console.log ("newObj is : \n" , newObj);

/*
originalObj is :
 {
  name: 'Tushar',
  age: 200,
  date: 2024-08-10T04:53:19.909Z,
  nested: { a: 1, b: 2 },
  set: Set(3) { 1, 2, 3 },
  map: Map(1) { 'key1' => 'value1' }
}
newObj is : 
 {
  name: 'Tushar',
  age: 200,
  date: 2024-08-10T04:53:19.909Z,
  nested: { a: 1, b: 2 },
  set: Set(3) { 1, 2, 3 },
  map: Map(1) { 'key1' => 'value1' }
}
*/
```

**Explanation:** 
- Here, `originalObj` and `newObj` reference the same object in memory. When you modify the `age` property using `newObj`, the change is reflected in `originalObj` as well, because both variables point to the same memory location.

### Shallow Copy with the Spread Operator

If you want to create a copy of an object without affecting the original, you might consider using the spread operator `...`:

```javascript
const originalObj = { a : 1, b : 2 };
const newObj = { ...originalObj };

newObj.b = 3;

console.log(originalObj); // {a : 1, b : 2}
```

**Explanation:** 
- The spread operator creates a **shallow copy** of the object. In this example, `originalObj` and `newObj` are separate objects. Changing `newObj` does not affect `originalObj`.

However, since the copy is shallow, nested objects within the original object are still shared between the original and the copied object:

```javascript
const originalObj = { a : 1,
                      b : { 
                          c : 3, 
                          d : 4 
                      }};

const newObj = { ...originalObj };

newObj.a = 2; 
newObj.b.c = 9;

console.log(originalObj); // { a : 1, b : { c : 9, d : 4 } };
```

**Explanation:**
- While `newObj.a` is independent of `originalObj.a`, the nested object `b` is still shared. Thus, changes to `newObj.b.c` affect `originalObj.b.c`.

### Deep Copy with `structuredClone`

To avoid the pitfalls of shallow copying, you can use `structuredClone`, which creates a deep copy of the object, including all nested objects:

```javascript
const originalObj = { a : 1,
                      b : { 
                          c : 3, 
                          d : 4 
                      }};

const newObj = structuredClone(originalObj);

newObj.a = 2; 
newObj.b.c = 9;

console.log(originalObj); // { a : 1, b : { c : 3, d : 4 } };
```

**Explanation:**
- The `structuredClone` method ensures that `newObj` is a completely independent copy of `originalObj`, with no shared references.

### Comparing JavaScript with Java

The concept of references in JavaScript is similar to how Java handles data types, particularly when comparing primitive types and reference types.

#### Primitive Types in Java

Primitive types in Java (e.g., `int`, `float`, `char`) store their values directly. When you assign one primitive variable to another, the value is copied:

```java
int a = 2;
int b = a;

b = 9; // 'a' remains 2
```

**Explanation:** 
- Here, `a` and `b` are independent of each other after the assignment.

#### Reference Types in Java

Reference types in Java (e.g., objects, arrays) work similarly to JavaScript objects. They store a reference to the actual data in memory:

```java
ArrayList<Integer> list1 = new ArrayList<>();
list1.add(1);

ArrayList<Integer> list2 = list1;
list2.add(2);

System.out.println(list1); // Output: [1, 2]
```

**Explanation:** 
- Both `list1` and `list2` reference the same ArrayList object in memory. Changes made through `list2` are reflected when accessing `list1`.


