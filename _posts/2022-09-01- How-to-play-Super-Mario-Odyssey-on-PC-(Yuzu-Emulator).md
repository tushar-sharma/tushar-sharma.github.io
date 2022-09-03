---
layout: post
title: How to play Super Mario Odyssey on PC (Yuzu Emulator)
tags:
  - game
thumb: https://unsplash.com/photos/_R95VMWyn7A/download?w=800"
summary: How to play Super Mario Odyssey on PC (Yuzu Emulator)
image: https://unsplash.com/photos/_R95VMWyn7A/download?w=800"
author: Tushar Sharma
---

Super Mario Odyssey is a 2017 video game has been voted as the one of the best Mario game ever made. The game is only available for Nitendo Switch. Luckily I end up playing the game on Windows nonetheless.<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %}</p>

Super Mario Odyssey is a 2017 video game has been voted as the one of the best Mario game ever made. The game is only available for Nitendo Switch. Luckily I end up playing the game on Windows nonetheless.

We need to download [yuzu](https://yuzu-emu.org/downloads/) emulator. Follow the instructions to install it on Windows. First download and install Microsoft Visual C++ redistributable. Next download `yuzu_install.exe`.

<blockquote class="attention">
If you get error, yuzu encryption keys are missing. <br><br>
Fix: Download the <a href="https://raw.githubusercontent.com/icosaswitch/Yuzu-NAND/master/prod.keys">prod</a> file.<br><br> 
On Yuzu Windows -> Go to File -> Open Yuzu folder <br><br>
Save the file under `keys` folder.
</blockquote><br>


I am assuming that you already download the game in a NSP package. Open `yuzu` emulator  and click on plus sign (Add new Game directory). Navigate to the game directory. 

| <img align="center"  loading="lazy" src="{{ root_url }}/img/yuzu1.png"  />|


If you don't have joystick, you might want to configure keyboard with `yuzu` emulator. Download [input.zip](https://drive.google.com/file/d/1IwMqMr8E0L_crNhhaWnYqSShTCqliRN8/view?usp=sharing). Extract the `zip` file under `Yuzu -> config -> input` folder.

You can got `Emulation -> configure -> Control` and see the connect controller indicated in green color.

You can launch the game by clicking the game icon.

| <img align="center"  loading="lazy" src="{{ root_url }}/img/yuzu2.png"  />|
