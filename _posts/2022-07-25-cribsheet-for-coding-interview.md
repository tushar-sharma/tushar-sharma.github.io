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

## Stacks

Basic operations are

* `push(item)` - add items to top of stack - O(1)
* `pop()` - remove the top item from the stack - O(1)
* `peek()` - return the top of the stack - O(1)
* `isEmpty()`- return True if the stack is empty - O(1) 
* `size()` - return the number of elements in a stack - O(1)
* `remove()` - delete the element in a stack - O(n)

### Using Standard libraries 

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

 
### Patterns

1. If you see opeartions like '(', ')', '*', think about using `stack`. Try to insert characters in stack or their indices. Problems for stacks

* https://leetcode.com/problems/valid-parentheses/

* https://leetcode.com/problems/longest-valid-parentheses

## Comparable

## String

### Iterate it

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
