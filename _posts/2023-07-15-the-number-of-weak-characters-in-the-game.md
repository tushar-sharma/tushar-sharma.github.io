---
layout: post
date: 2023-07-15
title: The Number of Weak Characters in the Game Solution
image: /img/
thumb: /img/
author: ;
category: blog
---

.<!-- truncate_here -->

## First attempt 

I tried using brute force

```java
    public int bruteForceSolution(int[][] properties){
        int count = 0;

        for (int i = 0; i < properties.length; i++) {
            boolean weak = false;

            for (int j = 0; j < properties.length; j++){
                if (properties[i][0] < properties[j][0] && properties[i][1] < properties[j][1]){
                    weak = true;
                    break;
                }
            }

            if (weak){
                count++;
            }
        }

        return count;
    }
```

I got **Time Limit Exceeded**. The complexity of the solution is O(n2)

## Second attempt
