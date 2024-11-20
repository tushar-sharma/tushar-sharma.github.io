---
layout: post
title: Cribsheet for Heaps
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

Heaps = complete binary tree. binary means 2. Complete means? 

Min heap = root node has minimum value. Value of each node is equal or greater than parent node.

max heap = root node has maximum value. Value of each node is equal or smaller than parent node.

Queue = FIFO

priorty queue = remove the largest (or smallest)  item

```java

maxHeap = new PriortyQueue<>((a,b) ->  b - a);
minHeap = new PriortyQueue<>((a,b) -> a - b)
```
