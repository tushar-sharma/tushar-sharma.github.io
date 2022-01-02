---
layout: post
title: Design Twitter Leetcode solution
category: blog
tags:
- leetcode
- java
- python
- design
name: design-twitter
thumb: https://i.imgur.com/JaR80xq.jpg
summary: Design Twitter- Leetcode Solution
image: https://i.imgur.com/JaR80xq.jpg
author: Tushar Sharma
---

Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the 10 most recent tweets in the user's news feed.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<link rel="stylesheet" href="{{ root_url }}/css/multipleTab.css"/>
<script src="{{ root_url }}/js/jquery.easytabs.min.js"></script>
<script src="{{ root_url }}/js/multipleTab.js"></script>


Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and is able to see the 10 most recent tweets in the user's news feed.

Implement the Twitter class:

* Twitter() Initializes your twitter object.
* void postTweet(int userId, int tweetId) Composes a new tweet with ID tweetId by the user userId. Each call to this function will be made with a unique tweetId.
* List<Integer> getNewsFeed(int userId) Retrieves the 10 most recent tweet IDs in the user's news feed. Each item in the news feed must be posted by users who the user followed or by the user themself. Tweets must be ordered from most recent to least recent.
* void follow(int followerId, int followeeId) The user with ID followerId started following the user with ID followeeId.
* void unfollow(int followerId, int followeeId) The user with ID followerId started unfollowing the user with ID followeeId.

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>

  </ul>

   <div class="codeSample Java1" id="Java1">
       <script src="https://gist.github.com/tushar-sharma/ced5cd4f61fd36623f10f7be45d3c40a.js?file=DesignTwitter.java"></script>
    </div>

   <div class="codeSample Python1" id="Python1">
   </div>

</div> 
<br>