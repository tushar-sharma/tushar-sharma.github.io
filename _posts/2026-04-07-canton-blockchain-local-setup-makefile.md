---
layout: post
title: "Building and Testing Canton Smart Contracts Locally"
tags: [blockchain, canton, daml, makefile]
author: tushar sharma
category: blog
image: https://unsplash.com/photos/eSJSmF5y15U/download?w=437
thumb: https://unsplash.com/photos/eSJSmF5y15U/download?w=437
---

Building on Canton requires fast feedback loops. Testing locally before deploying to a testnet saves time and costs. This guide walks through a complete workflow: create a contract, build it, spin up a sandbox, and verify it works via the JSON API.<!-- truncate_here -->

Building on Canton requires fast feedback loops. Testing locally before deploying to a testnet saves time and costs. This guide walks through a complete workflow: create a contract, build it, spin up a sandbox, and verify it works via the JSON API.

## Step 1: Initialize Your Project

```bash
mkdir -p testContract
cd testContract
daml init
```

This creates the boilerplate:
```
testContract/
├── daml.yaml         # Project metadata
└── daml/
    └── Main.daml     # Smart contract code
```

## Step 2: Write a Simple Asset Contract

Create `daml/Main.daml`:

{% template  customCode.html %}
---
id: 9913b68c100405cd70c77baaa4333f9f
file: Main.daml
---
{% endtemplate %}

**What this does:**
- **Template Asset**: Represents an asset with owner, name, and value
- **signatory owner**: Only the owner can authorize contract creation
- **choice Transfer**: Lets the owner transfer the asset to someone else

## Step 3: Build the Contract

```bash
daml build
```

Output:
```
2026-04-07 20:17:41.33 [INFO] [build]
Created .daml/dist/testContract-1.0.0.dar
```

The `.dar` file (DAML ARchive) is like a JAR—it bundles your compiled smart contract.

## Step 4: Automate with a Makefile

Create a `Makefile` at the project root:

{% template  customCode.html %}
---
id: 9913b68c100405cd70c77baaa4333f9f
file: Makefile
---
{% endtemplate %}

## Step 5: Run the Sandbox

```bash
make start
```

This builds your contract and spins up:
- **Ledger API** on `localhost:6865`
- **JSON API** on `localhost:7575`

## Step 6: Verify It Works

Test the JSON API health check:

```bash
curl http://localhost:7575/readyz
```

Response:

```bash
[+] ledger ok (SERVING)
readyz check passed
```

Check the version:

```bash
curl http://localhost:7575/v2/version
```

You'll get detailed ledger capabilities. If both curl commands succeed, your sandbox is live.
