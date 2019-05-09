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
"Well, in our country," said Alice, still panting a little, "you'd generally get to somewhere else—if you run very fast for a long time, as we've been doing."<br><br>
"A slow sort of country!" said the Queen. "Now, here, you see, it takes all the running you can do, to keep in the same place. If you want to get somewhere else, you must run at least twice as fast as that!"
</blockquote>

Leigh Van Valen, an evolutionary biologist, proposed Red Queen hypothesis that captures arms race between co-evolving species. Coevolution leads to situations where the probabily of extinction is relatively constant over millions of years(Van Valen 1973). In tightly coevolved interactions, evolutionary change of one species could lead to extinction of other species. The longer evolutionary history is neither better adopter or less adapted. So evolution doesn't have a progressive quality. The species thus have to run(evolve) to remain in the same place (extant)<sup><a href='#fn:1' rel='footnote'>1</a></sup>.
	
	
<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>

    <li id='fn:1'>
         <p><a href="http://www.indiana.edu/~curtweb/Research/Red_Queen%20hyp.h" target="_blank">Red Queen Hypothesis</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
    
    
  </ol>
</div>
	

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a> 	{% endif %}
</nav>