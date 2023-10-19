---
published: false
---
The Liskov Substitution Principle, named after Barbara Liskov who introduced it in 1987, is one of the five SOLID principles of object-oriented design and programming. It states that:

> "Objects of a superclass shall be replaceable with objects of a subclass without affecting the correctness of the program."

In simple terms, if a program is using a base class, it should be able to switch to a derived class without any unexpected behavior.



### Why is LSP Important?

LSP emphasizes the importance of ensuring that a derived class doesn't just inherit the properties and behaviors of its base class but also adheres to its intended contract or behavior. By following LSP, developers can write more maintainable and scalable code, making it easier to add or modify subclasses without breaking existing functionality.

### Breaking LSP with Code

Let's start with an example where LSP is violated.

```java
class Rectangle {
  protected int width, height;
  
  public void setWidth(int width) {
    this.width = width;
  }
  
  public void setHeight(int height) {
    this.height = heigth;
  }
  
  public int getArea() {
    return width * height;
  }
}

class Square extends Rectangle {
}
```

