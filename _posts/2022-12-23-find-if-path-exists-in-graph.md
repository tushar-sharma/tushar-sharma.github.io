---
layout: post
date: 2022-12-23
title: Find if Path Exists in Graph leetcode solution
image: https://unsplash.com/photos/XBxQZLNBM0Q/download?w=437
thumb: https://unsplash.com/photos/XBxQZLNBM0Q/download?w=437
tags:
- leetcode
- java
author: Tushar Sharma
mutipleTab: true
category: blog
---

It's a easy problem on Graph in leetcode to find if a path exist in graph.<!-- truncate_here -->

It's a easy problem on Graph in leetcode to find if a path exist in graph.

### Problem Statement

There is a bi-directional graph with n vertices, where each vertex is labeled from 0 to n - 1 (inclusive). The edges in the graph are represented as a 2D integer array edges, where each edges[i] = [ui, vi] denotes a bi-directional edge between vertex ui and vertex vi. Every vertex pair is connected by at most one edge, and no vertex has an edge to itself.


You want to determine if there is a valid path that exists from vertex source to vertex destination.

Given edges and the integers n, source, and destination, return true if there is a valid path from source to destination, or false otherwise.

### Explanation

To solve this problem, you can use a graph traversal algorithm, such as breadth-first search (BFS).

* Create a queue to store nodes that need to be visited.

* Add the start node to the queue.

* While the queue is not empty:

* Remove the first node from the queue.

* If the node is the end node, return True (a path has been found).

* Otherwise, add all of the node's neighbors to the queue.

* If the queue is empty and the end node has not been found, return False (no path exists).


### Solution

{% template customCode.html %}
---
id: 7b99a20c4164f2ef510729218f0cef1b
file: ValidPath.java
---
{% endtemplate %}
