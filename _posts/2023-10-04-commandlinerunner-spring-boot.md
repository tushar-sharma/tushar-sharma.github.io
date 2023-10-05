---
layout: post
title: Delving into CommandLineRunner in Spring Boot
category: blog
tags:
  - spring boot
thumb: https://unsplash.com/photos/7mfR5n3XozU/download?w=800
image: https://unsplash.com/photos/7mfR5n3XozU/download?w=800
author: Tushar Sharma
published: true
---

Spring Boot provides a range of functionalities that allow developers to run specific code blocks during the application's lifecycle. One such feature is the CommandLineRunner interface. This interface is specifically designed to execute a code block just once, right after the Spring Boot application has initialized. This can be particularly useful for tasks like database seeding, running sanity checks, or any other initialization logic you want to run before your application begins processing.

There are a few ways to utilize the CommandLineRunner in a Spring Boot application. Let's explore them:

## Using `@Component` Annotation

```java
@Component
@Slf4j
public class ApplicationStartupRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        log.info("ApplicationStartupRunner started...!");
    }
}
```
> **Quiz:** What's the role of the `@Component` annotation in Spring?

<button class="quiz-btn" data-showing="false" onclick="toggleAnswer('answer1')">Show Answer</button>
<div class="quiz-answer" id="answer1">
The `@Component` annotation is used in Spring to indicate that a class should be considered as a Spring-managed component. When the application context is being created, classes annotated with `@Component` are auto-detected and a bean instance is created for them in the Spring container.
</div>

## Integrating with `@SpringBootApplication`

```java
@SpringBootApplication
@Slf4j
public class DemoCommandLineApplication implements CommandLineRunner {

	@Override
	public void run(String... args){
		log.info("CommandLineRunner started!");
	}

	public static void main(String[] args) {
		SpringApplication.run(DemoCommandLineApplication.class, args);
	}
}
```

> Quick Quiz: Explain the syntax `String....` How is it different than `String[] args` in Java?


## Quiz Answers


### What's the role of the @Component annotation in Spring?

The `@Component` annotation is used in Spring to indicate that a class should be considered as a Spring-managed component. When the application context is being created, classes annotated with @Component are auto-detected and a bean instance is created for them in the Spring container.


### Explain the syntax `String....` How is it different than `String[] args` in Java?

The String... syntax in Java denotes a varargs (variable number of arguments). It allows you to pass any number of arguments when invoking a method. Internally, varargs are treated as an array. The key difference between String... args and String[] args is in how you call the method. With varargs (String... args), you can call the method with multiple string arguments directly, without having to create an array. With String[] args, you'd need to pass an array of strings. However, inside the method body, args behaves like an array in both cases.

<script>
function toggleAnswer(answerId) {
    var answer = document.getElementById(answerId);
    var button = event.currentTarget;  // Get the button that was clicked
    if (button.getAttribute('data-showing') === "false") {
        answer.style.display = "block";
        button.textContent = "Hide Answer";
        button.setAttribute('data-showing', 'true');
    } else {
        answer.style.display = "none";
        button.textContent = "Show Answer";
        button.setAttribute('data-showing', 'false');
    }
}
</script>
