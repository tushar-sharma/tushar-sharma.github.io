---
title: Cribsheet for Coding Interview
category: blog
layout: post
tags:
- java
- python
- interview
thumb: https://i.imgur.com/XR4JjSOl.jpg
image: https://i.imgur.com/XR4JjSOl.jpg
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

### Implementation 

```python
stack = []
# push elements to stack 
stack.append(5)
stack.append(3)
stack.append(-1)

# pop element
top =- stack.pop() 
print(top)  
# prints -1

# peek at the top of the stack 
print(stack[-1]) 
# prints  3

# check if stack is empty
print(len(stack) == 0)
# False

# size of the stack 
print(len(stack))
# 2
```
 
### Patterns

1. If you see something with closing parenthesis '(' or ')', think about using `stack`. Try to insert characters in stack or their indices. Problems for stacks

* https://leetcode.com/problems/valid-parentheses/

* https://leetcode.com/problems/longest-valid-parentheses

## Comparable
 