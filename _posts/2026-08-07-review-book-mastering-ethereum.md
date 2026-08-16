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
 - ethereum
 - books
---

These are my learning notes and reflections while reading "Mastering Ethereum: Implementing Smart Contracts" by Carlo Parisi, Alessandro Mazza, Niccolo Pozzolini, Gavin Wood, and Andreas M. Antonopoulos. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<!-- disclaimer -->
<div class="book-notes-disclaimer">
  These are my rough notes while reading the book.
</div>

---


## Aug 15, 2026

Ethereum is an unbounded state machine.

Unbounded means the state is not a fixed small table. Ethereum's global state can keep growing as accounts, balances, contract code, and contract storage change. In practice it is still bounded by gas, storage cost, and protocol limits.

Ethereum has the EVM (Ethereum Virtual Machine), which applies valid transactions to the current state and produces the next state.

A state machine is a system where current state + input gives the next state. In Ethereum, the input is a transaction, and the output is the updated global state.


### Comparison between Bitcoin and Ethereum

1. Both are permissionless and open.


2. Participants use a P2P network to communicate without a trusted third party. Each node can act as both a client and a server. There is no dedicated central server.

HTTP is commonly used in a client-server model. Browser sends a request and server returns a response. The payload can follow different conventions, such as JSON for REST APIs, XML for SOAP, or binary formats for gRPC.

A gossip protocol is a way for nodes in a P2P network to spread information by forwarding it to some of their peers, who then forward it to more peers. Instead of one central server broadcasting to everyone, information propagates through the network.

3. Both need consensus because nodes have to agree on valid writes to the ledger.

Byzantine means faulty or malicious behavior in a distributed system. Bitcoin uses Nakamoto consensus with proof-of-work. Ethereum now uses proof-of-stake, with validators and finality rules. Both systems are designed for a network where some nodes cannot be trusted.

4. Both use a native digital currency. Ethereum uses ether (ETH), and Bitcoin uses bitcoin (BTC).

Bitcoin is the network/protocol, and bitcoin is the currency unit used on that network. The ticker symbol is BTC.

5. Both use digital signatures and hashes. A hash is a one-way function that generates a fixed-length output from arbitrary input. It is easy to compute the hash from the input, but infeasible to recover the original input from only the hash.

### Types of blockchain

| | Permissionless | Permissioned |
| --- | --- | --- |
| Private | Usually not useful | Canton |
| Open | Bitcoin, Ethereum | Hedera |



Permissioned: Only authorized validators can participate in consensus.

Permissionless: Anyone can participate in consensus.

Open: Anyone can view the data.

Private: Only authorized parties can view the data.

### Ethereum components

1. P2P network.

2. Ethereum nodes run two main clients: a consensus client and an execution client. Validators also run validator client software. The consensus client handles proof-of-stake consensus. The execution client executes transactions and smart contracts. Contract code and storage are part of Ethereum state, and transactions change this singleton global state.

3. The EVM executes EVM bytecode. A high-level language like Solidity can be compiled into this bytecode.


### Turing Complete


Ethereum is often described as a Turing-complete distributed state machine. More precisely, the EVM instruction set is Turing complete, but every real transaction is bounded by gas. Let's understand Turing completeness.

Alan Turing described a state machine that can change symbols by reading from and writing to sequential memory. This model is called a Turing machine. Universal computability is the idea that a machine can compute anything that is computable, given enough time and memory.

Not all questions about programs are decidable. For example, the halting problem asks whether, given any arbitrary program and input, we can always determine whether that program will eventually stop. In other words, can we build a perfect function like this?

```python
halts(program, input) -> True if program(input) stops, else False
```

Turing's idea was proof by contradiction. Suppose this perfect `halts` function exists. Now create another program that uses `halts` and then does the opposite:

```python
def strange(program):
  if halts(program, program):
    while True:
      pass
  else:
    return
```

Now ask: what happens if we run `strange(strange)`?

If `halts(strange, strange)` says it will halt, then `strange` goes into an infinite loop. So the prediction is wrong.

If `halts(strange, strange)` says it will not halt, then `strange` returns immediately. So the prediction is wrong again.

This contradiction means the perfect `halts` function cannot exist. It is not that we cannot decide simple programs. We can. The point is that there is no one general algorithm that works for every possible program and input.

The system that can simulate a Turing machine is called Turing complete. A machine that can simulate any other Turing machine is called a Universal Turing Machine.

Universal means it is not built for only one specific computation. It can take another machine's description and input, then simulate that machine's behavior.

So Ethereum is not literally an unlimited Universal Turing Machine while executing a transaction. Better way to say it: EVM programs can express arbitrary computation, but execution stops when gas runs out.

Turing completeness can be implemented with a surprisingly small machine. Even SQL can be Turing complete in some forms. This creates a problem: if Ethereum can execute arbitrary programs, it cannot know in general whether a program will end.


Ethereum adds gas. Gas is the unit used to meter computation, storage, and transaction execution. Each transaction includes a gas limit, which is the maximum gas the sender is willing to spend. Gas is paid for using ether. This prevents a smart contract from running forever because execution stops when gas runs out.

### Dapp

Dapp means decentralized application. In practice it usually means smart contracts plus a web interface, so users interact with blockchain logic through a browser and wallet.

Web1 generally means the early read-only web: mostly static pages connected by hyperlinks. It was created by Tim Berners-Lee at CERN around 1989-1991. Web2 refers to the interactive and social web, where users create content and platforms manage much of the data. Web3 refers to applications that use blockchains, wallets, tokens, and decentralized protocols.


## Aug 16, 2026

Ether is the currency of Etherium. Every transcations requires transcation fee. 

```
1 ETH = 10 ^ 9 Gwei (giga way) = 10^18 wei 
```

Wallets stores keys. It could be software or hardware. Software wallets can also create and broadcast transcations. 

Private keys in the wallet helps acces the funds (ether) and smart contract.

**Metamask** is one such wallet. There's a [chrome extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) or from their [website](https://metamask.io/download). 

Wallet generates a private key. Next you can generate public key from your private key. The last 20 bytes of hash of your public key is your address. 

Transcations will use this address `to` or `from` fields to transfer ether. Transcations are messages that are stored as cyrptographical links in the blockchain.

```
An address can logically look like 0x23..1bc
   ETH balance
   transcations count nonce 
   Smart contract code 
```

Nonce is Numewr used once. Different blockchain uses nonce differntly. In ether, nonce is sequential identification of the transcations block.

Bitcoin uses UXTO model, where miners use nonce to perform proof of work.

What's differnce between private and public key? Previously you had one private key that was used to encryptt and decrypt messages. However it causes isses to securely distribute private key. 


Public key solves that. Every use will have a pair of (public and private key). Public key can be broadcasted to all.

For scenario 1, Alice wants to send secure message to Bob. Alice will take Bob's public key to encryp the message and her private key. Now Bob can decrypt the message with his private key. Bob didn't had to send ALice his private key. 

For scenario 2, Alice can digital signed the message with her private key, and anyone can verify using her public key that it was signed by Alice.

Etherium has various neetwork 

1. Main network 
2. private network like localhost
3. Testnet like Sepolia
4. Holešky network

Gas fees are paid by the Sender. There are 3 types of transcations

1. Ether transfer : It has `to' and 'from` field. Datafield is emtpy. Used for transfer ether

2. Contract deployment: `To` is empty, & data load is contract bytecode

 > To is specail address like zero or not

3. Contract Interaction: Transcation has encoded function call in the data field.  

EVM is a global singleton; each node has the same state. There are two types of accounts in Ethereum 

1. Externaly owned account (EOA) : IT has a private key. Used for sending ether or accessing contract code

2. Contract Account: It doens't have private key. canot initiate transcations. 


What's a facuet? A code that gives out ether to any address and can be refilled.