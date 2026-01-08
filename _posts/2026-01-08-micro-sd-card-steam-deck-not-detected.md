---
layout: post
title: Fix MicroSD Card Not Detected on Steam Deck
category: blog
tags:
  - steam deck
name: micro-sd-card-steam-deck-not-detected
thumb: https://i.ytimg.com/vi/DpI2D2zkIQE/maxresdefault.jpg
summary: How to fix a MicroSD card not being recognized by SteamOS
image: https://i.ytimg.com/vi/DpI2D2zkIQE/maxresdefault.jpg
author: Tushar Sharma
published: true
---

I recently got a new [512GB MicroSD card](https://www.amazon.com/dp/B0CWPPMD8W) for my Steam Deck. After inserting it, SteamOS didn't recognize it. Here's how I fixed it via SSH.<!-- truncate_here -->

I recently got a new [512GB MicroSD card](https://www.amazon.com/dp/B0CWPPMD8W) for my Steam Deck. After inserting it, SteamOS didn't recognize it. Here's how I fixed it via SSH.

## Step 1: Connect via SSH


{% template  customCode.html %}
---
id: 9427a75117b3cb551f0f049e2e0e774d
file: ex1.sh
---
{% endtemplate %}

> Replace it with your Steam Deck's IP address. For informaiton on how to find it [here](https://randomwits.com/blog/add-non-steam-games-to-steam-deck)

## Step 2: Identify the SD Card

{% template  customCode.html %}
---
id: 9427a75117b3cb551f0f049e2e0e774d
file: ex2.sh
---
{% endtemplate %}

Look for the `mmcblk0` device:

```
mmcblk0      477.5G disk
└─mmcblk0p1  477.5G part
```

- `mmcblk0` - the SD card device
- `mmcblk0p1` - the partition

## Step 3: Create Partition Table

Wipe and create a fresh GPT partition table:

{% template  customCode.html %}
---
id: 9427a75117b3cb551f0f049e2e0e774d
file: ex3.sh
---
{% endtemplate %}

## Step 4: Format as ext4

SteamOS requires ext4 for game storage:

{% template  customCode.html %}
---
id: 9427a75117b3cb551f0f049e2e0e774d
file: ex4.sh
---
{% endtemplate %}

Verify the filesystem:

{% template  customCode.html %}
---
id: 9427a75117b3cb551f0f049e2e0e774d
file: ex5.sh
---
{% endtemplate %}

You should see `ext4` with label `steamdeck`.

## Step 5: Mount Using udisks

SteamOS uses udisks for mounting, not `/etc/fstab`:

{% template  customCode.html %}
---
id: 9427a75117b3cb551f0f049e2e0e774d
file: ex6.sh
---
{% endtemplate %}

The card mounts to `/run/media/deck/steamdeck`.

## Step 6: Add to Steam Library

1. Switch to **Desktop Mode**
2. Open **Steam**
3. Go to **Steam → Settings → Storage**
4. Click **Add Drive** (or the + button)
5. Browse to `/run/media/deck/steamdeck`
6. Click **Add**

## Verify in Game Mode

Return to Game Mode and check **Settings → Storage**. You should now see both:

- Internal SSD
- SD Card (~477 GB)

Your SD card is ready for installing games.
