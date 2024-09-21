---
layout: post
title: Fix WSL2 internet connection while on VPN
category: blog
tags:
  - vpn
  - wsl
  - windows
name: wsl2-vpn-internet
thumb: 'https://unsplash.com/photos/0Fws0jyIt9s/download?w=437'
summary: How to fix WSL2 internet connection while on VPN
image: 'https://unsplash.com/photos/0Fws0jyIt9s/download?w=437'
author: Tushar Sharma
published: true
category: blog
---

Windows Subsystem for Linux (WSL2) provides native Linux environment for Windows. It's great alternative to `cygwin` which can't run native Linux apps. However WSL2 doesn't have out-of-box connectivity with internet once you connect with `vpn`.<!-- truncate_here -->

Windows Subsystem for Linux (WSL2) provides native Linux environment for Windows. It's great alternative to `cygwin` which can't run native Linux apps. However WSL2 doesn't have out-of-box connectivity with internet once you connect with `vpn`.

## Solution

### Step 1

Open `powershell` and get the list of `nameservers`

```powershell
Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object -ExpandProperty ServerAddresses
```

### Step 2

Retrive search domains via powershell

```
Get-DnsClientGlobalSetting | Select-Object -ExpandProperty SuffixSearchList
```

### Step 3

Open up wsl2, and run the following commands


```bash
# this will unlink the default wsl2 resolv.conf
sudo unlink /etc/resolv.conf 


# This config will prevent wsl2 from overwritting the resolve.conf file everytime you start wsl2
$ sudo bash -c 'echo "[network]" > /etc/wsl.conf'
$ sudo bash -c 'echo "generateResolvConf = false" >> /etc/wsl.conf'

$ sudo rm /etc/resolv.conf

# Add nameserver and search domain
$ sudo bash -c 'echo "nameserver 1.1.1.1" > /etc/resolv.conf'
$ sudo bash -c 'echo "nameserver 8.8.8.8" >> /etc/resolv.conf'
# Get following value from step 1
$ sudo bash -c 'echo "nameserver x.x.x.x" >> /etc/resolv.conf' 
# Get following value from step 2
$ sudo bash -c 'echo "search .com" >> /etc/resolv.conf'

# Make the new /etc/resolve.conf immutable
$ sudo chattr +i /etc/resolv.conf 
```

> Remove any nameserver that starts with 172.* or 192.

### Step 4 

Restart `wsl2` via powershell.

```powershell
Restart-Service LxssManager
```

Finally you can connect to internet with <strong>vpn</strong>. To verify run the following command:

```bash
$ nslook www.google.com
```
