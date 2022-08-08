---
title: Cribsheet for Coding Interview
category: blog
layout: post
tags:
  - java
  - python
  - interview
thumb: 'https://i.imgur.com/XR4JjSOl.jpg'
image: 'https://i.imgur.com/XR4JjSOl.jpg'
mutipleTab: true
published: false
---

### Data structure

### ArrayList

<div class="tab-container">
  <ul>
    <li class="tab Java3"><a href="#Java3">Java</a></li>
  </ul>

   <div class="codeSample Java3" id="Java3">
<script src="https://gist.github.com/tushar-sharma/34b1612faf0771608b476b205d2e35a2.js?file=ArrayList.java"></script>
   </div>
</div>

### Stacks

Basic operations are

* `push(item)` - add items to top of stack - O(1)
* `pop()` - remove the top item from the stack - O(1)
* `peek()` - return the top of the stack - O(1)
* `isEmpty()`- return True if the stack is empty - O(1) 
* `size()` - return the number of elements in a stack - O(1)
* `remove()` - delete the element in a stack - O(n)

#### Using Standard libraries 

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
<script src="https://gist.github.com/tushar-sharma/34b1612faf0771608b476b205d2e35a2.js?file=Stack.java"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
<script src="https://gist.github.com/tushar-sharma/34b1612faf0771608b476b205d2e35a2.js?file=stack.py"></script>    </div>

</div>

### Queue

* `add(item)` - add an item to the end of the list - O(1)
* `remove()` - remove the first item in the list - O(1)
* `peek()` - return the front of the queue
* `isEmpty()` - return true if the queue is empty

#### Using Standard libraries 

## Comparable

<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
<script src="https://gist.github.com/tushar-sharma/34b1612faf0771608b476b205d2e35a2.js?file=Comparable.java"></script>
   </div>
</div>



### Patterns

1. If you see opeartions like '(', ')', '*', think about using `stack`. Try to insert characters in stack or their indices. 

2. If you see **pairs** like [[1, 2], [2, 3]], think about using **adjacency list**.


## String

### Iterate itadd(item) - add an item to the end of the list - O(1)
remove() - remove the first item in the list - O(1)
peek() - return the front of the queue
isEmpty() - return true if the queue is empty

```python
for i,c  in enumerate(s):
    print(i, c)
```

### Find a substring

```java
String s = "long string";
p = s.substring(0, 2);
System.out.println(p); 
// prints lo
```