---
layout: post
title: The Last Of Us Part 1 Steam Deck crashing
image: https://www.gamewallpapers.com/wallpapers_slechte_compressie/01wallpapers/wallpaper_the_last_of_us_part_1_01_1920x1080.jpg
thumb: https://www.gamewallpapers.com/wallpapers_slechte_compressie/01wallpapers/wallpaper_the_last_of_us_part_1_01_1920x1080.jpg
author: tushar sharma
category: blog
tags:
 - steam deck
---

If you've recently installed *The Last of Us Part I* on your Steam Deck using Lutris and it's crashing at launch, here's a step-by-step guide to get it running.
<!-- truncate_here -->

If you've recently installed *The Last of Us Part I* on your Steam Deck using Lutris and it's crashing at launch, here's a step-by-step guide to get it running.

### Launch the game

Install the game using **lutris**. Add `launcher.exe` as a **Non-Steam Game** to Steam, and rename it to: `The Last Of Us Part 1`. Launch the game let it crash. This creates the Proton prefix that Protontricks will use later.


### SSH Into Your Steam Deck

Use SSH to connect to your Steam Deck:

{% template  customCode.html %}
---
id: 3b990ba755d08f6946e0d1d2a77e78be
file: ex1.sh
---
{% endtemplate %}

Navigate to your Downloads folder and download the necessary installers:


{% template  customCode.html %}
---
id: 3b990ba755d08f6946e0d1d2a77e78be
file: ex2.sh
---
{% endtemplate %}

### Step 3: Install Dependencies with Protontricks

1. Open **Protontricks**.
2. Select *The Last of Us Part I*.
3. Click "Install an Application" and hit **OK**.
4. When the next prompt shows up, click **Cancel**.

After canceling, a window will open with more options:

- Choose **Run Explorer** and click **OK**.
- In the file browser, navigate to: `C:\home\deck\Downloads`
- Double-click both `vc_redist.x64.exe` and `dotnet-sdk-3.1.426-win-x64.exe` to install them.


**The Last of Us Part I**

Switch to **Game Mode** on Steam Deck and launch from there.