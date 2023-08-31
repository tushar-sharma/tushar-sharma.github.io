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
    this.finalVar = finalVar;
  }
  
  void setFinalVar(int finalVar){
    this.finalVar = finalVar; // This is an error
  }
}
```
### Methods

A final method can't be overridden in subclasses. This is useful to lock behavior of a method.


### Classes

A final class can't be subclassed. This is sometimes done for security or design reasons.

## Static Final

### Variables

A static final variable belongs to the class and not any specific instance. It's also immutable. Value can only be assigned at point of declaration or within a static initizlizer block. An initializer block is a chunk of code that runs when the class is first loaded into memory. It runs only once, regardless of how many instance of the class.

```java
class MyClass {
  static final int CONSTANT_VAL; 
  
  public MyClass(int val){
    CONSTANT_VAL = val;  // this is an error
  }
  
  static {
    CONSTANT_VAL = 100;
  }
}
```