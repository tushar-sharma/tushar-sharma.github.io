---
layout: post
title: Setting up Claude Code with AWS Bedrock and SSO Authentication
image: https://images.unsplash.com/photo-1555949963-ff9fe472c8f1?w=437
thumb: https://images.unsplash.com/photo-1555949963-ff9fe472c8f1?w=437
author:
category: blog
tags:
 - ai
 - claude
 - aws
 - developmentcl
 - cli
published: false
---

<!-- truncate_here -->

Claude Code is Anthropic's official CLI tool that provides a powerful interface for interacting with Claude AI models. This guide walks through setting up Claude Code to work with AWS Bedrock and enterprise SSO authentication.

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

```json
{
  "env": {
    "CLAUDE_CODE_USE_BEDROCK": "1",
    "AWS_REGION": "us-east-1",
    "CLAUDE_CODE_ENABLE_TELEMETRY": "0",
    "DISABLE_TELEMETRY": "1",
    "ANTHROPIC_MODEL": "us.anthropic.claude-sonnet-4-20250514-v1:0",
    "AWS_PROFILE": "default",
    "ANTHROPIC_SMALL_FAST_MODEL": "us.anthropic.claude-3-5-haiku-20241022-v1:0",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "30000",
    "MAX_THINKING_TOKENS": "5000"
  }
}
```

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

```bash
okta-aws-cli \
  --org-domain your-org.okta.com \
  --oidc-client-id YOUR_OIDC_CLIENT_ID \
  --aws-acct-fed-app-id YOUR_AWS_FEDERATION_APP_ID \
  --open-browser \
  --session-duration 36000
```

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

```
platform.claude.com: SELF_SIGNED_CERT_IN_CHAIN
```

This typically occurs in corporate environments with SSL inspection. You can temporarily bypass this by setting:

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

> **Security Warning**: Only use this workaround in trusted corporate environments. It disables SSL certificate verification and should not be used in production or untrusted networks.

### Authentication Problems

- Ensure your AWS credentials are valid and haven't expired
- Verify you have the necessary permissions to invoke Bedrock models
- Check that your organization's SSO configuration allows API access

### Model Access Issues

- Confirm your AWS account has access to the specified Claude models in Bedrock
- Verify the model IDs in your configuration match exactly what's shown in your AWS Bedrock console
- Check AWS Bedrock service availability in your configured region
- Ensure you have the necessary IAM permissions to invoke the specific model versions

## Next Steps

With Claude Code set up, you can:

- Use it as an AI-powered coding assistant
- Integrate it into your development workflow
- Explore advanced features like plugins and custom configurations
- Set up team-wide configurations for consistent usage

For more advanced usage and configuration options, refer to the [official Claude Code documentation](https://claude.ai/claude-code).

## Conclusion

Claude Code provides a powerful command-line interface for leveraging Claude's capabilities in your development workflow. By configuring it with AWS Bedrock and proper authentication, you can securely access Claude's advanced reasoning and coding assistance within your organization's infrastructure. 
