---
layout: post
title: Next Greater Element I
image: https://unsplash.com/photos/NDdeOoTtxY0/download?w=437
thumb: https://unsplash.com/photos/NDdeOoTtxY0/download?w=437
author: tushar sharma
category: blog
skipImage: true
tags:
 - leetcode
 - python
 - monotonic stack
mutipleTab: true
---

The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.<!-- truncate_here -->

The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.

You are given two distinct 0-indexed integer arrays nums1 and nums2, where nums1 is a subset of nums2.

For each 0 <= i < nums1.length, find the index j such that nums1[i] == nums2[j] and determine the next greater element of nums2[j] in nums2. If there is no next greater element, then the answer for this query is -1.

Return an array ans of length nums1.length such that ans[i] is the next greater element as described above.

## Brute Force

For each element in `nums1`, find its position in `nums2`, then search to the right for the first larger element.

{% template  customCode.html %}
---
id: d78c90b71089dd9f756605498853bb72
file: next_greatest_brute.py
---
{% endtemplate %}

**Time Complexity:** O(N<sup>2</sup>)

## Monotonic Stack

A monotonic stack maintains elements in decreasing order. For each element in nums2, we track the next greater element using the stack, storing results in a hash map for O(1) lookups.


* Initialize an empty stack and a hash map.

* Iterate through nums2:
  - While the stack is not empty and the current element is greater than the stack's top:
  - Pop from the stack and record the current element as the next greater for the popped value.
  - Push the current element to the stack.

* Query the hash map for each element in nums1 to build the result.

{% template  customTab.html %}
---
id: d78c90b71089dd9f756605498853bb72
files:
  - file: next_greatest_stack.py
    language: python
  - file: NextGreatest.java
    language: java
---
{% endtemplate %}



**Time Complexity:** O(nums1.length + nums2.length)