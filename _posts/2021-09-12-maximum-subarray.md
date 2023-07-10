---
layout: post
title: Maximum Subarray
category: blog
tags:
- leetcode
- dp
- java
- python
name: maximum-subarray
thumb: https://www.hrccu.org/wp-content/uploads/2020/05/hackers.jpg
---

There's an interesting problem I recently solved on leetcode based on dynamic programming. My <a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github</a> repository contains list of all problems that I have solved. I often start with a brute force approach without fretting about time complexity. Later I try to improve my algorithm for a better efficient solution.<!-- truncate_here -->


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>

<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>

<script src="{{ root_url }}/js/multipleTab.js"></script>


<p>There's an interesting problem I recently solved on leetcode based on dynamic programming. My <a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github</a> repository contains list of all problems that I have solved. I often start with a brute force approach without fretting about time complexity. Later I try to improve my algorithm for a better efficient solution.</p>


Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a contiguous part of an array.<sup><a href='#fn:1' rel='footnote'>1</a></sup>


### Brute force algorithm

We can commence with a brute force algorithm. For every element of array, we compare its sum with the rest of the element to calculate maximum sum. 

![img](https://i.imgur.com/WHMSDtu.png)

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
      <script src="https://gist.github.com/tushar-sharma/5fab75b08c891f6e2ca958b2338c369d.js"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
       <script src="https://gist.github.com/tushar-sharma/d8c221cf6eb1f4c8abd85c625127a9c1.js"></script>   
    </div>

</div>


Time complexity is <b>O(n<sup>2</sup>)</b> and has **Time Limit Exceeded** on leetcode.

### More efficient solution


We can use <a href="https://en.wikipedia.org/wiki/Maximum_subarray_problem">Kadane algorithm</a> to solve. It scans the given array <b>A[1..n]</b> from left to right. In the jth step, it computes the subarray with the largest sum ending at j; this sum is maintained in variable cSum. It computes the subarray with the largest sum anywhere in <b>A[1..j]</b>, maintained in variable oSum;

<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
    <li class="tab Python2"><a href="#Python2">Python</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
      <script src="https://gist.github.com/tushar-sharma/e1bc03cd4bb10fe2739c8cbef11b2c47.js"></script>
   </div>

   <div class="codeSample Python2" id="Python2">
     <script src="https://gist.github.com/tushar-sharma/d7ae08673b2170467d84fd1183ef2d34.js"></script>
   </div>

</div>

The time complexity is <b>O(n<sup></sup>)</b>.

<div class='footnotes'><h4>Footnotes</h4><hr />
  <ol>
    <li id='fn:1'>
         <p><a href="https://leetcode.com/problems/maximum-subarray/" target="_blank">Leetcode</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
    <li id='fn:2'>
         <p><a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github Repository</a></p>
         <a href='#fnref:2' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>


