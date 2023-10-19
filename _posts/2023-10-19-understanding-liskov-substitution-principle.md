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
    @Override
    public void setWidth(int width) {
        super.setWidth(width);
        super.setHeight(width);  // A square's width and height are the same
    }

    @Override
    public void setHeight(int height) {
        super.setWidth(height);
        super.setHeight(height);
    }
}

public static void main(String[] args) {
    Rectangle rect = new Square();
    rect.setWidth(5);
    rect.setHeight(10);
    System.out.println(rect.getArea());  // Outputs 100 instead of expected 50
}
```

In the above code, a Square is-a Rectangle by inheritance. However, when we attempt to set distinct width and height for a Square (which violates a square's properties), we get incorrect results.

### Honoring LSP with Code

One solution is to use an abstract base class or interface and then have separate implementations for Rectangle and Square.

```java
interface Shape {
    int getArea();
}
class Rectangle implements Shape {
    protected int width, height;

    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public int getArea() {
        return width * height;
    }
}

class Square implements Shape {
    private int side;

    public Square(int side) {
        this.side = side;
    }

    @Override
    public int getArea() {
        return side * side;
    }
}
```

Now, both Rectangle and Square implement Shape, but they are not directly related by inheritance. This way, we ensure that each class adheres to its intended behavior without breaking the LSP.




