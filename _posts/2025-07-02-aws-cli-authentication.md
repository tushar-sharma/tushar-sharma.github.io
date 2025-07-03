---
layout: post
title: 
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: 
category: blog
published: false
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->

### 1. Okta Federation with AWS CLI


```bash
okta-aws-cli --org-domain  company.okta. com
--oidc-client-id <client-id>
--aws-acct-fed-app-id <app-id>
--open-browser -z
--session-duration 36000
```

**What's happening here?**
- Uses OIDC (OpenID Connect) for federated authentication
- Initiates a 10-hour session (36000 seconds)
- Browser-based authentication flow
- Creates temporary AWS credentials


### 2. ECR Docker Authentication

```bash
aws ecr get-login-password --region <region> | \
docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
```

**What's happening here?**
- Generates an authentication token for ECR
- Pipes the token directly to Docker login
- Sets up Docker credential helper
- Valid for 12 hours by default

