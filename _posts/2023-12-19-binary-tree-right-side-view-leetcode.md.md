---
layout: post
title: Binary Tree Right Side View Leetcode
image: https://unsplash.com/photos/eZt5mvF7RcU/download?w=437
thumb: https://unsplash.com/photos/eZt5mvF7RcU/download?w=437
author: ;
tags:
  - python
  - queue
  - java
category: blog
published: true
mutipleTab: true
---

We delve into a popular algorithmic problem from LeetCode: the "Binary Tree Right Side View". This problem is an excellent exercise for understanding tree-based data structures and breadth-first traversal techniques.<!-- truncate_here -->

We delve into a popular algorithmic problem from LeetCode: the "Binary Tree Right Side View". This problem is an excellent exercise for understanding tree-based data structures and breadth-first traversal techniques.

### Problem Statement

The "Binary Tree Right Side View" problem asks us to find the values of the nodes you can see when you look at a binary tree from the right side. This perspective means we only observe the rightmost node at each level of the tree.

example

Given a binary tree like this:

```
    1
   / \
  2   3
   \   \
    5   4

```

The right side view will be [1, 3, 4].

### Solution

To solve this problem, we employ a breadth-first search (BFS) approach using a queue. BFS allows us to traverse the tree level by level, ensuring we can access the rightmost element of each level.

{% template customTab.html %}
---
id: 752705ffec52ff6a44ed559c49d0fd2f
files:
  - file: right_side_view.py
    language: python
  - file: RightSideView.java
    language: java
---
{% endtemplate %}

### Code Walkthrough

* Method Signature: The method rightSideView takes the root of a binary tree as its input and returns a list of integers representing the tree's right side view.

* Base Case Check: We first check if the root is null. If it is, we return an empty list, as there's no tree to traverse.

* Queue Initialization: We use a Deque to store nodes at each level.

* BFS Loop: We iterate through the tree using a while loop, processing nodes level by level.

* Level Processing: For each level, we iterate through the nodes at that level. The key is to add the value of the last node of each level to our output list.

* Child Nodes: We add the left and right child nodes of each processed node to the queue for subsequent processing.

### Time Complexity

The time complexity of this solution is O(N), where N is the number of nodes in the tree. This is because each node is visited exactly once during the BFS traversal.

* Queue Operations: Each node is added and removed from the queue exactly once.

* Level-wise Traversal: Since we process nodes level by level, we ensure that each node is considered only once.
