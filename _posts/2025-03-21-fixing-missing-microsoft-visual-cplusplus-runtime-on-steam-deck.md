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

When launching non-Steam games via Proton, you may encounter, following error.<!-- truncate_here -->

When launching non-Steam games via Proton, you may encounter, following error.

```
Following componet are required to run the program microsoft visual c++ runtime . steam deck proton experimental
```

### Enter Desktop Mode. 

Hold POWER button → Switch to Desktop Mode

### Install ProtonTricks

Open Discover (blue shopping bag icon)

Search → "Protontricks" → Install

Discover Store Protontricks Installation

4. Run ProtonTricks

Open Konsole (terminal) → Execute:

```bash
protontricks --gui
Target Your Game
```

Select from list: Non-Steam shortcut: Sifu.exe
(Replace "Sifu" with your game's EXE name)

If missing, run the game once in Gaming Mode first

### Install Runtime Components

```
Select → "Select the default wineprefix"
Choose → "Install a Windows DLL or component"
Check → vcrun2022 (Microsoft Visual C++ 2022 Redistributable)
ProtonTricks workflow
```

### Confirm Installation

Accept all prompts → Wait for "Install completed" message
