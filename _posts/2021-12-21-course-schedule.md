---
layout: post
title: Course Schedule Leetcode Solution
category: blog
tags:
- leetcode
- graph
- bfs
- java
- python
name: course-schedule
thumb: https://unsplash.com/photos/Fi-GJaLRGKc/download?w=437
summary: Course Schedule Leetcode Solution
image: https://unsplash.com/photos/Fi-GJaLRGKc/download?w=437
author: Tushar Sharma
---

There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>] indicates that you must take course b<sub>i</sub> first if you want to take course a<sub>i</sub>.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>



<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>
<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML-full"></script>


There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>] indicates that you must take course b<sub>i</sub> first if you want to take course a<sub>i</sub>.

* For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return true if you can finish all courses. Otherwise, return false.
# Testcase

## Example 1

```bash
Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0. So it is possible.
```

## Example 2

```bash
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: There are a total of 2 courses to take. 
To take course 1 you should have finished course 0, 
and to take course 0 you should also have finished course 1. So it is impossible.
```

## Constraints:

* 1 <= numCourses <= 105
* 0 <= prerequisites.length <= 5000
* prerequisites[i].length == 2
* 0 <= ai, bi < numCourses
* All the pairs prereq

# Explanation
 
Lets take a good test case like

```bash
numCourses = 5
prerequisites = [[1,4],[2,4],[3,1],[3,2]]
```

Here 
* **4** is prerequisite for both **1** and **2**
* **1** is a prerequisite for **3** 
* **2** is a prerequisite for **3**. 


We can visuallize it as a **directed graph**.

<p> 
<center>
<img src="https://i.imgur.com/YptmwmT.png" alt="graph directed">
</center>
</p>

This problem is equivalent to finding if a cycle exists in a directed graph. If a cycle exists, no topological ordering exists and therefore it will be impossible to take all courses.

# Solution

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>

  </ul>

   <div class="codeSample Java1" id="Java1">
      <script src="https://gist.github.com/tushar-sharma/4e20a87e4f6622bd6996d502d528f942.js?file=CourseSchedule.java"></script>
    </div>

   <div class="codeSample Python1" id="Python1">
      <script src="https://gist.github.com/tushar-sharma/4e20a87e4f6622bd6996d502d528f942.js?file=course_schedule.py"></script>
   </div>

</div> 
<br>

# Complexity 


Time complexity:  $$\mid V \mid  + \mid E \mid$$.

V : numCourses & E : prerequisites


<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
        <p><a href="https://leetcode.com/problems/course-schedule/" target="_blank">207. Course Schedule</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

