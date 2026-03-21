---
layout: post
title: Fixing Canton Validator OAuth2 Authentication Errors
category: blog
tags:
- canton
- blockchain
- oauth
published: false
name: canton-oauth-fix
thumb: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
image: https://unsplash.com/photos/_mX0sSpVbOg/download?w=437
---

Onboarding a **Canton validator** to **devnet, testnet, or mainnet** can be challenging. One error that kept me stuck was integrating OAuth2 with the Canton node—specifically, the missing `access_token` error.<!-- truncate_here -->

Onboarding a **Canton validator** to **devnet, testnet, or mainnet** can be challenging. One error that kept me stuck was integrating OAuth2 with the Canton node—specifically, the missing `access_token` error.

## Background

Canton is a privacy-enabled blockchain network. Unlike public blockchains, only authorized parties can read ledger data. To interact with Canton, you deploy a participant node and a validator node.

The issue I hit was the validator failing to authenticate with this error: 

```json
{
  "@timestamp": "2026-03-19T13:02:49.744Z",
  "message": "Token refresh failed",
  "logger_name": "AuthTokenManager:validator=validator_backend",
  "level": "WARN",
  "stack_trace": "spray.json.DeserializationException: Object is missing required member 'access_token'"
}
```

## The Problem

OAuth2 requires a bearer token in request headers. How you get that token is up to you. We use Okta as our identity provider with `client_credentials` grant type for machine-to-machine auth.

First, verify you can get a token from your OAuth provider: 

```bash
curl -X POST https://yourorg.okta.com/oauth2/{auth_server}/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "audience=YOUR_AUDIENCE" \
  -d "grant_type=client_credentials" \
  -d "scope=default"
```

Get these values from your Okta admin. You should see a response like:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleTEifQ...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "default"
}
```

## The Fix

### 1. Extract the Sub Field

The JWT contains a `sub` (subject) claim that identifies the client. Canton needs this for authentication. Decode the token:

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
  "iss": "https://******.oktapreview.com/oauth2/aus***********8",
  "scope": "default"
}
```

Use the `sub` value in your validator's Kubernetes configuration:

```yaml
- name: LEDGER_API_ADMIN_USER
  value: "0abc123def456ghi789@clients"  # Your sub field

- name: VALIDATOR_AUTH_CLIENT_ID
  value: "0abc123def456ghi789@clients"  # Your sub field

- name: LEDGER_API_AUTH_AUDIENCE
  value: "YOUR_AUDIENCE"

- name: VALIDATOR_AUTH_AUDIENCE
  value: "YOUR_AUDIENCE"
```

### 2. Add Default Scope

This was the missing piece. Canton's OAuth client needs the scope explicitly configured:

```yaml
- name: ADDITIONAL_CONFIG_OAUTH_SCOPE
  value: |
    canton.validator-apps.validator_backend.participant-client.ledger-api.auth-config {
      scope = "default"
    }
```

Here's the full configuration in context:

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

### 3. Grant User Rights

After the validator is onboarded, grant it ledger access rights via the Canton Ledger API:

```bash
POST /v2/users/<SUB_FIELD>/rights
```

Request body:

```json
{
  "identityProviderId": "",
  "userId": "0abc123def456ghi789@clients",
  "rights": [
    {
      "kind": {
        "CanActAs": {
          "value": {
            "party": "YourPartyId::122028c637.."
          }
        }
      }
    },
    {
      "kind": {
        "CanReadAs": {
          "value": {
            "party": "YourPartyId::122028c637.."
          }
        }
      }
    },
    {
      "kind": {
        "CanReadAsAnyParty": {
          "value": {}
        }
      }
    }
  ]
}
```

## Summary

The missing `access_token` error happens when Canton's OAuth scope isn't explicitly configured. The fix:

1. Extract the `sub` field from your JWT
2. Add it to `LEDGER_API_ADMIN_USER` and `VALIDATOR_AUTH_CLIENT_ID`
3. Set `scope = "default"` in the `ADDITIONAL_CONFIG_OAUTH_SCOPE` variable
4. Grant the validator proper ledger rights after onboarding

This resolved the authentication issue and got my validator connecting properly.
