---
title: Coin Change solution leetcode
category: blog
layout: post
tags:
- programming
- leetcode
- code
- dp
- java
- python
name: coin-change
thumb: https://i.imgur.com/LYeioqF.jpeg
---

<p>It's one of the most popular question on leetcode that seems very easy at first. Coin change is a classic problem to solve if you are practice dynamic programming. I will proceed with a naive (albeit wrong) which only passes few test cases. Subsequently I'll proceed to a correct & more efficient solution.</p>


You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. You may assume that you have an infinite number of each kind of coin.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<link type="text/css" rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>

<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>

<script src="{{ root_url }}/js/multipleTab.js"></script>

<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>


<p>It's one of the most popular question on leetcode that seems very easy at first. Coin change is a classic dynamic programming problem. I will proceed with an obvious (albeit wrong) solution and subsequently proceeding to an efficient correct solution.</p>

## Problem Statement

<p>You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. You may assume that you have an infinite number of each kind of coin.</p>

## Greedy Solution

My first instinct is to sort the coins array. Pick the largest coin first and then substract the largest possible value from the amount. Subsequently proceed with smaller denomination while keeping track of the count.
 
<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
     <script src="https://gist.github.com/tushar-sharma/82d9dfdf52f92c4f38bfb559221c4b0f.js"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
     <script src="https://gist.github.com/tushar-sharma/d5d258b7fcba9b731d37ac23dcc6cb65.js"></script>
   </div>

</div>

 
**However this solution fails the following test case as the minimum sequence is [8, 4]**

```sh
[1, 2, 4, 8, 9]
12

Output : 3
Expected: 2
```




## Dynamic Programming

We have to find some subproblem that will help in solving coin-change problem. We can start with substructure dp[i] such that 

\begin{equation}
Dp(i) = \min_{j=0}^{n-1} Dp(i - C_j) + 1
\end{equation}


Let us proceed with following test case 

```sh
[1, 2, 5]
11
```
We can vary the amount as i from 0 to amount. The value of dp[i] becomes for each iteration

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

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>