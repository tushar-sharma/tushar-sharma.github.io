---
layout: post
title: Remove-all-adjacent-duplicates-in-string-ii Solution
category: blog
tags:
- leetcode
- stack
- python 
- java
- scala
- javascript
name: remove-adjacent-string-ii
thumb: https://unsplash.com/photos/842ofHC6MaI/download?w=437
summary: Remove all adjacent duplicates in string
image: https://unsplash.com/photos/842ofHC6MaI/download?w=437
author: Tushar Sharma
---


You are given a string s and an integer k, a k duplicate removal consists of choosing k adjacent and equal letters from s and removing them, causing the left and the right side of the deleted substring to concatenate together.<!-- truncate_here -->


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>
<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

# Problem Statement 


You are given a string s and an integer k, a k duplicate removal consists of choosing k adjacent and equal letters from s and removing them, causing the left and the right side of the deleted substring to concatenate together.

We repeatedly make k duplicate removals on s until we no longer can.

Return the final string after all such duplicate removals have been made. It is guaranteed that the answer is unique<sup><a href='#fn:1' rel='footnote'>1</a></sup>.

<!-- disclaimer -->
<div class="cl disclaimer">
  <i class="icon-star"></i>
    <span style="color:black"> &nbsp;&nbsp;All my solutions are uploaded to <a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github repository</a>
</span> 
</div><br>

# Testcase

## Example 1

```bash
Input: s = "abcd", k = 2
Output: "abcd"
Explanation: There's nothing to delete.
```

## Example 2

```bash
Input: s = "deeedbbcccbdaa", k = 3
Output: "aa"
Explanation: 
First delete "eee" and "ccc", get "ddbbbdaa"
Then delete "bbb", get "dddaa"
Finally delete "ddd", get "aa"
```

## Example 3 

```bash
Input: s = "pbbcggttciiippooaais", k = 2
Output: "ps"
```

## Constraints:

* 1 <= s.length <= 105
* 2 <= k <= 104
* s only contains lower case English letters.

# Explanation

1. Use a stack and store a pair of character and its count. 
2. Update the count of character if its adjacent. 
3. If the count equals to the value of `k` then remove the character. 
4. Iterate over the stack to generate the output string.

For example for `Input: s = "deeedbbcccbdaa", k = 3`.

<p> 
<center>
<img src="https://i.imgur.com/iZHiqyl.gif" alt="stack operation">
</center>
</p>

# Solution


<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
    <li class="tab Javascript1"><a href="#Javascript1">Javascript</a></li>
    <li class="tab Scala1"><a href="#Scala1">Scala</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
      <script src="https://gist.github.com/tushar-sharma/00bbaae23770cf2b451ed26151951e82.js?file=RemoveDuplicates.java"></script>
   </div>

  <div class="codeSample Python1" id="Python1">
      <script src="https://gist.github.com/tushar-sharma/00bbaae23770cf2b451ed26151951e82.js?file=remove_duplicates.py"></script>
  </div>

  <div class="codeSample Javascript1" id="Javascript1">
      <script src="https://gist.github.com/tushar-sharma/00bbaae23770cf2b451ed26151951e82.js?file=removeDuplicates.js"></script>
  </div>

  <div class="codeSample Scala1" id="Scala1">
      <script src="https://gist.github.com/tushar-sharma/00bbaae23770cf2b451ed26151951e82.js?file=RemoveDuplicates.scala"></script>
  </div>
</div>

# Complexity

Time Complexity: O(N).
   
Space Complexity: O(N).

<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
        <p><a href="https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/" target="_blank">Remove All Adjacent Duplicates in String II</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

