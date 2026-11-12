---
layout: post
title: "Postgres CDC: Following Changes Through the WAL"
image: https://unsplash.com/photos/toBSID2_0F8/download?w=437
thumb: https://unsplash.com/photos/toBSID2_0F8/download?w=437
author: tushar sharma
category: blog
tags:
  - letters
  - postgres
  - cdc
---

Short tutorial on using CDC with Postgres.<!-- truncate_here -->

## Postgres & CDC

Postgres stores tables and indexes in binary files on disk. Those files are split into fixed-size blocks, usually called **pages**. A page is normally 8 KB, and it holds multiple rows plus some metadata. Postgres does not keep one readable text file per table.

> So a page is the unit Postgres reads from disk into memory and later writes back. A row lives inside a page.

When a row changes, Postgres usually changes the copy of its page in shared memory first. That page is now **dirty**: memory has the newer version, while the table file on disk may still have the older version.

How can Postgres acknowledge my transaction before that dirty page reaches the table file safely? This is where WAL comes in.

## WAL: write the history before the page

WAL means **Write-Ahead Log**. It is an ordered sequence of records describing changes needed to redo database work. The important rule is in the name: the WAL record must reach durable storage before the changed data page is allowed to reach durable storage.

For a normal durable commit (`synchronous_commit = on`), my mental model is:

1. Postgres changes pages in shared memory and produces WAL records for those changes.
2. At commit, it adds a commit record to WAL.
3. It flushes the WAL through that commit record to durable storage.
4. It acknowledges the commit to the client.
5. The dirty table and index pages can be flushed later, usually by background processes or during a checkpoint.

So commit does **not** mean every changed table page is already on disk. It means the WAL needed to recover the committed transaction is durable. If Postgres crashes before the dirty page is written, startup recovery replays WAL and rebuilds the missing change.

WAL is append-oriented, which is friendlier to storage than forcing many scattered data pages to disk for every commit. But WAL is more than a performance trick; its first job is durability and crash recovery.

[PostgreSQL describes the write-ahead rule here](https://www.postgresql.org/docs/current/wal-intro.html).

## How CDC uses WAL

CDC means **Change Data Capture**. Instead of repeatedly asking every table, “what changed?”, a consumer follows the database's change stream.

Raw WAL describes physical storage-level changes and depends on Postgres internals. An application usually wants a logical event such as:

```text
orders: UPDATE id=42, status='paid'
```

**Logical decoding** reads WAL and turns the relevant records into a logical stream of table changes. An output plugin decides the actual format sent to the consumer. So logical decoding does not literally convert every WAL record into one row; it reconstructs transaction-level changes into a form a consumer can understand.

Three pieces fit together:

1. **Logical decoding** translates WAL into logical changes.
2. A **publication** selects which tables and operations are exposed by PostgreSQL's built-in logical replication. It is like an allowlist, but it does not store a consumer's progress.
3. A **logical replication slot** tracks how far a consumer has confirmed reading. It prevents Postgres from removing WAL that the consumer may still need.

A slot is closer to a durable cursor than a pointer to one WAL file. If the consumer stops, required WAL can accumulate and fill the disk. This means replication-slot lag must be monitored.

There are two related paths:

- With native logical replication, I create a publication on the source; a subscription on the target normally creates or uses a logical replication slot.
- With a CDC tool such as Debezium or AWS DMS, the tool can read from a logical slot using a decoding plugin. Whether it needs a PostgreSQL publication depends on the tool and plugin.

[The logical decoding documentation explains decoding, slots, and output plugins](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html).

## Making it happen on RDS PostgreSQL

First I can check the current WAL level:

```sql
SHOW wal_level;

-- or
SELECT name, setting
FROM pg_settings
WHERE name IN ('wal_level', 'rds.logical_replication');
```

If `wal_level` is `replica`, Postgres has enough WAL for physical replication, but not the extra information required for logical decoding. Logical CDC needs `wal_level = logical`.

On Amazon RDS for PostgreSQL, I do not edit `postgresql.conf` directly. I attach a custom DB parameter group, set:

```text
rds.logical_replication = 1
```

This is a static setting, so the DB instance must be rebooted for it to take effect. RDS also needs suitable values for `max_replication_slots`, `max_wal_senders`, and `max_connections`. After the reboot, `SHOW wal_level;` should return `logical`.

Then I create the publication and/or logical slot required by the CDC consumer, and give the consumer a user with the necessary replication and table permissions. On RDS, setup generally involves the `rds_superuser` and `rds_replication` roles rather than a true PostgreSQL superuser.

One warning worth keeping next to the setup steps: enabling logical replication can generate more WAL, and an inactive slot can retain WAL indefinitely. Always watch slot lag and free storage.

[AWS documents the RDS setup and the storage risk here](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PostgreSQL.Concepts.General.FeatureSupport.LogicalReplication.html).
