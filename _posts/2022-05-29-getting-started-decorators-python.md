---
title: Getting Started with decorators in Python
category: blog
layout: post
tags:
- python
name: decorators-python
thumb: https://unsplash.com/photos/Cl-OpYWFFm0/download?w=800
---

In python, functions are first class citizens. They are basically objects which can be passed as arguments. A decorator is a function that receives a function and returns a function.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

In python, functions are first class citizens. They are basically objects which can be passed as arguments. A decorator is a function that receives a function and returns a function.

Let's say we have a simple function that multiples two numbers

```python
def my_function(a, b):
    return a * b

my_function(3, 2)
```

This will print

```bash
6
```

Now if want to log the execution time of the function without modifying the existing function, we can create a `wrapper function`.

```python
def timeme(func):
    def wrapper(*args, **kwargs):
        t = time()
        res = func(*args, **kwargs)
        print(f'{func.__name__} took {time()-t} seconds')
        return res

    return wrapper

def my_function(a, b):
    return a * b

my_function = timeme(my_function)

my_function(3, 2)
```

```bash
my_function took 0.0 seconds
6
```

Or we can use syntactic sugar for decorators like

```python
@timeme
def my_function(a, b):
    return a * b

```

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>