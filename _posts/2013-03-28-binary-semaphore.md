---
layout: post
title: Binary Sempahore
category: projects
tags: 
- projects
- binary semaphore
name: binary-semaphore
thumb: /img/code.png
---

<p>Implemented binary semaphore in Minix 3. Minix 3 is a micro-kernel operating system.</p>

Most of the process pass information among themselves using application IPC. This often result in race condition. To prevent it and provide synchronization, semaphores, first proposed by Dikstras, is used.<!-- truncate_here -->
- - -

[code][code]

- - -

Implemented binary semaphore in Minix 3. Minix 3 is a micro-kernel operating system. 

**About**

Most of the process pass information among themselves using application IPC. This often result in race condition. To prevent it and provide synchronization, semaphores, first proposed by Dikstras, is used. 

**Description**

Implemented a new system call in Minix 3 along with the library function that allows it to be called conveniently from a C program. The library interface extends different process to use semaphore. 

Binary Semaphore is used by processes to access the critical shared resources of the system. To demonstrate the working of semaphore, dining philosopher is implemented.

- - -

[code][code]

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>


[details]: /projects/binary-semaphore
[code]: https://github.com/tushar-sharma/dining_philosopher

<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
         <p>Image courtesy ~ <a href="https://opensourcewin.wordpress.com/2012/03/16/what-is-minix-linux/" target="_blank">OpenSourcewin.Wordpress.com</a>
</p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

