---
title: Apply Discount To Prices leetcode solution
category: blog
layout: post
tags:
- leetcode
- java
- python
- string
thumb: https://i.imgur.com/ZF5YvLD.jpg
image: https://i.imgur.com/ZF5YvLD.jpg 
mutipleTab: true
---

A sentence is a string of single-space separated words where each word can contain digits, lowercase letters, and the dollar sign '$'. A word represents a price if it is a sequence of digits preceded by a dollar sign.<!-- truncate_here -->

A sentence is a string of single-space separated words where each word can contain digits, lowercase letters, and the dollar sign '$'. A word represents a price if it is a sequence of digits preceded by a dollar sign.


For example, "<span>$</span>100", "<span>$</span>23", and "<span>$</span>6" represent prices while "100", "<span>$</span>", and "<span>$</span>1e5" do not.

You are given a string sentence representing a sentence and an integer discount. For each word representing a price, apply a discount of discount% on the price and update the word in the sentence. All updated prices should be represented with exactly two decimal places.

Return a string representing the modified sentence.

Note that all prices will contain at most 10 digits.

## Explanation

1. Split the **string** by whitespaces
2. For each string, apply discount only if it starts with '<span>$</span>' and is **numeric**. 
3. Merge the **string array** into a string and return it.

| <img align="center"  loading="lazy" src="{{ root_url }}/img/apply_discount.png" alt="Explanation of apply discount" />|


## Solution

<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
    <li class="tab Python2"><a href="#Python2">Python</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
     <script src="https://gist.github.com/tushar-sharma/f34119b8638d8071aff8526f9c77b549.js?file=DiscountPrices.java"></script>
   </div>

   <div class="codeSample Python2" id="Python2">
     <script src="https://gist.github.com/tushar-sharma/f34119b8638d8071aff8526f9c77b549.js?file=discount_prices.py"></script>
   </div>

</div>


