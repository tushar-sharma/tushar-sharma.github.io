---
layout: post
title: Time Based Key-Value Store Solution
image: https://i.imgur.com/LYeioqF.jpeg
thumb: https://i.imgur.com/LYeioqF.jpeg
author: Tushar Sharma
tags:
  - java
  - leetcode
category: blog
published: true
---

Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.<!-- truncate_here -->

Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.

#### Problem statement

Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.

Implement the TimeMap class:

TimeMap() Initializes the object of the data structure.
void set(String key, String value, int timestamp) Stores the key key with the value value at the given time timestamp.
String get(String key, int timestamp) Returns a value such that set was called previously, with timestamp_prev <= timestamp. If there are multiple such values, it returns the value associated with the largest timestamp_prev. If there are no values, it returns "".

#### First Attempt

{% template  customCode.html %}
---
id: 1860d33b9fc700c49c0d5dbd1cc348dc
file: Solution1.java
---
{% endtemplate %}

It failed with error : Time Limit Exceeded. 


#### Second Attempt

Instead of using List, I can try using `TreeMap`. A TreeMap is a Red-Black tree-based NavigableMap implementation that stores keys in sorted order.

{% template  customCode.html %}
---
id: 1860d33b9fc700c49c0d5dbd1cc348dc
file: Solution2.java
---
{% endtemplate %}

 We use the `floorEntry` method of the TreeMap to get the closest timestamp lower than or equal to the requested timestamp. 

 Consider a TreeMap with the following key-value pairs: {1: "a", 3: "b", 5: "c"}. Let's assume you call the floorEntry method with the argument 4. Since 4 is greater than 3 but less than 5, the method will return the entry with the key 3 and value "b".