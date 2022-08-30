---
published: false
---
##  Dear Vishi, daily log for Aug 29, 2022

Dear Vishi, this is my daily log for Aug 29, 2022

### Java

Today I want to talk about sorting arrays in java. Lets say if you have an array of integer and we want to sort it, we can do this way

```java
int[] testArray = {11, 234, 45, 1, -30};


//Sort an array
Arrays.sort(testArray); 

for (int i : testArray) {
  System.out.println(i);
}
```

This will print the following 

```java
-30
1
11
45
234
```
