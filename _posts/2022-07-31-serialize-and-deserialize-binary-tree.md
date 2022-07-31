---
title: Serialize and Deserialize Binary Tree
category: blog
layout: post
tags:
- leetcode
- java
- python
- design
thumb: https://i.imgur.com/yznwqse.jpg
image: https://i.imgur.com/yznwqse.jpg
mutipleTab: true
---

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

**Clarification:** The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.


## Explanation

Lets first implement `serialize` method. We will use a `pre order` traversal. Just to revise preorder traversal, the sequence is 

* Visit the root

* Traverse the left subtree

* Traverse the right subtree

For `deserialize` we will first split the string by a serpator (we are using comma as a separtor). Next we will consruct the tree from the string. 

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
   <script src="https://gist.github.com/tushar-sharma/ed76a998ebd3b50c32e782be15ddcafb.js?file=Serialize.java"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
   <script src="https://gist.github.com/tushar-sharma/ed76a998ebd3b50c32e782be15ddcafb.js?file=serialize.py"></script>
   </div>
</div>

## Complexity

Time Complexity of Preorder traversal is **$$O(n)$$** 

Space complexity is **$$O(n)$$**

