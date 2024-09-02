---
layout: post
title: Unit Testing Preauthroize Annotation in Spring Boot
image: https://unsplash.com/photos/kdqncvp6rao/download?w=800
thumb: https://unsplash.com/photos/kdqncvp6rao/download?w=800
author: tushar sharma
category: blog
tags:
  - java
  - spring boot
  - spring security
---

Preauthorize annotation can be use to enforce access control in Spring Boot applications. It's part of Spring Security that allows you to specify access control expression for methods. These expressions are evaluated before method execution, determining whether the current user has the authority to invoke the method.<!-- truncate_here -->

Preauthorize annotation can be use to enforce access control in Spring Boot applications. It's part of Spring Security that allows you to specify access control expression for methods. These expressions are evaluated before method execution, determining whether the current user has the authority to invoke the method.

## Implementing `@PreAuthorize`

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: AuthorizedService.java
---
{% endtemplate %}


In this example, the `hasAuthority()` method is protected by a `@PreAuthorize` annotation. The expression "hasAuthority(@config.getAuthority())" checks if the current user has the authority specified by the getAuthority() method of a @Config bean.

To make this work, we need to define our Config class:

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: Config.java
---
{% endtemplate %}


This class reads the required authority from the application's configuration. In your application.yaml, you can specify the required authority:

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: application.yaml
---
{% endtemplate %}

## The Challenge of Unit Testing

When it comes to unit testing a service with @PreAuthorize, we encounter some challenges. Let's look at a common approach that doesn't work as expected:

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: AuthorizedServiceTest.java
---
{% endtemplate %}


It fails with following error : 



{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: error.txt
---
{% endtemplate %}

This approach fails because Mockito-created mocks are not proxied by Spring Security. As a result, the @PreAuthorize annotation is not processed, and the security checks are not performed during the test.

## The Solution: Integration Testing

To properly test methods annotated with @PreAuthorize, we need to use integration tests that load the entire Spring context. Here's how we can modify our test:

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: AuthorizedServiceIntegrationTest.java
---
{% endtemplate %}
