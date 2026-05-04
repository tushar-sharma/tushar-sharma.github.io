---
layout: post
title: "How to Disable Canton Coins on a Canton Validator"
image: 'https://unsplash.com/photos/SQG9tSKPeVM/download?w=437'
thumb: 'https://unsplash.com/photos/SQG9tSKPeVM/download?w=437'
author: tushar sharma
category: blog
skipImage: true
tags: [canton, blockchain, kubernetes, daml]
---

When running a Canton Validator node, the wallet component (which manages Canton Coin transactions) is enabled by default. If your use case does not require Canton Coins — for example, you are running a private or enterprise deployment and do not want to participate in the CC economy — you can disable it with a single configuration flag.<!-- truncate_here -->

---

## Background

The [Canton Network](https://www.canton.network/) is a blockchain infrastructure built on Daml. Each validator node ships with a **wallet** component that allows participants to hold, send, and receive **Canton Coins (CC)** — the native token of the network.

Disabling the wallet does not affect your validator's ability to process transactions or host Daml applications. It simply opts the node out of the CC-related smart contracts.

---

## The Configuration Flag

Canton validator configuration is written in [HOCON](https://github.com/lightbend/config/blob/main/HOCON.md) syntax. The flag to disable the wallet lives under the validator backend config block:

<div style="display:none;" markdown="1">
canton.validator-apps.validator_backend {
  enable-wallet = false
}
</div>

{% template  customCode.html %}
---
id: 680d6ef4cc728a77795a4884eac4acd2
file: validator-backend.conf
---
{% endtemplate %}

Setting `enable-wallet = false` prevents the validator from initialising the wallet app instance on startup.

---

## Applying It in a Kubernetes Deployment

The Canton validator image reads additional HOCON config from environment variables prefixed with `ADDITIONAL_CONFIG_`. This makes it straightforward to inject configuration via a Kubernetes `Deployment` without rebuilding the image.

Add the following env entry to your validator container spec:

<div style="display:none;" markdown="1">
- name: ADDITIONAL_CONFIG_DISABLE_WALLET
  value: |
    canton.validator-apps.validator_backend {
      enable-wallet = false
    }
</div>

{% template  customCode.html %}
---
id: 680d6ef4cc728a77795a4884eac4acd2
file: disable-wallet-env.yaml
---
{% endtemplate %}


A minimal deployment snippet showing this in context:

<div style="display:none;" markdown="1">
apiVersion: apps/v1
kind: Deployment
metadata:
  name: canton-validator-deploy
spec:
  template:
    spec:
      containers:
        - name: canton-validator-app
          image: ghcr.io/digital-asset/decentralized-canton-sync/docker/validator-app:<VERSION>
          ports:
            - containerPort: 5003
              name: validator-http
          readinessProbe:
            httpGet:
              path: /api/validator/readyz
              port: 5003
          env:
            # ... other required env vars ...

            - name: ADDITIONAL_CONFIG_DISABLE_WALLET
              value: |
                canton.validator-apps.validator_backend {
                  enable-wallet = false
                }
</div>

{% template  customCode.html %}
---
id: 680d6ef4cc728a77795a4884eac4acd2
file: validator-deployment.yaml
---
{% endtemplate %}

Replace `<VERSION>` with the validator app version you are deploying (e.g. `0.5.12`).

---

## How Additional Config Variables Work

The validator image merges all `ADDITIONAL_CONFIG_*` environment variables into its effective configuration at startup. Each variable is treated as a HOCON fragment and applied on top of the base config in alphabetical order by variable name. This means you can layer multiple overrides independently, for example:

| Variable | Purpose |
|---|---|
| `ADDITIONAL_CONFIG_DISABLE_WALLET` | Disable Canton Coin wallet |
| `ADDITIONAL_CONFIG_PERSISTENCE` | Configure Postgres storage |
| `ADDITIONAL_CONFIG_BFT_SCAN` | Set BFT scan client URLs |
| `ADDITIONAL_CONFIG_MIGRATION_ID` | Set domain migration ID |

---

## Verification

After deploying, check the validator logs for wallet-related startup messages. With `enable-wallet = false`, you should **not** see the wallet app initialisation output that appears in a default deployment.

You can also call the readiness endpoint to confirm the validator is up:

```bash
curl http://<VALIDATOR_HOST>:5003/api/validator/readyz
```

A `200 OK` response confirms the validator started successfully without the wallet.
