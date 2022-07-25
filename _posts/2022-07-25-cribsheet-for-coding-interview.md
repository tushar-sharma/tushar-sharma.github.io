---
published: false
---
## Stacks

Basic operations are

* `push(item)` - add items to top of stack - O(1)
* `pop()` - remove the top item from the stack - O(1)
* `peek()` - return the top of the stack - O(1)
* `isEmpty()`- return True if the stack is empty 

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
print(len(stack))
# prints 2
```
 
### Patterns

1. If you see something with closing parenthesis '(' or ')', think stack. For example https://leetcode.com/problems/valid-parentheses/. Try to insert characters in stack or their indices.

2. You can push characters, integers, or even objects in a stack. Fr
 