---
layout: post
date: 2023-07-20
title: The number of Weak Characers in the Game
image: https://i.imgur.com/PC32zDw.jpg 
thumb: https://i.imgur.com/PC32zDw.jpg 
author: Tushar Sharma
category: blog
tags:
 - java
---

You are playing a game that contains multiple characters, and each of the characters has two main properties: attack and defense. You are given a 2D integer array properties where properties[i] = [attacki, defensei] represents the properties of the ith character in the game..<!-- truncate_here -->


You are playing a game that contains multiple characters, and each of the characters has two main properties: attack and defense. You are given a 2D integer array properties where properties[i] = [attacki, defensei] represents the properties of the ith character in the game.

A character is said to be weak if any other character has both attack and defense levels strictly greater than this character's attack and defense levels. More formally, a character i is said to be weak if there exists another character j where attack<sub>j</sub> > attack<sub>i</sub> and defense<sub>j</sub> > defense<sub>i</sub>.

Return the number of weak characters.

## Brute force

My first hunch was to use a brute force solution. For each character, compare it against the remaining characters.

{% template  customCode.html %}
---
id: ecf1dc2cef72c564a908353159f754dc
file: BruteForceSolution.java
---
{% endtemplate %}

I got **Time Limit Exceeded**. The complexity of the solution is $$O(n^2)$$

## Optimal Solution

First we sort the 2D array based on criteria 

1. First, compare the first elements of each sub-array in descending order.

2. If the first elements of two sub-arrays are equal, then compare their second elements in ascending order.


Next we checks if the second element (property[1]) of the current property is less than the current maximum value (max). If it is, it means the property is not optimal (since it has a lower second element than the previously encountered properties).

If the second element (property[1]) of the current property is greater than or equal to the current maximum value (max), it means this property is currently the best among the encountered properties. We update the max variable to hold the value of the second element of this property, as it becomes the new maximum. This step ensures that we keep track of the property with the highest second element encountered so far.

The output counter keeps track of the number of properties that are not optimal, as they have lower second elements than the previously seen properties.

{% template  customCode.html %}
---
id: ecf1dc2cef72c564a908353159f754dc
file: OptimalSolution.java
---
{% endtemplate %}