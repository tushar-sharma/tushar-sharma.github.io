---
title: Minimum Consecutive Cards to Pick up solution leetcode
category: blog
layout: post
tags:
- leetcode
- java
- python
name: minimum-cards-pick-up
thumb: https://unsplash.com/photos/-2vD8lIhdnw/download?w=800
---

It's one of the most popular questions on leetcode that seems very easy at first. Coin change is a classic dynamic programming problem. I will proceed with an obvious (albeit wrong) solution and subsequently proceed to an efficient correct solution.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>


<p>It's one of the most popular questions on leetcode that seems very easy at first. Coin change is a classic dynamic programming problem. I will proceed with an obvious (albeit wrong) solution and subsequently proceed to an efficient correct solution.</p>

## Problem Statement

You are given an integer array cards where cards[i] represents the value of the ith card. A pair of cards are matching if the cards have the same value.

Return the minimum number of consecutive cards you have to pick up to have a pair of matching cards among the picked cards. If it is impossible to have matching cards, return -1.

 
## Brute force Solution

A simple solution would be that for each card, calculate the minimum length for consecutive card. This would be **O(n^2)** time complexity.

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
     <script src="https://gist.github.com/tushar-sharma/2b1119ca6114e81f29c156f7f8fc4fd2.js?file=BruteMinimumCardPickUp.java"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
     <script src="https://gist.github.com/tushar-sharma/2b1119ca6114e81f29c156f7f8fc4fd2.js?file=brute_minimum_card_pick_up.py"></script>
   </div>

</div>
 
**However this solution fails as the time limit exceeded**

## Using HashMap

<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
    <li class="tab Python2"><a href="#Python2">Python</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
     <script src="https://gist.github.com/tushar-sharma/2b1119ca6114e81f29c156f7f8fc4fd2.js?file=MinimumCardPickUp.java"></script>
   </div>

   <div class="codeSample Python2" id="Python2">
     <script src="https://gist.github.com/tushar-sharma/2b1119ca6114e81f29c156f7f8fc4fd2.js?file=minimum_card_pick_up.py"></script>
   </div>

</div>
 

## Complexity

Time Complexity is **$$\theta(n * m)$$**, Space complexity is **$$\theta(n)$$**


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
