---
layout: post
title: Course Schedule Leetcode Solution
category: blog
tags:
- leetcode
- graph
- bfs
- java
name: course-schedule
thumb: https://i.imgur.com/t4KbRpA.jpg
summary: Course Schedule Leetcode Solution
image: https://i.imgur.com/t4KbRpA.jpg
author: Tushar Sharma
---

There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>] indicates that you must take course b<sub>i</sub> first if you want to take course a<sub>i</sub>.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a<sub>i</sub>, b<sub>i</sub>] indicates that you must take course b<sub>i</sub> first if you want to take course a<sub>i</sub>.

* For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return true if you can finish all courses. Otherwise, return false.

<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
        <p><a href="https://leetcode.com/problems/course-schedule/" target="_blank">Course Schedule</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>