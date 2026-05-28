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

> The following component(s) are required to run this program: Microsoft Visual C++ Runtime

This is a common issue when certain runtime libraries (like `vcrun6sp6` or `vcrun2022`) are missing. This guide provides two solutions: one for **Proton games using Protontricks**, and one for **Lutris-based installations** (especially via Flatpak).

---

## 🧭 Solution 1: Using Protontricks (for Steam/Proton games)

### 1. Enter Desktop Mode

Hold the **POWER** button → Select **Switch to Desktop Mode**

### 2. Install Protontricks

Open the **Discover** store (blue shopping bag icon), then search for: `Protontricks` and install it.


### 3. Launch Protontricks GUI

Open **Konsole** (terminal), and run:

```bash
protontricks --gui
```


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

remember to enable it after installing

```bash
sudo steamos-readonly enable
```

## 🧩 Solution 2: Lutris (Flatpak) – Wine DLL Missing in Non-Steam Game

If you're using **Lutris installed via Flatpak** and running into missing DLLs like `isskin.dll`, follow these steps:

### 1. Create a Custom Wine Prefix

In terminal:

```bash
mkdir -p ~/Games/MyGamePrefix
WINEPREFIX=~/Games/MyGamePrefix wineboot
```

This sets up a new Wine environment specifically for your game.

### 2. Install the Missing Runtime (`vcrun6sp6`)

```bash
WINEPREFIX=~/Games/MyGamePrefix winetricks vcrun6sp6
```

This installs the required Microsoft Visual C++ 6.0 components, including `isskin.dll`.

> Make sure you have **native `winetricks` installed**, not the Flatpak version.  
> Install it with:

```bash
sudo pacman -S winetricks
```


### 3. Configure Lutris to Use This Prefix

- Open **Lutris**
- Right-click your game → **Configure**
- Go to the **Game Options** tab
- Set **Wine prefix** to: `/home/deck/Games/MyGamePrefix`


### 4. Relaunch the Game

Now that the correct DLL is available in the prefix, the game should launch without runtime errors.

## Solution 3: Use Nix

Nix is both a package manager and a build system.

Unlike pacman/apt, it installs everything into its own store (/nix/store) with exact versions and hashes.

It does not overwrite system files → so it works perfectly with SteamOS (where the root partition is tiny & immutable).

SteamOS 3.5+ even ships a /nix directory on the big /home partition, specifically to support it.

Install it : 

```bash
sh <(curl -L https://nixos.org/nix/install) --daemon

# This makes sure your shell picks up the Nix environment.
sudo reboot 

nix-env --version

# Start the Nix daemon manually

sudo systemctl start nix-daemon.service
# enable it in next boot
sudo systemctl enable nix-daemon.service

#  install winetricks 

nix-env -iA nixpkgs.winetricks
nix-env -iA nixpkgs.wine
WINEPREFIX=$HOME/.local/share/NonSteamGames/prefix winetricks vcrun6sp6
```

## Advanced Tip: Register a DLL Manually

If a DLL like `isskin.dll` is still not detected, you can download it manually (from a trusted source), place it in: `~/Games/MyGamePrefix/drive_c/windows/system32/`


Then register it using:

```bash
WINEPREFIX=~/Games/MyGamePrefix wine regsvr32 isskin.dll
```

---

## Summary

| Platform         | Tool             | Fix                                 |
|------------------|------------------|--------------------------------------|
| Steam/Proton     | Protontricks     | Install `vcrun2022` via GUI         |
| Lutris (Flatpak) | Wine + Winetricks| Create prefix, install `vcrun6sp6`  |