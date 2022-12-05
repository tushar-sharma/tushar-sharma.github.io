---
layout: post
date: 2022-12-05
title: Getting Started With JWT
image: 'https://unsplash.com/photos/gYvGBOmx5do/download?w=800'
thumb: 'https://unsplash.com/photos/gYvGBOmx5do/download?w=800'
author: Tushar Sharma
---

<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

JWT is pronounced jot. The stateless token of JWT. JWT is base 64 encoded. JSON Web Tokens (JWT) are referred to as stateless because the authorizing server needs to maintain no state; the token itself is all that is needed to verify a token bearer's authorization.


JWT HEADER

eyJslaflasf can be decoded with base 64 {
}

JWT body
claim means keys in JTW body. 

{
    
}

JWT signature...

consuming the JWT..


So JWT has three parts 
- JWT header
- JWT body
- JWT signature

Validation of JWT
1. validate the signature
2. validated the claims 
 iss claim : who created this jwt 
 exp claim : they are time based because JWT is stateless
 aud claim (means audience): issuer of JWT is putting aud claim for audience

```java
//check claims
Jwt jwt = new JTW();

jwt.getOtherClaims.put("name", "Dan moore");
jwt.getOtherClaims.put("role", new String[]{"1" , "2"});

```

JWT uuses as bearer token. Like a car key, anyone can use it.