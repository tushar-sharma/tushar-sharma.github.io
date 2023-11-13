---
published: false
---

## List comprehension in Python

List comprehension is a concise way to create lists in Python. The basic syntax is:

```python
[expression for item in iterable]
```
* **expression**: This is the value that will be added to the list. It's usually some operation or transformation applied to item.

* **item**: This is the current element being considered from the iterable.

* **iterable**: Any Python iterable like a list, tuple, string, etc., from which item values are taken.

Some examples

### create a list of squares from 1 to 10

```python
[ x**2 for x in range(1, 11) ] 
```

### create a list of even numbers from 1 to 10

```python
[ x for x in range(1, 11) if x % 2 == 0]
```

### Create a list of tuples, where each tuple contains a number and its square, for numbers from 1 to 5.

```python
[ (x, x**2) for x in range(1, 11) ]
```