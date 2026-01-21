---
layout: post
title: Setting up Claude Code with AWS Bedrock and SSO Authentication
image: https://unsplash.com/photos/B3y-Uz9DLS0/download?w=437
thumb: https://unsplash.com/photos/B3y-Uz9DLS0/download?w=437
author: tushar sharma
category: blog
tags:
 - ai
 - claude
 - aws
 - cli
---

Install Claude Code quickly and configure it with SSO and AWS Bedrock.<!-- truncate_here -->

Install Claude Code quickly and configure it with SSO and AWS Bedrock.

## Prerequisites

Before starting, ensure you have:

- AWS CLI installed and configured
- Node.js (version 16 or higher)
- An AWS account with Bedrock access
- Access to your organization's SSO/Okta configuration
- Appropriate permissions to invoke Claude models in Bedrock

## Installation

Install Claude Code using the official installation script:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

After installation, verify it's working by running:

```bash
claude --version
```

## Configuration

Create a configuration file at `~/.claude/settings.json` to customize Claude Code's behavior:

{% template  customCode.html %}
---
id: 174307115d1e04e103acde93bd56ffb3
file: settings.json 
---
{% endtemplate %}

### Configuration Options Explained

- **CLAUDE_CODE_USE_BEDROCK**: Enables AWS Bedrock as the model provider
- **AWS_REGION**: Specifies the AWS region for Bedrock API calls (ensure your chosen models are available in this region)
- **CLAUDE_CODE_ENABLE_TELEMETRY**: Disables telemetry collection for privacy
- **ANTHROPIC_MODEL**: The primary Claude model ID as it appears in AWS Bedrock
- **ANTHROPIC_SMALL_FAST_MODEL**: A faster Haiku model for quick operations and lightweight tasks
- **AWS_PROFILE**: The AWS profile to use for authentication (typically "default")
- **CLAUDE_CODE_MAX_OUTPUT_TOKENS**: Sets maximum tokens for model responses
- **MAX_THINKING_TOKENS**: Limits tokens used for internal reasoning

> **Important**: When using Bedrock, you must use the exact model IDs as they appear in your AWS Bedrock console. Model availability varies by AWS region and account permissions. Verify these models are accessible in your AWS account before using them.

## SSO Authentication Setup

For enterprise environments using SSO (like Okta), you'll need to authenticate to get temporary AWS credentials. Use a command similar to this, replacing the placeholders with your organization's specific values:

{% template  customCode.html %}
---
id: 174307115d1e04e103acde93bd56ffb3
file: okta.sh 
---
{% endtemplate %}

> **Note**: Replace `your-org.okta.com`, `YOUR_OIDC_CLIENT_ID`, and `YOUR_AWS_FEDERATION_APP_ID` with your organization's actual values. Contact your IT administrator if you don't have these details.

The `--session-duration 36000` parameter sets the session to last for 10 hours, reducing the need for frequent re-authentication.

## Usage

Once configured and authenticated, start Claude Code by simply running:

```bash
claude
```

This will open an interactive session where you can chat with Claude, execute code, and perform various development tasks.

## Troubleshooting

### Self-Signed Certificate Issues

If you encounter SSL certificate errors like:

```bash
platform.claude.com: SELF_SIGNED_CERT_IN_CHAIN
```

This typically occurs in corporate environments with SSL inspection. You can temporarily bypass this by setting:

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

> **Security Warning**: Only use this workaround in trusted corporate environments. It disables SSL certificate verification and should not be used in production or untrusted networks.
