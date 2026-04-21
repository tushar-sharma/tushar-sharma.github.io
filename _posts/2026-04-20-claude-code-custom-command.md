---
layout: post
title: "Claude Code Custom Command: Import JVM Certificates"
image: https://unsplash.com/photos/g0rjkxS5SF8/download?w=437
thumb: https://unsplash.com/photos/g0rjkxS5SF8/download?w=437
author: tushar sharma
tags: 
 - claude
 - ai
category: blog
published: true
---

One of the most powerful features in Claude Code is the ability to create **custom slash commands**. Instead of repeatedly typing long or error-prone commands, you can encapsulate workflows into a reusable command.<!-- truncate_here -->

One of the most powerful features in Claude Code is the ability to create **custom slash commands**. Instead of repeatedly typing long or error-prone commands, you can encapsulate workflows into a reusable command.


If you work with Java-based systems, you’ve likely had to import certificates into the JVM truststore using `keytool`. This process usually involves:
- `sudo` access
- remembering long commands
- manually verifying results

This is exactly the kind of repetitive task that benefits from automation.

---

## Understanding `askpass` (The Key Concept)

Normally, `sudo` requires a password entered through a terminal (TTY). But tools like Claude Code don’t always run in an interactive terminal environment.

This is where **`SUDO_ASKPASS`** comes in.

### What is Askpass?

`askpass` is a helper mechanism that allows `sudo` to retrieve a password programmatically instead of prompting the user interactively.

When you run:

```bash
sudo -A <command>
```

- `-A` tells `sudo` to use the `askpass` program
- `SUDO_ASKPASS` defines which script to run
- That script outputs the password

---

## Step 1: Create an Askpass Script

Create a secure script that returns your password:


<div style="display:none;" markdown="1">
mkdir -p ~/bin
cat > ~/bin/askpass.sh << 'EOF'
#!/bin/bash
echo "YOUR_PASSWORD_HERE"
EOF
chmod 700 ~/bin/askpass.sh
</div>

{% template  customCode.html %}
---
id: 5ce7b9af79ef69ce7ddd83d1853aa528
file: askpass.sh
---
{% endtemplate %}


### ⚠️ Security Note
- Replace `YOUR_PASSWORD_HERE` with your actual password
- `chmod 700` ensures only your user can access it
- Avoid committing this file to version control

---

## Step 2: Export the Environment Variable

Add this to your shell configuration (`.zshrc` or `.bashrc`):

```bash
export SUDO_ASKPASS="$HOME/bin/askpass.sh"
```

---

## Step 3: Configure Claude Code

Update your Claude settings:

`~/.claude/settings.json`



<div style="display:none;" markdown="1">
{
  "env": {
    "SUDO_ASKPASS": "/Users/YOUR_USERNAME/bin/askpass.sh"
  },
  "permissions": {
    "allow": [
      "Bash(sudo -A keytool --import *)",
      "Bash(echo $JAVA_HOME)"
    ]
  }
}
</div>

{% template  customCode.html %}
---
id: 5ce7b9af79ef69ce7ddd83d1853aa528
file: askpass.json
---
{% endtemplate %}


### Why permissions matter
Claude requires explicit permission for commands involving `sudo`. This keeps execution controlled and predictable.

---

## Step 4: Create the `/import-cert` Command

Now we define a reusable workflow.

Create:

`~/.claude/commands/import-cert.md`

<div style="display:none;" markdown="1">
Import a certificate into JVM truststore

Ask me for:
1. alias (e.g. nexus)
2. cert_file (path to .crt or .pem)

Steps:
1. Run `echo $JAVA_HOME`
2. Then execute:

sudo -A keytool --import \
  -alias <alias> \
  -file <cert_file> \
  -keystore <resolved_path>/lib/security/cacerts \
  -storepass changeit \
  -noprompt

Finally, remind me to verify:

keytool --list -keystore <resolved_path>/lib/security/cacerts | grep <alias>
</div>

{% template  customCode.html %}
---
id: 5ce7b9af79ef69ce7ddd83d1853aa528
file: cert.md
---
{% endtemplate %}


Restart Claude Code after creating this file.

---

## Step 5: Make It Discoverable

Add this to your project’s `CLAUDE.md`:

<div style="display:none;" markdown="1">
## Available Workflows

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| /import-cert   | Import a certificate into JVM truststore         |
</div>

{% template  customCode.html %}
---
id: 5ce7b9af79ef69ce7ddd83d1853aa528
file: cert2.md
---
{% endtemplate %}

---

## Optional Improvements

- Use a password manager instead of hardcoding credentials
- Add logging for auditability
- Parameterize truststore path for multi-JDK setups


