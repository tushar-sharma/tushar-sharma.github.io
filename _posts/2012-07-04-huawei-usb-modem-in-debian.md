---
layout: post
title: Huawei Usb Modem in Debian
category: blog
tags: debian huawei usb modem coding
name: huawei-modem 
thumb: /img/debian.jpg
---


The Debian claimed to be the Universal Operating System. Impressed by the stability & the community, I decided to switch to Debian. Earlier I used Fedora which handled all the hassles for me. Unlike Fedora, I had manually configure it to connect to the internet. But I soon realized it was not as difficult as it earlier seemed to be.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

The Debian claimed to be the Universal Operating System. Impressed by the stability & the community, I decided to switch to Debian. Earlier I used Fedora which handled all the hassles for me. Unlike Fedora, I had manually configure it to connect to the internet. But I soon realized it was not as difficult as it earlier seemed to be.


I'll be using <code>wvdial</code> to configure the internet. It's likely that your system will have the package pre installed. Otherwise you can manyally download it from <a href="http://packages.debian.org/squeeze/wvdial" target="_blank">here</a>. 

Now connect the modem & run lsusb to see the modem connected to the usb
<div class="highlight"><pre><code><span class="nv">$</span> lsusb</code></pre></div>

![w4](/img/w4.png "w4")

Here we see Huawie usb is visible as Huawei Wireless Data Modem. Now for detecting the modem run.
<div class="highlight"><pre><code><span class="nv">#</span> wvdial /etc/wvdial.conf</code></pre></div>

![w1](/img/w1.png "w1")

This scans the usb port for modem. In my case the modem was detected in ttyUSB0. Now edit the wvdial.conf file. I am accustomed to use vi editor. But you can use any editor like gedit, nano, etc. Just replace vi with the name of your editor


<div class="highlight"><pre><code><span class="nv">#</span> vi  /etc/wvdial.conf</code></pre></div>

![w3](/img/w3.png "w3")

Remove the semicolons & change the following values.

<div class="highlight"><pre><code>
Username: internet
Password: internet
Phone   : #777
</code></pre></div>

Also add the following lines to wvdial.conf

<div class="highlight"><pre><code>
Init3 = AT+CRM=1
Stupid Mode = 1
</code></pre></div>

Now run the following command.

<div class="highlight"><pre><code><span class="nv">#</span> wvdial</code></pre></div>

Bravo! It connects to the internet. Press <b>Ctrl + C</b> anytime to disconnect.

**Note:** You can also use the above method for other Linux distros. Some of the above commands require super user privelege. You can become super user simply be typing su. 


