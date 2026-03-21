---
layout: post
title: Fixing Canton Validator OAuth2 Authentication Errors
category: blog
tags:
- canton
- blockchain
- oauth
published : false
name: canton-oauth-fix
thumb: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
image: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
---

Onboarding **canton valdiator** to **devent, testnet, or mainnet** could be daunting. One particular error that kept me pulling my hairs was integrating oauth2 with canton node.<!-- truncate_here -->

Onboarding **canton valdiator** to **devent, testnet, or mainnet** could be daunting. One particular error that kept me pulling my hairs was integrating oauth2 with canton node.

## Refersher

Canton is a private permissioned blockchain network. This is differnet than public permissioned blockchain. In canton, only the parties having access can read the ledger with the data. To talk to the canton network, you need to deploy participant and validator. One common issue I encountered when deploying canton validator was missing `access_token`. 

You will see logs like this : 

```json
{
  "@timestamp": "2026-03-19T13:02:49.744Z",
  "message": "Token refresh failed",
  "logger_name": "AuthTokenManager:validator=validator_backend",
  "level": "WARN",
  "stack_trace": "spray.json.DeserializationException: Object is missing required member 'access_token'"
}
```


## Oauth2

First lets understand how oauth2 works before we diagnosze this error. Oauth2 is a protocol that demands that it needs a bearer token in the headers. That's it. Now how do you get this token, it's upto you. We have okta as our IDP , and we use `client credentials` grant type to get the token when there's no UI. For UI we use SSO. 

verify that you are able to get bearer token using 

```
curl -X POST https://yourorg.okta.com/oauth2/{auth server}/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "audience=YOUR_AUDIENCE" \
  -d "grant_type=client_credentials" \
  -d "scope=default"
```

These information you should get form your Okta admin team. and respond like 

```bash
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleTEifQ...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "default"
}
```

### Extract the Sub Field

The token contains a `sub` (subject) claim that identifies the client. Decode the JWT to view it:

```bash
# Save the token first
TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleTEifQ..."

# Decode and view the payload (requires jq)
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq .
```

You'll see something like:

```json
{
  "sub": "0abc123def456ghi789@clients",
  "client_id": "YOUR_CLIENT_ID",
  "aud": "YOUR_AUDIENCE",
  "iat": 1710883369,
  "exp": 1710886969,
  "scope": "default"
}
```

The `sub` field needs to be captured and stored as an environment variable for the validator. Add this to your Kubernetes manifest:

```yaml
- name: SPLICE_APP_VALIDATOR_OAUTH_SUB
  value: "0abc123def456ghi789@clients"
```

# Add default scope


Add this configuration block to your environment variables:

```yaml
- name: ADDITIONAL_CONFIG_OAUTH_SCOPE
  value: |
    canton.validator-apps.validator_backend.participant-client.ledger-api.auth-config {
      scope = "default"
    }
```

For context, here's where this sits among your other `ADDITIONAL_CONFIG_*` variables:

```yaml
spec:
  strategy:
    $patch: replace
    type: Recreate
  template:
    spec:
      containers:
        - name: validator-app
          env:
            - name: ADDITIONAL_CONFIG_GLOBAL_DOMAIN_UPGRADE_DUMP_PATH
              value: canton.validator-apps.validator_backend.domain-migration-dump-path = "/domain-upgrade-dump/domain_migration_dump.json"
            
            - name: ADDITIONAL_CONFIG_OAUTH_SCOPE
              value: |
                canton.validator-apps.validator_backend.participant-client.ledger-api.auth-config {
                  scope = "default"
                }
```

### Deployment Strategy Note

Also consider adding the `Recreate` deployment strategy to ensure clean pod restarts:

```yaml
spec:
  strategy:
    $patch: replace
    type: Recreate
```