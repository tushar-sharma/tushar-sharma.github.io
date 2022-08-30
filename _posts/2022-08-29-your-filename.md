---
published: false
---
##  Dear Vishi, daily log for Aug 29, 2022

Dear Vishi, this is my daily log for Aug 29, 2022


### Reading `Origin of Species`

Charles Darwin coined the term called `Natural Selection`. In his own words, "Owing to this struggle for life, any variation, however slight and from whatever cause proceeding, if it be in any degree profitable to an individual of any species, in its infinitely complex relations to other organic beings and to external nature, will tend to the preservation of that individual, and will generally be inherited by its offspring.The offspring, also, will thus have a better chance of surviving, for, of the many individuals of any species which are periodically born, but a small number can survive. I have called this principle, by which each slight variation, if useful, is preserved, by the term of Natural Selection, in order to mark its relation to man's power of selection."

So variation in organism that are suited for their environemnt are "naturally selected" to survive and become more common. It's the foundation of modern theory of evolution.


## Words of the day

I want to introduce you two new words in English language

1. Sagacious: Somebody who has sound judgement. Like he was sagacious enough to pay his taxes on time. 

2. Concur: Agree. Like he concurred with my views.


### Vitamins

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