---
layout: post
date: 2023-04-05
title: Understanding the Chain of Responsibility Pattern
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: Tushar Sharma
published: false
---

.<!-- truncate_here -->

The Chain of Responsibility pattern is a design pattern used in object-oriented programming to create a chain of objects that can process a request. In Reactive Java Spring Boot, the pattern can be used to handle and process events asynchronously in a non-blocking manner.

To understand the Chain of Responsibility pattern in Reactive Java Spring Boot, let's start with a simple example. Let's say we have a web application that receives HTTP requests, and we want to implement a series of filters to process these requests. Each filter will perform a specific task, such as authentication, logging, or rate limiting.

One way to implement the filter system would be to use a series of if-else statements to check each filter and apply the appropriate logic. However, this approach can quickly become cumbersome and difficult to maintain as the number of filters increases.

Instead, we can use the Chain of Responsibility pattern to create a chain of reactive functions, each responsible for applying a specific filter logic. Each function in the chain has a reference to the next function in the chain, and if it cannot handle the request, it passes the request on to the next function in the chain.


To implement the Chain of Responsibility pattern in Reactive Java Spring Boot, we can use the Mono and Flux classes provided by the Reactor library. We can create a chain of reactive functions, each taking a Mono or Flux object as input and returning a Mono or Flux object as output.


Let's create a simple example to demonstrate how to implement the Chain of Responsibility pattern in Reactive Java Spring Boot. Let's say we have a web application that receives HTTP requests, and we want to implement a series of filters to process these requests. We want to implement the following filters:


* Authentication filter: This filter checks if the request contains a valid authentication token.
* Rate limiting filter: This filter limits the number of requests that can be made within a certain time frame.
* Logging filter: This filter logs the request and response data.

To implement the filters, we can create a chain of reactive functions, each responsible for applying a specific filter logic. Each function in the chain will take a Mono<ServerRequest> object as input and return a Mono<ServerResponse> object as output.

Let's create an interface called FilterHandler that will serve as the base interface for all filter handlers in the chain:


```java
public interface FilterHandler {
    Mono<ServerResponse> handle(ServerRequest request, HandlerFunction<ServerResponse> next);
}
```

The handle method takes a ServerRequest object, as well as a reference to the next handler in the chain. If the current handler can handle the request, it returns a Mono<ServerResponse> object. If it cannot handle the request, it calls the next handler in the chain and returns the result of that handler.

Next, let's create a concrete implementation of the FilterHandler interface for each filter:

```java
public class AuthenticationFilter implements FilterHandler {
    @Override
    public Mono<ServerResponse> handle(ServerRequest request, HandlerFunction<ServerResponse> next) {
        // check if the request contains a valid authentication token
        // if yes, return the next handler in the chain
        // if no, return an unauthorized response
    }
}

public class RateLimitingFilter implements FilterHandler {
    @Override
    public Mono<ServerResponse> handle(ServerRequest request, HandlerFunction<ServerResponse> next) {
        // check if the number of requests within a certain time frame has been exceeded
        // if yes, return a too many requests response
        // if no, return the next handler in the chain
    }
}

public class LoggingFilter implements FilterHandler {
    @Override
    public Mono<ServerResponse> handle(ServerRequest request, HandlerFunction<ServerResponse> next) {
        // log the request and response data
        // return the next handler in the chain
    }
}

```


Finally, we can create a chain of handlers using the andThen method provided by the HandlerFilterFunction class:



```java
FilterHandler authenticationFilter = new AuthenticationFilter();
FilterHandler rateLimitingFilter = new RateLimitingFilter();
FilterHandler loggingFilter = new LoggingFilter();

HandlerFilterFunction<ServerResponse, ServerResponse> handler =
    authenticationFilter::handle
        .andThen(rateLimitingFilter::handle)
        .andThen(loggingFilter::handle);
```

The andThen method creates a new HandlerFilterFunction by chaining the current function with the provided function. The resulting HandlerFilterFunction is a composite function that applies both the current function and the provided function to the input.



Now that we have implemented the Chain of Responsibility pattern in Reactive Java Spring Boot, let's see how we can use it to process HTTP requests in our web application.

To use the Chain of Responsibility pattern, we can create a HandlerFilterFunction object and add it to our RouterFunction. The HandlerFilterFunction object will take care of processing the HTTP requests and applying the filters in the chain.

Let's create a simple example to demonstrate how to use the Chain of Responsibility pattern in Reactive Java Spring Boot. Let's say we have a web application that receives HTTP requests, and we want to implement a series of filters to process these requests. We have implemented the following filters:

Authentication filter: This filter checks if the request contains a valid authentication token.
Rate limiting filter: This filter limits the number of requests that can be made within a certain time frame.
Logging filter: This filter logs the request and response data.
We have also implemented a FilterHandler interface and concrete implementations for each filter.

Now, let's create a HandlerFilterFunction object that will apply the filter chain to incoming HTTP requests:

```java
FilterHandler authenticationFilter = new AuthenticationFilter();
FilterHandler rateLimitingFilter = new RateLimitingFilter();
FilterHandler loggingFilter = new LoggingFilter();

HandlerFilterFunction<ServerResponse, ServerResponse> handler =
    authenticationFilter::handle
        .andThen(rateLimitingFilter::handle)
        .andThen(loggingFilter::handle);
```

Next, let's create a RouterFunction object that will handle incoming HTTP requests and apply the HandlerFilterFunction to them:


```java
@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> routerFunction() {
        return RouterFunctions.route()
            .POST("/api/endpoint", handler)
            .build();
    }

}
```

The RouterFunctions.route() method creates a new RouterFunctions.Builder object that we can use to define our request mappings. We can then use the POST method to map the /api/endpoint path to our HandlerFilterFunction object.

Finally, we can start our web application and send an HTTP request to the /api/endpoint path:

```
@SpringBootApplication
public class MyApp {

    public static void main(String[] args) {
        SpringApplication.run(MyApp.class, args);
    }

}
```

When the web application receives an HTTP request to the /api/endpoint path, it will apply the filter chain defined by the HandlerFilterFunction object. The AuthenticationFilter will check if the request contains a valid authentication token, the RateLimitingFilter will limit the number of requests that can be made within a certain time frame, and the LoggingFilter will log the request and response data.

If any of the filters fail to handle the request, the request will be passed on to the next filter in the chain. If all filters in the chain successfully handle the request, the HandlerFilterFunction will return a Mono<ServerResponse> object containing the HTTP response.

In conclusion, the Chain of Responsibility pattern is a powerful tool for handling and processing events asynchronously in a non-blocking manner. In Reactive Java Spring Boot, we can use the Mono and Flux classes provided by the Reactor library to create a chain of reactive functions that handle incoming events. By using the Chain of Responsibility pattern, we can create a flexible and extensible system for processing HTTP requests and other events in our web application.


In the previous tutorials, we have seen how to implement and use the Chain of Responsibility pattern in Reactive Java Spring Boot. However, one important aspect we have not addressed yet is how to handle exceptions that may occur during the processing of events in the chain.

When implementing a chain of reactive functions, it is important to handle exceptions properly to avoid disrupting the flow of the chain and ensure that errors are handled gracefully. In Reactive Java Spring Boot, we can handle exceptions using the onErrorResume and onErrorContinue operators provided by the Reactor library.

Let's modify our previous example to demonstrate how to handle exceptions in the Chain of Responsibility pattern.

First, let's modify our FilterHandler interface to include a handleException method that will handle exceptions thrown by filters in the chain:

```java
public interface FilterHandler {

    Mono<ServerResponse> handle(ServerRequest request);

    default Mono<ServerResponse> handleException(Throwable t) {
        return Mono.error(t);
    }

}
```

We have added a handleException method that returns a Mono object containing the exception. This method will be called if an exception is thrown by a filter in the chain.

Next, let's modify our HandlerFilterFunction object to use the onErrorResume operator to handle exceptions thrown by filters:

```java
HandlerFilterFunction<ServerResponse, ServerResponse> handler =
    authenticationFilter::handle
        .onErrorResume(t -> authenticationFilter.handleException(t))
        .andThen(rateLimitingFilter::handle)
        .onErrorResume(t -> rateLimitingFilter.handleException(t))
        .andThen(loggingFilter::handle)
        .onErrorResume(t -> loggingFilter.handleException(t));
```

We have added the onErrorResume operator to each filter in the chain. This operator takes a function that handles exceptions and returns a new Mono object. In this case, if an exception is thrown by any filter in the chain, the onErrorResume operator will call the handleException method of that filter and return a new Mono object containing the exception.

Finally, let's modify our RouterFunction object to use the onErrorContinue operator to handle exceptions thrown during the processing of HTTP requests:

```java
@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> routerFunction() {
        return RouterFunctions.route()
            .POST("/api/endpoint", handler)
            .onErrorContinue((t, obj) -> log.error("Error processing request: {}", t.getMessage()))
            .build();
    }

}
```


We have added the onErrorContinue operator to the RouterFunction object. This operator takes a function that handles exceptions and continues processing the chain. In this case, if an exception is thrown during the processing of an HTTP request, the onErrorContinue operator will log the error message and continue processing the chain.

By handling exceptions properly in the Chain of Responsibility pattern, we can ensure that errors are handled gracefully and the flow of the chain is not disrupted. We can use the onErrorResume and onErrorContinue operators provided by the Reactor library to handle exceptions in a flexible and extensible manner.