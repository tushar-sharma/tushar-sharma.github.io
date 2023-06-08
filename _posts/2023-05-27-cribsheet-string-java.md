---
layout: post
date: 2023-05-27
title: Cribsheet for String in Java
tags:
  - java
  - interview
image: https://unsplash.com/photos/xZTScJvolYk/download?w=800
thumb: https://unsplash.com/photos/xZTScJvolYk/download?w=800
author: Tushar Sharma
java: true
prismjs: true
---

Strings are immutable in java. It's best to convert string to StringBuilder/StringBuffer so that it's memory efficient for string manipulation.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Strings are immutable in Java, meaning their values cannot be changed once they are created. To efficiently manipulate strings, it is recommended to convert them to StringBuilder or StringBuffer objects. StringBuilder is preferable for its speed, while StringBuffer is thread-safe.


Here's an example of converting a string to a StringBuilder:

{% template customCode.html %}
---
title: language-java
---
  String input = "abcd";
  StringBuilder sb = new StringBuilder(input);
{% endtemplate %}


Appending a value to the StringBuilder can be done using the append() method:

{% template customCode.html %}
---
title: language-java
---
  sb.append("zz")
{% endtemplate %}

To check the resulting string, you can convert the StringBuilder back to a string using `toString()` and compare it:

{% template customCode.html %}
---
title: language-java
---
  assert sb.toString().equals("abcdezz");
{% endtemplate %}

You can also retrieve the index location of a specific substring within the StringBuilder using the indexOf() method:

{% template customCode.html %}
---
title: language-java
---
    int index = sb.indexOf("zz");
    assert index == 5;
{% endtemplate %}

If you need to replace a portion of the string with another value, you can use the replace() method:

{% template customCode.html %}
---
title: language-java
---
sb.replace(1, 4, "foo");
assert sb.toString().equals("afooezz");
{% endtemplate %}

To reverse the string in the StringBuilder, you can use the `reverse()` method:

{% template customCode.html %}
---
title: language-java
---
sb.reverse();
assert sb.toString().equals("zzeoofa");
{% endtemplate %}

Removing a substring from the StringBuilder can be achieved using the delete() method:

{% template customCode.html %}
---
title: language-java
---
sb.delete(3, 6);
assert sb.toString().equals("zzea");
{% endtemplate %}

Alternatively, you can delete a specific character at a given index using deleteCharAt():

{% template customCode.html %}
---
title: language-java
---
sb.deleteCharAt(1);
assert sb.toString().equals("zea");
{% endtemplate %}

To access a character at a specific index within the StringBuilder, you can use `charAt()`:

{% template customCode.html %}
---
title: language-java
---
char c = sb.charAt(1);
{% endtemplate %}

If you wish to modify a character at a specific index, you can use setCharAt():

{% template customCode.html %}
---
title: language-java
---
sb.setCharAt(1, 'z');
{% endtemplate %}

You can obtain the ASCII value of a character by using the charAt() method and casting it to an int:

{% template customCode.html %}
---
title: language-java
---
int asciiA = sb.charAt(0);
assert asciiA == 97;
int asciiA = 'A';
assert asciiA == 65;
{% endtemplate %}

Conversely, you can convert an ASCII value back to a character using a cast:

{% template customCode.html %}
---
title: language-java
---
char c = (char) asciiA;
assert c == 'a';
int asciiZ = 'Z';
assert asciiZ == 90;
{% endtemplate %}