---
layout: post
title: 
image: https://unsplash.com/photos/tAz4APuJwvs/download?w=437
thumb: https://unsplash.com/photos/tAz4APuJwvs/download?w=437
author: tushar sharma
skipImage: true
category: blog
tags:
 - leetcode
 - python
 - stack
---

Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.<!-- truncate_here -->

Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.


## Brute force solution

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        n = len(temperatures)
        answers = [0] * n

        for i, temp in enumerate(temperatures[:-1]):
            answers[i] += 1
            if temperatures[i + 1] <= temp:
                j = i + 1
                while temperatures[j] <= temp:
                    answers[i] += 1
                    j += 1
                    if j > n - 1:
                        answers[i] = 0
                        break
        return answers
````

Time Limit Exceeded since complexity is O(N²)

## Quick refresher on Monotonic stack

A regular stack follows LIFO (Last In, First Out). You push and pop from the top. 

A monotonic stack , we maintain either increasing or decreasing order. Use decreasing monotonic stack to find next greater element. Use increasing monotonic stack to find next smallest element.

## Optimized Solution

We will use monotonic decreasing stack to find next largest element

```python
class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:

       result = [0] * len(temperatures)

       stack = []

       for i, temp in enumerate(temperatures):

           while stack and temperatures[stack[-1]] < temp: 
               prev_index = stack.pop()
               result[prev_index] = i - prev_index

           stack.append(i)

       return result
```

Time complexity O(n)

Why time complexity is O(N²)?

```
for i in range(n):         # ← loop runs n times
    while something:       # ← looks like this could run up to n times too
        do stuff
```

The outer for loop runs n times (where n is the length of temperatures).

Each index is pushed onto the stack at most once. This contributes at most n push operations in total.

Each index is popped from the stack at most once. This contributes at most n pop operations in total.