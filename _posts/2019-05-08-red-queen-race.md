---
layout: post
title: Red Queen Race 
tags: 
- evolution 
- arms race
- biology
name: red-queen-race
thumb: TODO
visible: 1
---

<div>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </div>
<div style="clear:both;padding-top:20px;padding-bottom:20px;"></div>


Lewis Caroll was not only a wolrd famous children's writer but also a mathematician. Hence it's not surprising to find intriguing logics in his writings. One such writing that I stumbled upon was an incident that appears in Lewis Carroll's Through the Looking-Glass. 

<blockquote>
"Well, in our country," said Alice, still panting a little, "you'd generally get to somewhere else—if you run very fast for a long time, as we've been doing."

"A slow sort of country!" said the Queen. "Now, here, you see, it takes all the running you can do, to keep in the same place. If you want to get somewhere else, you must run at least twice as fast as that!"
</blockquote>


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a> 	{% endif %}
</nav>