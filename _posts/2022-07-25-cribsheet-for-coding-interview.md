---
published: false
---
## Stacks

Basic operations are

* `push(item)` - add items to top of stack - O(1)
* `pop()` - remove the top item from the stack - O(1)
* `peek()` - return the top of the stack - O(1)
* `isEmpty()`- return True if the stack is empty - O(1) 
* `size()` - return the number of elements in a stack - O(1)

### Implementation 

```python
stack = []
# push elements to stack 
stack.append(5)
stack.append(3)
stack.append(-1)

# pop element
top =- stack.pop() 
print(top)  
# prints -1

# peek at the top of the stack 
print(stack[-1]) 
# prints  3

# check if stack is empty
print(len(stack) == 0)
# False

# size of the stack 
print(len(stack))
# 2
```
 
### Patterns

1. If you see something with closing parenthesis '(' or ')', think stack. For example https://leetcode.com/problems/valid-parentheses/. Try to insert characters in stack or their indices.

2. You can push characters, integers, or even objects in a stack. For example 

```python
stack = []

class Node:
    def __init__(self, name: str, age: int) -> None: 
         self.name = name
         self.age = age

# insert element

stack.append(Node("Tom", 42))
stack.append(Node("Mathew", 55))
stack.append(Node("Nancy", 5))

# pop an element
node = stack.pop()
print(node.name, node.age)

# peek
node = stack[-1]
print(node.name, node.age)

# size of stack
print(len(stack))
```
 