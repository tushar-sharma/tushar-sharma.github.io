## Global Cluade.md file

Global persistent configuration file for Claude Code

```bash
~/.claude/CLAUDE.md
```

## Split instructions into multiple files

```bash
# Main CLAUDE.md

@~/.claude/wsl2-environment.md
@~/.claude/code-standards.md
@~/.claude/security-requirements.md
```

## Authentication

```
export ANTHROPIC_API_KEY="your-api-key"

# or okta
okta-aws-cli --org-domain company.okta.com --oidc-client-id 123456789 --aws-acct-fed-app-id 123456789 --open-browser -z --session-duration 36000
```

## Environment Varibales

```
# Disables telemetry, error reporting, and auto-updates
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
```