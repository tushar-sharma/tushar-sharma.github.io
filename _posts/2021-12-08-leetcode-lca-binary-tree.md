---
layout: post
title: Lowest Common Ancestor of a Binary Tree
category: blog
tags:
- leetcode
- java
- python
- javascript
- scala
name: lca-binary-tree
thumb: https://i.imgur.com/4YDq7FT.jpg
summary: Finding lowest common ancestor of a binary tree
image: https://i.imgur.com/4YDq7FT.jpg
author: Tushar Sharma
---

Questions involving the binary tree data structure are very popular in tech interviews, and can be challenging and varied! A binary tree is a data structure consisting of a collection of nodes (starting at a root node), where each node consists of a value (data), together with a directed edges to at most two nodes (the "left child" and "right child"), with the additional conditions that no two edges point to the same node and no edge points to the root. I recently solved an interesting problem on binary tree.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>

<p>Questions involving the binary tree data structure are very popular in tech interviews, and can be challenging and varied! A binary tree is a data structure consisting of a collection of nodes (starting at a root node), where each node consists of a value (data), together with a directed edges to at most two nodes (the "left child" and "right child"), with the additional conditions that no two edges point to the same node and no edge points to the root. I recently solved an interesting problem on binary tree.
</p>

<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<!-- disclaimer -->
<div class="cl disclaimer">
  <i class="icon-star"></i>
    <span style="color:black"> &nbsp;&nbsp;All my solutions are uploaded to <a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github repository</a>
</span> 
</div><br>


# Problem Statement

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the [definition of LCA on Wikipedia](https://en.wikipedia.org/wiki/Lowest_common_ancestor): "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)"<sup><a href='#fn:1' rel='footnote'>1</a></sup>.

# Testcase


## Example 1

```bash 
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
Output: 3
Explanation: The LCA of nodes 5 and 1 is 3.
```

## Example 2

```bash 
Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
Output: 5
Explanation: The LCA of nodes 5 and 4 is 5, 
since a node can be a descendant of itself according to the LCA definition.
```

### Example 3

```bash
Input: root = [1,2], p = 1, q = 2
Output: 1
```

## Constraints:

* The number of nodes in the tree is in the range [2, 105].
* -109 <= Node.val <= 109
* All Node.val are unique.
* p != q
* p and q will exist in the tree.

# Explanation

We traverse the left and right sub trees. 

1. If current node is NULL, then we will return NULL since we have reached the end of tree. 

2. If current node matches node p or q, then we return current node. 

3. If the current node has node p in its left subtree and q in its right subtree or vice versa then the current node will be the lowest common ancestor.

4. If the current node has nodes p and q exclusively in its left subtree or right subtree, then we will return the left or right subtree accordingly.

# Solution

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
    <li class="tab Javascript1"><a href="#Javascript1">Javascript</a></li>
    <li class="tab Scala1"><a href="#Scala1">Scala</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
      <script src="https://gist.github.com/tushar-sharma/313465d1f1fa21800d3a726146780020.js"></script>

   </div>

   <div class="codeSample Python1" id="Python1">
       <script src="https://gist.github.com/tushar-sharma/a0b2faeeace2acaa3f8b61794af59976.js"></script>  
    </div>

   <div class="codeSample Javascript1" id="Javascript1">
       <script src="https://gist.github.com/tushar-sharma/cb9e4364f354423764459a11477c4d98.js"></script> 
    </div>


   <div class="codeSample Scala1" id="Scala1">
       <script src="https://gist.github.com/tushar-sharma/8611d4612495af58e3d0fb9f8e4c3883.js"></script> 
    </div>
</div>

## Complexity

Time Complexity: O(N).
   
Space Complexity: O(1).


<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
        <p><a href="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" target="_blank">Lowest Common Ancestor of a Binary Tree</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>