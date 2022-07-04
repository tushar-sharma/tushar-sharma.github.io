---
title: Sort Characters By Frequency solution leetcode
category: blog
layout: post
tags:
- leetcode
- java
- python
- heap
thumb: https://i.imgur.com/XR4JjSOl.jpg
image: https://i.imgur.com/XR4JjSOl.jpg
mutipleTab: true
---


Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Given a string s, sort it in decreasing order based on the frequency of the characters. The frequency of a character is the number of times it appears in the string.

Return the sorted string. If there are multiple answers, return any of them

## Explanation

1. Use `hashmap` to count the frequency of all characters in string

2. Insert character & frequency pair into `Max Heap` where frequency is used for ranking. 

3. Extract Maximum from the heap and append it to the output string.

## Solution

<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
    <li class="tab Python2"><a href="#Python2">Python</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
<script src="https://gist.github.com/tushar-sharma/5b65da231be6d7d4de3ee4cc2a5e0d10.js?file=FrequencySort.java"></script>
   </div>

   <div class="codeSample Python2" id="Python2">
<script src="https://gist.github.com/tushar-sharma/5b65da231be6d7d4de3ee4cc2a5e0d10.js?file=frequency_sort.py"></script>
   </div>

</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>

