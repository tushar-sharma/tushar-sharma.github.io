---
layout: post
title: Fixing Missing Microsoft Visual C++ Runtime on Steam Deck
image: https://unsplash.com/photos/Urd-8c7N_pQ/download?w=437
thumb: https://unsplash.com/photos/Urd-8c7N_pQ/download?w=437
author: tushar sharma
category: blog
skipImage: true
tags:
 - steam deck
---

When launching non-Steam games via Proton or Wine on the Steam Deck, you may encounter the following error.<!-- truncate_here -->

When launching non-Steam games via Proton or Wine on the Steam Deck, you may encounter the following error:

{% template  customCode.html %}
---
id: 0537f40629aefbe99947a710e37c2d91
file: ex2.txt
---
{% endtemplate %}


This is a common issue when certain runtime libraries (like `vcrun6sp6` or `vcrun2022`) are missing. This guide provides two solutions: one for **Proton games using Protontricks**, and one for **Lutris-based installations** (especially via Flatpak).

---

## 🧭 Solution 1: Using Protontricks (for Steam/Proton games)

### 1. Enter Desktop Mode

Hold the **POWER** button → Select **Switch to Desktop Mode**

### 2. Install Protontricks

Open the **Discover** store (blue shopping bag icon), then search for: `Protontricks` and install it.


### 3. Launch Protontricks GUI

Open **Konsole** (terminal), and run:

{% template  customCode.html %}
---
id: 0537f40629aefbe99947a710e37c2d91
file: ex1.sh
---
{% endtemplate %}


From the list, select your game:
> Example: `Non-Steam shortcut: Sifu.exe`  
(If your game isn't listed, run it once in Gaming Mode first.)

### 4. Install Visual C++ Components

- Choose: `Select the default wineprefix`
- Then: `Install a Windows DLL or component`
- Check: `vcrun2022` or another relevant package (e.g. `vcrun6sp6`)

Accept all prompts and wait for confirmation.

If you are getting error: **Could not lock database: Read-only file system**, run this command


```bash
sudo steamos-readonly disable
```

## 🧩 Solution 2: Lutris (Flatpak) – Wine DLL Missing in Non-Steam Game

If you're using **Lutris installed via Flatpak** and running into missing DLLs like `isskin.dll`, follow these steps:

### 1. Create a Custom Wine Prefix

In terminal:

{% template  customCode.html %}
---
id: 0537f40629aefbe99947a710e37c2d91
file: ex3.sh
---
{% endtemplate %}

This sets up a new Wine environment specifically for your game.

### 2. Install the Missing Runtime (`vcrun6sp6`)

{% template  customCode.html %}
---
id: 0537f40629aefbe99947a710e37c2d91
file: ex4.sh
---
{% endtemplate %}

This installs the required Microsoft Visual C++ 6.0 components, including `isskin.dll`.

> ✅ Make sure you have **native `winetricks` installed**, not the Flatpak version.  
> Install it with:

{% template  customCode.html %}
---
id: 0537f40629aefbe99947a710e37c2d91
file: ex5.sh
---
{% endtemplate %}


### 3. Configure Lutris to Use This Prefix

- Open **Lutris**
- Right-click your game → **Configure**
- Go to the **Game Options** tab
- Set **Wine prefix** to: `/home/deck/Games/MyGamePrefix`


### 4. Relaunch the Game

Now that the correct DLL is available in the prefix, the game should launch without runtime errors.


## 🧪 Advanced Tip: Register a DLL Manually

If a DLL like `isskin.dll` is still not detected, you can download it manually (from a trusted source), place it in: `~/Games/MyGamePrefix/drive_c/windows/system32/`


Then register it using:

{% template  customCode.html %}
---
id: 0537f40629aefbe99947a710e37c2d91
file: ex6.sh
---
{% endtemplate %}

---

## ✅ Summary

| Platform         | Tool             | Fix                                 |
|------------------|------------------|--------------------------------------|
| Steam/Proton     | Protontricks     | Install `vcrun2022` via GUI         |
| Lutris (Flatpak) | Wine + Winetricks| Create prefix, install `vcrun6sp6`  |

By using the correct tools and setting up Wine prefixes properly, you can get even the trickiest non-Steam games running on your Steam Deck.
