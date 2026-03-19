---
published: false
---

# Canton Validator OAuth Authentication Error: Missing access_token Fix

**Last Updated:** March 19, 2026  
**Tags:** #canton #blockchain #oauth #kubernetes #troubleshooting #daml

## Problem Summary

Canton Network validator applications may fail to authenticate with OAuth providers, causing circuit breaker failures and preventing command submissions. This guide explains how to fix the "Object is missing required member 'access_token'" error in Canton validator deployments.

---

## Error Symptoms

### Primary Error Message

```json
{
  "@timestamp": "2026-03-19T13:02:49.744Z",
  "message": "Token refresh failed",
  "logger_name": "AuthTokenManager:validator=validator_backend",
  "level": "WARN",
  "stack_trace": "spray.json.DeserializationException: Object is missing required member 'access_token'"
}
```

### Related Error Messages

```json
{
  "message": "Acquiring auth token failed with an unknown exception, not retrying",
  "stack_trace": "spray.json.DeserializationException: Object is missing required member 'access_token'
    at spray.json.package$.deserializationError(package.scala:23)
    at spray.json.ProductFormats.fromField(ProductFormats.scala:61)
    Caused by: java.util.NoSuchElementException: key not found: access_token"
}
```

```json
{
  "message": "Command submission aborted by circuit breaker due to too many successive failures, next attempt in 30s",
  "logger_name": "ValidatorLicenseActivityTrigger:validator=validator_backend",
  "level": "INFO"
}
```

### Affected Components

- **AuthTokenManager**: Token refresh fails
- **DomainIngestionService**: Periodic task processing fails
- **UpdateIngestionService**: Ledger ingestion subscription fails
- **ValidatorLicenseActivityTrigger**: Command submissions blocked by circuit breaker

---

## Root Cause

The Canton validator backend is missing the OAuth scope configuration in the ledger API authentication settings. Without the proper scope configuration, the OAuth token endpoint returns responses that cannot be properly deserialized, resulting in the missing `access_token` field error.

---

## Solution

Add the `ADDITIONAL_CONFIG_OAUTH_SCOPE` environment variable to your Kubernetes deployment manifest to configure the OAuth scope for the Canton validator's ledger API authentication.

### Configuration Fix

Add this configuration block to your `deployment-update.yaml` or equivalent manifest file:

```yaml
- name: ADDITIONAL_CONFIG_OAUTH_SCOPE
  value: |
    canton.validator-apps.validator_backend.participant-client.ledger-api.auth-config {
      scope = "default"
    }
```

### Complete Example Context

Place this configuration alongside other `ADDITIONAL_CONFIG_*` environment variables:

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
            # ... other environment variables ...
            
            - name: ADDITIONAL_CONFIG_GLOBAL_DOMAIN_UPGRADE_DUMP_PATH
              value: canton.validator-apps.validator_backend.domain-migration-dump-path = "/domain-upgrade-dump/domain_migration_dump.json"
            
            - name: ADDITIONAL_CONFIG_OAUTH_SCOPE
              value: |
                canton.validator-apps.validator_backend.participant-client.ledger-api.auth-config {
                  scope = "default"
                }
            
            - name: ADDITIONAL_CONFIG_DISABLE_WALLET
              value: |
                canton.validator-apps.validator_backend {
                  enable-wallet = false
                }
```

### Deployment Strategy Recommendation

Also consider adding the `Recreate` deployment strategy to ensure clean pod restarts:

```yaml
spec:
  strategy:
    $patch: replace
    type: Recreate
```

This ensures the old pod is fully terminated before the new one starts, preventing potential state conflicts.

---

## Implementation Steps

1. **Update your deployment manifest** with the OAuth scope configuration
2. **Apply the changes** to your Kubernetes cluster:
   ```bash
   kubectl apply -k devops/[environment]/k8s/
   ```
3. **Restart the validator pods** to pick up the new configuration:
   ```bash
   kubectl rollout restart deployment/validator-deploy -n [namespace]
   ```
4. **Verify the fix** by checking the logs:
   ```bash
   kubectl logs -f deployment/validator-deploy -n [namespace] | grep -i "auth\|token"
   ```

---

## Verification

After applying the fix, you should see:

✅ No more `DeserializationException` errors for missing `access_token`  
✅ Successful OAuth token acquisition  
✅ Circuit breaker no longer blocking command submissions  
✅ Domain ingestion service processing normally  
✅ Validator license activity trigger working without retries  

---

## Related Configuration

### OAuth Environment Variables

Ensure these OAuth-related secrets are properly configured:

- `SPLICE_APP_VALIDATOR_LEDGER_API_AUTH_URL` - OAuth well-known URL
- `SPLICE_APP_VALIDATOR_LEDGER_API_AUTH_CLIENT_ID` - OAuth client ID
- `SPLICE_APP_VALIDATOR_LEDGER_API_AUTH_CLIENT_SECRET` - OAuth client secret
- `SPLICE_APP_VALIDATOR_LEDGER_API_AUTH_AUDIENCE` - OAuth audience

### Additional Validator Configuration

Other common validator configurations:

```yaml
# BFT Scan Client Configuration
- name: ADDITIONAL_CONFIG_BFT_SCAN
  value: |
    canton.validator-apps.validator_backend.scan-client.type = "bft"
    canton.validator-apps.validator_backend.scan-client.seed-urls = [ "https://scan.example.com" ]

# Migration ID
- name: ADDITIONAL_CONFIG_MIGRATION_ID
  value: |
    canton.validator-apps.validator_backend {
      domain-migration-id = ${MIGRATION_ID}
    }

# Disable Wallet (if not needed)
- name: ADDITIONAL_CONFIG_DISABLE_WALLET
  value: |
    canton.validator-apps.validator_backend {
      enable-wallet = false
    }
```

---

## Troubleshooting Tips

### If the error persists after applying the fix:

1. **Check OAuth credentials**: Verify that client ID and secret are correct
2. **Verify OAuth endpoint**: Ensure the auth URL is reachable from the pod
3. **Check network policies**: Ensure the validator can reach the OAuth provider
4. **Review secrets**: Confirm all required secrets are present in Kubernetes
5. **Check OAuth provider logs**: Look for errors on the authentication server side

### Common Related Errors

- **Circuit breaker failures**: Usually a symptom of authentication issues
- **Command submission timeouts**: Can be caused by authentication problems
- **Ledger API connection failures**: Check participant service connectivity

---

## Keywords

Canton blockchain, Canton Network validator, OAuth authentication error, Daml ledger, spray.json DeserializationException, access_token missing, Kubernetes deployment, Canton validator configuration, ledger-api auth-config, circuit breaker error, Canton troubleshooting, Digital Asset Canton, validator authentication fix

---

## Additional Resources

- [Canton Documentation](https://docs.canton.network/)
- [Canton Network Architecture](https://docs.canton.network/concepts/architecture/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Kubernetes Deployment Strategies](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#strategy)

---

## Changelog

- **2026-03-19**: Initial documentation - OAuth scope configuration fix for Canton validator authentication error
