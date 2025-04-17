---
layout: post
title: Getting Started with Spring AI
image: https://unsplash.com/photos/3wXVwtdaESA/download?w=437
thumb: https://unsplash.com/photos/3wXVwtdaESA/download?w=437
author: Tushar Sharma
category: blog
skipImage: true
published: true
tags:
  - spring boot
quiz: true
---

In this blog, we'll explore how to create a simple Spring Boot application that leverages Spring AI for generating responses. We'll build a BooksApi application that can tell us which book won the booker prize for a given year.<!-- truncate_here -->


In this blog, we'll explore how to create a simple Spring Boot application that leverages Spring AI for generating responses. We'll build a BooksApi application that can tell us which book won the booker prize for a given year.

### Initialize Your Project

* Go to [start.spring.io](https://start.spring.io/)

* Name your project as `BooksApi`

* Add the dependencies: Spring Web, Spring Boot Dev Tools

### Adding Snapshot Repository with Gradle

Snapshot repositories store development versions of artifacts. The Spring Snapshot Repository contains the latest updates. Add this to your `build.gradle` to access the Spring Snapshot Repository and Spring AI dependency:

{% template  customCode.html %}
---
id: a180a0e9603e7fe9d018b220387465f6
file: build.gradle
---
{% endtemplate %}

### API Keys

Add your API key to `src/main/resources/application.properties`:

```yaml
spring.ai.openai.api-key=YOUR_API_KEY
```

### Controller

Create `controller/BooksController.java``:

{% template  customCode.html %}
---
id: a180a0e9603e7fe9d018b220387465f6
file: BooksController1.java
---
{% endtemplate %}


In the above code, `openAiClient` is injected through constructor injection, which is a preferred method in Spring for dependency injection. The @Autowired annotation is not required when using constructor injection.

> Quick Quiz: What's @RequestMapping Annotation?

<button class="quiz-btn" data-showing="false" data-answer="answer1">Show Answer</button>
<div class="quiz-answer" id="answer1">
@RequestMapping is an annotation used in Spring to map web requests to specific handler classes or handler methods. Here, it's used to map all requests starting with <i>/books</i> to this controller.
</div>

### Using PromptTemplate

PromptTemplate is useful for dynamically constructing prompts with variables. It ensures cleaner code and easier manipulation of the prompt string.

{% template  customCode.html %}
---
id: a180a0e9603e7fe9d018b220387465f6
file: BooksController2.java
---
{% endtemplate %}

If you go to : `http://localhost:8080/books/booker/2003`, it will output something like 

```
The book that won the Booker Prize in 2003 is "Vernon God Little" by DBC Pierre.
```

> Quick Quiz: What's @PathVariable Annotation?

<button class="quiz-btn" data-showing="false" data-answer="answer2">Show Answer</button>
<div class="quiz-answer" id="answer2">
A path variable is a part of the URL that is captured and used as a variable in your method. In this case, {year} in the URL /booker/{year} is a path variable.
</div>

### Creating a record class

A record class in Java is a concise way to create immutable data objects.

{% template  customCode.html %}
---
id: a180a0e9603e7fe9d018b220387465f6
file: BookWinner.java
---
{% endtemplate %}

### Parsing AI Response into Java Object

BeanOutputParser is a utility in Spring AI that helps in parsing the output from AI into a Java Bean (in our case, BookerWinner).

`parser.getFormat()` returns a string that represents the format in which the AI should return the data, making it easier to parse into the BookerWinner object.

{% template  customCode.html %}
---
id: a180a0e9603e7fe9d018b220387465f6
file: BooksController3.java
---
{% endtemplate %}

If you go to : `http://localhost:8080/books/booker/2003`, it will output something like 

```
{
  "title": "Vernon God Little",
  "author": "DBC Pierre",
  "year": "2003"
}
```