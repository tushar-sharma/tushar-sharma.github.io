---
layout: post
title: Cribsheet for Heap data structure
category: blog
tags:
  - java
  - python
  - algorithm
  - heap
thumb: https://unsplash.com/photos/tGTVxeOr_Rs/download?w=437
image: https://unsplash.com/photos/tGTVxeOr_Rs/download?w=437
mutipleTab: true
author: tushar sharma
---

A quick reference guide for heap data structures, algorithms, and common interview patterns. Covers max/min heaps, heapsort, priority queues, and practical implementations in Java and Python.<!-- truncate_here -->

A heap is a specialized tree-based data structure that satisfies the **heap property**: for every node $i$ other than the root, $A[\text{parent}(i)] \ge A[i]$ (Max-Heap) or $A[\text{parent}(i)] \le A[i]$ (Min-Heap).

### Core Properties

*   **Structure:** A nearly complete binary tree.
*   **Height:** A heap of $n$ nodes has height $h = \lfloor \log n \rfloor$. 
    *   *Bounds:* $2^h \le n \le 2^{h+1} - 1$.
*   **Representation (Array):** Usually implemented as a 1-indexed array.
    *   `Root`: $A[1]$
    *   `Parent(i)`: $\lfloor i/2 \rfloor$
    *   `Left(i)`: $2i$
    *   `Right(i)`: $2i + 1$
    *   **Fact:** The leaves are the nodes indexed by $\lfloor n/2 \rfloor + 1, \dots, n$.


### Key Algorithms

#### 1. Max-Heapify ($O(\log n)$)
Assumes the left and right subtrees of node $i$ are already max-heaps, but $A[i]$ might be smaller than its children. It "bubbles down" $A[i]$ to its correct position.

#### 2. Build-Max-Heap ($O(n)$)
Converts an unordered array into a max-heap by calling `Max-Heapify` on all non-leaf nodes in bottom-up order (from $n/2$ down to $1$).
*   **Why $O(n)$?** While $O(n \log n)$ is an upper bound, the tight bound is $O(n)$ because most nodes are near the leaves and only travel a small distance. The sum of heights is a convergent series: $\sum_{h=0}^{\lfloor \log n \rfloor} \frac{n}{2^{h+1}} O(h) = O(n)$.

#### 3. Heapsort ($O(n \log n)$)
1. Build a max-heap from the array.
2. Swap the root (max element) with the last element of the heap.
3. Reduce `heapsize` and call `Max-Heapify` on the new root.
4. Repeat until the heap is empty.

### Priority Queue API

A Max-Priority Queue maintains a set $S$ and supports:
*   **Insert(S, x):** Adds element $x$ ($O(\log n)$).
*   **Maximum(S):** Returns the max element ($O(1)$).
*   **Extract-Max(S):** Removes and returns the max element ($O(\log n)$).
*   **Increase-Key(S, x, k):** Increases $x$'s value to $k$ ($O(\log n)$).

### Using Standard Libraries

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1" markdown="1">

```java
// Min Heap (Default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max Heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// Operations
minHeap.offer(10);    // Insert - O(log n)
minHeap.peek();       // Maximum - O(1)
minHeap.poll();       // Extract-Min - O(log n)
```
   </div>

   <div class="codeSample Python1" id="Python1" markdown="1">

```python
import heapq

# Min Heap (Default)
min_heap = []
heapq.heapify(min_heap) # O(n)

# Operations
heapq.heappush(min_heap, 10)  # Insert - O(log n)
heapq.heappop(min_heap)       # Extract-Min - O(log n)
min_heap[0]                    # Minimum - O(1)

# Max Heap: Use negative values
```
   </div>
</div>

### Common Patterns

1.  **Top K Elements:** Use a Min-Heap of size $K$.
2.  **Median from Stream:** Use a Max-Heap (lower half) and a Min-Heap (upper half).
3.  **Greedy with Cooldown:** Use a Max-Heap for the next best item and a Queue for items in cooldown.

