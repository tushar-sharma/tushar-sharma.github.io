---
published: false
---
Multiple init in dataclass in python

lets say we have a python code like this

```python
class Test:
    def __init__(self, data: int) -> None:
        print(f"argument is int: {data}")

    def __init__(self, data: dict) -> None:
        print(f"argument is dict: {data}")

```

Now if we call this separately we get this

```python
id = 2
data = {"id": 2, "name": "test"}

Test(id)

Test(data)
```

We get the same override constructor as expected.

```output
argument is dict: 2
argument is dict: {'id': 2, 'name': 'test'}
```

However we were not expecting this. Passing id should invoke first ```__init__`` method..

If we change our class like

```python
class Test:
    def __init__(self, data: int) -> None:
        print(f"argument is int: {int}")

    def __init__(self, data: dict) -> None:
        print(f"argument is dict: {data}")

```

So this will print the following 

```bash
argument is int: 2
argument is int: {'id': 2, 'name': 'test'
```

So does python support `function override`?

