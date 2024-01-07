---
published: false
---
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