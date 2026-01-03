---
layout: post
title: Fix jekyll jolt plugin using monkey patching
image: https://unsplash.com/photos/52jRtc2S_VE/download?w=437
thumb: https://unsplash.com/photos/52jRtc2S_VE/download?w=437
author: tushar sharma
tags:
 - jekyll
 - ruby
 - monkey-patching
category: blog
---

My existing `jekyll` website started failing newer jekyll version: `4.4.1`. I had to do a **monkey patch** to resolve this error.<!-- truncate_here -->

My existing `jekyll` website started failing with newer jekyll version: `4.4.1`. I had to do a **monkey patch** to resolve this error. 

The build started failing 

```
  Liquid Exception: undefined method `=~' for 1:Integer in _posts
```

The post responsible for the error uses [jekyll-jolt](https://github.com/helpscout/jekyll-jolt). 
## Monkey Patching

A **monkey patch** is a technique in dynamic languages (like Ruby) where you modify or extend existing code at runtime without changing the original source files. The name comes from the idea of "monkey-wrenching" your way into existing code—it's a quick and sometimes crude fix.


### Key Characteristics

- **Runtime modification**: Changes are applied when the code runs, not during compilation

- **No source changes**: You don't modify the original library files

- **Permanent for the session**: The modifications persist throughout your application's runtime

- **Global scope**: Changes affect all code using that class/module

### The Problem

The `jekyll-jolt` gem has a method called `prop?` that checks if a string matches a certain pattern. However, it doesn't handle integer values properly—it assumes all input is a string. When an integer is passed, the method crashes because integers don't respond to the regex matching operation.

### The Solution: The Monkey Patch

Create a file `_plugins/jekyll_jolt_fix.rb`. Jekyll automatically loads all `.rb` files in the `_plugins/` directory. When this file loads, Ruby reopens the `Jekyll::Tags::TemplateBlock` class and replaces the buggy `prop?` method with our fixed version. From that point forward, any call to `prop?` uses our improved implementation.


{% template  customCode.html %}
---
id: b31870337e3c92ff9128e34822dcdbb9
file: jekyll_jolt_fix.rb
---
{% endtemplate %}