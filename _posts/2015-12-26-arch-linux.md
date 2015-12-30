---
layout: post
title: Guide to install Arch Linux in Virtual Box
category: blog
tags:
- arch 
- linux
- virtual box
- install
name: arch-virtual
thumb: /img/lego.jpg
---

<style type="text/css">
.myheading{font-family:Georgia, "Times New Roman", Times, serif;font-size:24px;margin-top:5px;margin-bottom:0;text-align:center;font-weight:400;color:#222}
.mysubheading{font-family:"Lucida Grande", Tahoma;font-size:10px;font-weight:lighter;font-variant:normal;text-transform:uppercase;color:#666;margin-top:10px;text-align:center!important;letter-spacing:.3em}
</style>


<p>I started with my Linux adventure with Ubuntu. It gave me a respite from vendor-lock that's common with Microsoft Windows. Ubuntu gave me an out-of-the box usable system with a simplified installer and a clean interface of Unity (Ok! Some people hate it) which made me feel at home. As my familiarity with Linux grew, I found user-friendliness impeding to my learning. So I began searching for a new Linux disto until I fell in love with Arch Linux. </p>

Arch Linux is focused on simplicity, minimalism and code elegance. I soon found that installing Arch Linux was like a Lego game. You need to do little digging and tie other pieces together until they make sense while still reading the  <a href="https://wiki.archlinux.org/index.php/Beginners%27_guide" target="_blank">manual</a>. However building a usable Arch Linux is more simple than building a house in Lego.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


<script type="text/javascript" src="{{ root_url }}/js/shCore.js"></script>
<script type="text/javascript" src="{{ root_url }}/js/shBrushCpp.js"></script>
<link type="text/css" rel="stylesheet" href="{{ root_url }}/css/shCoreDefault.css"/>
<script type="text/javascript">SyntaxHighlighter.all();</script>

<p>I started with my Linux adventure with Ubuntu. It gave me a respite from vendor-lock that's common with Microsoft Windows. Ubuntu gave me an out-of-the box usable system with a simplified installer and a clean interface of Unity (Ok! Some people hate it) which made me feel at home. As my familiarity with Linux grew, I found user-friendliness impeding to my learning. So I began searching for a new Linux disto until I fell in love with Arch Linux. </p>

Arch Linux is focused on simplicity, minimalism and code elegance<sup><a href='#fn:1' rel='footnote'>1</a></sup>. I soon found that installing Arch Linux was like a Lego game. You need to do little digging and tie other pieces together until they make sense while still reading the  <a href="https://wiki.archlinux.org/index.php/Beginners%27_guide" target="_blank">manual</a>. However building a usable Arch Linux is more simple than building a house in Lego. 

<p> 
<img src="{{ root_url }}/img/lego.jpg" >
</p>


# Table of Contents 
{:.no_toc}

1. Will be replaced with the ToC, excluding the "Table of Contents" header
{:toc}


# Step 1 : Find a base

In Lego, we begin by find a base. This is a piece on which all other pieces could be clubbed together. For Arch Linux, we have three options for our base

1. Completely wipe off clean install 
2. Dual Boot 
3. **Hypervisor** 

<p><b>First Method</b> : Choose this option if you prefer to run only Arch Linux. Though GNU / Linux OS are becoming more usable day by day, yet many hardware vendors still shy away from publishing their drivers in the open source community. So some of your fancy NVIDIA graphic card, etc may not properly work here<sup><a href='#fn:2' rel='footnote'>2</a></sup>. However things may change in the future<sup><a href='#fn:3' rel='footnote'>3</a></sup>.</p>

<p><b>Second Method</b> : Most of the people opt for this option. This lets you to conveniently use your legacy system along side Arch Linux. You could easily switch back and forth any OS as you like. However this requires partitioning the file system and tinkering with the boot loader.</p> 

<p><b>Third Method</b> : This is great bet for those who prefers quick solution to run multiple OS without the hassle of memory partition.</p> 

**NOTE** : I'll be using Virtual Box, a hypervisor for x86 computers, for this guide to install Arch Linux. 



## What is an hypervisor?

Each operating system has its own complexity (architecture, HAL and device drivers, etc). In 1960's it was difficult to migrate operating system to new hardware. This was a problematic due to frequent hardware failures & cost of each hardware. Thus it was required to run multiple OS instances on a single hardware. This was achieved by decoupling OS from the hardware. 

So **hypervisor**

1. Behaves like hardware
2. Encapsulates all OS and application state 
3. Provides Software Abstraction

It uses **Virtualization layer (VMM)** which  

1. Decouples hardware, OS
2. Enforces isolation
3. Multiplexes physical hardware
across Virtual Machines

## Using Virtual Box 

Download <a href="https://www.virtualbox.org" target="_blank">Virtual Box</a> and create a new machine.


<p> 
<img src="{{ root_url }}/img/vbox_create.png" >
</p>

Allocate `RAM` to your VM (Virtual Machine). I've dragged it to 1g which is sufficient. However you could also run it with 128 Mb.

<p> 
<img src="{{ root_url }}/img/vbox_ram.png" >
</p>


Choose the default configuration for the virtual machine.

<p> 
<img src="{{ root_url }}/img/vbox_type.png" >
</p>

<p> 
<img src="{{ root_url }}/img/vbox_dy.png" >
</p>

<p> 
<img src="{{ root_url }}/img/vbox_harddisk.png" >
</p>


I've allocated 40g for the Arch Linux. However, you could also allocate as low as 8g according to your requirements. 

<p> 
<img src="{{ root_url }}/img/vbox_size.png" >
</p>


Select the downloaded **iso** file to install Arch Linux.


<p> 
<img src="{{ root_url }}/img/vbox_iso.png" >
</p>


# Step 2 : Plan your house

Next step in our Lego design, require us to plan our house. For Arch Linux, we need to prepare our system before installing Arch it. 

<p>After creating Arch Virtual Machine, you need to launch the machine. It splashes a bluish black screen with multiple options. I'll proceed with the first option which is load a 64 bits Arch Linux. </p>


<p> 
<img src="{{ root_url }}/img/arch_start.png" >
</p>


<p> 
<img src="{{ root_url }}/img/arch_root.png" >
</p>


Check all the available **sysfs filesystem** on the system. We only have one primary hard drive `/dev/sda`. 

    # lsblk

<p> 
<img src="{{ root_url }}/img/arch_lsblk.png" >
</p>
    
Next we need to partition the filesystem. I'll divide the filesystem into following


1.**BIOS Partition** : This is the partition for BIOS grub.  We set "bios_grub" flag on. 

2.**Boot Partition** : This is the partition for virtual "boot loader". 

3.**Swap Partition** : (Optional) This is used for computer to free use extra space, when computer with lots of applications running can free some `RAM`. 

4.**Root Partition** : This is the partition that serves as the highest level of your computer’s file system

5.**Home Partition** : This is the partition where rest of your files and personal settings will live.  


Each partition information is stored in "partition table". There are 2 main formats in use: the classic Master Boot Record, and the modern GUID Partition Table. I'll be using GPT partition table which is an improved version that does away with several limitations of MBR style.

To use **GPT partition**, type 

    # gdisk /dev/sda

<p> 
<img src="{{ root_url }}/img/arch_gdisk.png" >
</p>
    

To create five partion, follow five parts 

### Create Partition 1  

1. Type ‘n’ at the prompt and hit 'Return'.

2. When it asks for a partition number, hit ‘Return’ to accept the default (1).

3. When it asks for a “first sector”, hit 'Return' to accept the default.  This will start the partition at the beginning of your virtual hard disk.

4. When it asks for a “last sector”, type  '+32m'. This will create 32 megabytes in size, which is used for BIOS grub. 

5. When it asks for a "hex code", type 'EF02' and hit 'Return'


<p> 
<img src="{{ root_url }}/img/arch_gpt.png" >
</p>
    


### Create Partition 2


1. Type ‘n’ at the prompt and hit 'Return'.

2. When it asks for a partition number, hit ‘Return’ to accept the default (1).

3. When it asks for a “first sector”, hit 'Return' to accept the default.  This will start the partition at the beginning of your virtual hard disk.

4. When it asks for a “last sector”, type  '+1g'. This will create 1 gigabytes in size, which is used for bootloader partition. 

5. When it asks for a "hex code", type '8300' and hit 'Return'


### Create Partition 3


1. Type ‘n’ at the prompt and hit 'Return'.

2. When it asks for a partition number, hit ‘Return’ to accept the default (1).

3. When it asks for a “first sector”, hit 'Return' to accept the default.  This will start the partition at the beginning of your virtual hard disk.

4. When it asks for a “last sector”, type  '+2g'. This will create 2 gigabytes in size, which is used for swap partition. 

5. When it asks for a "hex code", type '8200' and hit 'Return'



### Create Partition 4

    

1. Type ‘n’ at the prompt and hit 'Return'.

2. When it asks for a partition number, hit ‘Return’ to accept the default (1).

3. When it asks for a “first sector”, hit 'Return' to accept the default.  This will start the partition at the beginning of your virtual hard disk.

4. When it asks for a “last sector”, type  '+15g'. This will create 15 gigabytes in size, which is used for root partition. 

5. When it asks for a "hex code", type '8300' and hit 'Return'

### Create Partition 5


1. Type ‘n’ at the prompt and hit 'Return'.

2. When it asks for a partition number, hit ‘Return’ to accept the default (1).

3. When it asks for a “first sector”, hit 'Return' to accept the default.  This will start the partition at the beginning of your virtual hard disk.

4. When it asks for a “last sector”, hit 'Return'. This will allocate remaining size, which is used for home partition. 

5. When it asks for a "hex code", type '8300' and hit 'Return'


### Write to Partition 

1. Type 'p' to see all the partition

2. Type 'w' to save the partition to the filesystem.



<p> 
<img src="{{ root_url }}/img/arch_gpt_write.png" >
</p>
    

You can also see your final filesystem, by typing 

    # fdisk -l  
    

<p> 
<img src="{{ root_url }}/img/arch_fdisk.png" >
</p>
    
Next we need to format our partitons before we install Arch Linux. However don't format the first partition i.e. `/dev/sda1`. 


    # mkfs -t ext4 /dev/sda2

    # mkfs -t ext4 /dev/sda4

    # mkfs -t ext4 /dev/sda5

 
Also format the swap space and switch it on. 


    # mkswap /dev/sda3

    # swapon /dev/sda3

# Step 3 : Build the walls 

<p>We are very close to building <strike>our house in Lego</strike> Arch Linux. We need to start building our <strike>walls</strike> system.
</p>

<p> 
<img src="{{ root_url }}/img/lego_walls.jpg" >
</p>


Linux follows the root hierarchy. So we need to mount the root partition first i.e. `/dev/sda4`.  

    # mount /dev/sda4 /mnt

    # cd /mnt

Next we need to mount partition for bootloader and home on root partition.

    # mkdir boot home

    # mount /dev/sda2 boot

    # mount /dev/sda5 home

    
Now we are ready to install Arch Linux on our system. Type the following command and sit back for few minutes before everything is loaded

    # pacstrap /mnt base base-devel


After this we need to install bootloader. When a computer loads up, it needs bootloader to find and load an operating system. There are many bootloaders to install like syslinux, grub, LILO, etc but we'll be using GRUB for this guide. To install GRUB type 

    # pacstrap /mnt grub

 Local and remote filesystem mounts a special file `/etc/fstab` which contains instructions on starting up all your Linux system’s various partitions. To generate `fstab` file type

    #  genfstab -p /mnt >> /mnt/etc/fstab
    #  nano /mnt/etc/fstab 

<p> 
<img src="{{ root_url }}/img/arch_fstab.png" >
</p>

# Step 4 : Add a roof 

You can't live in your Lego home before you add a roof. Similarly you can't reboot your system now before you initialize your Boot Loader. 

First you need to login to your system without rebooting. Type 
 
    # arch-chroot /mnt /bin/bash

    # grub-install --no-floppy /dev/sda


<p> 
<img src="{{ root_url }}/img/arch_grub_install.png" >
</p>

Lastly, generate the configuration file for the `grub`. 


    # grub-mkconfig -o /boot/grub/grub.cfg



Now you could easily reboot your system. However it's advised that you follow the last step to make it more usable. 


# Step 5 : Add final touches

We have built our little home, Arch Linux. However we need more than a blank terminal to stare at. 

First we’ll edit `/etc/locale.gen`. type 

    # nano /etc/locale.gen 

And uncomment the following two lines by removing the `#` from the front 

    en_US.UTF-8 UTF-8
    en_US ISO-8859-1


Generate the updated file by typing 

    # locale.gen

Change the hostname and enter the `hostname`

    # nano /etc/hostname

Change the time zone to your location

    # ln -s /usr/share/zoneinfo/America/New\_York /etc/localtime

And finally :) 

    # reboot

  

# Step 6 : Play with your house  

<p> 
<img src="{{ root_url }}/img/final.png" >
</p>


<p> 
<img src="{{ root_url }}/img/final_display.png" >
</p>

 




<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
         <p><a href="https://wiki.archlinux.org/index.php/Arch_Linux#Principles" target="_blank">Arch Linux Priniples</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>

    <li id='fn:2'>
         <p><a href="http://www.pcworld.com/article/2911459/why-nvidia-graphics-cards-are-the-worst-for-open-source-but-the-best-for-linux-gaming.html" target="_blank">Graphics Card NVIDIA</a></p> 
         <a href='#fnref:2' rev='footnote'>&#8617;</a>
    </li>

    <li id='fn:3'>
         <p><a href="http://arstechnica.com/information-technology/2013/09/nvidia-seeks-peace-with-linux-pledges-help-on-open-source-driver/" target="_blank">NVIDIA pledges support to Linux</a></p> 
         <a href='#fnref:3' rev='footnote'>&#8617;</a>
    </li>


  </ol>
</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>


[code]: https://github.com/tushar-sharma/lsdRadixSort.git

