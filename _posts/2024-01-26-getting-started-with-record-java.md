---
published: false
---

Getting Started with Record in Java

Records are special type of classes that are used for holding immutable data. Since they are designed to be transparent carriers, we can't hide their members field which means the data they hold is always accessible. 

Lets say we create a record :

```java
public record Book(String title, String author) { }
```

This creates a record named `Book` with two fields called title and author. Because it's a record, these fields are final and cannot be changed once the `Book` is created making the data help by the record immutable.

We can create a record 

```java
Book myBook = new Book('sherlock holmes', 'conan doyle')
```

And we can access the fields directly 

```java
String title = myBook.title();
String author = myBook.author();
```

The fields are directly accessible and cannot be hidden.

Records dont support inheritance. They are useful as Data Transfer Objects (DTO). These are objects that are commonly used to transport data between different parts of a software system (like between layers in an architecture), or to send data as a response from an API endpoint.