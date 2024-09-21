---
layout: post
category: blog
title: Leetcode - Longest Substring Without Repeating Characters
date: 2022-01-17 21:07 -0500
name: coin-change
thumb: https://unsplash.com/photos/YK0HPwWDJ1I/download?w=437
image: https://unsplash.com/photos/YK0HPwWDJ1I/download?w=437
tags:
- leetcode
- two pointers
- set
- string
---

In this [leetcode](https://leetcode.com/problems/longest-substring-without-repeating-characters/) problem, we are asked to find the length of the longest string of characters in a provided string that does not contain repeating characters. In other words, in the string `abcabcbb` the longest substring without repeating characters is `abc` (with a length of 3).<!-- truncate_here -->


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>

<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>

<script src="{{ root_url }}/js/multipleTab.js"></script>


In this [leetcode](https://leetcode.com/problems/longest-substring-without-repeating-characters/) problem, we are asked to find the length of the longest string of characters in a provided string that does not contain repeating characters. In other words, in the string `abcabcbb` the longest substring without repeating characters is `abc` (with a length of 3).

## Problem Statement

Given a string s, find the length of the longest substring without repeating characters.

### Example 1

```sh
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

### Example 2

```sh
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
```

### Example 3

```sh
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
Notice that the answer must be a substring,
"pwke" is a subsequence and not a substring.
```

## Explanation

We can use two pointers to solve this problem.

1. Assign `i` = 0 and `left` = 0.

2. Create a `set` to keep track of characters in the substring.

3. Loop through the string

* If the character at index `i` is not in the `set`, we add it to the `set` and increment `i` pointer.

* If the character at index `i` is in the set, then we have found a new substring. We remove the character at index `left` from the set and increment `left` pointer.

<img src="{{ root_url }}/img/longest_substring.gif" alt="Longest substring image">

## Solution

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
    <script src="https://gist.github.com/tushar-sharma/83cc247e2832e0a381556d57a6ef8ce3.js?file=LengthOfLongestSubstring.java"></script>

   </div>

   <div class="codeSample Python1" id="Python1">
    <script src="https://gist.github.com/tushar-sharma/83cc247e2832e0a381556d57a6ef8ce3.js?file=length_of_longest_substring.py"></script>
    </div>

</div>


## Complexity

Time Complexity is **$$\mathcal{O}(n)$$**, Space complexity is **$$\mathcal{O}(1)$$**

