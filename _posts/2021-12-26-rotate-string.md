---
layout: post
title: Rotate String Leetcode Solution
category: blog
tags:
- leetcode
- string
name: rotate-string
thumb: https://i.imgur.com/hCo5tJF.jpg
summary: Course Schedule Leetcode Solution
image: https://i.imgur.com/hCo5tJF.jpg
author: Tushar Sharma
---

Given two strings s and goal, return true if and only if s can become goal after some number of shifts on s.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>
<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

Given two strings s and goal, return true if and only if s can become goal after some number of shifts on s.

A shift on s consists of moving the leftmost character of s to the rightmost position

For example, 

```bash
if s = "abcde", 
then it will be "bcdea" after one shift.
```

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>

  </ul>

   <div class="codeSample Java1" id="Java1">
      <script src="https://gist.github.com/tushar-sharma/a21e7c5a08bbd19cf7715f5d58527a09.js?file=RotateString.java"></script>
    </div>

</div> 
<br>

<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>

  </ul>

   <div class="codeSample Java2" id="Java2">
      <script src="https://gist.github.com/tushar-sharma/a21e7c5a08bbd19cf7715f5d58527a09.js?file=RotateString2.java"></script>
    </div>

</div> 
<br>

<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
        <p><a href="https://leetcode.com/problems/rotate-string/" target="_blank">796. Rotate String</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>