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

How to test Canton ledger locally? 

```bash 
❯ mkdir -p testContract

# initialize
❯ daml init 
# This creates:
# my-canton-project/
# ├── daml.yaml         # Project configuration
# └── daml/
#     └── Main.daml     # Smart contract code (empty by default)


❯ mkdir daml

cat > daml/Main.daml <<EOF
module Main where

-- Simple asset template
template Asset
  with
    owner : Party
    name : Text
    value : Decimal
  where
    signatory owner

    -- Allow owner to transfer asset to someone else
    choice Transfer : ContractId Asset
      with
        newOwner : Party
      controller owner
      do
        create this with owner = newOwner
EOF

```
Template Asset: Defines an asset with owner, name, and value

signatory owner: Only the owner can create this contract

choice Transfer: Allows owner to transfer asset to a new owner

```bash
❯ daml build
WARNING: Daml Assistant has been deprecated and replaced with the Digital Asset Package Manager (DPM)
See installation here: https://docs.digitalasset.com/build/3.4/dpm/dpm.html
Daml Assistant will be removed in 3.5
You can disable this warning with --no-legacy-assistant-warning

Running single package build of testContract as no multi-package.yaml was found.

2026-04-07 20:17:40.51 [INFO]  [build]
Compiling testContract to a DAR.

2026-04-07 20:17:41.33 [INFO]  [build]
Created .daml/dist/testContract-1.0.0.dar

❯ ls -la .daml/dist
total 704
-rw-r--r--  1 xxx  xxx  359713 Apr  7 16:17 testContract-1.0.0.dar

```

AML ARchive - like a JAR file for DAML

Contains compiled smart contracts

lets create a makefile

```
.PHONY: build
build:
	@echo "Building DAML project..."
	@daml build
	@echo "Build complete!"

.PHONY: sandbox
sandbox:
	@if ! ls .daml/dist/*.dar >/dev/null 2>&1; then \
		echo "No DAR found. Run 'make build' first."; \
		exit 1; \
	fi
	@echo "Starting Canton Sandbox + JSON API..."
	@echo "Ledger API: localhost:6865"
	@echo "JSON API: localhost:7575"
	@daml start --sandbox-port 6865 --json-api-port 7575

.PHONY: test
test:
	@echo "Running DAML tests..."
	@daml test

.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf .daml/dist
	@echo "Clean complete!"

.PHONY: start
start:
	@echo "Starting DAML sandbox + JSON API..."
	@echo "Ledger API: localhost:6865"
	@echo "JSON API: localhost:7575"
	@daml start --sandbox-port 6865 --json-api-port 7575

.PHONY: help
help:
	@echo "DAML Project Commands:"
	@echo "  make build    - Build the DAR file"
	@echo "  make sandbox  - Start Canton Sandbox only"
	@echo "  make start    - Start Sandbox + JSON API"
	@echo "  make test     - Run DAML tests"
	@echo "  make clean    - Remove build artifacts"

```

```bash
make build
make sandbox
```

Test it : 

```
❯ curl  http://localhost:7575/readyz
[+] ledger ok (SERVING)
readyz check passed


❯ curl  http://localhost:7575/v2/version
{"version":"3.4.11","features":{"experimental":{"staticTime":{"supported":false},"commandInspectionService":{"supported":true}},"userManagement":{"supported":true,"maxRightsPerUser":1000,"maxUsersPageSize":1000},"partyManagement":{"maxPartiesPageSize":10000},"offsetCheckpoint":{"maxOffsetCheckpointEmissionDelay":{"seconds":75,"nanos":0,"unknownFields":{"fields":{}}}},"packageFeature":{"maxVettedPackagesPageSize":100}}}%
```