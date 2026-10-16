---
layout: post
title: Resolving chromedrive verification error in MacOS
image: 'https://unsplash.com/photos/3xQ65cknLPk/download?w=437' 
thumb: 'https://unsplash.com/photos/3xQ65cknLPk/download?w=437'
author: Tushar Sharma
tags:
  - macos
category: blog
skipImage: true
---

The MacOS Catalina (v 10.15.3) has a security feature known as Gatekeeper, which verifies downloaded applications. When you encounter the error: "chromedriver" cannot be opened because the developer cannot be verified, it's due to Gatekeeper restricting the execution of the chromedriver executable. This is because it doesn't recognize the developer, which is a common issue for developers and testers who use chromedriver for browser automation.<!-- truncate_here -->

The MacOS Catalina (v 10.15.3) has a security feature known as Gatekeeper, which verifies downloaded applications. When you encounter the error: "chromedriver" cannot be opened because the developer cannot be verified, it's due to Gatekeeper restricting the execution of the chromedriver executable. This is because it doesn't recognize the developer, which is a common issue for developers and testers who use chromedriver for browser automation.

Chromedriver is a separate executable that WebDriver uses to control Chrome. It's part of the Selenium project, which is a framework for conducting automated testing of web applications. WebDriver is an open standard for automating browsers, providing a way to interact with them in a way that mimics a human user.

Error while runing the chromedriver : 

```
Error: "chromedriver" cannot be opened because the developer cannot be verified
```

We can manually override this security feature for the chromedriver executable.

```bash
$ xattr -d com.apple.quarantine $(which chromedriver)
```

If the downloaded software is an application bundle instead of a command-line
executable, pass the path to the `.app` directory and remove the attribute
recursively. For example, an app installed in your user-level Applications
directory can be unquarantined with:

```bash
$ xattr -dr com.apple.quarantine "$HOME/Applications/xyz.app"
```

If your app is stored in `~/Application/xyz.app` (without the trailing `s`),
use that path instead:

```bash
$ xattr -dr com.apple.quarantine "$HOME/Application/xyz.app"
```
 
The command uses xattr, a utility for viewing and modifying extended attributes of file system objects. Extended attributes are metadata components that can be unique to specific files and applications. In this case, xattr -d is used to delete a specific extended attribute.

The attribute in question is com.apple.quarantine. This attribute is assigned to files downloaded from the internet or received via AirDrop to indicate that the file might be unsafe.

The $(which chromedriver) part of the command is a command substitution that finds the path of the chromedriver executable. which is a command-line utility that shows the full path of shell commands. For an application bundle, the `-r` option applies the change recursively to the bundle's contents.

By deleting the com.apple.quarantine attribute from the chromedriver executable, you're effectively telling MacOS that the chromedriver is safe, and it can be run without Gatekeeper's intervention. That's why the error "chromedriver" cannot be opened because the developer cannot be verified is resolved after running this command.
