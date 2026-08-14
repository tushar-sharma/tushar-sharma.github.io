---
layout: post
title: Mastering Ethereum: Implementing Smart Contracts
image: https://thumbs.dreamstime.com/b/crypto-currency-market-mixed-media-businesswoman-using-tablet-pc-symbols-out-screen-d-rendering-171649622.jpg
thumb: https://thumbs.dreamstime.com/b/crypto-currency-market-mixed-media-businesswoman-using-tablet-pc-symbols-out-screen-d-rendering-171649622.jpg
author: tushar sharma
category: blog
published: false
---

These are my learning notes and reflections while reading the book. I plan to update this periodically as I progress through the book.<!-- truncate_here -->

<!-- disclaimer -->
<div class="book-notes-disclaimer">
  These are my rough notes while reading the book.
</div>

---

Etherium is a blockchain it uses ether as currency.  Bitcoin is also a blokchain , it uses bitcoin currency?

Etherium is an unbounded state machine. A state machine is a design system with precomputed states based on some logics. 

Etheirum has a singletone state and a virutal machine. Virtula Machine allows other OSes to run on host computer using logical partition. Like VMWare had a virutal machine. 

The Etheirum virtual machine (EVM) executes smart contract.  Think of smart contract as the code that is is saved on the ledger.

## Similarties of Etherium with Bitcoin

1. Participants uses P2P network through gossip protocol without the need of a trusted third party. Gossip protoocol is used for P2P network unlike HTTP protocol? 

2. It has byzantine fault tolernace ? 

3. It has a digital currency. Etherium has ether

4. Use Digital signature and hashes for cyrptographical verification 

## Differnce between Etherium and Bitcoin

1. Etherium language is Turing computer. A turing complete was proposed by Alan Turing. He divided problems in solvable and non-solvable like the halting problem. A universal turing computer can theoritcall solve any problem or run any algorithm that's art of sovlable set. 

 A halting probllem is that it's impossioble to detec if a progtram will stop evnetually without running it ? what's so important about this ? 

2. Bitcoin has very limited scripting language

3. Etherium migrated from Proof of Work to Proof of Stake. IN proof of stake, validators stake part of their currency to validate the transcations. But why ? Do they get new rewards?

## Components of a blockchain 

1. Blockchain is a distributed state machine . I thoght it was distributed ledger ? 

2. P2p network for communication 

3. Messages are communicated using trnascations whichi have a sender, recipients, and a payload 

4. Game theory based incentivized schme like PoW or PoS 

5. Bitcoin has just one clinet, etheirum has two clients: one for consensus, other for executing smart contract. 

## Categories of blockchain 

1. permission less ; everyone is open the join the network

2. permissioned : Only approved participants can join the network

3. public

4. private 

Bitcoin is a distributed consensus state machine. Etherium is also a distrubuted consensus state machine but also has a EVM . Bitcoin only keep track of the change of ownershipoof coins. Etheirum also keep track of general purpsoe data store , key value topic. Is this smart contract ?

## Etherium Components

1. a p2p nework using devP2p runing on port 30303 

2. Transcations = network messages 

3. EVM which executes byte code called smart contract. We can use any langhuage to conver it to byte code in etherium. 


You can create a turin gcomplete machine with smallest 4 states and six symbols ? ownershipoof

Modenr printers are turing complete , so you can snet them file that could freeze them . How to do that ?

