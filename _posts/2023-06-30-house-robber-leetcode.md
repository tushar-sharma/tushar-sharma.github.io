---
layout: post
date: 2023-06-30
title: House Robber Leetcode Solution
image: https://unsplash.com/photos//download?w=800
thumb: https://unsplash.com/photos//download?w=800
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
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

### Problem Statement

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.

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
