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

Ether is the native currency of Etherium. It is used to pay gas fees and transfer value. Every transcation that is sent to Ethereum and executed by EVM needs gas, even if it fails. Read only operations are free when called locally, because they are not stored on-chain.

After EIP-1559, gas fee has base fee and priority fee. Base fee is burned and priority fee goes to the validator.

```
1 gwei = 10^9 wei

1 ETH = 10^9 gwei = 10^18 wei 
```

Wallets stores keys. It could be software or hardware. Software wallets can also create and broadcast transcations. 

Private keys authorize the ownership of the address. They also authorize transcations by signing them.

Funds are not inside the wallet. Funds are in Ethereum state. Wallet just stores the key that can sign transcations from that address.

**Metamask** is one such wallet. There's a [chrome extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) or from their [website](https://metamask.io/download). 

Wallet generates a private key. Next you can generate public key from your private key. The last 20 bytes of hash of your public key is your address. 

```
private key is generated randomly

public key is generated from private key using elliptic curve cryptography (secp256k1)

address = last 20 bytes of Keccak-256 hash(public key)
```

In Ethereum, public key is usually hashed without the `0x04` uncompressed public key prefix. The rightmost 20 bytes of the Keccak-256 hash becomes the address.

Transcations use addresses to transfer ether or interact with contracts. `to` is inside the transcation. `from` is recovered from the digital signature. Transcations are stored inside blocks, and blocks are cryptographically linked using the parent block hash.

```
An address can logically look like 0x23..1bc
   ETH balance
   transcations count nonce 
   contract storage
   Smart contract code 
```

Nonce is number used once. Different blockchain uses nonce differently. In Ethereum, nonce is not a block id. For EOA, nonce counts the number of transcations sent from that account. For contract account, nonce counts the number of contracts created by that account.

Bitcoin uses UXTO model, where miners use nonce to perform proof of work.

What's differnce between private and public key? Previously you had one private key that was used to encryptt and decrypt messages. However it causes isses to securely distribute private key. 


Public key solves that. Every use will have a pair of (public and private key). Public key can be broadcasted to all.

For scenario 1, Alice wants to send secure message to Bob. Alice will take just use Bob's public key to encrypt the message. Now Bob can decrypt the message with his private key. Bob didn't had to send ALice his private key. 

Alice does not need her private key for encryption to Bob. She only needs Bob's public key. Her private key is needed when she wants to sign something.

For scenario 2, Alice can digital signed the message with her private key, and anyone can verify using her public key that it was signed by Alice.

Etherium has various neetwork 

1. Main network 
2. private network like localhost
3. Testnet like Sepolia
4. Holešky network

Gas fees are paid by the Sender. There are 3 types of transcations

1. Ether transfer : It has `to`, `value`, nonce, gas limit, gas fee fields and signature. Data field is empty. `from` is recovered from signature. Used for transfer ether

2. Contract deployment: `To` is empty, & data load is contract bytecode

 > To is empty/null, not the zero address. Data contains init code and contract bytecode.

3. Contract Interaction: Transcation has encoded function call in the data field.  

EVM is the execution environment for Ethereum. Each full node runs the EVM and maintains the same world state after processing the same chain of blocks. There are two types of accounts in Ethereum 

1. Externaly owned account (EOA) : IT has a private key. Used for sending ether or accessing contract code

2. Contract Account: It doens't have private key. canot initiate transcations. 

Contract account cannot initiate top-level transcations because it has no private key to sign a transcation. But contract code can call other contracts during execution when an EOA or another contract triggers it.


What's a facuet? A service or smart contract in testnet that gives out test ether to any address and can be refilled. Faucets exist because developers need testnet ETH to deploy and test contracts without spending real ETH.


## Aug 22, 2026

Lets revise a smart contract is written in high lelel programing language like Solidity and is converted to bytecode. A simple program: 


```c
pragma solidity 0.8.34;

//SPDX-License-Identifier: GPL-3.0

contract Faucet {
    function withdraw(uint256 _withdrawAmount, address payable _to) public {
        require(_withdrawAmount <= 100000000000);

        _to.transfer(_withdrawAmount);
    }

    // Function to receive ether when msg.data is empty
    receive() external payable {}

    // Function called when msg.data is not empty or no function matches
    fallback() external payable {}
}
```

Faucet is a smart contract that can transfer ether to another payable address.

How do you register a smart contract?

Create a special **transaction** called a contract-creation transaction. It does not have a normal destination address (`to` is empty / `null`); instead, the contract's initialization bytecode goes in the transaction `data`.

Example shape:

```json
{
  "from": "0xYourEOA...",
  "to": null,
  "value": "0x0",
  "data": "0x<contract init bytecode>"
}
```

Deploying a smart contract is not free. You pay gas for executing the initialization code and for storing the contract bytecode on-chain.

After successful deployment, the contract address is determined automatically by Ethereum. The deployer does not manually choose a normal contract address.

Internal calls: calls made by a smart contract while executing a top-level transaction. Top-level transactions are created and signed by externally owned accounts (EOAs).


### Ethereum node 

You can run full ethereum node. For that you need to download two clients : 

1. for execution e.g. Geth
2. for consensus e.g. Prysm


Other alternative is to use remote clients that can be connected to other ethereum node. They are also called wallets. e.g. metamask, coinbase wallet, etc.


Etherum clients can execute set of RPC commands over API. This is called JSON-RPC API and it follows [specification](https://www.jsonrpc.org/specification)

Remote clients don't validate block headers or transcations. This is done by light client in Bitcoin.

Cool trick , on termianl you can convert hexadecimal to decimal 

```sh
echo $((0x123234))
```
