---
layout: post
date: 2023-06-30
title: House Robber Leetcode Solution
image: /img/house-robber.jpeg
thumb: /img/house-robber.jpeg
author: Tushar Sharma
category: blog
mutipleTab: true
tags:
  - javascript
  - java
  - python
  - rust
---

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.<!-- truncate_here -->

### Problem Statement

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

### Explanation 

We can use dynamic programming to solve this problem. We will create an auxiliary array `dp` which will store the largest money for each iteration. Eg for input : **[2 , 1, 1, 2, 9]**

| ith value | dp array |
|-----------|----------|
| i = 0    | [2, 0, 0, 0, 0] |
| i = 1    | [2, 2, 0, 0, 0] |
| i = 2    | [2, 2, 3, 0, 0] |
| i = 3    | [2, 2, 3, 4, 0] |
| i = 4    | [2, 2, 3, 4, 12] |


### Solution

{% template  customTab.html %}
---
id: c7e93c597941b726616dc6a74c274dde
files:
  - file: HouseRobber.java
    language: java
  - file: house_rubber.py
    language: python
  - file: houseRobber.js
    language: javascript
  - file: houseRobber.rs
    language: rust
---
{% endtemplate %}

### Time complexity is 

$ O(n) $
