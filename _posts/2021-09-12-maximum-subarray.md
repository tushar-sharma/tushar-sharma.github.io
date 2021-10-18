---
layout: post
title: Maximum Subarray
category: blog
tags:
- programming
- leetcode
- code
- dp
name: maximum-subarray
thumb: https://www.hrccu.org/wp-content/uploads/2020/05/hackers.jpg
toc: true
---

<style type="text/css">
.myheading{font-family:Georgia, "Times New Roman", Times, serif;font-size:24px;margin-top:5px;margin-bottom:0;text-align:center;font-weight:400;color:#222}
.mysubheading{font-family:"Lucida Grande", Tahoma;font-size:10px;font-weight:lighter;font-variant:normal;text-transform:uppercase;color:#666;margin-top:10px;text-align:center!important;letter-spacing:.3em}
</style>

<p>There's an interesting problem I recently solved on leetcode based on dynamic programming. My <a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github</a> repository contains list of all problems that I have solved. </p>

Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a contiguous part of an array.<sup><a href='#fn:1' rel='footnote'>1</a></sup>


<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<p>There's an interesting problem I recently solved on leetcode based on dynamic programming. My <a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github</a> repository contains list of all problems that I have solved. </p>


Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a contiguous part of an array.<sup><a href='#fn:1' rel='footnote'>1</a></sup>

# Table of Contents
{:.no_toc}

1. Will be replaced with the ToC, excluding the "Table of Contents" header
{:toc}

# Brute force algorithm

We can commence with a brute force algorithm. For every element of array, we compare its sum with the rest of the element to calculate maximum sum. 

![img](https://i.imgur.com/WHMSDtu.png)

{% highlight java %}

class Solution {
    public int maxSubArray(int[] nums) {
        
        if (nums.length == 1){
            return nums[0];
        }

        int output = nums[0];
        
        for (int i = 0; i < nums.length; i++) {
            int tempSum = nums[i];
            for (int j = i + 1; j < nums.length; j++) {
                tempSum += nums[j];
                output = Math.max(tempSum, output);
            }
            
            output = Math.max(output, nums[i]);
            
        }     
        return output;   
        
    }
}
{% endhighlight %}

Time complexity is <b>O(n<sup>2</sup>)</b> and the execution time is 110 ms on leetcode.

## More efficient solution


We can use <a href="https://en.wikipedia.org/wiki/Maximum_subarray_problem">Kadane algorithm</a> to solve. It cans the given array <b>A[1..n]</b> from left to right. In the jth step, it computes the subarray with the largest sum ending at j; this sum is maintained in variable cSum. It computes the subarray with the largest sum anywhere in <b>A[1..j]</b>, maintained in variable oSum;

{% highlight java %}
class Solution {
    public int maxSubArray(int[] nums) {
        
        if (nums.length == 1){
            return nums[0];
        }

        int cSum = nums[0];
        int oSum = nums[0];
        
        for (int i = 1; i < nums.length; i++){
            if (nums[i] > nums[i] + cSum) {
                cSum = nums[i];
                
            } else { 
                cSum += nums[i];
            }
            oSum = Math.max(oSum, cSum);
        }
 
        return oSum;
  
    }
}
{% endhighlight %}

The time complexity is <b>O(n<sup></sup>)</b>. The execution time took 0 ms on leetcode.

<div class='footnotes'><h4>Footnotes</h4><hr />
  <ol>
    <li id='fn:1'>
         <p><a href="https://leetcode.com/problems/maximum-subarray/" target="_blank">Leetcode</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
    <li id='fn:2'>
         <p><a href="https://github.com/tushar-sharma/prep-coding" target="_blank">Github Repository</a></p>
         <a href='#fnref:2' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
