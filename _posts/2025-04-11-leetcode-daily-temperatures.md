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
  - file: MonotonicStack.java
    language: java
  - file: monotoinc_stack.py
    language: python
---
{% endtemplate %}

Time complexity **O(n)**

Why time complexity is O(N²)?

{% template  customCode.html %}
---
id: 68b174bcb00ebb2f0e3cc6b15bdfea3e
file: psuedopseudoCode.sh
---
{% endtemplate %}

The outer for loop runs n times (where n is the length of temperatures).

Each index is pushed onto the stack at most once. This contributes at most n push operations in total.

Each index is popped from the stack at most once. This contributes at most n pop operations in total.

| Iteration | Index | Temperature | Operations                                                                                                                                                          | Stack State After          | Result Update              |
|-----------|-------|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|----------------------------|
| 0         | 0     | 73          | Stack is empty → push index 0                                                                                                                                        | [0]                        | `[0, 0, 0, 0, 0, 0, 0, 0]`  |
| 1         | 1     | 74          | Compare 74 with temperature at index 0 (73): 74 > 73 → pop index 0, set result[0] = 1; then push index 1                                                            | [1]                        | `[1, 0, 0, 0, 0, 0, 0, 0]`  |
| 2         | 2     | 75          | Compare 75 with temperature at index 1 (74): 75 > 74 → pop index 1, set result[1] = 1; then push index 2                                                            | [2]                        | `[1, 1, 0, 0, 0, 0, 0, 0]`  |
| 3         | 3     | 71          | Compare 71 with temperature at index 2 (75): 71 is not > 75 → push index 3                                                                                            | [2, 3]                     | No change                  |
| 4         | 4     | 69          | Compare 69 with temperature at index 3 (71): 69 is not > 71 → push index 4                                                                                            | [2, 3, 4]                  | No change                  |
| 5         | 5     | 72          | - Compare 72 with temperature at index 4 (69): 72 > 69 → pop index 4, set result[4] = 5 - 4 = 1<br>- New top is index 3 (71): 72 > 71 → pop index 3, set result[3] = 5 - 3 = 2<br>- 72 is not > temperature at index 2 (75), so push index 5 | [2, 5]                     | result[4]=1, result[3]=2     |
| 6         | 6     | 76          | - Compare 76 with temperature at index 5 (72): 76 > 72 → pop index 5, set result[5] = 6 - 5 = 1<br>- New top is index 2 (75): 76 > 75 → pop index 2, set result[2] = 6 - 2 = 4<br>- Stack empty → push index 6   | [6]                        | result[5]=1, result[2]=4     |
| 7         | 7     | 73          | Compare 73 with temperature at index 6 (76): 73 is not > 76 → push index 7                                                                                            | [6, 7]                     | No change                  |
