---
layout: post
title: Patterns for Coding Interview
image: https://unsplash.com/photos/8rj4sz9YLCI/download?w=437
thumb: https://unsplash.com/photos/8rj4sz9YLCI/download?w=437
author: Tushar Sharma;
category: blog
published: false
tags:
  - coding
---

<!-- truncate_here -->

## Array

* Sort an array

```python
nums = [4, 3, 2, 2]
snums = sorted(nums)
```

## String

What you can do with a string? 

* check if its empty: 

```java
public String someFunction(String foo) {
  if (foo.isEmpty()) {
  }
}
```

```python
def some_function(foo: str):
    if not foo:
        return -1
```

* length 

```java
String s = "testString";
int len = s.length();
```

* Count frequencies of each character in a string

```python
from collections import Counter

def some_function(foo: str):
    count = Counter(str)
    
    # Iterate the count
    for key, value in count.items():
        print(key, value)
    
    # Get value
    print(count['key'])

```

* Split a String with space

* Split a string with any character

* Get a character at location for string

```java
public void someFunction(String foo) {
  char c = foo.charAt(0);
}
```
## Hashmap

* create one

```python
freq = {}
```
```java
import java.util.Map;

Map<Integer, Integer> freq = new HashMap<>();
```


## Set

* create

```java
Set<Integer> set = new HashSet<>();
```

```python
mySet = set()
```

* add a value

```java
set.add(2);
```

```python
mySet.add(3)
```

* check if a value exist

```java
if (set.contains(value)) {
}
```

* clear all values

```java
freq = new HashSet<>();
```

## Built in functions

* Max 

```python
foo = max(foo, bar)
```

* Length

```python
foo = "abcd"
bar = len(foo)
assert bar == 4
```