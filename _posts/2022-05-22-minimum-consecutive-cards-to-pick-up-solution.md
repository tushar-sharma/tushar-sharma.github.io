---
title: Minimum Consecutive Cards to Pick up solution leetcode
category: blog
layout: post
tags:
- leetcode
- java
- python
name: minimum-cards-pick-up
thumb: https://i.imgur.com/O4nTgxWr5Sc.jpeg
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
     <script src="https://gist.github.com/tushar-sharma/2b1119ca6114e81f29c156f7f8fc4fd2.js?filename=BruteMinimumCardPickUp.java"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
     <script src="https://gist.github.com/tushar-sharma/d5d258b7fcba9b731d37ac23dcc6cb65.js"></script>
   </div>

</div>

 
**However this solution fails as the time limit exceeded**



## Using HashCode

We have to find some subproblem that will help in solving coin-change problem. Given an amount n, we want to generate an exact change using the fewest number of coins of denominations d<sub>1</sub> < d<sub>2</sub> < ... < d<sub>m</sub>.
 
Let Dp(n) represent the minimum number of coins required for a given amount n. Coins d<sub>j</sub> can be added to amount n - d<sub>j</sub> only if d<sub>j</sub> <= n and 0 <= j <= n -1 wher Dp(0) is 0.

\begin{equation}
Dp(n) = \min_{j=0}^{d_j<=n} Dp(n - D_j) + 1
\end{equation}

Let us proceed with following test case

```sh
coins = [1, 2, 5]
amount = 11
```
We can vary the amount as i from 0 to amount. The value of Dp[i] for each iteration becomes

|         | *0*| *1* | *2*| *3*| *4*| *5*| *6* | *7* | *8* | *9* | *10* | *11* |
|---------+----+-----+----+----+----+----+-----+-----+-----+-----+-------+-----+
| i = 0   | 0   | 12    | 12   | 12   | 12   | 12   |  12   | 12    | 12    | 12    | 12      |  12   |
| i = 1   |  0 |  1  | 12 | 12 | 12 | 12 | 12  | 12 | 12 | 12 | 12 | 12  |
| i = 2   |  0 |  1  | 1  | 12 | 12 | 12 | 12  | 12 | 12 | 12 | 12 | 12  |
| i = 3   |  0 |  1  | 1  | 2  | 12 | 12 | 12  | 12 | 12 | 12 | 12 | 12  |
| i = 4   |  0 |  1  | 1  | 2  | 2  | 12 | 12  | 12 | 12 | 12 | 12 | 12  |
| i = 5   |  0 |  1  | 1  | 2  | 2  | 1  | 12  | 12 | 12 | 12 | 12 | 12  |
| i = 6   |  0 |  1  | 1  | 2  | 2  | 1  | 2   | 12 | 12 | 12 | 12 | 12  |
| i = 7   |  0 |  1  | 1  | 2  | 2  | 1  | 2   | 2  | 12 | 12 | 12 | 12  |
| i = 8   |  0 |  1  | 1  | 2  | 2  | 1  | 2   | 2  | 3  | 12 | 12 | 12  |
| i = 9   |  0 |  1  | 1  | 2  | 2  | 1  | 2   | 2  | 3  | 3  | 12 | 12  |
| i = 10  |  0 |  1  | 1  | 2  | 2  | 1  | 2   | 2  | 3  | 3  | 2  | 12  |
| i = 11  |  0 |  1  | 1  | 2  | 2  | 1  | 2   | 2  | 3  | 3  | 2  | 3   |


<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
    <li class="tab Python2"><a href="#Python2">Python</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
      <script src="https://gist.github.com/tushar-sharma/8518f5b023dacdfac1381756ff099883.js"></script>
   </div>

   <div class="codeSample Python2" id="Python2">
     <script src="https://gist.github.com/tushar-sharma/108a8677ef861d8af291671ff7d25708.js"></script>
   </div>

</div>

## Complexity

Time Complexity is **$$\theta(n * m)$$**, Space complexity is **$$\theta(n)$$**


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
