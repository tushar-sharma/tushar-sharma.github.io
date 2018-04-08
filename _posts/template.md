---
layout: post
title: Your title
category: blog
tags:
- mytag
name: title-name
thumb: /img/random.jps
---
ccording to the 2015 census, Thailand has 2,892,311 Muslims, or 4.29% of the total population. 2,227,613 of these Muslims are concentrated in the southern region of the country, where they represent up to 24.33% of the population.[3]:wq

<style type="text/css">
.myheading{font-family:Georgia, "Times New Roman", Times, serif;font-size:24px;margin-top:5px;margin-bottom:0;text-align:center;font-weight:400;color:#222}
.mysubheading{font-family:"Lucida Grande", Tahoma;font-size:10px;font-weight:lighter;font-variant:normal;text-transform:uppercase;color:#666;margin-top:10px;text-align:center!important;letter-spacing:.3em}
</style>

<p> Some text</p>
Random shit... <!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<p> Random shit< /p>


1. Will be replaced with the ToC, excluding the "Table of Contents" header
{:toc}

# topic headline

<p>
<center>
<img src="{{ root_url }}/img/.png" >
</center>
</p>


<blockquote>
for no reason
</blockquote>

<a href='#fn:3' rel='footnote'>3</a></sup> miles per secon

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>


<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>

    <li id='fn:1'>
         <p><a href="https://www.buzzfeed.com/andreborges/13-eye-opening-facts-that-show-how-engineering-obsessed-indi" target="_blank">Buzzfeed.com</a></p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
    <li id='fn:2'>
         <p><a href="    http://www.dw.com/en/blame-victims-and-the-west-indias-way-of-justifying-sexual-assaults/a-37023646" target="_blank">Blame victims and the West</a></p>
         <a href='#fnref:2' rev='footnote'>&#8617;</a>
    </li>

    <li id='fn:3'>
         <p> Speed of Light </p>
         <a href='#fnref:3' rev='footnote'>&#8617;</a>
    </li>
    <li id='fn:3'>
         <p> <b>Translation:</b> You have the right to perform your actions,but you are not entitled to the fruits of the actions. Do not let the fruit be the purpose of your actions, and therefore you won’t be attached to not doing your duty. </p>
         <a href='#fnref:3' rev='footnote'>&#8617;</a>
    </li>


  </ol>
</div>
