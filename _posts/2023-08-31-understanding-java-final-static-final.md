---
published: false
---

## Final modifier

Wehn you come accross final keyword in Java, think "immutable". 

### Variables 

When applied to variables, final ensures that a variable is assigned, it can't be reassigned. Every instance of class will have its own separate copy of this final variable. 

```java
class MyClass {
  final int finalVar = 10;
  
  public MyClass(int finalVar){
    this.finalVar = finalVar; // This is allowed
  }
  
  void setFinalVar(int finalVar){
    this.finalVar = finalVar; // This is an error
  }
}
```