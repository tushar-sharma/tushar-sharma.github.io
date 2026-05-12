---
layout: post
title: "Running a Local Multi-Node Canton Sandbox"
category: blog
tags:
- canton
- daml
- blockchain
author: tushar sharma
image: 'https://unsplash.com/photos/tQagUWpAx5k/download?w=437'
thumb: 'https://unsplash.com/photos/tQagUWpAx5k/download?w=437'
skipImage: true
---

A single local Canton sandbox is good for fast contract development. It gives you one participant, one Ledger API, one JSON API, and a simple place to upload DAR files. But it does not help much when you want to reason about distributed behavior: two participants, party hosting, package vetting on more than one participant, and the role of a synchronizer.<!-- truncate_here -->

A single local Canton sandbox is good for fast contract development. It gives you one participant, one Ledger API, one JSON API, and a simple place to upload DAR files. But it does not help much when you want to reason about distributed behavior: two participants, party hosting, package vetting on more than one participant, and the role of a synchronizer.

This tutorial builds a local two-participant Canton sandbox from scratch. The goal is not to reproduce a production Canton Network deployment. The goal is to create a small, deterministic development environment that helps you understand the moving pieces and test multi-participant behavior locally.

By the end, you will be able to run:

```bash
make sandbox-multinode
```

and get:

```text
participant1 Ledger API: localhost:6865
participant1 JSON API:   http://localhost:7575

participant2 Ledger API: localhost:6875
participant2 JSON API:   http://localhost:7576

local synchronizer: sequencer + mediator
```

You will also have a smoke test:

```bash
make sandbox-multinode-smoke
```

that verifies both participants are up and both have the expected DAR packages available.

---

## What We Are Building

The local topology looks like this:

```text
                    local synchronizer
                 +---------------------+
                 | sequencer + mediator |
                 +----------+----------+
                            |
              +-------------+-------------+
              |                           |
       +-------------+             +-------------+
       | participant1 |             | participant2 |
       | Ledger 6865  |             | Ledger 6875  |
       | JSON   7575  |             | JSON   7576  |
       +-------------+             +-------------+
```

There are three important points:

1. `participant1` and `participant2` are distinct Canton participant nodes.
2. Both participants connect to the same local synchronizer.
3. Both participants receive the same DAR uploads.

The existing single-node sandbox remains useful. It is still the fastest path when you only need one participant:

```bash
make sandbox
```

The multi-node target is for a different use case: testing distributed assumptions.

---

## The Concepts

Before writing any files, it helps to separate the Canton concepts.

### Participant

A participant is the Canton node that applications connect to. It exposes the Ledger API and, in this setup, the JSON API. It hosts parties, stores the private ledger state visible to those parties, validates submissions, and participates in the Canton protocol.

If you run an application that submits Daml commands, it normally talks to a participant.

### Party

A party is a Daml identity. Contracts are not hosted by random machines; they are visible to parties based on signatories, observers, controllers, and stakeholders.

A participant can host one or more parties. A party can also be hosted on more than one participant, which is the basis for party replication and migration scenarios.

### DAR

A DAR is a Daml Archive. It packages compiled Daml code and dependencies. A participant cannot use your templates unless the relevant DAR packages are uploaded and vetted.

In a one-node sandbox, the `daml sandbox --dar ...` shortcut hides much of this. In a multi-node setup, it is better to make the upload explicit.

### Synchronizer

A synchronizer coordinates participants. It gives participants a shared ordering and transaction coordination mechanism without making all contract data public.

In a local development setup, the synchronizer is usually represented by:

- a sequencer
- a mediator

The sequencer handles ordered communication. The mediator participates in transaction confirmation and conflict resolution.

The official Canton docs describe a synchronizer as providing sequencing and mediating for independent participant nodes:

```text
https://docs.digitalasset.com/subnet/3.4/overview/index.html
```

### Validator

In Canton Network or DevNet discussions, the word "validator" often refers to an application or deployment bundle around a Canton participant. It may automate onboarding, wallet behavior, party management, DAR upload, or network connection tasks.

For this local tutorial, we do not need a separate validator app. We only need:

```text
participant1
participant2
sequencer1
mediator1
```

The bootstrap script below does the small amount of setup that a larger environment might automate elsewhere.

### Canton Console Script

Files ending in `.canton` are Canton console scripts. The Canton console is Scala-based. The official docs describe it as a REPL where commands must be valid Scala:

```text
https://docs.digitalasset.com/operate/3.4/howtos/operate/console/console.html
```

That is why the bootstrap file looks like Scala:

```scala
val synchronizerName = "local-multinode"
participant1.synchronizers.connect_local(sequencer1, synchronizerName)
```

---

## Prerequisites

This tutorial assumes:

- You have a Daml project that can produce one or more `.dar` files.
- You have Daml SDK 3.4.x installed.
- You have `dpm`, `jq`, `curl`, `make`, and Java available.
- Your repository has a `versions.yaml` file containing the SDK version.
- Your built DARs are copied to a `dist/` directory.

Example `versions.yaml`:

```yaml
sdk_version: "3.4.10"
```

Example output after building:

```text
dist/
|-- app-1.0.0.dar
|-- enumerations-1.0.0.dar
`-- models-v2-1.0.0.dar
```

The exact DAR names do not matter. The Makefile target below uploads every `dist/*.dar`.

---

## Step 1: Keep the Single-Node Sandbox

Do not replace the simple sandbox target. Keep it for the common case.

```make
.PHONY: sandbox
sandbox:
	@echo "Starting Canton Sandbox + JSON API with your contracts..."
	@if [ ! -d "$(DIST_DIR)" ] || [ -z "$$(ls -A $(DIST_DIR)/*.dar 2>/dev/null)" ]; then \
		echo "Error: No DARs found in $(DIST_DIR)/. Run 'make build-all' first."; \
		exit 1; \
	fi
	@echo "Loading DARs from $(DIST_DIR)/:"
	@ls -1 $(DIST_DIR)/*.dar
	@echo ""
	@echo "Ledger API (gRPC): localhost:6865"
	@echo "JSON API (HTTP):   http://localhost:7575/readyz"
	@echo "                   http://localhost:7575/v2/parties"
	@echo "                   http://localhost:7575/v2/packages"
	@echo ""
	@daml sandbox --port 6865 --json-api-port 7575 $$(ls $(DIST_DIR)/*.dar | sed 's/^/--dar /')
```

This remains one participant. It is still the right tool when you only need to test contract logic quickly.

---

## Step 2: Add a Multi-Node Canton Config

Create:

```text
canton/multinode-sandbox.conf
```

with:

```hocon
canton {
  mediators {
    mediator1 {
      admin-api {
        port = 6889
      }
    }
  }

  participants {
    participant1 {
      admin-api {
        port = 6866
      }
      http-ledger-api {
        port = 7575
      }
      ledger-api {
        port = 6865
        user-management-service {
          enabled = true
        }
      }
      storage {
        type = "memory"
      }
    }

    participant2 {
      admin-api {
        port = 6876
      }
      http-ledger-api {
        port = 7576
      }
      ledger-api {
        port = 6875
        user-management-service {
          enabled = true
        }
      }
      storage {
        type = "memory"
      }
    }
  }

  sequencers {
    sequencer1 {
      admin-api {
        port = 6888
      }
      public-api {
        port = 6887
      }
      sequencer {
        type = "reference"
        config {
          storage {
            type = "memory"
          }
        }
      }
      storage {
        type = "memory"
      }
    }
  }
}
```

This file defines the nodes and ports. It does not yet connect participants to the synchronizer or upload DARs.

The storage is intentionally in-memory. That makes startup clean and repeatable. Every restart gives you a fresh local network.

The ports are chosen so the first participant matches the existing sandbox:

| Node | Ledger API | JSON API | Admin API |
|---|---:|---:|---:|
| participant1 | 6865 | 7575 | 6866 |
| participant2 | 6875 | 7576 | 6876 |

The local synchronizer uses:

| Node | Public API | Admin API |
|---|---:|---:|
| sequencer1 | 6887 | 6888 |
| mediator1 | n/a | 6889 |

Important: `sandbox-multinode` and `sandbox` both use participant1 ports `6865` and `7575`. Do not run them at the same time.

---

## Step 3: Add the Bootstrap Script

Create:

```text
canton/multinode-bootstrap.canton
```

with:

```scala
import com.digitalasset.canton.config.RequireTypes.PositiveInt
import com.digitalasset.canton.version.ProtocolVersion
import java.io.File

val synchronizerName = "local-multinode"
val staticSynchronizerParameters = StaticSynchronizerParameters.defaults(
  sequencer1.config.crypto,
  ProtocolVersion.forSynchronizer,
  topologyChangeDelay = NonNegativeFiniteDuration.Zero
)
val synchronizerOwners = Seq(sequencer1, mediator1)

bootstrap.synchronizer(
  synchronizerName,
  Seq(sequencer1),
  Seq(mediator1),
  synchronizerOwners,
  PositiveInt.one,
  staticSynchronizerParameters
)

participant1.synchronizers.connect_local(sequencer1, synchronizerName)
participant2.synchronizers.connect_local(sequencer1, synchronizerName)

val darDirectory = new File("dist")
val darFiles = Option(darDirectory.listFiles())
  .getOrElse(Array.empty[File])
  .filter(file => file.isFile && file.getName.endsWith(".dar"))
  .sortBy(_.getName)

darFiles.foreach { darFile =>
  println(s"Uploading ${darFile.getPath} to all local participants")
  participants.all.dars.upload(darFile.getPath)
}

println("Canton multi-node sandbox is ready.")
println(s"Participant 1 Ledger API (gRPC): localhost:${participant1.config.ledgerApi.port.unwrap}")
println(s"Participant 1 JSON API (HTTP):   http://localhost:${participant1.config.httpLedgerApi.port.unwrap}/readyz")
println(s"Participant 2 Ledger API (gRPC): localhost:${participant2.config.ledgerApi.port.unwrap}")
println(s"Participant 2 JSON API (HTTP):   http://localhost:${participant2.config.httpLedgerApi.port.unwrap}/readyz")
```

This file is the startup glue.

The config file says:

```text
these nodes exist
```

The bootstrap script says:

```text
create a synchronizer
connect both participants to it
upload every DAR to every participant
print useful endpoint information
```

### Why not put this in the config file?

Configuration is static. It declares nodes, ports, and storage.

Bootstrap is procedural. It performs actions after the nodes exist.

That separation matters. A participant can exist but still not be connected to a synchronizer. A participant can be running but still not have your DARs uploaded. The bootstrap script closes that gap.

### Why upload to both participants?

Each participant needs access to the Daml packages it will use.

If only participant1 has the DARs, participant2 may be connected to the synchronizer but still unable to submit or inspect contracts using your templates.

The Canton console command reference documents `dars.upload` as the command for uploading a DAR to a participant:

```text
https://docs.digitalasset.com/operate/3.4/reference/console.html
```

---

## Step 4: Add Makefile Variables

At the top of your `Makefile`, add:

```make
DIST_DIR := dist
VERSIONS_FILE := versions.yaml
DPM := dpm
SDK_VERSION := $(shell grep 'sdk_version:' $(VERSIONS_FILE) 2>/dev/null | awk '{print $$2}' | tr -d '"\r')
CANTON_JAR ?= $(HOME)/.daml/sdk/$(SDK_VERSION)/canton/canton.jar
MULTINODE_CONFIG := canton/multinode-sandbox.conf
MULTINODE_BOOTSTRAP := canton/multinode-bootstrap.canton
```

The important variable is `CANTON_JAR`.

In a Daml SDK installation, Canton is bundled under the SDK directory. For SDK `3.4.10`, the jar is usually:

```text
~/.daml/sdk/3.4.10/canton/canton.jar
```

Reading the SDK version from `versions.yaml` avoids hard-coding it in two places.

You can still override it:

```bash
make sandbox-multinode CANTON_JAR=/path/to/canton.jar
```

---

## Step 5: Add `make sandbox-multinode`

Add this target:

```make
.PHONY: sandbox-multinode
sandbox-multinode:
	@echo "Starting Canton multi-node sandbox + JSON APIs with your contracts..."
	@if [ ! -d "$(DIST_DIR)" ] || [ -z "$$(ls -A $(DIST_DIR)/*.dar 2>/dev/null)" ]; then \
		echo "Error: No DARs found in $(DIST_DIR)/. Run 'make build-all' first."; \
		exit 1; \
	fi
	@if [ -z "$(SDK_VERSION)" ]; then \
		echo "Error: Failed to parse sdk_version from $(VERSIONS_FILE)"; \
		exit 1; \
	fi
	@if [ ! -f "$(CANTON_JAR)" ]; then \
		echo "Error: Canton jar not found at $(CANTON_JAR)"; \
		echo "Install DAML SDK $(SDK_VERSION), or set CANTON_JAR=/path/to/canton.jar"; \
		exit 1; \
	fi
	@if [ ! -f "$(MULTINODE_CONFIG)" ]; then \
		echo "Error: $(MULTINODE_CONFIG) not found"; \
		exit 1; \
	fi
	@if [ ! -f "$(MULTINODE_BOOTSTRAP)" ]; then \
		echo "Error: $(MULTINODE_BOOTSTRAP) not found"; \
		exit 1; \
	fi
	@echo "Loading DARs from $(DIST_DIR)/ to participant1 and participant2:"
	@ls -1 $(DIST_DIR)/*.dar
	@echo ""
	@echo "Participant 1 Ledger API (gRPC): localhost:6865"
	@echo "Participant 1 JSON API (HTTP):   http://localhost:7575/readyz"
	@echo "                                   http://localhost:7575/v2/parties"
	@echo "                                   http://localhost:7575/v2/packages"
	@echo "Participant 2 Ledger API (gRPC): localhost:6875"
	@echo "Participant 2 JSON API (HTTP):   http://localhost:7576/readyz"
	@echo "                                   http://localhost:7576/v2/parties"
	@echo "                                   http://localhost:7576/v2/packages"
	@echo ""
	@java -jar "$(CANTON_JAR)" daemon --config "$(MULTINODE_CONFIG)" --bootstrap "$(MULTINODE_BOOTSTRAP)" --log-file-name log/canton-multinode.log
```

This target deliberately checks prerequisites before starting Canton. Missing DARs or a missing SDK should fail fast with a readable error.

---

## Step 6: Add a Smoke Test

Add:

```make
.PHONY: sandbox-multinode-smoke
sandbox-multinode-smoke:
	@set -e; \
	for api in http://localhost:7575 http://localhost:7576; do \
		echo "Checking $$api/readyz..."; \
		curl -fsS -o /dev/null "$$api/readyz"; \
	done; \
	expected_package_ids=$$(for dar in $(DIST_DIR)/*.dar; do \
		$(DPM) inspect-dar --json "$$dar" | jq -r '.main_package_id'; \
	done); \
	for api in http://localhost:7575 http://localhost:7576; do \
		echo "Checking packages on $$api..."; \
		actual_package_ids=$$(curl -fsS "$$api/v2/packages" | jq -r '(.packages // .packageIds)[]'); \
		for package_id in $$expected_package_ids; do \
			if ! echo "$$actual_package_ids" | grep -qx "$$package_id"; then \
				echo "Error: Expected package $$package_id on $$api"; \
				exit 1; \
			fi; \
		done; \
	done; \
	echo "Multi-node sandbox smoke check passed."
```

This does two checks.

First, it checks both JSON APIs:

```bash
curl -fsS -o /dev/null http://localhost:7575/readyz
curl -fsS -o /dev/null http://localhost:7576/readyz
```

Second, it checks that the exact main package IDs from your local DAR files exist on both participants.

This is better than checking only the number of packages. The package endpoint can include standard library packages and dependencies. A count can accidentally pass even if your project DARs were not uploaded. Checking exact package IDs proves the expected DARs are present.

---

## Step 7: Run It

Build first:

```bash
make build-all
```

Start the multi-node sandbox:

```bash
make sandbox-multinode
```

Expected output:

```text
Starting Canton multi-node sandbox + JSON APIs with your contracts...
Loading DARs from dist/ to participant1 and participant2:
dist/app-1.0.0.dar
dist/enumerations-1.0.0.dar
dist/models-v2-1.0.0.dar

Participant 1 Ledger API (gRPC): localhost:6865
Participant 1 JSON API (HTTP):   http://localhost:7575/readyz
                                   http://localhost:7575/v2/parties
                                   http://localhost:7575/v2/packages
Participant 2 Ledger API (gRPC): localhost:6875
Participant 2 JSON API (HTTP):   http://localhost:7576/readyz
                                   http://localhost:7576/v2/parties
                                   http://localhost:7576/v2/packages

Uploading dist/app-1.0.0.dar to all local participants
Uploading dist/enumerations-1.0.0.dar to all local participants
Uploading dist/models-v2-1.0.0.dar to all local participants
Canton multi-node sandbox is ready.
```

In a second terminal:

```bash
make sandbox-multinode-smoke
```

Expected output:

```text
Checking http://localhost:7575/readyz...
Checking http://localhost:7576/readyz...
Checking packages on http://localhost:7575...
Checking packages on http://localhost:7576...
Multi-node sandbox smoke check passed.
```

---

## Step 8: Interact With Each Participant

Participant1:

```bash
curl http://localhost:7575/readyz
curl http://localhost:7575/v2/packages
curl http://localhost:7575/v2/parties
```

Participant2:

```bash
curl http://localhost:7576/readyz
curl http://localhost:7576/v2/packages
curl http://localhost:7576/v2/parties
```

Using the Ledger API, participant1 is on port `6865`:

```bash
daml ledger allocate-party \
  --host=localhost --port=6865 \
  PartyOne \
  --display-name="Party One"
```

Participant2 is on port `6875`:

```bash
daml ledger allocate-party \
  --host=localhost --port=6875 \
  PartyTwo \
  --display-name="Party Two"
```

The exact party workflow depends on your templates. A useful first check is to allocate one party on each participant, then use your application or Daml scripts to create contracts involving those parties.

---

## What This Setup Can Test

This setup is useful for:

- verifying both participants can start from the same local DAR set
- testing client configuration against different Ledger API ports
- testing visibility differences between parties hosted on different participants
- preparing for party replication or party migration experiments
- catching assumptions hidden by a single-node sandbox

It is also a good teaching tool. You can see explicitly that:

- participants host parties
- participants need DARs
- participants connect to synchronizers
- synchronizers are separate from participants
- JSON API readiness does not prove your project DARs are uploaded

---

## What This Setup Does Not Test

This is not a production network.

It does not test:

- durable participant storage
- production identities and certificates
- Kubernetes deployment behavior
- validator app APIs
- Canton Coin wallet flows
- HA failover
- performance under realistic network latency
- a real shared/global synchronizer

Everything runs locally, in one Canton process, with in-memory storage. That is intentional. The goal is conceptual clarity and fast feedback.

---

## Troubleshooting

### Error: no DARs found

If you see:

```text
Error: No DARs found in dist/. Run 'make build-all' first.
```

build your packages:

```bash
make build-all
```

### Error: Canton jar not found

If you see:

```text
Error: Canton jar not found at ~/.daml/sdk/3.4.10/canton/canton.jar
```

check your installed SDKs:

```bash
daml version
```

Then either install the expected SDK or override the jar path:

```bash
make sandbox-multinode CANTON_JAR=/path/to/canton.jar
```

### Error: port already in use

The multi-node sandbox uses `6865` and `7575`, same as the single-node sandbox. Stop the single-node sandbox before starting the multi-node one.

On macOS or Linux:

```bash
lsof -iTCP:6865 -sTCP:LISTEN -n -P
lsof -iTCP:7575 -sTCP:LISTEN -n -P
```

Then stop the owning process.

### Smoke test fails on packages

If readiness passes but package verification fails:

```text
Error: Expected package <package-id> on http://localhost:7575
```

then the participant is running, but one of your project DARs was not uploaded or is not visible through the package service.

Check:

```bash
dpm inspect-dar --json dist/app-1.0.0.dar | jq -r '.main_package_id'
curl -s http://localhost:7575/v2/packages | jq .
curl -s http://localhost:7576/v2/packages | jq .
```

The main package ID from `inspect-dar` should appear in both package lists.

### The sandbox starts inside a restricted tool but cannot bind ports

Some automation sandboxes restrict local server sockets. If the Canton process fails with an error like:

```text
Failed to bind to address /127.0.0.1:<port>
```

try running the command directly in a normal terminal:

```bash
make sandbox-multinode
```

---

## Why This Is Worth Doing

A single-node sandbox can hide distributed assumptions.

For example:

- You may accidentally assume all parties are on the same participant.
- You may upload DARs to one participant and forget another.
- You may test only one Ledger API endpoint.
- You may confuse a participant with a synchronizer or validator app.

A two-participant local sandbox makes those boundaries visible.

It is still small enough to understand, but it has enough structure to teach the real Canton model:

```text
application -> participant -> synchronizer -> other participant
```

That mental model is the point of the exercise.

---

## Final File List

At the end, you should have:

```text
canton/
|-- multinode-bootstrap.canton
`-- multinode-sandbox.conf

Makefile
```

Optional but useful:

```text
scripts/
`-- validate-multinode-sandbox-static.sh
```

The single-node sandbox remains:

```bash
make sandbox
```

The new multi-node sandbox is:

```bash
make sandbox-multinode
```

And the smoke test is:

```bash
make sandbox-multinode-smoke
```

That gives you a reproducible local environment for learning and testing multi-participant Canton behavior.
