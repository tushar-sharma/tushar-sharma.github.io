--
layout: post
title: Canton Cribsheet
image: https://unsplash.com/photos/JrjhtBJ-pGU/download?w=437
thumb: https://unsplash.com/photos/JrjhtBJ-pGU/download?w=437
author: 
tags:
 - canton
 - daml
category: blog
---

Rough notes while working on canton.<!-- truncate_here -->

# What's Canton?

Canton is a ledger interoperability protocol that connects different DAML ledgers into a single virtual global ledger. This allows DAML applications to span across various participants and organizations. Canton enforces the privacy and authorization rules set by DAML, ensuring transaction integrity and high levels of data privacy, even in complex distributed environments. Canton is implemented in Scala and runs as a Java process.

# What is DAML?

DAML (Digital Asset Modeling Language) is an open-source smart contract language used for building multi-party distributed applications. It defines who can see and who can change a contract, with built-in models for authorization and privacy.

# Canton validator node

A Canton validator node is a crucial component of the Canton Network, a public Layer 1 blockchain specifically designed for financial institutions to facilitate secure, interoperable, and privacy-preserving transactions.

Validator nodes are responsible for storing contract data and executing smart contract code. They validate only those transactions in which they are directly involved, ensuring data privacy and confidentiality.

Unlike many other public blockchains where all transactions are replicated across all nodes, Canton's architecture ensures that data is segmented and replicated only to the nodes permissioned to view it. This "proof-of-stakeholder" consensus model means that only the validators relevant to a transaction are responsible for its validation.

## Recovering from a failed upgrade

If a canton node fails to upgrade, you might need to manually inspect the database to understand the state of the upgrade. The following query can be used to check the last ingested offsets. If no rows are returned by the query, that means nothing was ingested and thus the app's database doesn't contain any invalid data.

```sql
select * from update_history_last_ingested_offsets
where history_id = (select distinct history_id from update_history_last_ingested_offsets)
and migration_id = ?
```

The `?` in the query above is a placeholder for the `migration_id`. You will need to replace it with the actual `migration_id` you are investigating.

## Contract id 

A contract is an instance of DAML template stored on the ledger and refrenced by ContractId.

