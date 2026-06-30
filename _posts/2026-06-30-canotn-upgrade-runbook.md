---
layout: post
title: Runbook for Canton Node Upgrade
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
---

Upgrading Canton Node is a recurring process that needs to performed if you are operating your own node to communicate with Canton network. Both participant and validator needs to updated in a correct sequence else you might end up with a stale database state.<!-- truncate_here -->

Upgrading Canton Node is a recurring process that needs to performed if you are operating your own node to communicate with Canton network. Both participant and validator needs to updated in a correct sequence else you might end up with a stale database state.

First check the schedule at this location : https://sv-cal.canton.foundation/. 

This list all the shceudle and update so you can track. 

> Do not upgrade during a topological freeze window 

Next , check the version you want ot upgrade . 

go to https://canton.foundation/sv-network-status-2

We usually keep our all environment , devnet , testtnet and mainnet at same version. for mainent, as if this wriitng , it's veriosn 0.6.8 

```{
  "network": "mainnet",
  "sv": {
    "migration_id": 4,
    "serial_id": 5,
    "version": "0.6.8"
  },
  "synchronizer": {
    "current": {
      "chain_id_suffix": "2",
      "serial_id": 5,
      "version": "0.6.8"
    },
    "legacy": {
      "chain_id_suffix": "2",
      "serial_id": "4",
      "version": "0.6.7"
    },
    "successor": null
  }
}
```

## Images for participant and validator

Usually you just have to change the verison number

For participatn 

```
docker pull ghcr.io/digital-asset/decentralized-canton-sync/docker/canton-participant:0.6.8

docker pull ghcr.io/digital-asset/decentralized-canton-sync/docker/validator-app:0.6.8
```

> Participant needs to upraded first before validator

