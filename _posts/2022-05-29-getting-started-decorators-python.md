---
title: Getting Started with decorators in Python
category: blog
layout: post
tags:
- python
name: decorators-python
thumb: https://unsplash.com/photos/Cl-OpYWFFm0/download?w=437
image: https://unsplash.com/photos/Cl-OpYWFFm0/download?w=437
---

In python, everything is an object. So functons are also objects which can be passed around. A decorator is a function that receives a function and returns a function.<!-- truncate_here -->

In python, everything is an object. So functons are also objects which can be passed around. A decorator is a function that receives a function and returns a function.

## Use case 1

### Without using decorator

Let's say we have two simple functions to add and multiply numbers.

<script src="https://gist.github.com/tushar-sharma/91b5ee39ccca52fad0776b5571f4fa1c.js?file=ex1.py"></script>

This will print

```bash
6
5
```

Now lets say we want to print `execution` time in both these functions. We could do something like this

<script src="https://gist.github.com/tushar-sharma/91b5ee39ccca52fad0776b5571f4fa1c.js?file=ex2.py"></script>

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

<script src="https://gist.github.com/tushar-sharma/91b5ee39ccca52fad0776b5571f4fa1c.js?file=ex3.py"></script>


Next we can `decorate` our functions using syntatic sugar like this 

<script src="https://gist.github.com/tushar-sharma/91b5ee39ccca52fad0776b5571f4fa1c.js?file=ex4.py"></script>

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


<script src="https://gist.github.com/tushar-sharma/91b5ee39ccca52fad0776b5571f4fa1c.js?file=ex5.py"></script>


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


<script src="https://gist.github.com/tushar-sharma/91b5ee39ccca52fad0776b5571f4fa1c.js?file=ex6.py"></script>



This will print the same result

```bash
Default executed set()
str executed string
int executed 123
Dog executed bowbow
```


