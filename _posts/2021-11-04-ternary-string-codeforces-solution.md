---
title: Ternary String solution Codeforces - 1354B
category: blog
layout: post
tags:
- codeforces
- two pointers
- java
- python
name: ternary-string-codeforces
thumb: https://i.imgur.com/ceIoDSn.jpeg
---

<p>Ternary string is an interesting problem that could be solved using two pointers techniques. It's a convenient way to keep track of multiple indices. This helps in making decisions based on two values.</p>

<p>You are given a string s such that each its character is either 1, 2, or 3. You have to choose the shortest contiguous substring of s such that it contains each of these three characters at least once. A contiguous substring of string s is a string that can be obtained from s by removing some (possibly zero) characters from the beginning of s and some (possibly zero) characters from the end of s.</p>

The first line contains one integer t (1≤t≤20000) - the number of test cases.

Each test case consists of one line containing the string s (1≤s≤200000).<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>

<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>

<script src="{{ root_url }}/js/multipleTab.js"></script>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML-full"></script>

Ternary string is an interesting problem that could be solved using two pointers techniques. It's a convenient way to keep track of multiple indices. This helps in making decisions based on two values.

## Problem Statement

<p>
You are given a string s such that each its character is either 1, 2, or 3. You have to choose the shortest contiguous substring of s such that it contains each of these three characters at least once.

A contiguous substring of string s is a string that can be obtained from s by removing some (possibly zero) characters from the beginning of s and some (possibly zero) characters from the end of s.<sup><a href='#fn:1' rel='footnote'>1</a></sup>
</p>

### Input

The first line contains one integer t (1≤t≤20000) - the number of test cases.

Each test case consists of one line containing the string s (1≤s≤200000). It is guaranteed that each character of s is either 1, 2, or 3.

The sum of lengths of all strings in all test cases does not exceed

```bash
7
123
12222133333332
112233
332211
12121212
333333
31121
```

### Output

For each test case, print one integer — the length of the shortest contiguous substring of s containing all three types of characters at least once. If there is no such substring, print 0 instead.

```bash
3
3
4
4
0
0
4
```

## Two pointers

We can start with two pointers; left and right. Index array is used to keep track of the frequency of each occurrence of characters in string s. We can safely increment left pointer till index[s[left]] is greater than 1. The output is the minimum value of the window (right - left + 1);

## Implementation

<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
    <li class="tab Python2"><a href="#Python2">Python</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
      <script src="https://gist.github.com/tushar-sharma/08e86c62a3467e2e7566d1260abcfd70.js"></script>
   </div>

   <div class="codeSample Python2" id="Python2">
     <script src="https://gist.github.com/tushar-sharma/67482f38af954634a068f51fbef2eb63.js"></script>
   </div>

</div>

## Complexity

Time Complexity is **$$\theta(n)$$**

<div class='footnotes'><h4>Footnotes</h4><hr />
  <ol>
    <li id='fn:1'>
         <p><a href="https://codeforces.com/problemset/problem/1354/B" target="_blank">Codeforces problem 1354 B</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
