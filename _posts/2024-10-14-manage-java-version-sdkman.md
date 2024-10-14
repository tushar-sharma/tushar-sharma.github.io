---
layout: post
title: Manage Java Version Using SDKMAN
image: https://unsplash.com/photos/x1Qw2gCPMUU/download?w=437
thumb: https://unsplash.com/photos/x1Qw2gCPMUU/download?w=437
author: tushar sharma
category: blog
tags:
 - java
---

As a Java developer, you often need to switch between multiple versions of Java for different projects. Managing this manually can be tedious, but SDKMAN! is a great tool that simplifies the process of installing, listing, and switching between Java versions.<!-- truncate_here -->


As a Java developer, you often need to switch between multiple versions of Java for different projects. Managing this manually can be tedious, but SDKMAN! is a great tool that simplifies the process of installing, listing, and switching between Java versions.

In this guide, we'll explore how to use SDKMAN! to:

List available and installed Java versions.

* Install specific Java versions.

* Switch between Java versions.

* Set default and local versions for your projects.

### Installing SDKMAN!

First, if you don't have SDKMAN! installed, you can install it by running the following commands in your terminal:

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

### To verify the installation, run:

```bash
sdk version
```

Once SDKMAN! is installed, you can list all available Java versions and the ones you have installed locally.


### List all available Java versions:

```bash
sdk list java
```

### List installed Java versions:

```bash
sdk current java
```

This will show you the Java versions you currently have installed on your machine.


### Installing a Specific Java Version

```bash
sdk install java 17.0.0-open

```

This command downloads and installs OpenJDK 17. SDKMAN! will set this version as the default unless you specify otherwise.


### Switching Between Java Versions

You may need to switch Java versions frequently, depending on your project. SDKMAN! makes this seamless.

#### Switch globally (set the default Java version):

To switch the default Java version globally (for all projects), use the sdk use command. For example:

```bash
sdk use java 11.0.0-open
```

This sets the default Java version system-wide to OpenJDK 11.


#### Switch locally (per project):

If you want to set a Java version for a specific project, navigate to your project folder and run:


```bash
sdk env init
```


This creates a .sdkmanrc file where you can specify the Java version. To apply the version defined in .sdkmanrc, simply run:

```bash
sdk env
```

SDKMAN! will automatically switch to the Java version specified in the project directory.

### Setting a Default Java Version

To set a default version that persists across terminal sessions:

```
sdk default java 17.0.0-open
```

This command sets OpenJDK 17 as the default version system-wide.
