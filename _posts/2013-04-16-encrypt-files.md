---
layout: post
title: Encrypted Files in Minix 3
category: projects
tags: 
- projects
- minix
- encrypted-files
name: encrypted-files
---

<link rel="stylesheet" href="../css/styles.css.css" />

Implemented encrypted files in Minix 3. Minix 3 is a micro-kernel operating system. 

[details][details] &mdash; [code][code]
<!-- truncate_here -->
- - -

[code][code]

- - -

Implemented encrypted files in Minix 3. The cipher used is simple Caesar's cipher.

**Description**

Implemented a new system call in Minix 3 along with the library function that allows it to be called conveniently from a C program. The library interface extends extends file access operations to handle encrypted files.

Reading and writing to a file is done through a system call. The first is to access the "master encryption table" file (/etc/encryptTable) that stores the information about every file that is encrypted within Minix and contains three pieces of information: fs_dev, inode_nr and hashed_pw. The first two information uniquely identifies what file is encrypted and can be obtained from the vnode for the file. 

- - -

[code][code]

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>


[details]: /projects/encrypt-files
[code]: https://github.com/tushar-sharma/encrypted-file-sytem
