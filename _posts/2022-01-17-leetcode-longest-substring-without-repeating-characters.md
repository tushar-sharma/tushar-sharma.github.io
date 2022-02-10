---
layout: post
category: blog
title: Leetcode - Longest Substring Without Repeating Characters
date: 2022-01-17 21:07 -0500
name: coin-change
thumb: https://unsplash.com/photos/YK0HPwWDJ1I/download?w=800
image: https://unsplash.com/photos/YK0HPwWDJ1I/download?w=800
tags:
- leetcode
- two pointers
- set
---

In this [leetcode](https://leetcode.com/problems/longest-substring-without-repeating-characters/) problem,  we’re asked to find the length of the longest string of characters in a provided string that does not contain repeating characters. In other words, in the string `abcabcbb` the longest substring without repeating characters is `abc` (with a length of 3).<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>

<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>

<script src="{{ root_url }}/js/multipleTab.js"></script>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML-full"></script>

In this [leetcode](https://leetcode.com/problems/longest-substring-without-repeating-characters/) problem,  we’re asked to find the length of the longest string of characters in a provided string that does not contain repeating characters. In other words, in the string `abcabcbb` the longest substring without repeating characters is `abc` (with a length of 3).

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


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>