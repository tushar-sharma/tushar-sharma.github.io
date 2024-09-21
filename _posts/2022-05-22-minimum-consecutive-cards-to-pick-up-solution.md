---
title: Minimum Consecutive Cards to Pick up solution leetcode
category: blog
layout: post
tags:
- leetcode
- java
- python
- hashmap
name: minimum-cards-pick-up
thumb: https://unsplash.com/photos/-2vD8lIhdnw/download?w=437
---

An interesting problem on leetcode to find minimum number of ways to pick up consecutive cards. We will start with a brute force algorithm that would exceed in time limit. Later we will improve upon this algorithm using hashmap.<!-- truncate_here -->


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>


<p>An interesting problem on leetcode to find minimum number of ways to pick up consecutive cards. We will start with a brute force algorithm that would exceed in time limit. Later we will improve upon this algorithm using hashmap.</p>

## Problem Statement

You are given an integer array cards where cards[i] represents the value of the i<sup>th</sup> card. A pair of cards are matching if the cards have the same value.

Return the minimum number of consecutive cards you have to pick up to have a pair of matching cards among the picked cards. If it is impossible to have matching cards, return -1.

## Brute force Solution

A simple intuitive solution would be to pick up a card, and then iterate over the remaining cards to find the minimum length.

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


<blockquote class="attention">
This will fail as the time limit will exceed while submiting the solution to leetcode. This is because the time complexity of the solution is <strong>O(n<sup>2</sup>)</strong>.
</blockquote>



## Using HashMap

Lets take an example with a use case of following input

```bash
cards = [3,4,2,3,4,7]
```

Next we can create a `hashmap` to keep track of indices of a particular card.


<p>
<center>
<img src="{{ root_url }}/img/min_ways_hashmap.png" alt="hash map picture">
</center>
</p>

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

Time Complexity is **$$\theta(n * m)$$**.
