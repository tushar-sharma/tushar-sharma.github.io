---
layout: post
title: Huawei Usb Modem in Debian
category: blog
tags: 
- debian
- usb
- modem 
name: huawei-modem 
thumb: https://i.imgur.com/y6rUbX9.jpg
summary: Huawei Usb Modem in Debian
image: https://i.imgur.com/y6rUbX9.jpg
author: Tushar Sharma
---


The Debian claimed to be the Universal Operating System. Impressed by the stability and the community, I decided to switch to Debian. Earlier I used Fedora which handled all the hassles for me. Unlike Fedora, I had manually configure it to connect to the internet. But I soon realized it was not as difficult as it earlier seemed to be.<!-- truncate_here -->

The Debian claimed to be the Universal Operating System. Impressed by the stability and the community, I decided to switch to Debian. Earlier I used Fedora which handled all the hassles for me. Unlike Fedora, I had manually configure it to connect to the internet. But I soon realized it was not as difficult as it earlier seemed to be.


I'll be using `wvdial` to configure the internet. It's likely that your system will have the package pre installed. Otherwise you can manually download it from <a href="http://packages.debian.org/squeeze/wvdial" target="_blank">here</a>. 

Now connect the modem and run lsusb to see the modem connected to the usb:

	$ lusub


![w4](/img/w4.png "w4")

Here we see Huawie usb is visible as Huawei Wireless Data Modem. Become a super user by typing `sudo su`. Now for detecting the modem run:

	# wvdial /etc/wvdial.conf 

![w1](/img/w1.png "w1")

This scans the usb port for modem. In my case the modem was detected in ttyUSB0. Now edit the wvdial.conf file. I am accustomed to use vi editor. But you can use any editor like gedit, nano, etc. Just replace vi with the name of your editor

	# vi /etc/wvdial.conf

![w3](/img/w3.png "w3")

Remove the semicolons & change the following values:

	Username: internet
	Password: internet
	Phone   : #777

Also add the following lines to wvdial.conf

	Init3 = AT+CRM=1
	Stupid Mode = 1

Now run the following command.

	# wvdial

Bravo! It connects to the internet. Press <b>Ctrl + C</b> anytime to disconnect.