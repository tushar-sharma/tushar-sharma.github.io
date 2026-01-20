---
layout: post
title: Merge Two Sorted Lists
category: blog
tags:
- programming
- leetcode
- code
name: merge-sorted-lists
thumb: /img/heap_array.png
skipImage: true
---

<style type="text/css">
.myheading{font-family:Georgia, "Times New Roman", Times, serif;font-size:24px;margin-top:5px;margin-bottom:0;text-align:center;font-weight:400;color:#222}
.mysubheading{font-family:"Lucida Grande", Tahoma;font-size:10px;font-weight:lighter;font-variant:normal;text-transform:uppercase;color:#666;margin-top:10px;text-align:center!important;letter-spacing:.3em}
</style>


Merge two sorted linked lists and return it as a new list. The new list should be made by splicing together the nodes of the first two lists.<!-- truncate_here -->


Merge two sorted linked lists and return it as a new list.<sup><a href='#fn:1' rel='footnote'>1</a></sup>The new list should be made by splicing together the nodes of the first two lists.

It's an easy problem in Leetcode for practicing linked list. It's similar to the merge step of the Merge sort.

# Brute force algorithm

Merge the both list together and sort the returning list.  This will take complexitiy of  $ O(n + m)log(n + m) $ , where n & m are length of each two list

{% template customCode.html %}
---
id: 0f11e4ba933c83ae7f1cae07b38d66e0
file: Simple.java
---
{% endtemplate %}
```

# More efficient solution

Similary to algorithm used in merging step of Merge Sort, we can acheive $ O(n + m) $ time complexity. Traverse both the list together, and insert the smallest value into the new list.

{% template customCode.html %}
---
id: 0f11e4ba933c83ae7f1cae07b38d66e0
file: Solution.java
---
{% endtemplate %}

<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
         <p><a href="https://leetcode.com/problems/merge-two-sorted-lists/" target="_blank">Leetcode</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>

  </ol>
</div>


