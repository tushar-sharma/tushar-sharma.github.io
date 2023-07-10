---
layout: post
date: 2023-06-20
title: Kata - Correct the Time String
image: /img/cat-computer.jpeg
thumb: /img/cat-computer.jpeg
author: Tushar Sharma
mutipleTab: true
tags: 
 - java
 - javascript
category: blog
---

In this [kata](https://www.codewars.com/kata/57873ab5e55533a2890000c7/), you are given a string that represents a time in the format "HH:MM:SS". The string may be in the wrong format, or it may be missing some characters. Your task is to correct the string so that it represents a valid time.<!-- truncate_here -->

In this [kata](https://www.codewars.com/kata/57873ab5e55533a2890000c7/), you are given a string that represents a time in the format "HH:MM:SS". The string may be in the wrong format, or it may be missing some characters. Your task is to correct the string so that it represents a valid time.

The code first checks if the string is null or empty. If it is, then the code returns null. Otherwise, the code splits the string into three parts, representing the hours, minutes, and seconds. The code then tries to parse these parts as integers. If any of the parts cannot be parsed as an integer, then the code returns null.

If all of the parts can be parsed as integers, then the code calculates the correct time. The code does this by adding the seconds to the minutes, and then adding the minutes to the hours. The code then takes the remainder of the hours when it is divided by 24.


{% template  customTab.html %}
---
id: 4ba44496f5bf88cc6c0003b3b6f50758
files:
  - file: TimeCorrect.java
    language: java
  - file: timeCorrect.js
    language: javascript
---
{% endtemplate %}

Time complexity: The time complexity of the code is **O(n)**, where n is the length of the time string. This is because the code iterates through the time string once, and each iteration takes constant time.

Space complexity: The space complexity of the code is **O(1)**. This is because the code only creates a few small variables, and these variables are all of constant size.