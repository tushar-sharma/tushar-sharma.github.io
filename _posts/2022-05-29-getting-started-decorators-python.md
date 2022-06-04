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

## Use case 1

### Without using decorator

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

### With using decorator

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

## Use case 2
### Without using decorator

Lets define a function which depends on type of argument.

```python
from dataclasses import dataclass

@dataclass
class Dog:
    bark : str

def process_data(x):
    if type(x) == str:
        print("str executed %s" % x)
    elif type(x) == int:
        print("int executed %s" % x)
    elif type(x) == list:
        print("list executed %s" % x)
    elif type(x) == Dog:
        print("Dog executed %s" % x.bark)
    else:
        print("Default executed %s" % x)
```

We can invoke the function with different arguments. 

```python
process_data(set())

process_data("string")

process_data(123)

process_data(Dog("bowbow"))
```

This will print

```bash
Default executed set()
str executed string
int executed 123
Dog executed bowbow
```
### With using decorator

This coding style becomes hard to read as the number of cases increases. We can use `singledispatch` decorator. 

```python
from functools import singledispatch

@singledispatch
def process_data(x):
    print("Default executed %s" % x)

@process_data.register(str)
def _(x):
    print("str executed %s" % x)

@process_data.register(int)
def _(x):
    print("int executed %s" % x)

@process_data.register(list)
def _x(x):
    print("list executed %s" % x)

@process_data.register(Dog)
def _x(x):
    print("Dog executed %s" % x.bark)

```

This will print the same result

```bash
Default executed set()
str executed string
int executed 123
Dog executed bowbow
```


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>