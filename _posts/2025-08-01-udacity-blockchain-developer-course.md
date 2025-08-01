---
layout: post
title: Notes for Udacity Blockchain Developer Course
image: https://unsplash.com/photos/g/download?w=437
thumb: https://unsplash.com/photos/g/download?w=437
author: tushar sharma
category: blog
published: false
tags:
 - blockchain 
 - udacity
---

What's a blockchain? A distributed immutable ledger. Blocks forms a chain and are combined by their previous hash value, that's why it's a blockchain.

What's a **trusted 3rd party**? An entity that facilitates secure interactions between parties. It ensures transactions integrity and authenticity by acting as an impartial intermediary.

**Double spending problem**: Digital money is just data—can be copied and spent multiple times.

**Transaction Flow**:

1. Transaction Creation: User creates and signs transaction with private key

2. Broadcasting: Transaction propagated to network nodes

3. Mempool: Unconfirmed transactions pool at each node

4. Block Assembly: Miners select transactions (usually highest fees first)

5. Mining: Solve proof-of-work puzzle to validate block

6. Block Propagation: Valid block broadcast to network

7. Confirmation: Block added to chain after network acceptance


**What'a hasing**: Bitcoin uses SHA-256, a deterministic, one-way cryptographic hash function.

```
Given an arbitrary x string

f(x) = fixed length unique value
```

1. Deterministic: same input always yields same output.

2. One-way: infeasible to compute x from f(x).

3. Collision-resistant: two different inputs shouldn't yield same output.

## Block's data

```
Block Header:
├── Previous Block Hash (32 bytes)
├── Merkle Root (32 bytes)  
├── Timestamp (4 bytes)
├── Difficulty Target (4 bytes)
├── Nonce (4 bytes)
└── Block Body: Transaction List
```

**Merkle Root** is a single hash representing all transactions in the block. Built via a Merkle Tree, where each leaf is a transaction hash and parent nodes are hashes of child pairs. Enables efficient verification (log₂(n)).

```
Root Hash
      /          \
   Hash AB      Hash CD
   /    \       /     \
Hash A Hash B Hash C Hash D
  |     |       |      |
 Tx A  Tx B    Tx C   Tx D
```

**Nonce**: A number used once, iterated by miners to find a hash that meets the required difficulty target. Without the correct nonce, the hash won’t meet the block’s difficulty condition.

**Dificulty level** A dynamic target value that defines how hard it is to mine a block. Represented as the required number of leading zeroes in the hash.

How does block join a blockchain? Using consensus which solves Byzantine general problem 

- proof of work 

- proof of stake 

- etc.

**Proof of work** is when miners are trying to change a nonce and finda  hash that meets the required difficulty level (usually a hash with a certain number of leading zeros)

**Proof of stake** is consensus mechanism where validators are chosen to create new blocks based on the amount of cryptocurrency they **stake**. 

How a block would look like

```
|--------------------
|   Transcations 1  |
|     |---------|   |
|     | outputs |   |
|     |---------|   |
|                   |
|   Transcations 2  |
|     |---------|   |
|     | outputs |   |
|     |---------|   |
---------------------


```

Bitcoin needs to establish identity on blockchain.

1. private key 
2. public key 
3. wallet address

Wallets has private keys (e.g. software wallet). The hashed value of private key are public keys. We dont share public key yet because it can be traced back to private key. We hash the public key to get wallet address which we share.

Transcations are signed using digital signature by private keys ... 