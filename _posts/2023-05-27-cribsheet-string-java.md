---
layout: post
date: 2023-05-27
title: Cribsheet for String in Java
tags:
  - java
  - interview
image: https://unsplash.com/photos/xZTScJvolYk/download?w=437
thumb: https://unsplash.com/photos/xZTScJvolYk/download?w=437
author: Tushar Sharma
category: blog
---

Strings are immutable in java. It's best to convert string to StringBuilder/StringBuffer so that it's memory efficient for string manipulation.<!-- truncate_here -->

Strings are immutable in Java, meaning their values cannot be changed once they are created. To efficiently manipulate strings, it is recommended to convert them to StringBuilder or StringBuffer objects. StringBuilder is preferable for its speed, while StringBuffer is thread-safe.


Here's an example of converting a string to a StringBuilder:

```java
String input = "abcd";
StringBuilder sb = new StringBuilder(input);
```


Appending a value to the StringBuilder can be done using the append() method:

```java
sb.append("zz")
```

To check the resulting string, you can convert the StringBuilder back to a string using `toString()` and compare it:

```java
assert sb.toString().equals("abcdezz");
```

You can also retrieve the index location of a specific substring within the StringBuilder using the indexOf() method:

```java
int index = sb.indexOf("zz");
assert index == 5;
```

If you need to replace a portion of the string with another value, you can use the replace() method:

```java
sb.replace(1, 4, "foo");
assert sb.toString().equals("afooezz");
```

To reverse the string in the StringBuilder, you can use the `reverse()` method:

```java
sb.reverse();
assert sb.toString().equals("zzeoofa");
```

Removing a substring from the StringBuilder can be achieved using the delete() method:

```java
sb.delete(3, 6);
assert sb.toString().equals("zzea");
```

Alternatively, you can delete a specific character at a given index using deleteCharAt():

```java
sb.deleteCharAt(1);
assert sb.toString().equals("zea");
```

To access a character at a specific index within the StringBuilder, you can use `charAt()`:

```java
char c = sb.charAt(1);
```

If you wish to modify a character at a specific index, you can use setCharAt():

```java
sb.setCharAt(1, 'z');
```

You can obtain the ASCII value of a character by using the charAt() method and casting it to an int:

```java
int asciiA = sb.charAt(0);
assert asciiA == 97;
int asciiA = 'A';
assert asciiA == 65;
```

Conversely, you can convert an ASCII value back to a character using a cast:

```java
char c = (char) asciiA;
assert c == 'a';
int asciiZ = 'Z';
assert asciiZ == 90;
```