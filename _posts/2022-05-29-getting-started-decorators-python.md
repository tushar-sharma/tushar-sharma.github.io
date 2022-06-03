---
title: Getting Started with decorators in Python
category: blog
layout: post
tags:
- python
name: decorators-python
thumb: https://unsplash.com/photos/Cl-OpYWFFm0/download?w=800
---

In python, everything is an object. So functons are also objects which can be passed around. A decorator is a function that receives a function and returns a function.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

In python, everything is an object. So functons are also objects which can be passed around. A decorator is a function that receives a function and returns a function.

### Without using decorators

Let's say we have two simple functions to add and multiply numbers.

```python
def multiply_me(a, b):
    return a * b

def add_me(a, b):
    return a + b

print(multiply_me(3, 2))

print(add_me(3, 2))
```

This will print

```bash
6
5
```

Now lets say we want to print `execution` time in both these functions. We could do something like this


```python
from time import time, sleep

def multiply_me(a, b):
    t = time()
    res = a * b
    sleep(2)
    print("{} took {}".format(multiply_me.__name__, time() - t))
    return res

def add_me(a, b):
    t = time() 
    res = a + b
    sleep(2)
    print("{} took {}".format(add_me.__name__, time() - t))
    return res

print(multiply_me(3, 2))

print(add_me(3, 2))
```

This will print

```python
multiply_me took 2.00507378578
6
add_me took 2.00509095192
5
```

Here we are repeating our logic for logging execution time. This can be solved by using decorators. 

### Using decorators

Let's create a wrapper function called `timeme` that will do the following-

1. Receive the `function` as an argument
2. Execute the `function`
3. Log the execution time

```python
def timeme(func):
    def wrapper(*args, **kwargs):
        t = time()
        res = func(*args, **kwargs)
        print("{} took {}".format(func.__name__, time() - t))
        return res

    return wrapper
```

Next we can `decorate` our functions using syntatic sugar like this 

```python
@timeme
def multiply_me(a, b):
    return a * b

@timeme
def add_me(a, b):
    return a + b
```

This is similar to the following 

```python
multiply_me = timeme(multiply_me)

add_me = timeme(add_me)
```

Lastly runnig the functions will be like 

```python
print(multiply_me(3, 2))

print(add_me(3, 2))
```

This will print

```bash
multiply_me took 2.00506806374
6
add_me took 2.00509810448
5
```

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>