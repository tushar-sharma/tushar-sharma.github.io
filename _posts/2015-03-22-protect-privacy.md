---
layout: post
title: Protect Your Privacy 
category: blog
tags:
- privacy 
- surveillance
- snooping 
name: protect-privacy
thumb: /img/privacy.jpg
---

"If you've got nothing to hide, you've got nothing to fear". This is the most common retort used by governments to espouse Mass surveillance. They do it in the pretext of security. But even if you're not a fugitive, you have the right to protect your privacy. 

Privacy is not all about hiding bad things. Surveillance, for example, can inhibit such lawful activities as free speech, free association, and other First Amendment rights essential for democracy.
<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

"If you've got nothing to hide, you've got nothing to fear". This is the most common retort used by governments to espouse Mass surveillance<sup id='fnref:1'><a href='#fn:1' rel='footnote'>1</a></sup>. They do it in the pretext of security. But even if you're not a fugitive, you have the right to protect your privacy. 

<img src="{{ root_url }}/img/privacy.jpg" >

#### Why should you care ? 

Privacy is not all about hiding bad things. Surveillance, for example, can inhibit such lawful activities as free speech, free association, and other First Amendment rights essential for democracy.

Edward Snowden leaked the largest infamous clandestine mass surveillance by the NSA and GCHQ called PRISM (surveillance program)<sup id='fnref:2'><a href='#fn:2' rel='footnote'>2</a></sup>. The prism program taps into the system of technolgoy giants like Apple, Google, Microsoft, Facebook, etc. Since many of the world's leading technology companies are based in the U.S. , anybody who uses Google or Skype can have their privacy violated through prism. 


#### What all can you do

##### Use Encrypted Google

When you click search items, your search history is sent to the site you searched on (in the HTTP referrer header). In addition, when you visit any site, your computer automatically sends information about it to that site (including your User agent and IP address). This information can often be used to identify you directly.

Try using <a href="https://encrypted.google.com" target="_blank">Encrypted Google (HTTPS)</a>. It doesn't usually send your search terms to sites

##### If possible, try another search engine

Sometimes even Encrypted Google may not be completely anonymous. Google is vulnerable to Subpoena. Since Google is a ubiquitous giant in searching, it's difficult to fathom any other alternative search engine. 

However you can use Google results as well as keep your anonymity. 

<img src="{{ root_url }}/img/start_page.png" >

<a href="https://startpage.com/" target="_blank">Startpage Web Search</a> fetches results from the Google search engine. This is done without saving the users' IP addresses or giving any personal user information to Google's servers.

<img src="{{ root_url }}/img/ddg.png" >

<a href="https://duckduckgo.com/" target="_blank">Duckduckgo.com</a> is a Metasearch engine that emphasizes protecting searchers' privacy and avoiding the <a href="http://en.wikipedia.org/wiki/Filter_bubble" target="_blank">filter bubble</a> of personalized search results . 

One cool feature I like about DuckDuckGo is !bang syntax that lets you do many interesting things. You can also search Google anonymously by prepending !g to your search term.

<img src="{{ root_url }}/img/ddg_search.png" >

##### Use Encryption

Most movies depicts encryption as quixotic tool used by computer geeks trying to counter espionage. However it could be used by common people to protect their privacy from unscrupulous marketers and identity thieves.  

<img src="{{ root_url }}/img/tor_bundle.jpg" >

Tor Browser Bundle could be easily used to communicate anonymously on the Internet.

You could also use <a href="http://en.wikipedia.org/wiki/Pretty_Good_Privacy" target="_blank">Pretty Good Privacy</a>. It was created by Phil Zimmermann. He encouraged widespread use of cryptography. He believed that everybody deserved the right to privacy. It could be used for signing, encrypting, and decrypting texts, e-mails, files, directories, and whole disk partitions and to increase the security of e-mail communications. 

Though using all these may not give you impregnable security or anonymity, but it certainly will make you less vulnerable to Mass surveillance. 


<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
         <p> <a href="http://en.wikipedia.org/wiki/Mass_surveillance" target="_blank">Mass Surveillance</a> </p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>

    <li id='fn:2'>
         <p> <a href="http://en.wikipedia.org/wiki/PRISM_(surveillance_program)" target="_blank">PRISM</a> </p>
         <a href='#fnref:2' rev='footnote'>&#8617;</a>
    </li>

  </ol>
</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>


