---
layout: post
date: 2023-04-04
title: Transforming a blocking method to a reactive one using Spring Reactor
image: https://unsplash.com/photos/qac9Q3pWHWg/download?w=800
thumb: https://unsplash.com/photos/qac9Q3pWHWg/download?w=800
author: Tushar Sharma
mutipleTab: true
tags:
 - reactive programming
 - java
---

Reactive programming is becoming increasingly popular in modern software development, and the use of reactive frameworks like Spring Reactor and RxJava is becoming more common. Reactive programming is an event-driven approach to programming that emphasizes asynchronous data streams, non-blocking I/O, and functional programming.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


Reactive programming is becoming increasingly popular in modern software development, and the use of reactive frameworks like Spring Reactor and RxJava is becoming more common. Reactive programming is an event-driven approach to programming that emphasizes asynchronous data streams, non-blocking I/O, and functional programming.

The code we're working with is a method that reads a value from Redis and returns an App object. The method is blocking, and the Redis call can take some time to complete. Here's the original code:

<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
      <script src="https://gist.github.com/tushar-sharma/31f81906fcf43e8395f455ee4ae2cbfc.js?file=Service1.java"></script>
   </div>


</div>

The method returns a Mono<App> object, which is a reactive stream that can emit one or more values. The Redis read operation is performed synchronously, which means that the thread calling this method will be blocked until the operation completes. This is not ideal in a reactive application, as we want to avoid blocking threads and keep the application responsive.


To make this method more reactive, we can use the Mono.fromCallable operator. This operator allows us to wrap a synchronous method call in a reactive stream. Here's the new code:


<div class="tab-container">
  <ul>
    <li class="tab Java2"><a href="#Java2">Java</a></li>
  </ul>

   <div class="codeSample Java2" id="Java2">
      <script src="https://gist.github.com/tushar-sharma/31f81906fcf43e8395f455ee4ae2cbfc.js?file=Service2.java"></script>
   </div>


</div>

The fromCallable operator takes a Callable object, which is a functional interface that takes no arguments and returns a value. In our case, the Callable object wraps the Redis read operation. This operation is still synchronous, but it's now executed inside a reactive stream.

The onErrorResume operator allows us to handle exceptions that may be thrown during the Redis read operation. If an exception is thrown, we log a warning message and return an empty Mono.

In conclusion, by using the fromCallable operator, we've transformed a blocking method into a reactive one. The Redis read operation is now executed asynchronously inside a reactive stream, which allows us to avoid blocking threads and keep our application responsive.