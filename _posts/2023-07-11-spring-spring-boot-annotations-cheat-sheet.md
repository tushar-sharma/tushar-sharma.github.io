---
layout: post
title: Spring Boot Annotations Cheat sheet
category: blog
tags:
- spring boot
name: interface-aws-cdk
thumb: /img/
image: /img
---

TODO.<!-- truncate_here -->

### Autowired

`@Autowired` is a Spring framework annotation that enables dependency injection in a Spring application. It allows the Spring container to automatically wire beans by matching their data type. The @Autowired annotation can be used on setter methods, instance variables, or constructors.


Assume we have a class called "UserService" that we want to autowire

```java
@Service
public class UserService{
    public void performOperation(){
        Sytem.out.println("User has performed some operation");
    }
}
```
When applied to a setter method, the @Autowired annotation instructs the Spring container to inject the dependency by invoking the setter method with the appropriate bean. Here's an example:

```java
public class UserController {
    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
    
}

```

Similarly, the @Autowired annotation can be applied to instance variables:


```java
public class UserController {
    @Autowired
    private UserService userService;

}

```

Constructor injection using @Autowired is also possible and is often considered a preferred approach. Here's an example:


```java
public class UserController{
    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
}
```
### Configuration

@Configuration: It is a class-level annotation. The class annotated with @Configuration used by Spring Containers as a source of bean definitions.

When a class is annotated with @Configuration, it is treated as a source of bean definitions, similar to XML-based configuration files. The Spring container scans the @Configuration class and processes its methods annotated with @Bean, allowing you to define and customize bean instances programmatically.

```java
@Configuration
public class AppConfig {

    @Bean
    public UserService userService() {
        return new UserService();
    }

    @Bean
    public UserController userController() {
        return new UserController(userService());
    }

    // ...
}
````

### Service

@Service: It is also used at class level. It tells the Spring that class contains the business logic.

### Inversion of Control

Inversion of Control (IoC) is a principle in software development that refers to the shift of control of object creation and lifecycle management from the application code to an external container or framework. In IoC, the responsibility of creating and managing objects (often referred to as "beans") is delegated to a container, which dynamically manages the dependencies between objects.

@Required: It applies to the bean setter method. It indicates that the annotated bean must be populated at configuration time with the required property, else it throws an exception BeanInitilizationException.

@Autowired: Spring provides annotation-based auto-wiring by providing @Autowired annotation. It is used to autowire spring bean on setter methods, instance variable, and constructor. When we use @Autowired annotation, the spring container auto-wires the bean by matching data-type.

@Configuration: It is a class-level annotation. The class annotated with @Configuration used by Spring Containers as a source of bean definitions.

@ComponentScan: It is used when we want to scan a package for beans. It is used with the annotation @Configuration. We can also specify the base packages to scan for Spring Components.

@Bean: It is a method-level annotation. It is an alternative of XML tag. It tells the method to produce a bean to be managed by Spring Container.

@Component: It is a class-level annotation. It is used to mark a Java class as a bean. A Java class annotated with @Component is found during the classpath. The Spring Framework pick it up and configure it in the application context as a Spring Bean.

@Controller: The @Controller is a class-level annotation. It is a specialization of @Component. It marks a class as a web request handler. It is often used to serve web pages. By default, it returns a string that indicates which route to redirect. It is mostly used with @RequestMapping annotation.

@Service: It is also used at class level. It tells the Spring that class contains the business logic.

@Repository: It is a class-level annotation. The repository is a DAOs (Data Access Object) that access the database directly. The repository does all the operations related to the database.

@SpringBootApplication: It is a combination of three annotations @EnableAutoConfiguration, @ComponentScan, and @Configuration.

Spring MVC and REST Annotations:
@RequestMapping: It is used to map the web requests. It has many optional elements like consumes, header, method, name, params, path, produces, and value. We use it with the class as well as the method.

@GetMapping: It maps the HTTP GET requests on the specific handler method. It is used to create a web service endpoint that fetches It is used instead of using: @RequestMapping(method = RequestMethod.GET)

@PostMapping: It maps the HTTP POST requests on the specific handler method. It is used to create a web service endpoint that creates It is used instead of using: @RequestMapping(method = RequestMethod.POST)

@PutMapping: It maps the HTTP PUT requests on the specific handler method. It is used to create a web service endpoint that creates or updates It is used instead of using: @RequestMapping(method = RequestMethod.PUT)

@DeleteMapping: It maps the HTTP DELETE requests on the specific handler method. It is used to create a web service endpoint that deletes a resource. It is used instead of using: @RequestMapping(method = RequestMethod.DELETE)

@PatchMapping: It maps the HTTP PATCH requests on the specific handler method. It is used instead of using: @RequestMapping(method = RequestMethod.PATCH)

@RequestBody: It is used to bind HTTP request with an object in a method parameter. Internally it uses HTTP MessageConverters to convert the body of the request. When we annotate a method parameter with @RequestBody, the Spring framework binds the incoming HTTP request body to that parameter.

@ResponseBody: It binds the method return value to the response body. It tells the Spring Boot Framework to serialize a return an object into JSON and XML format.

@PathVariable: It is used to extract the values from the URI. It is most suitable for the RESTful web service, where the URL contains a path variable. We can define multiple @PathVariable in a method.

@RequestParam: It is used to extract the query parameters form the URL. It is also known as a query parameter. It is most suitable for web applications. It can specify default values if the query parameter is not present in the URL.

@RequestHeader: It is used to get the details about the HTTP request headers. We use this annotation as a method parameter. The optional elements of the annotation are name, required, value, defaultValue. For each detail in the header, we should specify separate annotations. We can use it multiple time in a method

@RestController: It can be considered as a combination of @Controller and @ResponseBody annotations. The @RestController annotation is itself annotated with the @ResponseBody annotation. It eliminates the need for annotating each method with @ResponseBody.

@RequestAttribute: It binds a method parameter to request attribute. It provides convenient access to the request attributes from a controller method. With the help of @RequestAttribute annotation, we can access objects that are populated on the server-side.

@EnableSwagger2: Mainly used for documentation the Restful we-service

@EnableOAuth2Sso: Oauth Authentication