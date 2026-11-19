---
layout: post
title: Build a Merkle Tree Verifier in Solidity with Foundary
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: 
category: blog
published: false
---

Dear Vishi, dear logs for today.<!-- truncate_here -->

Dear Vishi, dear logs for today.


## What's a Merkle tree?

It's a tree of hashes. In the binary Merkle tree we'll use here, each leaf is a hash of some data, and each parent is a hash built from its two children. We repeat this until we reach one hash at the top: the **Merkle root**.

```text
             root
           /      \
         P1        P2
        /  \      /  \
       L1  L2    L3  L4
```

Let's start with the basic idea:

- `L1`, `L2`, `L3`, and `L4` are hashes of individual pieces of data.
- `P1 = hash(L1 || L2)`.
- `P2 = hash(L3 || L4)`.
- `root = hash(P1 || P2)`.

Here, `||` means concatenate the bytes. We join the two hashes and hash the result. Later, we'll add a prefix and sort each pair so our Python code and Solidity code follow exactly the same rules.

Why is this useful?

1. **The root commits to the data.** Changing a leaf changes the hashes along its path to the root, producing a different root with overwhelming probability. This relies on the hash function being collision resistant. The tree itself can be rebuilt; a previously published root lets us detect that the data has changed.
2. **We can prove that one item belongs to the tree.** We need the item and the sibling hashes along its path. These sibling hashes form a Merkle proof. A leaf alone is generally not enough to reconstruct the root.
3. **The verifier only needs to keep the root.** Someone still needs the original data or tree information to generate proofs, but the smart contract can verify a supplied proof without storing the whole tree.

For example, to prove that `L1` belongs to the four-leaf tree above, we supply `L2` and `P2`. The verifier computes `P1` from `L1` and `L2`, then computes the root from `P1` and `P2`.

For a balanced binary tree with `n` leaves, a proof contains roughly `log2(n)` sibling hashes. That's the saving: the verifier processes a short path instead of the whole list.

## Smart contract

Let's build a checklist containing two task names: `build` and `test`. We'll generate its Merkle root in Python, put that root in a Solidity contract, and then prove that a task belongs to the checklist.

This assumes Foundry and Python 3 are installed. If you're starting a new project, run:

```shell
mkdir checklist
cd checklist
forge init
```

If you're following along in this repository, use its existing project directory and skip those setup commands.

In a separate terminal, start our local blockchain:

```shell
anvil
```

Leave this terminal running. By default, Anvil exposes an Ethereum JSON-RPC endpoint at `http://127.0.0.1:8545` and provides funded, unlocked development accounts. Run the remaining commands in your project terminal.

Anvil normally starts a fresh chain when restarted unless you configure state persistence. Our deployed contract belongs to that local chain, so keep the same Anvil instance running throughout this tutorial.

Create our simple smart contract in `src/Checklist.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Checklist {
  bytes32 public immutable root;

  constructor(bytes32 taskRoot) {
    root = taskRoot;
  }
}
```

Here, `bytes32` holds a 32-byte hash. The constructor receives the root when we deploy the contract.

`immutable` means the value is fixed during construction and cannot be changed afterward. Solidity embeds the assigned value into the deployed runtime bytecode wherever it is needed. It doesn't occupy a normal storage slot, and it isn't kept in EVM memory: memory is temporary working space for an execution.

`public` also gives us an automatically generated `root()` getter, which we'll call after deployment.

## Next, let's generate the root hash

Create `src/tree.py`:

```python
from hashlib import sha256

build_leaf = sha256(b"\x00" + b"build").digest()
test_leaf = sha256(b"\x00" + b"test").digest()

first, second = sorted([build_leaf, test_leaf])
root = sha256(b"\x01" + first + second).digest()

print("Build leaf:", build_leaf.hex())
print("Test leaf:", test_leaf.hex())
print("root:", root.hex())
```

Let's walk through the rules, because the contract must reproduce them exactly.

First, we hash each task's bytes with a `0x00` byte in front:

```text
build_leaf = SHA256(0x00 || UTF8("build"))
test_leaf  = SHA256(0x00 || UTF8("test"))
```

Python's byte literals contain the same bytes as UTF-8 for these ASCII task names. If we later use arbitrary Python strings, we'd encode them with `.encode("utf-8")`. Solidity hashes the bytes supplied in its `string` argument, so both sides must agree on the exact encoding, spelling, case, and whitespace.

Next, we sort the two 32-byte hashes and hash them with a `0x01` byte in front:

```text
parent(a, b) = SHA256(0x01 || min(a, b) || max(a, b))
root = parent(build_leaf, test_leaf)
```

The prefixes are single bytes, not the text strings `"0x00"` and `"0x01"`. They separate leaf inputs from parent inputs, so those two kinds of nodes have distinct encodings. This is called domain separation.

Sorting each pair means the verifier doesn't need an extra flag saying whether a sibling goes on the left or right. Python compares these byte sequences lexicographically; Solidity's comparison of equal-width `bytes32` values gives the same ordering. With a larger tree, we would apply this pair-sorting rule at every level.

This choice also means the proof doesn't establish a task's original position in a list. Swapping two siblings produces the same parent. We're proving membership in our checklist, not an ordered sequence of tasks.

Finally, `.digest()` returns the raw 32 bytes used in the next hash, while `.hex()` converts those bytes into readable hexadecimal for printing. Hashing the printed hex text would produce a different result.

Run it:

```shell
python3 src/tree.py
```

Expected output:

```text
Build leaf: eb770dbd044eb3d7e1d08f6010613e2449b3e2c141010c18383d9cdaf2812f7e
Test leaf: dbebd10e61bc8c28591273feafbbef95d544f874693301d8f7f8e54c6e30058e
root: e41dd0e6dd51e697092e0f1dfede0470e8413f78c498a46472a50e3a56d0905f
```

We're using SHA-256 in both languages. Ethereum commonly uses Keccak-256 elsewhere, but substituting it here would change every hash and break compatibility with this root. A Merkle root only makes sense together with its tree-building rules: hash function, input encoding, prefixes, pairing, and sorting. A larger implementation would also need an agreed rule for an odd number of nodes; this two-leaf example doesn't need one.

## Next, let's deploy the root

In the project terminal, set a few values we'll reuse:

```shell
RPC_URL="http://127.0.0.1:8545"
DEPLOYER="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
ROOT="0xe41dd0e6dd51e697092e0f1dfede0470e8413f78c498a46472a50e3a56d0905f"
```

`DEPLOYER` is the first account in a default Anvil instance. If you started Anvil with a different mnemonic or account configuration, use an unlocked account from its output.

Now deploy:

```shell
forge create src/Checklist.sol:Checklist \
  --rpc-url "$RPC_URL" \
  --from "$DEPLOYER" \
  --unlocked \
  --broadcast \
  --constructor-args "$ROOT"
```

`src/Checklist.sol:Checklist` identifies the source file and contract. `--constructor-args` passes our root into `taskRoot`, and the constructor assigns it to `root`. We include `0x` so the command represents the value explicitly as hexadecimal bytes.

`--broadcast` submits the deployment transaction. `--unlocked` tells Forge to send it through the node using the account selected by `--from`; this works with Anvil's unlocked development accounts. An address alone doesn't provide transaction-signing authority. Use this setup only with a local development node; a real network requires a signing method such as a keystore or hardware wallet.

Forge compiles the contract if needed, then prints the deployer, contract address, and transaction hash. Here's an example from a local deployment:

```text
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Transaction hash: 0x7a0c17c92857dd26c6bda63b9353c4bb4721007ecf37fe244bafcfb1893dffe0
```

Use the values from your own deployment. The transaction hash and gas usage can change with the compiled code and chain state. The deployed address depends on the sender and its nonce for this kind of deployment.

For the example above, we'd set:

```shell
CONTRACT="0x5FbDB2315678afecb367f032d93F642f64180aa3"
DEPLOY_TX="0x7a0c17c92857dd26c6bda63b9353c4bb4721007ecf37fe244bafcfb1893dffe0"
```

## Now let's inspect the transaction

```shell
cast receipt "$DEPLOY_TX" --rpc-url "$RPC_URL"
```

The receipt describes the result of executing the deployment transaction. Among the fields, look for:

```text
contractAddress      0x5FbDB2315678afecb367f032d93F642f64180aa3
from                 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
status               1 (success)
```

`contractAddress` is where the contract was created. `status` tells us execution succeeded. `gasUsed` measures the gas consumed, while `effectiveGasPrice` is the price paid per unit of gas. For this ordinary local deployment, their product gives the transaction fee in wei.

The receipt doesn't directly show the contract's `root` value. To read it, let's call the getter:

```shell
cast call "$CONTRACT" 'root()(bytes32)' --rpc-url "$RPC_URL"
```

Expected result:

```text
0xe41dd0e6dd51e697092e0f1dfede0470e8413f78c498a46472a50e3a56d0905f
```

`root()(bytes32)` tells Cast the function name, its empty argument list, and the return type to decode. Cast uses the node's `eth_call` JSON-RPC method to execute the getter against chain state. This call doesn't publish a transaction or charge a transaction fee, although the EVM still executes instructions to produce the result.

## Next, let's verify a task against the root

So far, our contract only holds the root. Let's extend it so we can supply a task name and a proof, recompute a candidate root, and check whether it matches.

Replace `src/Checklist.sol` with:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Checklist {
  bytes32 public immutable root;

  constructor(bytes32 taskRoot) {
    root = taskRoot;
  }

  function verify(string calldata task, bytes32[] calldata proof) external view returns (bool) {
    bytes32 node = sha256(abi.encodePacked(bytes1(0x00), task));

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 sibling = proof[i];

      if (node < sibling) {
        node = sha256(abi.encodePacked(bytes1(0x01), node, sibling));
      } else {
        node = sha256(abi.encodePacked(bytes1(0x01), sibling, node));
      }
    }

    return node == root;
  }
}
```

Let's follow what `verify` does.

First, it hashes the supplied task with the `0x00` prefix, giving us its leaf. `abi.encodePacked` joins the prefix and task bytes without padding or a length field, matching Python's byte concatenation. Here, the leaf encoding contains one fixed-width prefix and one string, and the parent encoding contains only fixed-width values, so the field boundaries are unambiguous.

Next, it walks through the proof. Each element is the sibling of our current node at the next level. We sort the pair with `node < sibling`, add the `0x01` prefix, and hash it. The resulting parent becomes `node` for the next iteration. For a larger tree, the proof must list siblings from the leaf level upward.

Finally, `node == root` checks whether the path reaches the root recorded at deployment. A matching proof returns `true`; a nonmatching proof returns `false`.

`external` makes the function callable from outside the contract. `calldata` lets it read its arguments from the call input without first copying the whole string or array into memory. `view` says the function reads contract state without modifying it, and `returns (bool)` declares its boolean result.

Before calling this new function, **deploy the updated contract again**:

```shell
forge create src/Checklist.sol:Checklist \
  --rpc-url "$RPC_URL" \
  --from "$DEPLOYER" \
  --unlocked \
  --broadcast \
  --constructor-args "$ROOT"
```

Update `CONTRACT` with the new `Deployed to` address from that deployment. Editing the source or compiling it doesn't change code already deployed on-chain. This contract has no upgrade mechanism.

If your project already contained the complete contract when you first deployed it, you can use that deployment directly.

## Now let's supply a proof

Our tree has only two leaves:

```text
                 root
                /    \
        test_leaf    build_leaf
```

`test_leaf` sorts before `build_leaf`, so this is their order when computing the parent. To prove that `test` belongs to the tree, the only sibling we need is `build_leaf`.

We can read that hash from `python3 src/tree.py`, then call:

```shell
PROOF="0xeb770dbd044eb3d7e1d08f6010613e2449b3e2c141010c18383d9cdaf2812f7e"

cast call "$CONTRACT" 'verify(string,bytes32[])(bool)' \
  'test' "[$PROOF]" \
  --rpc-url "$RPC_URL"
```

Expected result:

```text
true
```

`[$PROOF]` supplies an array containing one `bytes32` value. We pass the task's original text as the first argument because the contract computes its leaf internally.

The path is:

```text
"test"
  -> SHA256(0x00 || UTF8("test"))
  -> combine with build_leaf using the sorted-parent rule
  -> compare the computed root with the contract's root
  -> true
```

We can also verify `build`. This time, its sibling is `test_leaf`:

```shell
PROOF="0xdbebd10e61bc8c28591273feafbbef95d544f874693301d8f7f8e54c6e30058e"

cast call "$CONTRACT" 'verify(string,bytes32[])(bool)' \
  'build' "[$PROOF]" \
  --rpc-url "$RPC_URL"
```

This also returns `true`.

Now try a task that wasn't included, using the same sibling:

```shell
cast call "$CONTRACT" 'verify(string,bytes32[])(bool)' \
  'deploy' "[$PROOF]" \
  --rpc-url "$RPC_URL"
```

Expected result:

```text
false
```

The hash of `deploy`, combined with that sibling, doesn't produce our recorded root. Changing a task's case or adding a space would also change its leaf. A valid task with the wrong proof likewise fails to reach the root.

We've now moved from a list of task names to a single root, and from that root to checking an individual task with a short proof. The contract never needed to store the task list or the whole tree.

What we've proved is that a task name belongs to the checklist committed to by the root. This doesn't prove that somebody completed the task, enforce task order, or record progress. Those would require additional application rules and state. For now, our checklist contract answers one question: does this task and proof match the root we deployed?
