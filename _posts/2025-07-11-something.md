---
layout: post
title: Something
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
published: false
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

Retrieve Username in a Spring WebFlux application.

## JWT based Username Controller

```java
@RestController
@RequestMapping("username")
@RequiredArgsConstructor
class UsernameController {
    @GetMapping
    public Mono<String> getUsername(@AuthenticationPrincipal jwt) {
        return jwt
            .map(token -> token.getClaimAsString("sub"))
            .defaultIfEmpty("")
            .flatMap(username -> Mono.just(username));
    }
}
```

### Understanding map vs flatMap

**map**: 

* takes a value and return a transformed value

* `token -> token.getClaimAsString("sub)` transform JWT token to a username string

**flatmap**

* takes a value and returns a publisher (Mono/Flux)

* flattens nested publishers into a single reactive stream 

```java
Mono.just("token")
    .map(str -> str.toUpperCase());

Mono.just("token")
    .flatMap(str -> Mono.just(str.toUpperCase()));

Mono.just("userid")
    .flatMap(id -> userRepository.findById(id)); 
```

Here `getName()` maps to `getSub` in Jwt 

## Generic Approach Username

```java
public Mono<String> getUsername(){
    return ReactiveSecurityContextHolder().getContext()
         .map(SecurityContext::getAuthentication)
         .map(Authentication::getName);
}
```


## Jwt Structure

It consit of three parts

1. Header (algorithm info)
2. Payload (claims)
3. Signature (for verification)


The `sub` claim maps to `Authentication.getName()` in Spring Security.

## Kerberos Authentication 

If an application is using kerberos for autneticaiton. 

1. they have a keytab file `etc/krb5.keytab`

Youc an see this info using `klist `a

```
kilist display 
```

Flow 

1. Client request a ticket from KDC (Key distrubtion center) common server

2. KDC provides Ticket Granting System (TGT)

3. clinet uses TGT to request service ticket

4. service ticket is decrypted using keytab

5. headers you snet this decrpted servie ticket for authehtiicatiion


5. `Authentication.getName()` willr eturn principal name
