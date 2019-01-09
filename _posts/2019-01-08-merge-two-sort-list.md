---
layout: post
title: Merge Two Sorted Lists
category: blog
tags:
- programming
- leetcode
- code
name: merge-sorted-lists
thumb: http://destructor.de/linklist/linklist.png
---

<style type="text/css">
.myheading{font-family:Georgia, "Times New Roman", Times, serif;font-size:24px;margin-top:5px;margin-bottom:0;text-align:center;font-weight:400;color:#222}
.mysubheading{font-family:"Lucida Grande", Tahoma;font-size:10px;font-weight:lighter;font-variant:normal;text-transform:uppercase;color:#666;margin-top:10px;text-align:center!important;letter-spacing:.3em}
</style>


<p>Merge two sorted linked lists and return it as a new list.<sup><a href='#fn:1' rel='footnote'>1</a></sup>. The new list should be made by splicing together the nodes of the first two lists.</p> 

It's an easy problem in Leetcode for practicing linked list. It's similar to the merge step of the Merge sort.
<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


Merge two sorted linked lists and return it as a new list.<sup><a href='#fn:1' rel='footnote'>1</a></sup>The new list should be made by splicing together the nodes of the first two lists.

It's an easy problem in Leetcode for practicing linked list. It's similar to the merge step of the Merge sort.

# Brute force algorithm

Merge the both list together and sort the returning list.  This will take complexitiy of  @L O(n + m)log(n + m) @L , where n & m are length of each two list.

# More efficient solution

Similary to algorithm used in merging step of Merge Sort, we can acheive @L O(n + m) @L time complexity. Traverse both the list together, and insert the smallest value into the new list.

{% highlight java %}
public class ListNode {
   int val;
   ListNode next;
   ListNode(int x) { val = x; }
}

class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode l3 = null;
        ListNode tail = null;

        while (l1 != null && l2 != null) {
            int lowestValue;

            if (l1.val < l2.val) {
                lowestValue = l1.val;
                l1 = l1.next;
            } else {
                lowestValue = l2.val;
                l2 = l2.next;
            }

            if (l3 == null) {
                l3 = new ListNode(lowestValue);
                tail = l3;
            } else {
                ListNode ptr = new ListNode(lowestValue);
                tail.next = ptr;
                tail = ptr;
            }
        }

        //if any of the two lists is not yet completely traversed
        if (tail != null) {
            tail.next = l1 != null ? l1 : l2;
        } else {
            l3 = l1 != null ? l1 : l2;
        }

        return l3;
    }
}
{% endhighlight %}

<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
         <p><a href="https://leetcode.com/problems/merge-two-sorted-lists/" target="_blank">Leetcode</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>

  </ol>
</div>


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
