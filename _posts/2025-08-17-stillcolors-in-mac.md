---
layout: post
title: "StillColor for macOS: Disable Temporal Dithering"
image: https://unsplash.com/photos/M2cFm9iHXSc/download?w=437
thumb: https://unsplash.com/photos/M2cFm9iHXSc/download?w=437
author: tushar sharma
category: blog
tags:
 - eyes
 - mac
---

What's a temporal dithering and why it's bad for our eyes?<!-- truncate_here -->

What's a temporal dithering and why it's bad for our eyes?

According to the [BetterDisplay wiki](https://github.com/waydabber/BetterDisplay/wiki/Eye-care:-prevent-PWM-and-or-temporal-dithering):

> Temporal dithering is a technique to produce more colors than what a display's panel (or display connection) can support (for example showing colors with 10 bit color depth – "billions of colors" – on an 8 bit – "millions of colors" – panel). When the display does not have the capability to show the full color depth, it will emulate missing colors by rapidly changing between two adjacent color levels, thus creating a middle ground.

Temporal dithering is a trade-off: it improves apparent color depth but can introduce subtle flicker that stresses the eyes. Tools like StillColor help remove it for a smoother, more comfortable viewing experience on Apple M1/M2/M3.

### Step 1. Check Dithering Status

Run the following command in Terminal:

```bash
ioreg -lw0 | grep -i enableDither
```

If dithering is enabled, you will see results like:

```bash
"enableDither" = Yes
"enableDither" = Yes
"enableDither" = Yes
"enableDither" = Yes
```

---

### Step 2. Download StillColor

1. Go to the [StillColor releases page](https://github.com/aiaf/Stillcolor/releases).  
2. Download the latest `.zip` file (e.g., `Stillcolor-v1.1.zip`).  
3. Extract and move **Stillcolor.app** into your Applications folder:

```bash
mv Stillcolor.app ~/Applications
```

---

### Step 3. Verify Dithering is Disabled

Run the same command again:

```bash
ioreg -lw0 | grep -i enableDither
```

Now you should see:

```bash
"enableDither" = No
"enableDither" = No
"enableDither" = No
"enableDither" = No
```

---

### Step 4. Launch StillColor

Open **StillColor** from Launchpad to keep dithering disabled. You can now enjoy a flicker-free display.