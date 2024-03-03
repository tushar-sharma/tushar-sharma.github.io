---
layout: post
title: Setup php on MacOS localhost
category: blog
tags:
- macos
- php
name: localhost-php-setup
thumb: /img/localhost.png
---

Users with the newest versions of Mac OS X (Mountain Lion or later) no longer see the option of web sharing in `System Preferences->Sharing`. If you are a web developer / designer, you might find this change unpleasant. However Mac OS X still includes Apache HTTP version. 
 
Testing web sites on your personal computer is indispensable for web developers / designers. Enabling `php` on Mac OX S is plain and easy. <!-- truncate_here -->


Users with the newest versions of Mac OS X (Mountain Lion or later) no longer see the option of web sharing in `System Preferences->Sharing`. If you are a web developer / designer, you might find this change unpleasant. However Mac OS X still includes Apache HTTP version. 
 
Testing web sites on your personal computer is indispensable for developers / designers. Enabling `php` on Mac OX S is plain and easy. 

First test your apache server. Open your terminal and type 

```bash
$ httpd -v 
```

If you see something similar, we are good to proceed.

```bash
Server version: Apache/2.4.16 (Unix)
Server built:   Jul 31 2015 15:53:26
```

Unix like operating system keep its configuration files in `/etc/`

```bash
$ cd /etc 
```

Copy the default `php` file.  The php.ini file is where you declare changes to your PHP settings. You can use the default settings for the server, change specific settings by editing the existing php.ini, or create a new text file and name it php.ini`.

```bash
$ sudo cp php.ini.default php.ini 
```

Open the following file & search line number containing  `libexec/apache2/libphp5.so` & uncomment it (remove the `#` from the front)

```bash
$ sudo pico /etc/apache2/httd.conf 
```

Save and close the editor by pressing **Control-O** followed by **Control-X**

Next we need to create `Sites` folder. It will be used for saving sites hosted on `localhost`.
    
```bash
$ sudo mkdir ~/Sites
$ sudo chmod o+r ~/Sites
$ sudo echo "<?php phpinfo(); ?>" > ~/Sites/phptest.php
$ sudo chmod o+r ~/Sites/phptest.php
```

Next, edit the following file. Write your username instead of `tushar`. 

```bash
$ sudo pico /etc/apache2/users/`whoami`.conf
```

For all systems other than Yosemite, use the following as the content:

```xml
<Directory "/Users/tushar/Sites/">
	Options Indexes MultiViews
	AllowOverride None
	Order allow,deny
	Allow from localhost
</Directory>
```

For Yosemite, use this content:

```xml
<Directory "/Users/tushar/Sites/">
	AddLanguage en .en
	LanguagePriority en fr de
	ForceLanguagePriority Fallback
	Options Indexes MultiViews
	AllowOverride None
	Order allow,deny
	Allow from localhost
	Require all granted
</Directory>
```

Enable the web server

```bash
$ sudo apachectl start
```

Change the permission of the configuration folder. 

```bash
$ sudo chown root:wheel /etc/apache2/users/*
$ sudo chmod 644 /etc/apache2/users/*
```

Restart the server

```bash
$ sudo apachectl restart
```

Lastly , go to `http://localhost` to confirm.

<p> 
<img src="{{ root_url }}/img/localhost.png" >
</p>