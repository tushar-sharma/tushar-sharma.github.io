---
published: false
---
##  Dear Vishi, daily log for Aug 29, 2022

Dear Vishi, this is my daily log for Aug 29, 2022


### Reading `Origin of Species`


### Words of the day

1. Sagacious

2. Concur

He concur in my view


### Java

Today I want to talk about sorting arrays in java. Lets say if you have an array of integer and we want to sort it, we can do this way

```java
int[] testArray = {11, 234, 45, 1, -30};

Arrays.sort(testArray); 

for (int i : testArray) {
  System.out.println(i);
}
```

This will print the following output in ascending order

```java
-30
1
11
45
234
```

Now what happens if you have an array of strings, like this

```java

String[] testArray = {"hello", "bye", "si"};

//Sort an array
Arrays.sort(testArray); 

for (String i : testArray) {
  System.out.println(i);
}
```

This will print strings sorted in lexicographic order.


``` bash
bye
hello
si
```

However if we want to change the order of sorting, we can use `Comparator`. Like we want to sort the array based on length of strings. Comparators in java are objects that can be used to compare two objects.

```java
String[] testArray = {"hello", "bye", "si"};

Comparator<String> comparator = new Comparator<String>(){
  public int compare(String s1, String s2){
    return Integer.compare(s1.length(), s2.length());
  }
};

Arrays.sort(testArray, comparator); 

for (String i : testArray) {
  System.out.println(i);
}
```

This will print

```bash
si 
bye
hello
```