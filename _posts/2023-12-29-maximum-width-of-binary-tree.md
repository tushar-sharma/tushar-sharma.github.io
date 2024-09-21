---
layout: post
title: Maximum Width of Binary Tree
image: https://unsplash.com/photos/GiIZSko7Guk/download?w=437
thumb: https://unsplash.com/photos/GiIZSko7Guk/download?w=437
author: Tushar Sharma
category: blog
published: true
mutipleTab: true
tags:
  - python
  - queue
  - java
---

The problem statement, as given on LeetCode, asks us to find the maximum width of a binary tree. The width of a level is defined as the number of nodes at that level. The maximum width of the binary tree is the maximum width among all levels.<!-- truncate_here -->

The problem statement, as given on LeetCode, asks us to find the maximum width of a binary tree. The width of a level is defined as the number of nodes at that level. The maximum width of the binary tree is the maximum width among all levels.

## Solution 

{% template customTab.html %}
---
id: 279fb609b7e6502db5e74eaab77c701b 
files:
  - file: width_of_binary_tree.py
    language: python
  - file: WidthOfBinaryTree.java
    language: java
---
{% endtemplate %}


## Code Walkthrough

Initialization: Start with the root node of the binary tree. Initialize a queue to hold nodes and their positions. Set a variable max_width to keep track of the maximum width seen so far (initially set to 0).

Breadth-First Search (BFS): Perform a BFS traversal of the binary tree. Begin with the root node and assign it a position of 0. Enqueue the root node along with its position into the queue.

While the Queue is not Empty:

* Get the size of the queue, which represents the number of nodes at the current level.

* Initialize left_index and right_index to track the indices of the leftmost and rightmost nodes at the current level.

* Iterate through the nodes at the current level:

* Dequeue a node and its position from the queue.

* Update left_index with the position of the leftmost node.

* Update right_index with the position of the last node (rightmost) in the current level.

* Calculate the width of the current level as right_index - left_index + 1.

* Update max_width with the maximum of its current value and the width of the current level.

* If the node has a left child, enqueue the left child with a position calculated as (2 * current_position) + 1.

* If the node has a right child, enqueue the right child with a position calculated as (2 * current_position) + 2.

* Return max_width: After processing all levels, max_width will hold the maximum width of the binary tree.

## Time Complexity

The time complexity is O(N), where N is the number of nodes in the binary tree. This is because both solutions traverse all nodes in the tree once using BFS.