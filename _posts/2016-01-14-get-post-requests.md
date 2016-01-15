---
layout: post
title: Get all GET and POST requests using tshark  
category: blog
tags:
- tshark 
- REST
- HTTP
- GET
- POST
name: get-post
thumb: /img/shart.jpg
---

Browsers have made browsing insanely easy. Toolbar fetches webpage magically. However, under the hood, lots of `requests` are exchanged. These requests are based on `REST` architecture. 

What is REST? REST is **RE**presentational **S**tate **T**ransfer. Loosely speaking it defines how resources are exchanged based on item of request. Two most common HTTP Request Methods are `POST` and `GET`. Using tshark, we can see the headers exchange as you browse the web.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

Browsers have made browsing insanely easy. Toolbar fetches webpage magically. However, under the hood, lots of `requests` are exchanged. These requests are based on `REST` architecture. 

What is REST? REST is **RE**presentational **S**tate **T**ransfer. Loosely speaking it defines how resources are exchanged based on item of request. Two most common HTTP Request Methods are `POST` and `GET`. Using tshark, we can see the headers exchange as you browse the web.


<p> 
<img src="{{ root_url }}/img/shart.jpg" >
</p>


Check your network interface by typing (Mac or Linux) 

	$ ifconfig
	
Capture all `GET` and `POST` request using tshark on the network interface & save it to the file `~/out.ncap`. 

	$ tshark -i en1 -f 'port 80 and 
	(tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504F5354 or 
	tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420)' -w ~/out.ncap   
	
	
The above commands looks gibberish, however if you analyze closely, its plain easy. Lets read it line by line

1. `tshark`
    - Network Protocol Analyzer
1. `-i` 
    - Interface
2. `en1`
    - Name of the interface
3. `80`
    - Default `http` port number
4. `(tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x504F5354`
    - Take the upper 4 bits of the 12th octet in the tcp header  ( tcp[12:1] & 0xf0 )
    - multiply it by four `((tcp[12:1] & 0xf0)>>2)` which should give the tcp header length
    - Take Four octets from the tcp stream, starting at that offset `(tcp[(((tcp[12:1] & 0xf0) >> 2)):4])`
    - Lastly, verify that they are equal to POST which is 0x504F5354 in hex.     
5. `tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420)`
    - Like `POST` command, it checks for `GET` request. 
6. `-w`
    - Dumps the output
7. `~/out.ncap`
    - The output file


Now start surfing the web & see the `POST` & `GET` request by typing

	$ tail -f ~/out.ncap 


<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>


