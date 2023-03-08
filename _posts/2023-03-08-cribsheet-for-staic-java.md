---
published: false
---
## Cribsheet for Static in Java

### Static Variable

A static variable, belongs to class itself rather than specific instance of the class. It's shared among all instances of the class and can be accessed using the class name

```java
public class Car {
  private static int count = 0;
  private String make;
  
  public Car(String make, int count) {
    count++;
    this.make = make; 
  }
  
  public static int getCount(){
    return count;
  }
}
```