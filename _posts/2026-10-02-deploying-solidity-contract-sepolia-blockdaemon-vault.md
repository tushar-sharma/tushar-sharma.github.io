---
layout: post
title: "Publishing a Movie Rating to Ethereum Sepolia with Blockdaemon Vault"
author: tushar sharma
category: blog
tags: [blockchain, ethereum, solidity, sepolia, foundry, makefile]
published: false
---

This is a fictionalized walkthrough of a Solidity contract deployment and a separate data publication on Ethereum Sepolia. It uses a sample movie rating so the transaction flow is easy to follow without exposing the original project data.<!-- truncate_here -->

The Makefile command names and the Vault signing stages reflect the workflow I used. The contract name, payload, addresses, hashes, and command output below are illustrative. The movie contract is a fictional adaptation of the deployed contract's behavior, not its verified source code. To run this exact movie example, the transaction-building script must encode the <code>MovieRatingsPublisher</code> ABI and its <code>publishMovieRating</code> function.

## The three addresses

We need two Vault wallets and, after deployment, one contract address:

| Address | Role | Action |
| --- | --- | --- |
| <code>0x&lt;administrator-wallet-address&gt;</code> | Administrator wallet | Signs deployment and may replace the publisher. |
| <code>0x&lt;publisher-wallet-address&gt;</code> | Publisher wallet | Signs each movie rating publication. |
| <code>0x&lt;deployed-contract-address&gt;</code> | Smart contract | Receives publication transactions and stores the data. |

The first two addresses belong to wallets that can sign. The contract address is created by the deployment transaction and has no private key.

In Blockdaemon Vault, create two accounts and add <code>ETH (Ethereum/Sepolia)</code> as an asset for each one. Use one account for administration and the other for publishing.

<img src="{{ root_url }}/img/blockdaemon-vault.png" alt="Blockdaemon Vault Accounts page showing two accounts" />

This example runs on **Ethereum Sepolia**, chain ID <code>11155111</code>. The administrator wallet needs Sepolia ETH to deploy. The publisher wallet needs Sepolia ETH to publish a rating.

## What the contract stores

A <code>MovieRatingsPublisher</code> contract could use the same role and storage pattern with a fictional movie payload:

~~~solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract MovieRatingsPublisher {
    struct Rating {
        string classification;
        string ratedOn;
        string action;
    }

    struct MoviePayload {
        string movieId;
        string title;
        Rating rating;
    }

    address public administrator;
    address public pendingAdministrator;
    address public publisher;
    bytes32 public latestMovieKey;

    MoviePayload private latestMoviePayload;
    mapping(bytes32 movieKey => MoviePayload payload) private moviePayloads;

    error NotAdministrator();
    error NotPendingAdministrator();
    error NotPublisher();
    error InvalidAddress();
    error EmptyMovieId();

    event AdministratorTransferStarted(
        address indexed currentAdministrator, address indexed pendingAdministrator
    );
    event AdministratorTransferred(address indexed previousAdministrator, address indexed newAdministrator);
    event PublisherUpdated(address indexed previousPublisher, address indexed newPublisher);
    event MovieRatingPublished(bytes32 indexed movieKey, MoviePayload payload);

    constructor(address initialAdministrator, address initialPublisher) {
        if (
            initialAdministrator == address(0) || initialPublisher == address(0)
                || initialAdministrator == initialPublisher
        ) revert InvalidAddress();

        administrator = initialAdministrator;
        publisher = initialPublisher;
    }

    function publishMovieRating(MoviePayload memory payload) external {
        if (msg.sender != publisher) revert NotPublisher();
        if (bytes(payload.movieId).length == 0) revert EmptyMovieId();

        bytes32 key = movieKey(payload.movieId);
        latestMovieKey = key;
        latestMoviePayload = payload;
        moviePayloads[key] = payload;

        emit MovieRatingPublished(key, payload);
    }

    function setPublisher(address newPublisher) external {
        if (msg.sender != administrator) revert NotAdministrator();
        if (
            newPublisher == address(0) || newPublisher == publisher
                || newPublisher == administrator || newPublisher == pendingAdministrator
        ) revert InvalidAddress();

        address previousPublisher = publisher;
        publisher = newPublisher;
        emit PublisherUpdated(previousPublisher, newPublisher);
    }

    function transferAdministration(address newAdministrator) external {
        if (msg.sender != administrator) revert NotAdministrator();
        if (
            newAdministrator == address(0) || newAdministrator == administrator
                || newAdministrator == publisher
        ) revert InvalidAddress();

        pendingAdministrator = newAdministrator;
        emit AdministratorTransferStarted(administrator, newAdministrator);
    }

    function acceptAdministration() external {
        if (msg.sender != pendingAdministrator) revert NotPendingAdministrator();

        address previousAdministrator = administrator;
        administrator = msg.sender;
        delete pendingAdministrator;
        emit AdministratorTransferred(previousAdministrator, msg.sender);
    }

    function latestPayload() external view returns (MoviePayload memory) {
        return latestMoviePayload;
    }

    function movieRating(string memory movieId) external view returns (MoviePayload memory) {
        return moviePayloads[movieKey(movieId)];
    }

    function movieKey(string memory movieId) public pure returns (bytes32) {
        return keccak256(bytes(movieId));
    }
}
~~~

The constructor receives two different wallet addresses. Only the publisher can call <code>publishMovieRating</code>. The contract hashes <code>movieId</code> to form a storage key, keeps both the latest payload and the current payload for each movie ID, and emits the full payload in an event. Republishing the same ID replaces its current stored value; the earlier transaction and event remain on-chain. A first-time read for an unknown ID returns an empty struct, so callers should check the returned <code>movieId</code>.

Only the administrator can call <code>setPublisher</code> or <code>transferAdministration</code>. The new administrator must call <code>acceptAdministration</code> from the proposed wallet address before the handoff completes. These role changes emit events. Zero addresses and role collisions are rejected. These methods change who may publish or administer; they do not transfer ETH or move the contract to another address. A publisher change takes one signed transaction; an administration handoff takes two signed transactions from different wallets. The wallets that send those transactions need Sepolia ETH.

The JSON shown later is an **off-chain input**. The transaction builder converts its values into ABI-encoded calldata. Ethereum executes that calldata; it does not receive the JSON file as a file.

## Public configuration

Foundry provides <code>forge</code> to build and test Solidity and <code>cast</code> to build transactions and read the chain. The scripts also use <code>curl</code> and <code>jq</code>. A Makefile gives each stage a short name.

A local <code>.env</code> may contain public configuration such as URLs, chain IDs, and wallet addresses:

~~~dotenv
RPC_URL=https://svc.blockdaemon.com/ethereum/sepolia/native/rpc
VAULT_API=<your-vault-api-endpoint>
BD_WALLET_ADDRESS=0x<administrator-wallet-address>
ADMIN_WALLET_ADDRESS=0x<administrator-wallet-address>
PUBLISHER_WALLET_ADDRESS=0x<publisher-wallet-address>
CHAIN_ID=11155111
CAIP19=eip155:11155111/slip44:60
CONTRACT=src/MovieRatingsPublisher.sol:MovieRatingsPublisher
~~~

<code>BD_WALLET_ADDRESS</code> says which wallet signs the **deployment transaction**. Here it is the same address as <code>ADMIN_WALLET_ADDRESS</code>; it is not a third wallet.

The process receives <code>BD_RPC_API_KEY</code> and <code>BD_VAULT_API_KEY</code> from a secret manager. Source verification also needs <code>ETHERSCAN_API_KEY</code>. No API key or private key value belongs in the file or this post.

## Step 1: Build and prepare deployment

From the contract repository root:

~~~bash
make check-tools
make compile
make test
make check-rpc
make init-code
make unsigned-tx
~~~

| Command | Result |
| --- | --- |
| <code>make check-tools</code> | Confirms <code>forge</code>, <code>cast</code>, <code>curl</code>, and <code>jq</code> are installed. |
| <code>make compile</code> | Runs <code>forge build</code> to produce contract bytecode and an ABI. |
| <code>make test</code> | Runs <code>forge test</code>. |
| <code>make check-rpc</code> | Checks access to the Sepolia RPC endpoint. |
| <code>make init-code</code> | Adds the administrator and publisher constructor arguments to creation bytecode. |
| <code>make unsigned-tx</code> | Builds an unsigned deployment transaction from the administrator wallet. |

The creation bytecode and the two constructor addresses are part of the first transaction. The sample movie rating is **not** included. Before broadcasting, there is no contract address yet.

An example preparation result would look like:

~~~text
Init code written to .blockdaemon/init-code.hex
Constructor signature: constructor(address,address)
Unsigned transaction written to .blockdaemon/unsigned-transaction.hex
~~~

These files are local transaction artifacts, not Ethereum transactions.

## Step 2: Ask Blockdaemon Vault to sign

~~~bash
make sign-transaction
~~~

The script submits the unsigned deployment transaction to Blockdaemon Vault and saves a Vault operation ID locally. It has not sent anything to Sepolia yet.

~~~text
Vault makeTransaction started. operation_id=<vault-operation-id>
~~~

A Vault policy may require approval in its UI. After approval, or immediately if the policy completes the operation automatically:

~~~bash
make signed-transaction
~~~

This polls Vault and writes a signed, broadcastable transaction to <code>.blockdaemon/signed-transaction.hex</code>. The wallet's private key stays in Vault. If approval takes longer than the polling window, rerun this command after approval.

## Step 3: Broadcast the contract deployment

~~~bash
make publish
make receipt
~~~

Here <code>make publish</code> broadcasts the **deployment** transaction through an Ethereum RPC node. It does not publish the movie rating.

Illustrative output:

~~~text
Transaction published. tx_hash=0x<deployment-transaction-hash>
Receipt saved. status=0x1 contract_address=0x<new-contract-address>
~~~

The transaction hash identifies the deployment transaction. A receipt status of <code>0x1</code> means it succeeded. The receipt supplies the new contract address, which the script saves to <code>.blockdaemon/deployed-address.txt</code>.

At this point there are three addresses: administrator wallet, publisher wallet, and contract. Only **one** Ethereum transaction was needed to deploy the contract.

## Step 4: Verify deployment

~~~bash
make verify-deployment
make verify-source
~~~

<code>make verify-deployment</code> checks that the contract address has runtime bytecode and that its stored administrator and publisher match the configured addresses. <code>make verify-source</code> submits the source and constructor arguments to Sepolia Etherscan so a reader can inspect the verified code and ABI.

The contract still has no movie rating. Deployment and the first rating publication are separate Ethereum transactions.

## Step 5: Prepare a fictional movie rating

For the learning example, the publication JSON could be:

~~~json
{
  "movieId": "MOVIE-001",
  "title": "The Glass Harbor",
  "rating": {
    "classification": "PG-13",
    "ratedOn": "2026-10-02",
    "action": "New"
  }
}
~~~

This is deliberately fictional. The keys must match the contract's <code>MoviePayload</code> and nested <code>Rating</code> fields. The publication script must use the matching <code>publishMovieRating</code> ABI. The Makefile command names can stay the same when the ABI-specific builder is adapted.

## Step 6: Build and sign the data transaction

~~~bash
make data-unsigned-tx
~~~

The transaction builder reads the JSON, checks the publisher address on the deployed contract, and encodes a call to <code>publishMovieRating</code> for that contract address. It should print the destination and movie ID for review:

~~~text
Contract: 0x<deployed-contract-address>
Movie ID: MOVIE-001
Unsigned publication transaction written to .blockdaemon/data/unsigned-transaction.hex
~~~

The data transaction artifacts live under <code>.blockdaemon/data/</code>, apart from the deployment files. Check the printed destination before requesting a signature.

~~~bash
make data-sign-transaction
# Approve the publisher wallet operation in Vault if the policy requires it.
make data-signed-transaction
~~~

Now **the publisher wallet** signs. The administrator does not sign each rating publication. The signed transaction is still off-chain until broadcast.

## Step 7: Broadcast and read the data

~~~bash
make data-broadcast
make data-receipt
~~~

An illustrative result is:

~~~text
Transaction published. tx_hash=0x<publication-transaction-hash>
Receipt saved. status=0x1
~~~

The publisher sends one transaction **to the existing contract address**. The contract checks the sender, stores the movie rating, and emits a publication event. The receipt confirms execution; the event and transaction input show what was published.

For recurring updates, the same steps can be grouped around the Vault approval:

~~~bash
make data-request
# Approve in Vault if prompted.
make data-complete
~~~

The first command builds the data transaction and requests the publisher's signature. The second retrieves it, broadcasts it, and checks the receipt. The smaller commands remain useful for troubleshooting.

On a verified contract's **Read Contract** tab, a getter such as <code>movieRating("MOVIE-001")</code> would return the current value. An Ethereum read call does not send a transaction or spend Sepolia ETH.

## What changes on the next publication?

If the publisher submits another rating for <code>MOVIE-001</code>, the contract can replace that movie's current stored value. The earlier transaction and event remain in Ethereum's history. A new movie ID creates another current record.

Changing **data** uses a new publication transaction to the same contract. Changing the Solidity **code** requires a new deployment at a new address for this non-upgradeable design. All published movie fields are public; a Solidity <code>private</code> storage declaration does not hide on-chain data.
