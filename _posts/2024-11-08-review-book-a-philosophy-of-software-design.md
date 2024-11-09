---
layout: post
title: A Philosophy of Software Design by John Ousterhout
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
---

These are my rough notes while reading this book.<!-- truncate_here -->

<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<!-- disclaimer -->
<div style="margin: 0 auto" class="cl disclaimer">
<span style="color:black"> &nbsp;&nbsp;These are my rough notes while reading this book
</span> 
</div>

In the Waterfall model, development is a linear process with distinct phases: requirements, design, implementation, testing, and deployment. Each phase must be completed before the next begins. This rigid approach can lead to challenges in adapting to changing requirements or unexpected issues.

Agile methodologies, like Scrum or Kanban, emphasize iterative development. A project is broken down into smaller, manageable iterations or sprints. Each sprint involves planning, designing, implementing, and testing a specific set of features. This iterative approach allows for flexibility and continuous improvement.

Modular design is an approach where a software system is divided into distinct, relatively independent modules. Each module has two components: an interface and an implementation. The interface specifies what the module does without detailing how it accomplishes it. The implementation contains the code that fulfills the promises made by the interface.

In object-oriented programming (OOP), each class can be viewed as a module. By adhering to the interface, changes to a module's implementation do not impact other modules that depend on it. This isolation enhances flexibility and maintainability across the system.

Abstraction provides a simplified view of an entity, focusing only on essential details while omitting irrelevant information. This principle allows developers to manage complexity effectively.

An interface is like a contract that specifies methods which must be implemented by any class that adheres to it. It exposes these methods to other modules without revealing the actual implementation, ensuring that interactions occur through a consistent set of behaviors rather than direct access to the implementation."