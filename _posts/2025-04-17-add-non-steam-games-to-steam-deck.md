---
layout: post
title: How to add Non-Steam Games to Steam Deck
image: https://unsplash.com/photos/lEY5xl5D8CY/download?w=437
thumb: https://unsplash.com/photos/lEY5xl5D8CY/download?w=437
author: tushar sharma
category: blog
tags:
 - steam deck
---

I have a desktop for gaming, but ever since I got the Steam Deck, my gaming time has quadrupled. It's remarkable how well it handles even demanding games—it's like a Kindle for gaming. While the default SteamOS mainly supports games from the Steam store, you can actually play almost any game on the device.<!-- truncate_here -->

I have a desktop for gaming, but ever since I got the Steam Deck, my gaming time has quadrupled. It's remarkable how well it handles even demanding games—it's like a Kindle for gaming. While the default SteamOS mainly supports games from the Steam store, you can actually play almost any game on the device.

## Prerequisites

Before diving into the steps, ensure you have the following:

1. **Steam Deck**: Fully updated to the latest firmware.

2. **PC**: A computer to transfer game files (optional, but recommended).

3. **Wi-Fi Network**: Both your Steam Deck and PC should be connected to the same network.

4. **Terminal Access**: Familiarity with basic terminal commands is helpful.

5. **Game Files**: The non-Steam game files you want to install.

## Enable Desktop Mode

The Steam Deck runs on a custom Linux-based operating system called SteamOS. To add non-Steam games, you’ll need to switch to **Desktop Mode**.

1. **Power On** your Steam Deck.

2. **Hold the Power Button** until the power menu appears.

3. Select **Switch to Desktop** to enter Desktop Mode.

Once in Desktop Mode, you’ll have access to a full Linux desktop environment, allowing you to install and configure software.


In Desktop Mode, open the **Konsole** terminal (found in the Applications menu).


## Konsole Terminal

### Check the Username

The default username on the Steam Deck is `deck`. Confirm this by running:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal1.sh
---
{% endtemplate %}

### Find the IP Address

Next, find your Steam Deck's IP address:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal2.sh
---
{% endtemplate %}


Example output:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal3.sh
---
{% endtemplate %}

Take note of the IP address (e.g., `192.150.1.111`).


## Enable SSH on Steam Deck

To transfer files from your PC to the Steam Deck, enable SSH:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal4.sh
---
{% endtemplate %}

## Transfer Game Files to Steam Deck

On your PC, open a terminal and run:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal5.sh
---
{% endtemplate %}

## Install and Configure Lutris


Lutris is a popular open-source gaming platform for Linux that simplifies the process of running non-Steam games. It supports a variety of runners, including Wine, Proton, and native Linux games.

* Open Discover: In Desktop Mode, open the Discover Software Center (similar to an app store).

* Search for Lutris: Install Lutris from the Discover store.

* Install Wine and Dependencies: Lutris requires Wine to run Windows games. Install Wine and any necessary dependencies from Discover.

* Add Your Game:
  - Open Lutris and click the + button to add a new game.
  - Set the runner to Wine.
  - Browse to the game’s .exe file in `/home/deck/Games`.
  - Configure any additional settings (e.g., Wine version, DXVK, etc.).
  - Install and launch the game.


## Add the Game to Steam

To make the game accessible from SteamOS (Gaming Mode), you’ll need to add it to your Steam library.

* Open Steam in Desktop Mode.

* Click Add a Game > Add a Non-Steam Game.

* Browse to the game’s executable file. By default, Wine creates a virtual C: drive at: `/home/deck/.wine/drive_c/`

Add the game and ensure it appears in your Steam library.


##  Configure Proton Compatibility

For Windows games, you may need to enable Proton compatibility in SteamOS.

* In Gaming Mode, navigate to your library and select the non-Steam game.

* Go to Properties > Compatibility.

* Check Force the use of a specific Steam Play compatibility tool and select the latest version of Proton Experimental.

* Launch the game and enjoy!

## Common Issues and Fixes

###  Terminal Error: **Unable to Lock Database**

This error occurs when the package manager is locked by another process. Fix it by running:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal6.sh
---
{% endtemplate %}

### Missing Dependencies (e.g., isskin.dll)

Some games require additional libraries. Install them using winetricks:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal7.sh
---
{% endtemplate %}

### Invalid or Corrupted PGP Signature

This error can occur when updating packages. Fix it by reinitializing the keyring:

{% template  customCode.html %}
---
id: 77d64d5d24dc22c9b22ef53c1b3cc6c7
file: KonsoleTerminal8.sh
---
{% endtemplate %}
