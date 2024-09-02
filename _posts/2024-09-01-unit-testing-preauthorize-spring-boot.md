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

<div style="display:none;" markdown="1">
import org.springframework.security.access.prepost.PreAuthorize;
import reactor.core.publisher.Mono;

public class AuthorizedService {
    @PreAuthorize("hasAuthority(@config.getAuthority())")
    public Mono<Boolean> hasAuthority() {
        return Mono.just(true);
    }
}
</div>

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: AuthorizedService.java
---
{% endtemplate %}


In this example, the `hasAuthority()` method is protected by a `@PreAuthorize` annotation. The expression "hasAuthority(@config.getAuthority())" checks if the current user has the authority specified by the getAuthority() method of a @Config bean.

To make this work, we need to define our Config class:

<div style="display:none;" markdown="1">
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.Getter;

@Component
@Getter
public class Config {
    @Value("${spring.application.authority}")
    private String authority;
}
</div>

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

<div style="display:none;" markdown="1">
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.test.context.support.WithMockUser;
import reactor.test.StepVerifier;
import org.springframework.security.access.AccessDeniedException;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthorizedServiceTest {
    @InjectMocks
    private AuthorizedService authorizedService;

    @Mock
    private Config config;

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testHasAuthority_withAccess() {
        when(config.getAuthority()).thenReturn("ADMIN");

        StepVerifier.create(authorizedService.hasAuthority())
            .expectNext(true)
            .verifyComplete();
    }

    @Test
    void testHasAuthority_withoutAccess() {
        StepVerifier.create(authorizedService.hasAuthority())
            .expectError(AccessDeniedException.class)
            .verify();
    }
}
</div>

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: AuthorizedServiceTest.java
---
{% endtemplate %}


It fails with following error : 

<div style="display:none;" markdown="1">
org.mockito.exceptions.misusing.UnnecessaryStubbingException: 
Unnecessary stubbings detected.
Clean & maintainable test code requires zero unnecessary code.
Following stubbings are unnecessary (click to navigate to relevant line of code):
</div>

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: error.txt
---
{% endtemplate %}

This approach fails because Mockito-created mocks are not proxied by Spring Security. As a result, the @PreAuthorize annotation is not processed, and the security checks are not performed during the test.

## The Solution: Integration Testing

To properly test methods annotated with @PreAuthorize, we need to use integration tests that load the entire Spring context. Here's how we can modify our test:

<div style="display:none;" markdown="1">
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.test.context.support.WithMockUser;
import reactor.test.StepVerifier;
import org.springframework.security.access.AccessDeniedException;
import static org.mockito.Mockito.when;

@SpringBootTest(properties = {"spring.profiles.active=test"})
public class AuthorizedServiceIntegrationTest {

    @Autowired
    private AuthorizedService authorizedService;

    @Mock
    private PropertyConfig propertyConfig;

    @Test
    @WithMockUser(authorities = "ADMIN")
    void testHasKafkaAllowedAuthority_withAccess() {

        when(propertyConfig.getKafkaAllowedAuthority()).thenReturn("ADMIN");

        StepVerifier.create(authorizedService.hasAuthority())
                .expectNext(true)
                .verifyComplete();
    }

    @Test
    void testHasKafkaAllowedAuthority_withoutAccess() {

        StepVerifier.create(authorizedService.hasAuthority())
                .expectError(AccessDeniedException.class)
                .verify();
    }
}
</div>

{% template  customCode.html %}
---
id: 4152cea6d018ce10a56780ec6aaa1349
file: AuthorizedServiceIntegrationTest.java
---
{% endtemplate %}
