---
layout: post
date: 2023-05-27
title: Cribsheet for String in Java
tags:
  - java
  - interview
image: https://unsplash.com/photos/xZTScJvolYk/download?w=800
thumb: https://unsplash.com/photos/xZTScJvolYk/download?w=800
author: Tushar Sharma
---

Strings are immutable in java. It's best to convert string to StringBuilder/StringBuffer so that it's memory efficient for string manipulation.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Strings are immutable in java. It's best to convert string to StringBuilder/StringBuffer so that it's memory efficient for string manipulation. Use StringBuilder for speed and StringBuffer for threadsafe.


 <div>
 <script src="https://gist.github.com/tushar-sharma/394745794444792a8d6d271d922bad55.js?file=String1.java"></script>
 </div>
