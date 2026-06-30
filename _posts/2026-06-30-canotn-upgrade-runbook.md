---
layout: post
title: Canton Node Upgrade Runbook
image: https://unsplash.com/photos/qw_AjeRSY2g/download?w=437
thumb: https://unsplash.com/photos/qw_AjeRSY2g/download?w=437
author: Tushar Sharma
category: blog
tags:
- canton
- blockchain
---

Upgrading a Canton validator node requires careful coordination with the network and the correct upgrade sequence. Although the upgrade itself is straightforward, performing it at the wrong time or upgrading components in the wrong order can lead to synchronization failures or unnecessary downtime.<!-- truncate_here -->

Upgrading a Canton validator node requires careful coordination with the network and the correct upgrade sequence. Although the upgrade itself is straightforward, performing it at the wrong time or upgrading components in the wrong order can lead to synchronization failures or unnecessary downtime.

This runbook documents the process used to upgrade an LSU Canton validator node from **v0.6.7** to **v0.6.8**.

## Step 1: Verify the Network Is Not in a Topology Freeze

Before performing any upgrade, verify that the Canton network is **not** in a topology freeze.

```text
https://sv-cal.canton.foundation/
```

---

## Step 2: Verify the Target Network Version

Next, confirm which software version the network expects validators to run.

```text
https://canton.foundation/sv-network-status-2
```

For this upgrade, the network reported the following status:

```json
{
  "network": "mainnet",
  "migration_id": 4,
  "synchronizer": {
    "current": {
      "chain_id_suffix": "2",
      "serial_id": 5,
      "software_version": "0.6.8"
    }
  },
  "versions": {
    "target": "0.6.8",
    "previous": "0.6.7"
  }
}
```

The important fields are:

* **target** – the version validators should upgrade to
* **previous** – the version currently being replaced
* **software_version** – the synchronizer version currently running

> **Important:** Do not upgrade simply because a newer Docker image has been published. Always verify that the network's target version matches the version you intend to deploy.

---

## Step 3: Pull the Required Docker Images

Download the required images before beginning the upgrade.

### Participant

```bash
docker pull ghcr.io/digital-asset/decentralized-canton-sync/docker/canton-participant:0.6.8
```

### Validator

```bash
docker pull ghcr.io/digital-asset/decentralized-canton-sync/docker/validator-app:0.6.8
```

Pulling the images ahead of time reduces downtime during the maintenance window.

---

## Step 4: Upgrade Components in the Correct Order

The upgrade order is critical.

> **Always upgrade the participant before upgrading the validator.**

The validator depends on the participant. Running a newer validator against an older participant can result in compatibility issues, failed startup, or synchronization errors.

### 4.1 Upgrade the Participant

Update the participant container to use the new image:

```text
ghcr.io/digital-asset/decentralized-canton-sync/docker/canton-participant:0.6.8
```

Restart the participant service and wait until it has fully initialized.

Before proceeding, verify that:

* the container is running
* startup completed successfully
* database migrations (if any) completed
* the participant successfully connected to the synchronizer
* no repeated errors appear in the logs

Do **not** begin upgrading the validator until the participant is healthy.

---

### 4.2 Upgrade the Validator

After confirming the participant is healthy, update the validator image:

```text
ghcr.io/digital-asset/decentralized-canton-sync/docker/validator-app:0.6.8
```

Restart the validator and monitor the logs until startup completes successfully.

Verify that the validator reconnects to the participant and resumes normal operation.
