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

JSON Web Tokens(JWT) is pronounced as jot. It's a compact, self-contained method for transfering secure data as JSON object. JWT are stateless token because the authorizing server doesnt maintain any state.


### Uses

* Authentication 

* Information Exchange

### Structure of JWT

JWT consist of a header, payload & a signature. An sample JWT would look like

<p>
<span style="color:red;">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>. <span style="color:pink;">eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9</span>. <span style="color:blue;">TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ</span><br>
</p>

#### Header in JWT

It's used to specify the token type and the signature algorithm which is used to sign the token.

#### Payload in JWT

The payload is where all access data is added. Each assertion is called claims. Some of the registered claims are

* iss: The issuer of this token.

* sub: Usually a machine-readable identifier of the
client that this token is issued to.

* aud : Service-specific string identifier or list of string
identifiers representing the intended audience for this
token.

* iat: Indicating when this token was originally issued.

* exp : Indicating when this token will expire.

* nbf: Indicating when this token is not to be used
before.

* scope:A JSON string containing a space-separated list
of scopes associated with this token.

#### Signature in JWT

This is to ensure authenticity of the token. The authority first encodes the header and the payload with base64 algorithm and then signs on the concatenation of the encoded data.