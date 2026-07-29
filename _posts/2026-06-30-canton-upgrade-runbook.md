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

## Errors

Common errors while upgrading a Canton node:

### Unfinished LSU Target Conflicts with the Active Synchronizer

Another startup failure shape is an unfinished logical synchronizer upgrade (LSU) that points at an old target after the participant has already moved on to a newer active synchronizer.

The log usually looks like this:

```text
Found unfinished LSUs: List(FinishAutomaticLsuRequest(Synchronizer 'global', ...::N-1, ...::N))
...
Marking synchronizer connection ...::N as active
...
Unable to mark successor synchronizer ...::N as active:
AtMostOnePhysicalActive(Synchronizer 'global', Set(...::N, ...::N+1))
```


In the participant database, the synchronizer connection status letters are:

```text
A = Active
F = LSU source
U = LSU target
I = Inactive
```

Confirm the state before changing anything:

```sql
select synchronizer_alias, physical_synchronizer_id, status, synchronizer_predecessor
from par_synchronizer_connection_configs
where synchronizer_alias = 'global'
order by physical_synchronizer_id;
```

The suspicious pattern is:

```text
<old-source>    F
<stale-target>  U
<new-active>    A
```

In that state, startup sees `<old-source> = F` and `<stale-target> = U`, treats it as an unfinished LSU, and tries to promote `<stale-target>` to `A`. That fails because `<new-active>` is already `A`.

For a recovery window, stop the participant first and take a backup. If the stale target is confirmed obsolete, the least destructive manual correction is to mark only that stale `U` row inactive:

```sql
begin;

update par_synchronizer_connection_configs
set status = 'I'
where synchronizer_alias = '<alias>'
  and physical_synchronizer_id = '<stale-target-physical-synchronizer-id>'
  and status = 'U';

select synchronizer_alias, physical_synchronizer_id, status
from par_synchronizer_connection_configs
where synchronizer_alias = '<alias>'
order by physical_synchronizer_id;

commit;
```

Do not delete or rewrite all `F` rows just because they look old. `F` marks past LSU sources and does not trigger this crash by itself. The problematic row is the stale `U` target that startup is still trying to finish.

After restart, the important validation is that the participant no longer logs an unfinished LSU for the stale target and no longer attempts to mark it active.

### Failed to start participant due to UnknownPhysicalSynchronizerId

If an LSU did not finish cleanly, the participant may need a manual LSU command to move from the current physical synchronizer id to the successor physical synchronizer id. This is only useful when the participant can start far enough for the admin command to run. If startup fails earlier while finishing a stale LSU, fix the persisted synchronizer state first.

From the Canton REPL, first bind the participant console handle and confirm that the node is healthy and connected to the expected synchronizer. If the configured node is named `sandbox`, use `sandbox`; if it is named `participant`, use `participant`.

```scala
val participantNode = sandbox // or: val participantNode = participant
val global = com.digitalasset.canton.SynchronizerAlias.tryCreate("global")

participantNode.health.status
participantNode.synchronizers.active(global)
participantNode.synchronizers.physical_id_of(global)
```

Then keep the manual LSU command generic and build the successor connection details from the operator-provided synchronizer announcement:

```scala
import java.time.Instant

import com.digitalasset.canton.data.CantonTimestamp
import com.digitalasset.canton.networking.{Endpoint, Port}
import com.digitalasset.canton.topology.{PhysicalSynchronizerId, SequencerId, UniqueIdentifier}
import com.digitalasset.canton.topology.transaction.GrpcConnection
import com.digitalasset.canton.util.collection.NonEmpty

val currentPsid =
  PhysicalSynchronizerId.tryFromString("<current-physical-synchronizer-id>")
val successorPsid =
  PhysicalSynchronizerId.tryFromString("<successor-physical-synchronizer-id>")
val upgradeTime =
  Some(CantonTimestamp.assertFromInstant(Instant.parse("<upgrade-time>")))

val sequencerSuccessors =
  Map(
    SequencerId(UniqueIdentifier.tryFromProtoPrimitive("<sequencer-id-1>")) ->
      GrpcConnection(
        NonEmpty(Set, Endpoint("<sequencer-host-1>", Port.tryCreate(443))),
        transportSecurity = true,
        customTrustCertificates = None
      ),
    SequencerId(UniqueIdentifier.tryFromProtoPrimitive("<sequencer-id-2>")) ->
      GrpcConnection(
        NonEmpty(Set, Endpoint("<sequencer-host-2>", Port.tryCreate(443))),
        transportSecurity = true,
        customTrustCertificates = None
      )
  )

participantNode.synchronizers.perform_manual_lsu(
  currentPsid,
  successorPsid,
  upgradeTime,
  sequencerSuccessors
)
```

Some Canton versions also expose an overload that takes a full `SynchronizerConnectionConfig`. Use whichever form matches the installed Canton version and the data published for the successor synchronizer.

The pod might be in a **CrashLoopBackOff** state. In that case, use a temporary recovery bootstrap pattern:

1. Mount a recovery ConfigMap into the participant container.
2. Run a custom bootstrap entrypoint.
3. Start the participant.
4. Wait until the participant is active on the expected current physical synchronizer id.
5. Call the participant handle's `synchronizers.perform_manual_lsu(...)` command.
6. Remove the recovery bootstrap after the upgrade and restore normal startup.

The prior manual-LSU recovery script used a ConfigMap with two scripts: a tiny entrypoint wrapper and the actual user bootstrap.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: <participant>-canton-recovery
data:
  bootstrap-entrypoint.sc: |
    interp._compilerManager.asInstanceOf[ammonite.compiler.CompilerLifecycleManager]
      .preConfigureCompiler(_.YtastyReader.value = true)

    @

    import $file.`user-bootstrap`

    logger.info("=== Bootstrapping recovery ===")
    `user-bootstrap`.main()
    logger.info("=== Recovery bootstrap complete ===")

  bootstrap.sc: |
    import java.time.{Duration, Instant}
    import scala.util.Try

    import com.digitalasset.canton.topology.PhysicalSynchronizerId
    import com.digitalasset.canton.SynchronizerAlias

    def waitUntil(description: String, timeout: Duration)(condition: => Boolean): Unit = {
      def conditionSatisfied: Boolean = Try(condition).getOrElse(false)

      val deadline = Instant.now().plus(timeout)
      while (!conditionSatisfied && Instant.now().isBefore(deadline)) {
        Thread.sleep(1000)
      }

      if (!conditionSatisfied) {
        throw new RuntimeException(s"Timed out waiting for $description")
      }
    }

    def waitForCurrentSynchronizer(
        alias: SynchronizerAlias,
        currentPsid: PhysicalSynchronizerId
    ): Unit =
      waitUntil(s"$alias to be active on $currentPsid", Duration.ofMinutes(5)) {
        participant.synchronizers.active(alias) &&
          Try(participant.synchronizers.physical_id_of(alias)).toOption.contains(currentPsid)
      }

    def main(): Unit = {
      val alias = SynchronizerAlias.tryCreate("<alias>")
      val currentPsid = PhysicalSynchronizerId.tryFromString("<current-physical-synchronizer-id>")
      val successorPsid = PhysicalSynchronizerId.tryFromString("<successor-physical-synchronizer-id>")
      val upgradeTime =
        Some(com.digitalasset.canton.data.CantonTimestamp.assertFromInstant(
          Instant.parse("<upgrade-time>")
        ))

      val successorConfig =
        buildSuccessorConnectionConfigFromAnnouncement(
          endpoints = "<sequencer-endpoints>",
          threshold = "<sequencer-threshold>",
          livenessMargin = "<liveness-margin>",
          amplification = "<submission-request-amplification>"
        )

      participant.start()
      waitForCurrentSynchronizer(alias, currentPsid)

      participant.synchronizers.perform_manual_lsu(
        currentPsid,
        successorPsid,
        upgradeTime,
        successorConfig
      )
    }
```

The temporary Deployment patch mounted those scripts over the normal bootstrap files:

```yaml
volumeMounts:
  - name: canton-recovery
    mountPath: /app/bootstrap.sc
    subPath: bootstrap.sc
    readOnly: true
  - name: canton-recovery
    mountPath: /app/bootstrap-entrypoint.sc
    subPath: bootstrap-entrypoint.sc
    readOnly: true

volumes:
  - name: canton-recovery
    configMap:
      name: <participant>-canton-recovery
```

### Reonboarding

If the database schema is dropped, onboard the validator and participant again. Generate the onboarding secret from an environment with network access to the onboarding endpoint:

```bash
curl -s -X POST <validator-onboarding-prepare-url>

kubectl patch secret <validator-secret-name> \
  -p '{"data":{"SPLICE_APP_VALIDATOR_ONBOARDING_SECRET":"<base64-onboarding-secret>"}}'
```
