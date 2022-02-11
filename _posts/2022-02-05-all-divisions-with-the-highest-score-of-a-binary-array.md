---
title: Leetcode - All Divisions With the Highest Score of a Binary Array
category: blog
layout: post
tags:
- leetcode
- hashmap
- array
- java
- python
name: highest-score-binary-array
featuredPost: 
image: https://unsplash.com/photos/uXLgmicKSi4/download?w=800
thumb: https://unsplash.com/photos/uXLgmicKSi4/download?w=800
---

You are given a **0-indexed** binary array `nums` of length `n`. `nums` can be divided at index `i` (where `0 <= i <= n`) into two arrays (possibly empty) nums<sub>left</sub> and nums<sub>right</sub><!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>

## Problem Statement

You are given a **0-indexed** binary array `nums` of length `n`. `nums` can be divided at index `i` (where `0 <= i <= n`) into two arrays (possibly empty) nums<sub>left</sub> and nums<sub>right</sub>:

nums<sub>left</sub> has all the elements of `nums` between index `0` and `i - 1` (**inclusive**), while numsright has all the elements of nums between index `i` and `n - 1` (**inclusive**).
If i == 0, nums<sub>left</sub> is empty, while nums<sub>right</sub> has all the elements of nums.
If i == n, nums<sub>left</sub> has all the elements of nums, while nums<sub>right</sub> is empty.
The division score of an index i is the sum of the number of 0's in nums<sub>left</sub> and the number of 1's in nums<sub>right</sub>.

Return all distinct indices that have the highest possible division score. You may return the answer in any orde

### Example 1

```
Input: nums = [0,0,1,0]
Output: [2,4]
Explanation: Division at index
- 0: numsleft is []. numsright is [0,0,1,0]. The score is 0 + 1 = 1.
- 1: numsleft is [0]. numsright is [0,1,0]. The score is 1 + 1 = 2.
- 2: numsleft is [0,0]. numsright is [1,0]. The score is 2 + 1 = 3.
- 3: numsleft is [0,0,1]. numsright is [0]. The score is 2 + 0 = 2.
- 4: numsleft is [0,0,1,0]. numsright is []. The score is 3 + 0 = 3.
Indices 2 and 4 both have the highest possible division score 3.
Note the answer [4,2] would also be accepted.
```
### Example 2

```
Input: nums = [0,0,0]
Output: [3]
Explanation: Division at index
- 0: numsleft is []. numsright is [0,0,0]. The score is 0 + 0 = 0.
- 1: numsleft is [0]. numsright is [0,0]. The score is 1 + 0 = 1.
- 2: numsleft is [0,0]. numsright is [0]. The score is 2 + 0 = 2.
- 3: numsleft is [0,0,0]. numsright is []. The score is 3 + 0 = 3.
Only index 3 has the highest possible division score 3.
```

### Example 3

```
Input: nums = [1,1]
Output: [0]
Explanation: Division at index
- 0: numsleft is []. numsright is [1,1]. The score is 0 + 2 = 2.
- 1: numsleft is [1]. numsright is [1]. The score is 0 + 1 = 1.
- 2: numsleft is [1,1]. numsright is []. The score is 0 + 0 = 0.
Only index 0 has the highest possible division score 2.
```

## Explanation

We can maintain two window `left` with size 0 and `right` with full length of array. For each iteration, we will increase the length of `left` window and reduce the `right` window. We will also keep track of number of zeros in the `left` window and number of ones in `right` window. The `maximum sum` of `left + right` will contain the highest score.

@startmermaid
graph TD
A["[0, 0, 1, 0]"] --> B["[ ]"]
A["[0, 0, 1, 0]"] --> C["[0, 0, 1, 0]"]

B["[ ]"] --> D["[0]"]
C["[0, 0, 1, 0]"] -->  E["[0, 1, 0]"]

D["[0]"] --> F["[0, 0]"]
E["[0, 1, 0]"] -->  G["[1, 0]"]

F["[0, 0]"] --> H["[0, 0, 1]"] 
G["[1, 0]"] -->  I["[0]"]


H["[0, 0, 1]"] --> J["[0, 0, 1, 0]"] 
I["[0]"] -->  K["[ ]"]
@endmermaid


The maxium key in **hashmap** will contain the list of indices with the highest score.

## Solution

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
     <script src="https://gist.github.com/tushar-sharma/fa433cb7d3f266f5853854805134c543.js?file=MaxScoreIndices.java"></script>
   </div>

   <div class="codeSample Python1" id="Python1">
     <script src="https://gist.github.com/tushar-sharma/fa433cb7d3f266f5853854805134c543.js?file=max_score_indices.py"></script>
   </div>

</div>


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>