---
layout: post
title: Do you have triskaidekaphobia?
category: blog
tags:
- superstition
- rationalism
- python
name: triskaidekaphobia
thumb: https://unsplash.com/photos/yHG6llFLjS0/download?w=437
summary: Homeopathy and pseudoscience
image: https://unsplash.com/photos/yHG6llFLjS0/download?w=437
author: Tushar Sharma
---


I grew up in India with a diet of basmati rice and superstition. I have seen pedestrians freezing at the sight of a black cat crossing their path for fear of bad luck. Lemon and chilis hang in front of vehicles to ward off bad spirits. I fondly remember numerous advertisements proclaiming protection from evil eyes. Recently I stumbled upon an ad that refreshed my memories.<!-- truncate_here -->


<center>
<img  class="thumb"  src="https://unsplash.com/photos/yHG6llFLjS0/download?w=437" alt="13 number" >
</center>

### Tryst with Superstition


I grew up in India with a diet of basmati rice and superstition. I have seen pedestrians freezing at the sight of a black cat crossing their path for fear of bad luck. Lemon and chilis hang in front of vehicles to ward off bad spirits. I fondly remember numerous advertisements proclaiming protection from evil eyes. Recently I stumbled upon an ad that refreshed my memories.


<iframe
  style="position: relative;  width: 100%;" 
   height="500"
  src="https://www.youtube.com/embed/3emy2HwSwuo&autoplay=1"
  srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/3emy2HwSwuo?autoplay=1><img src=https://img.youtube.com/vi/3emy2HwSwuo/hqdefault.jpg alt='Video Sidh Nazar Raksha Kavach '><span>▶</span></a>"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="Sidh Nazar Raksha Kavach "
></iframe><br>

Another gem is a video by Numerologist, Sanjay Sethi, for doling out remedies for protection from Evil eyes. "Take little raw milk on a Saturday or a Sunday and give 7 rounds of it around the affected person head and after that give that milk to a black dog to drink...(sic)".

<iframe
 style="position: relative;  width: 100%;"
 height="500"
  src="https://www.youtube.com/embed/zsHsIoNr-JA&autoplay=1"
  srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/zsHsIoNr-JA?autoplay=1><img src=https://img.youtube.com/vi/zsHsIoNr-JA/hqdefault.jpg alt='Video How to protect yourself from Evil Eye'><span>▶</span></a>"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="How to protect yourself from Evil Eye "
></iframe><br>



When I moved to the United States, I believed I left behind the ghost of superstition. A society not plagued with superstition and has a knack for scientific temperament. But my beliefs were shattered when I took an elevator to my new apartment. Why was floor 13<sup>th</sup> missing in the elevator?


<center>
<img  class="thumb"  src="https://unsplash.com/photos/TxprxES25nA/download?w=437" alt="13 number" >
</center>


My first hunch was that maybe the construction company skipped their arithmetic class in school. Little bemused I tried searching for a secret button for 13<sup>th</sup> floor like a secret entrance that of platform 9<sup>3</sup>&frasl;<sub>4</sub>
. In the movie Harry Potter and the Philosopher's Stone, Harry had to run through a magical wall to reach Hogwart express. Luckily my sanity prevented me from banging my head against the wall of the elevator.


<div class="js-lazytube" data-embed="" data-width="640"></div>

<iframe
   style="position: relative;  width: 100%;" 
   height="500"
  src="https://www.youtube.com/embed/MTykayOv_XA&autoplay=1"
  srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/MTykayOv_XA?autoplay=1><img src=https://img.youtube.com/vi/MTykayOv_XA/hqdefault.jpg alt='Video The Sorceror Stone- Platform Nine and Three Quarters'><span>▶</span></a>"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="The Sorceror Stone- Platform Nine and Three Quarters"
></iframe><br>


Why was the floor 13<sup>th</sup> missing? It's purely a business decision. 13 percent of Americans in a 2007 Gallup poll said that it would bother them to stay in a room on 13 floors in a hotel[^usa-poll]. In 2015, an NYC housing data firm called CityReality released that only 9% of all apartment buildings in NYC had 13th floor[^nyc]. Many airlines like Air France, Lufthansa, Iberia and Ryanair are some of the airlines that don’t have row number 13[^airline].

There's also a rather cute word to describe a fear of number 13 called **triskaidekaphobia**. I am an empiricist. I believe that all hypotheses must be tested against observations. So for me to fear number 13 , I have to be convinced not by any religious book or folklore but by data buttressed with empirical evidence.


<blockquote class="attention">
"The test of all knowledge is experiment. Experiment is the sole judge of scientific truth" - Richard Feynman
</blockquote>


One of my worst nightmare is dying in a plane mishap. So I wanted to understand is there a correlation between aviation accident and number 13?

### Coding in Python

The National Transportation Safety Board (NTSB) maintains a database of aviation accidents and incidents that can be accessed by the general public on the NTSB web site. That database contains information about accidents and selected incidents within the United States, its territories and possessions, and in international waters. The database also includes events involving US-registered aircraft that occur outside US territory[^air-safe].

So lets download `AviationData.txt` dataset and analyze aviation accident[^book].

```bash
$ mkdir aviation
$ cd $_
$ wget http://www.airsafe.com/analyze/AviationData.txt

```

Create a `requirements.txt` file for requried libraries.

```
$ cat > requirements.txt<<EOF
pandas
matplotlib
EOF
```

Set up `python` project

```bash
$ poetry init
$ cat requirements.txt | xargs poetry add
```


Creae a simple python file `job.py`.

<script src="https://gist.github.com/tushar-sharma/d5936bac5ff41e578895c13061f81fc3.js?file=ex2.py"></script>



This should print the following data.


<img src="{{ root_url }}/img/number_post_1.png" >

Remove dates which are empty.

```python
selection = df['date'] != ' '
df = df[selection]
```

Add three more columns to the `dataframe`

<script src="https://gist.github.com/tushar-sharma/d5936bac5ff41e578895c13061f81fc3.js?file=ex1.py"></script>

Next convert dates as `decimal` year.

<script src="https://gist.github.com/tushar-sharma/d5936bac5ff41e578895c13061f81fc3.js?file=ex3.py"></script>


<img src="{{ root_url }}/img/number_post_2.png" >

Convert Columns from `string` type to `float`.

<script src="https://gist.github.com/tushar-sharma/d5936bac5ff41e578895c13061f81fc3.js?file=ex4.py"></script>

Next we will plot the data  after 1981.

<script src="https://gist.github.com/tushar-sharma/d5936bac5ff41e578895c13061f81fc3.js?file=ex5.py"></script>


<img src="{{ root_url }}/img/number_post_3.png" >

If we only select dates on **13** and recompute our result.

<script src="https://gist.github.com/tushar-sharma/d5936bac5ff41e578895c13061f81fc3.js?file=ex6.py"></script>

<img src="{{ root_url }}/img/number_post_4.png" >

So flying on 13<sup>th</sup> doesn't have greatest number of aviation accidents.

### Conclusion

**Pro Tip**: Book your flights or hotels on 13<sup>th</sup> to avail discount.


### References

[^book]: Mastering Python Data Analysis by Luiz Felipe Martins
[^usa-poll]: [Gallop polll](https://news.gallup.com/poll/26887/thirteen-percent-americans-bothered-stay-hotels-13th-floor.aspx)
[^nyc]: [Why no 13th floor in my buildings](https://streeteasy.com/blog/why-no-13th-floor-in-many-buildings/)
[^air-safe]: [AirSafe.com](http://www.airsafe.com/analyze/ntsb.database.html)
[^airline]: [Some planes skip row numbers 13, 14 and 17 for this reason](https://www.news.com.au/travel/travel-advice/flights/some-planes-skip-row-numbers-13-14-and-17-for-this-reason/news-story/779508d9d3088a631217ee02480b2023)
