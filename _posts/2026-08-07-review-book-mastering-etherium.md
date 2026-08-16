---
layout: post
title: "Mastering Ethereum: Implementing Smart Contracts"
image: https://thumbs.dreamstime.com/b/crypto-currency-market-mixed-media-businesswoman-using-tablet-pc-symbols-out-screen-d-rendering-171649622.jpg
thumb: https://thumbs.dreamstime.com/b/crypto-currency-market-mixed-media-businesswoman-using-tablet-pc-symbols-out-screen-d-rendering-171649622.jpg
author: tushar sharma
category: blog
---

These are my learning notes and reflections while reading the book. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<!-- disclaimer -->
<div class="book-notes-disclaimer">
  These are my rough notes while reading the book.
</div>

## Aug 15, 2026


Etheium is an unbounded state machine. 

> What's unbounded means here? 

Etheirum has EVM (Etherium virtual machine) that apply changes to the state machine.

> What's a state mahcine? A function that takes previous state, input parameter -> next state machine


### Comparision Bitcoin and Etherium 

1. Both are permissionles and open 


2. Participants uses P2P nework to communicate without trusted third party. Each node can act as client and serer. There's no dedicated server. 

> HTTP protocol is used by client server model. Is Gossip protocol used by P2P network. Browsers implments Http protocol, where it defines how a client can request HTTP request from a server and server can response with HTTP response. The request and response can be either REST standard if it's payload is JSON , XML if SOAP , or grpc if payload is binary

> What's gossip protocol when it comes to P2P network? 

3. IT uses Byzantine consensus algo for validating the writes to the ledger

> What's Byzantine? 

4. Both uses digital currency like etherium uses ether 

> Does Bitcoin uses bitcoin currency? 

5. Both ues digital signature and hashes. Hashes are one way function that generates a fixed length string from an arbitrrary output. It's easy to generate one way, but very difficult to decode it. 

### Types of blockchain 

|        | permissionless        | Permissioned |
----------------------------------|---------------

private  |          X             |   Canton
----------------------------------|---------------
open     | bitcoin, etherium      |   Hadera



Permissioned : Only authorized validators can participante in consensus

permissionless: Anyone can participante in consensus 

open: anyone can view the data

private: Only authorized parties can view the data

### Etherium compoennts

1. P2p network 

2. Etherium consist of two clients; one for apply consensus, other for exeucting smart contract. The smart contract lives on the ledger. It changes the singleton state on the ledger. 

3. EVM executes EVM byte code. High level langauge like Solidity can be compiled into machine instructions. 


### Turing Complete


Etherium is Turing complete distributed state machine. Lets understand turing complete. 

Alan Turning thought of a state machine that can change symbols by reading and writing form a sequential memory. He defined the term called Universal computablity. All the programs that can be solved by this machine which is a state machine . 

Not all programs are solvable. E.g. halting problem. WIthotu runnign the program, given an arbitrary program and its' input, see if the program will stop. In other words, find the path of a program before executing it. 

```python 
def foo(x : int):
  x = x * x 
  return x 
``` 

> Cant' we decide if this program will end ? It's the proof by negation?

The system which can simulate a Turing machine is called Turing Complete. And the system is called Universal Turing Machine. 

> Why universal ? 

Ehteirum is Universal Turing Machine. 

Turing completeness is easy to implmeent by just using fours tates and six symbols. Even SQL is turing complete. This creates a problem? If etherium can execute any program, it doens't know whether the program will end or not.


Etheirum adds a gas fee. It's a fee assoicated for runing the smart contract. Each smart contract has to define an upper bound for the gas fee. Gas fee can be purchased using ether. Every ether is included in every transcations. 

### Dapp

Dapp is a smart contracxt with a webinterface. So a web program on a distributed platform. 

> W3m is thrid version of web. current version which we access with the browser is called w2m. What was the first version ? Was it implemented by Tim Lee ?  