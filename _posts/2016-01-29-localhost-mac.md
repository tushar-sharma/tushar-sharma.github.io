---
layout: post
title: Guide to enable php on Mac OS X localhost
category: blog
tags:
- mac 
- os x
- localhost 
- php
name: localhost-mac
thumb: /img/localhost.png
---

<style type="text/css">
.myheading{font-family:Georgia, "Times New Roman", Times, serif;font-size:24px;margin-top:5px;margin-bottom:0;text-align:center;font-weight:400;color:#222}
.mysubheading{font-family:"Lucida Grande", Tahoma;font-size:10px;font-weight:lighter;font-variant:normal;text-transform:uppercase;color:#666;margin-top:10px;text-align:center!important;letter-spacing:.3em}
</style>

Users with the newest versions of Mac OS X (Mountain Lion or later) no longer see the option of web sharing in `System Preferences->Sharing`. If you are a web developer / designer, you might find this change unpleasant. However Mac OS X still includes Apache HTTP version. 
 
Testing web sites on your personal computer is indispensable for web developers / designers. Enabling `php` on Mac OX S is plain and easy. <!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>


<script type="text/javascript" src="{{ root_url }}/js/shCore.js"></script>
<script type="text/javascript" src="{{ root_url }}/js/shBrushCpp.js"></script>
<link type="text/css" rel="stylesheet" href="{{ root_url }}/css/shCoreDefault.css"/>
<script type="text/javascript">SyntaxHighlighter.all();</script>

 Users with the newest versions of Mac OS X (Mountain Lion or later) no longer see the option of web sharing in `System Preferences->Sharing`. If you are a web developer / designer, you might find this change unpleasant. However Mac OS X still includes Apache HTTP version. 
 
Testing web sites on your personal computer is indispensable for web developers / designers. Enabling `php` on Mac OX S is plain and easy. 

First test your apache server. Open your terminal and type 

	$ httpd -v 

If you see something similar, we are good to proceed.

	Server version: Apache/2.4.16 (Unix)
	Server built:   Jul 31 2015 15:53:26

Unix like operating system keep its configuration files in `/etc/`

	$ cd /etc 

Copy the default `php` file.  The php.ini file is where you declare changes to your PHP settings. You can use the default settings for the server, change specific settings by editing the existing php.ini, or create a new text file and name it php.ini`.

	$ sudo cp php.ini.default php.ini 

Open the following file & search line number containing  `libexec/apache2/libphp5.so` & uncomment it (remove the `#` from the front)

	$ sudo pico /etc/apache2/httd.conf 

Save and close the editor by pressing **Control-O** followed by **Control-X**

Next we need to create `Sites` folder. It will be used for saving sites hosted on `localhost`.
    
	$ sudo mkdir ~/Sites
	$ sudo chmod o+r ~/Sites
	$ sudo echo "<?php phpinfo(); ?>" > ~/Sites/phptest.php
	$ sudo chmod o+r ~/Sites/phptest.php

Next, edit the following file. Write your username instead of `tushar`. 
	
	$ sudo pico /etc/apache2/users/`whoami`.conf

For all systems other than Yosemite, use the following as the content:

	<Directory "/Users/tushar/Sites/">
		Options Indexes MultiViews
		AllowOverride None
		Order allow,deny
		Allow from localhost
	</Directory>
 
For Yosemite, use this content:

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

Enable the web server

	$ sudo apachectl start

Change the permission of the configuration folder. 

	$ sudo chown root:wheel /etc/apache2/users/*
	$ sudo chmod 644 /etc/apache2/users/*

Restart the server

	$ sudo apachectl restart

Lastly , go to `http://localhost` to confirm.

<p> 
<img src="{{ root_url }}/img/localhost.png" >
</p>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>

