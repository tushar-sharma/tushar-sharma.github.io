---
layout: post
title: Fixing Canton Validator OAuth2 Authentication Errors
category: blog
tags:
- canton
- blockchain
- oauth
name: canton-oauth-fix
thumb: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
image: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
---

Onboarding a **Canton validator** to **devnet, testnet, or mainnet** can be challenging. One error that kept me stuck was integrating OAuth2 with the Canton node—specifically, the missing `access_token` error.<!-- truncate_here -->

Onboarding a **Canton validator** to **devnet, testnet, or mainnet** can be challenging. One error that kept me stuck was integrating OAuth2 with the Canton node—specifically, the missing `access_token` error.

## Background

Canton is a privacy-enabled blockchain network. Unlike public blockchains, only authorized parties can read ledger data. To interact with Canton, you deploy a participant node and a validator node.

The issue I hit was the validator failing to authenticate with this error: 

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex1.json
---
{% endtemplate %}

## The Problem

OAuth2 requires a bearer token in request headers. How you get that token is up to you. We use Okta as our identity provider with `client_credentials` grant type for machine-to-machine auth.

First, verify you can get a token from your OAuth provider: 

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex2.sh
---
{% endtemplate %}

Get these values from your Okta admin. You should see a response like:

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex3.json
---
{% endtemplate %}

## The Fix

### 1. Extract the Sub Field

The JWT contains a `sub` (subject) claim that identifies the client. Canton needs this for authentication. Decode the token:

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex4.sh
---
{% endtemplate %}


You'll see something like:

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex5.json
---
{% endtemplate %}

Use the `sub` value in your validator's Kubernetes configuration:

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex6.yaml
---
{% endtemplate %}


### 2. Add Default Scope

This was the missing piece. Canton's OAuth client needs the scope explicitly configured:

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex7.yaml
---
{% endtemplate %}


Here's the full configuration in context:


{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex8.yaml
---
{% endtemplate %}


### 3. Grant User Rights

After the validator is onboarded, grant it ledger access rights via the Canton Ledger API:

```bash
POST /v2/users/<SUB_FIELD>/rights
```

Request body:

{% template  customCode.html %}
---
id: ca7aaa51d77717ebcb835eeb87abe8a6
file: ex9.json
---
{% endtemplate %}

