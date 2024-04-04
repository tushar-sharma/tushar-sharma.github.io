---
layout: post
title: 
image: 'https://unsplash.com/photos/flha0KwRrRc/download?w=800'
thumb: 'https://unsplash.com/photos/flha0KwRrRc/download?w=800'
author: Tushar Sharma
tags:
  - macos
category: blog
---

GlobalProtect is a security platform that extends the capabilities of a firewall to end-user devices. It is a product of Palo Alto Networks and it provides a network security infrastructure that prevents cyber threats regardless of what device is being used and from where. However, there might be instances where you would want to stop or disable this service. This can be done by modifying a specific system file, known as the LaunchAgent property list (plist) for GlobalProtect.<!-- truncate_here -->


GlobalProtect is a security platform that extends the capabilities of a firewall to end-user devices. It is a product of Palo Alto Networks and it provides a network security infrastructure that prevents cyber threats regardless of what device is being used and from where. However, there might be instances where you would want to stop or disable this service. This can be done by modifying a specific system file, known as the LaunchAgent property list (plist) for GlobalProtect.


The LaunchAgent plist is a type of file used by macOS systems to control the behavior of various services and applications. These files are written in XML and dictate when and how certain apps or services are launched, among other settings. In the case of GlobalProtect, the plist file of interest is `com.paloaltonetworks.gp.pangpa.plist`.


Open you terminal and type 

```bash
$ launchctl unload /Library/LaunchAgents/com.paloaltonetworks.gp.pangp*
```

If you wish to enable it again, type

```bash
$ launchctl load /Library/LaunchAgents/com.paloaltonetworks.gp.pangp*
```

If you want to change it 

The command to disable GlobalProtect service is:

```bash
$ sudo sed -i '' -e "s/true/false/g" /Library/LaunchAgents/com.paloaltonetworks.gp.pangpa.plist
```

Here, sudo is used to run the command with root privileges, which is necessary when modifying system files. -i option is for in-place editing of the file. -e option allows for the addition of the script to be executed. "s/true/false/g" is the actual sed command that replaces all instances of the string "true" with "false". This effectively changes the settings of the plist file to disable the GlobalProtect service.

To revert the changes and enable the GlobalProtect service again, the following command can be used:


```bash
$ sudo sed -i '' -e "s/false/true/g" /Library/LaunchAgents/com.paloaltonetworks.gp.pangpa.plist
```

This command is similar to the previous one, but it replaces instances of "false" with "true", thereby re-enabling the service.