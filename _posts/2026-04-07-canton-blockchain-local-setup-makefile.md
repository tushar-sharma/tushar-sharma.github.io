---
layout: post
title: "Building and Testing Canton Smart Contracts Locally: A Makefile-Driven Workflow"
tags: [blockchain, canton, daml, smart-contracts, makefile, tutorial]
author: tushar sharma
category: blog
published: false
image: https://unsplash.com/photos/JrjhtBJ-pGU/download?w=437
thumb: https://unsplash.com/photos/JrjhtBJ-pGU/download?w=437
---

### Why Test Locally?

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

```daml
module Main where

template Asset
  with
    owner : Party
    name : Text
    value : Decimal
  where
    signatory owner

    choice Transfer : ContractId Asset
      with
        newOwner : Party
      controller owner
      do
        create this with owner = newOwner
```

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

```makefile
.PHONY: build sandbox test clean start help

build:
    @echo "Building DAML project..."
    @daml build
    @echo "Build complete!"

sandbox:
    @if ! ls .daml/dist/*.dar >/dev/null 2>&1; then \
        echo "No DAR found. Run 'make build' first."; \
        exit 1; \
    fi
    @echo "Starting Canton Sandbox + JSON API..."
    @echo "Ledger API: localhost:6865"
    @echo "JSON API: localhost:7575"
    @daml start --sandbox-port 6865 --json-api-port 7575

test:
    @echo "Running DAML tests..."
    @daml test

clean:
    @echo "Cleaning build artifacts..."
    @rm -rf .daml/dist
    @echo "Clean complete!"

start: build sandbox

help:
    @echo "DAML Project Commands:"
    @echo "  make build    - Build the DAR file"
    @echo "  make start    - Build and start Sandbox + JSON API"
    @echo "  make test     - Run DAML tests"
    @echo "  make clean    - Remove build artifacts"
```

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
```json
[+] ledger ok (SERVING)
readyz check passed
```

Check the version:

```bash
curl http://localhost:7575/v2/version
```

You'll get detailed ledger capabilities. If both curl commands succeed, your sandbox is live.
