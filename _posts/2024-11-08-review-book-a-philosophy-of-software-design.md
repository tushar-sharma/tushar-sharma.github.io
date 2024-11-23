---
layout: post
title: A Philosophy of Software Design by John Ousterhout
image: https://unsplash.com/photos/H7XNBcG3vw4/download?w=437
thumb: https://unsplash.com/photos/H7XNBcG3vw4/download?w=437
author: tushar sharma
category: blog
tags: books
---

These are my rough notes while reading this book.<!-- truncate_here -->

<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<!-- disclaimer -->
<div style="margin: 0 auto" class="cl disclaimer">
<span style="color:black"> &nbsp;&nbsp;These are my rough notes while reading this book
</span> 
</div> <br>

In the Waterfall model, development is a linear process with distinct phases: requirements, design, implementation, testing, and deployment. Each phase must be completed before the next begins. This rigid approach can lead to challenges in adapting to changing requirements or unexpected issues.

Agile methodologies, like Scrum or Kanban, emphasize iterative development. A project is broken down into smaller, manageable iterations or sprints. Each sprint involves planning, designing, implementing, and testing a specific set of features. This iterative approach allows for flexibility and continuous improvement.

Modular design is an approach where a software system is divided into distinct, relatively independent modules. Each module has two components: an interface and an implementation. The interface specifies what the module does without detailing how it accomplishes it. The implementation contains the code that fulfills the promises made by the interface.

In object-oriented programming (OOP), each class can be viewed as a module. By adhering to the interface, changes to a module's implementation do not impact other modules that depend on it. This isolation enhances flexibility and maintainability across the system.

Abstraction provides a simplified view of an entity, focusing only on essential details while omitting irrelevant information. This principle allows developers to manage complexity effectively.

An interface is like a contract that specifies methods which must be implemented by any class that adheres to it. It exposes these methods to other modules without revealing the actual implementation, ensuring that interactions occur through a consistent set of behaviors rather than direct access to the implementation."

The best modules are deep: they have a lot of functionality hidden behind a simple interface. Shallow module is one whose interface is complicated relative to the functionality it provides.

Often taught that "classes should be small". Instead classes should be deep. Small classes don't contribute much functionality and increase boilerplate. e.g. 


```java
FileInputStream fileStream = new FileInputStream(filename);
BufferedInputStream bufferedStream = new BufferedInputStream(fileStream);
ObjectInputStream objectStream = enw ObjectInputStream(bufferedStream);
```

In this code, `FileInputStream` only provides rudimentary I/O: it's not capable of bueffered I/O, nor can it read or write searialized objects. `BufferedInputStream` adds buffering to `FileInputStream` and `ObjectInputStream` adds read ability to read and write serialized objects. First two objects, `fileStream` and `bufferedStream` are never used once the file has been opened. So buffering must be requested explicitly. If a developer forgest to creat this object, there will be no bufferring and I/O will be slow.

Java Developers argue that since not everyone wants to use buffering for file I/O, so that's why there's an additional step. However interfaces should be desigend to make **common case** as simple as possible. In contrast, Unix develoeprs made sequential I/O most common use case. 

A pass-through method is one that does little except invoke another method, whose signature is similar or identical to that of the calling method. They make the `class` more shallow, increase the complexity without increasing the functionality of system. However, one such exception like dispatcher. A dispatcher is a method that uses its arguments to select one of several other methods to invoke. 

**Decorators**. Also called wrapper. A decorator objct takes an existing object and extends its functionality. In Java, **BufferedInputStream** class is a decorator: given an **InputStream** object, it provides the same API but intorduces bufering. 

A pass-through variable is a variable that has been passed through long chain of methods. It increases complexity for intermediate methods. One Soulution - Use Global Variable. However it has it's cons. It's impossible to create independent instances of same system in same process that access same global variable (conflict). ANother solution - Use Context object. It stores all the glboal variable. Cons is that it can have thread safety issue. Solution use immutable objects in a context object.  

**Subdivision**: Breaking up classes to divide work. However too many classes will increase complexity if there are shallow. Also subdivision works great if classes are independent. If there is dependencies between them, it would be to merge them into single class. e.g. HTTP request reader and parsing it into String would be better to have a single class.

**GOTO* are bad programming practice because unstructured jumps makes it hard to understand the program.

**How to Split a method** : 

- Keep methods concise: Avoid methods exceeding 20 lines. While this isn't a strict rule, it serves as a guideline for keeping code readable and maintainable. 

- Single Responsibility Principle: A method should perform one specific task and do it completely. If a method appears to do more than one thing, consider splitting it. 

- Extract reusable subtasks: If a subtask within a method is general-purpose (i.e., it can be reused by other methods or components), extract it into its own method.

- Avoid overly dependent methods: If a child method requires extensive understanding of its parent method to be understood, it is not a clean split. Such "conjoined methods" make code harder to maintain and debug.

**Exception Handling:**:

- Increased complexity: Exceptions can increase code complexity if not handled properly. Always strive for clear and consistent exception handling.

- Masking exceptions: Handling exceptions at a low level (without propagating them when necessary) can hide the root cause of an issue. For example, silently failing or "hanging" instead of crashing might make debugging and resolution harder.

- Aggregating exceptions: Handle exceptions at a higher level when possible. This means propagating errors upwards to a central place where they can be logged or managed consistently, reducing duplicated error-handling logic across the codebase.