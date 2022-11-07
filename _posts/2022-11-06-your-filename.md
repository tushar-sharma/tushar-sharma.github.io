---
published: false
---
Multiple init in dataclass in python

lets say we have a python code like this

```python
class Test:
    def __init__(self, data: int):
        print(f"Argument is int: {data}")
        
    def __init__(self, data: dict):
        print(f"Argument is dict: {data}")
```

Now if we call this separately we get this

```python
id = 2 
data = {"id": 2, "name" : "TestName"} 

print(Test(id))

print(Test(data))
```

We get the same override constructor as expected.