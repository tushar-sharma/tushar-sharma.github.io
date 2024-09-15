---
layout: post
title: 792. Number of Matching Subsequences
image: https://unsplash.com/photos/5E5N49RWtbA/download?w=800
thumb: https://unsplash.com/photos/5E5N49RWtbA/download?w=800
author: tushar sharma
category: blog
tags:
 - leetcode
 - java
---

Given a string s and an array of strings words, return the number of words[i] that is a subsequence of s. A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.<!-- truncate_here -->

Given a string s and an array of strings words, return the number of words[i] that is a subsequence of s.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

### Example

Input:

s = "abcde"
words = ["a", "bb", "acd", "ace"]
Output:

3 ("a", "acd", and "ace" are subsequences of s).

### Brute force Approach

In this solution, we iterate through each word and check if it's a subsequence of the string s using a two-pointer technique.

<div style="display:none;" markdown="1">
class Solution {
    public boolean isSubSequence(String word, String s) {
        int sPos = 0;
        int wPos = 0;

        while (sPos < s.length()) { 
            if (wPos == word.length()) break;

            if (word.charAt(wPos) == s.charAt(sPos)) {
                wPos++;
            }
            sPos++;
        }

        return wPos == word.length();
    }

    public int numMatchingSubseq(String s, String[] words) {
        int count = 0;
        for (String word : words) {
            if (isSubSequence(word, s)) {
                count++;
            }
        }
        return count;
    }
}
</div>

{% template  customCode.html %}
---
id: 5f1a0e8ba086c2ebe4a554b2628485b5
file: SubSequenceBrute.java
---
{% endtemplate %}


####  Drawbacks:

Time Complexity: O(m * n), where m is the length of s and n is the number of words. This brute force approach checks each word against the entire string s, leading to time limit exceeded (TLE) errors on large inputs.

### Optimized Approach Using HashMap and Binary Search

To optimize the brute force approach, we can precompute the indices of each character in s using a HashMap. Then, for each word, we perform binary search to efficiently find the next character's position in s.

<div style="display:none;" markdown="1">
class Solution {
    public int numMatchingSubseq(String s, String[] words) {
        int count = 0;
        Map<Character, List<Integer>> map = new HashMap<>();

        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            map.computeIfAbsent(c, k -> new ArrayList<>()).add(i);
        }

        for (String word : words) {
            boolean found = true;
            int prevIndex = -1;

            for (char c : word.toCharArray()) {
                if (!map.containsKey(c)) {
                    found = false;
                    break;
                }

                List<Integer> indices = map.get(c);
                int pos = binarySearch(indices, prevIndex);

                if (pos == indices.size()) {
                    found = false;
                    break;
                }

                prevIndex = indices.get(pos);
            }

            if (found) count++;
        }

        return count;
    }

    private int binarySearch(List<Integer> indices, int prevIndex) {
        int low = 0;
        int high = indices.size() - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (indices.get(mid) <= prevIndex) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return low;
    }
}
</div>

{% template customCode.html %}
---
id: 5f1a0e8ba086c2ebe4a554b2628485b5
file: SubSequence.java
---
{% endtemplate %}


#### Explanation

HashMap Preprocessing: We create a HashMap where each character in s maps to a list of its indices. This allows us to quickly locate all occurrences of a character.

Binary Search for Subsequence Check: For each word, we use binary search to find the position of the next character in s after the last found character. This ensures that the characters appear in order while minimizing unnecessary comparisons.

#### Benefits

Time Complexity: O(m + n * k * log(l)), where:
m is the length of s.
n is the number of words.
k is the average length of the words.
l is the average number of occurrences of a character in s.

This is significantly faster, especially for larger inputs, since we reduce the time spent searching for characters using the precomputed HashMap and binary search.