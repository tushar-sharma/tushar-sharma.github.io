---
layout: post
title: Recursively sort a array
category: blog
tags:
- algorithm
- java
- code
name: rec-sort
thumb: /img/rec.png
---

I recently came across a simple telephonic interview problem. The problem was to sort an array recursively. But even numbers need to be placed before odd numbers. At first glance it was obvious that it was a simple case of implementation of merge sort.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<p>I recently came across a simple telephonic interview problem. The problem was to sort an array recursively. But even numbers need to be placed before odd numbers. At first glance it was obvious that it was a simple case of implementation of merge sort.
</p>

### Create an array that needs to be sorted

{% template customTab.html %}
---
id: f7d4dabc928d719367ab5cb3cc2a5dcf
file: Rec1.java
language: java
---
{% endtemplate %}

### Merge sort

If you are unfamiliary with merge sort, we just break the array into sub parts and later combine them based on our criteria. Here, we will maintiain left and right pointer which keeps track of the end of the array. Initially, the left is equal to 0 and right equals to the last element of the array.



{% template customTab.html %}
---
id: f7d4dabc928d719367ab5cb3cc2a5dcf
file: Rec2.java
language: java
---
{% endtemplate %}

We calculate a mid point and recursively call the method twice one half of array and another half of array. lastly we add the crux of our logic in merge sort.

---
id: f7d4dabc928d719367ab5cb3cc2a5dcf
file: Rec3.java
language: java
---
{% endtemplate %}


As per our requirement we need to sort even arrays before odd arrays, so we need to have a method to check that.

---
id: f7d4dabc928d719367ab5cb3cc2a5dcf
file: Rec4.java
language: java
---
{% endtemplate %}

Lastly we need to write our merge method.

---
id: f7d4dabc928d719367ab5cb3cc2a5dcf
file: Rec5.java
language: java
---
{% endtemplate %}

### What is the complexity of the program

It's a recursive algorithm , so we need a recurrence

<img src="{{ root_url }}/img/rec.png" >
