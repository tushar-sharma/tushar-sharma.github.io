---
layout: post
title: "Mastering Ethereum: Implementing Smart Contracts"
image: https://thumbs.dreamstime.com/b/crypto-currency-market-mixed-media-businesswoman-using-tablet-pc-symbols-out-screen-d-rendering-171649622.jpg
thumb: https://thumbs.dreamstime.com/b/crypto-currency-market-mixed-media-businesswoman-using-tablet-pc-symbols-out-screen-d-rendering-171649622.jpg
author: tushar sharma
category: blog
book_notes: true
tags:
 - blockchain
 - etherium
 - books
---

These are my learning notes and reflections while reading "Mastering Ethereum: Implementing Smart Contracts" by Carlo Parisi, Alessandro Mazza, Niccolo Pozzolini. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<!-- disclaimer -->
<div class="book-notes-disclaimer">
  These are my rough notes while reading the book.
</div>

---

## Aug 15, 2026

Ethereum is an unbounded state machine.

Unbounded means the state is not limited to a small, fixed set of values. Ethereum's global state can keep growing as accounts, balances, contract code, and contract storage change over time.

Ethereum has the EVM (Ethereum Virtual Machine), which applies valid transactions to the current state and produces the next state.

A state machine is a system where the next state is determined by the current state plus an input. In Ethereum, the input is a transaction, and the output is the updated global state.


### Comparison between Bitcoin and Ethereum

1. Both are permissionless and open.


2. Participants use a P2P network to communicate without a trusted third party. Each node can act as both a client and a server. There is no dedicated central server.

HTTP is commonly used in a client-server model. A browser implements HTTP, where the client sends a request and the server returns a response. The payload can follow different conventions, such as JSON for REST APIs, XML for SOAP, or binary formats for gRPC.

A gossip protocol is a way for nodes in a P2P network to spread information by forwarding it to some of their peers, who then forward it to more peers. Instead of one central server broadcasting to everyone, information propagates through the network.

3. They use Byzantine fault-tolerant consensus ideas for validating writes to the ledger.

Byzantine refers to the Byzantine Generals Problem: how distributed participants can agree on one result even when some participants are faulty, offline, or malicious. In blockchains, consensus protocols must tolerate untrusted nodes.

4. Both use a native digital currency. Ethereum uses ether (ETH), and Bitcoin uses bitcoin (BTC).

Bitcoin is the network/protocol, and bitcoin is the currency unit used on that network. The ticker symbol is BTC.

5. Both use digital signatures and hashes. A hash is a one-way function that generates a fixed-length output from arbitrary input. It is easy to compute the hash from the input, but infeasible to recover the original input from only the hash.

### Types of blockchain

| | Permissionless | Permissioned |
| --- | --- | --- |
| Private | X | Canton |
| Open | Bitcoin, Ethereum | Hedera |



Permissioned: Only authorized validators can participate in consensus.

Permissionless: Anyone can participate in consensus.

Open: Anyone can view the data.

Private: Only authorized parties can view the data.

### Ethereum components

1. P2P network.

2. Ethereum consists of two client roles: a consensus client and an execution client. The consensus client participates in consensus. The execution client executes transactions and smart contracts. Smart contracts live on the ledger and can change the singleton global state.

3. The EVM executes EVM bytecode. A high-level language like Solidity can be compiled into this bytecode.


### Turing Complete


Ethereum is a Turing-complete distributed state machine. Let's understand Turing completeness.

Alan Turing described a state machine that can change symbols by reading from and writing to sequential memory. This model is called a Turing machine. Universal computability is the idea that a machine can compute anything that is computable, given enough time and memory.

Not all questions about programs are decidable. For example, the halting problem asks whether, given an arbitrary program and input, we can always determine whether that program will eventually stop. In other words, can we know the future execution path of every possible program without executing it?

```python 
def foo(x : int):
  x = x * x 
  return x 
``` 

For simple programs like `foo`, yes, we can decide that it ends. The halting problem says there is no general algorithm that can decide this for every possible program and input. The classic proof is by contradiction: assume a perfect halting detector exists, then construct a program that does the opposite of what the detector predicts, creating a contradiction.

The system that can simulate a Turing machine is called Turing complete. A machine that can simulate any other Turing machine is called a Universal Turing Machine.

Universal means it is not built for only one specific computation. It can take another machine's description and input, then simulate that machine's behavior.

Ethereum is a Universal Turing Machine in the practical sense that smart contracts can express arbitrary computation, subject to gas limits.

Turing completeness can be implemented with a surprisingly small machine. Even SQL can be Turing complete in some forms. This creates a problem: if Ethereum can execute arbitrary programs, it cannot know in general whether a program will end.


Ethereum adds gas. Gas is the unit used to meter computation, storage, and transaction execution. Each transaction includes a gas limit, which is the maximum gas the sender is willing to spend. Gas is paid for using ether. This prevents a smart contract from running forever because execution stops when the transaction runs out of gas.

### Dapp

Dapp means decentralized application. It usually combines smart contracts with a web interface, so users interact with blockchain logic through a browser or wallet.

Web1 generally means the early read-only web: mostly static pages connected by hyperlinks. It was created by Tim Berners-Lee at CERN around 1989-1991. Web2 refers to the interactive and social web, where users create content and platforms manage much of the data. Web3 refers to applications that use blockchains, wallets, tokens, and decentralized protocols.

