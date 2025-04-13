---
layout: post
title: 
image: https://unsplash.com/photos/tAz4APuJwvs/download?w=437
thumb: https://unsplash.com/photos/tAz4APuJwvs/download?w=437
author: tushar sharma
category: blog
tags:
 - leetcode
 - python
 - stack
 - java
mutipleTab: true
---

Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.<!-- truncate_here -->

Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.


## Brute force solution

{% template  customTab.html %}
---
id: 68b174bcb00ebb2f0e3cc6b15bdfea3e
files:
  - file: BruteForce.java
    language: java
  - file: brute_force.py
    language: python
---
{% endtemplate %}

Time Limit Exceeded since complexity is **O(N²)**

## Quick refresher on Monotonic stack

A regular stack follows LIFO (Last In, First Out). You push and pop from the top. 

A monotonic stack , we maintain either increasing or decreasing order. Use decreasing monotonic stack to find next greater element. Use increasing monotonic stack to find next smallest element.

## Optimized Solution

We will use monotonic decreasing stack to find next largest element

{% template  customTab.html %}
---
id: 68b174bcb00ebb2f0e3cc6b15bdfea3e
files:
  - file: monotoinc_stack.py
    language: python
---
{% endtemplate %}

Time complexity **O(n)**

Why time complexity is O(N²)?

```
for i in range(n):         # ← loop runs n times
    while something:       # ← looks like this could run up to n times too
        do stuff
```

The outer for loop runs n times (where n is the length of temperatures).

Each index is pushed onto the stack at most once. This contributes at most n push operations in total.

Each index is popped from the stack at most once. This contributes at most n pop operations in total.