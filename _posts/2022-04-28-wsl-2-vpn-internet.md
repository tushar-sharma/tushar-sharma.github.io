---
published: false
---
---
layout: post
title: Fix WSL2 internet connection while on VPN
category: blog
tags:
- vpn
- wsl2
- windows
name: wsl2-vpn-internet
thumb: https://unsplash.com/photos/yHG6llFLjS0/download?w=800
summary: How to fix WSL2 internet connection while on VPN 
image: https://unsplash.com/photos/yHG6llFLjS0/download?w=800
author: Tushar Sharma
---

<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %}</p>


## Step 1

Open `powershell` and get the list of `nameservers`

```powershell
Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object -ExpandProperty ServerAddresses
```

## Step 2

Retrive search domains via powershell

```
Get-DnsClientGlobalSetting | Select-Object -ExpandProperty SuffixSearchList
```


## Step 3

Open up wsl2, and run the following commands


```bash
# this will unlink the default wsl2 resolv.conf
sudo unlink /etc/resolv.conf 


# This config will prevent wsl2 from overwritting the resolve.conf file everytime
# you start wsl2
$ sudo nano /etc/wsl.conf
[network]                                                                        
generateResolvConf = false

$ sudo rm /etc/resolv.conf

# modify the file
$ sudo nano /etc/resolv.conf
nameserver 8.8.8.8
nameserver 1.1.1.1
nameserver 10.... # Get this value from Step 1
search .com # Get this value from Step 2

# Make the new /etc/resolve.conf immutable
sudo chattr +i /etc/resolv.conf 

```

**Note**: Make sure there's no namerserver that starts with 172.* or 192.

## Step 4 

Restart wsl2 via powershell.

```powershell
Restart-Service LxssManager
```


```bash
$ nslook www.google.com
```

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
