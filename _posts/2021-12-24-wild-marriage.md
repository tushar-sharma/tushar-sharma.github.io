---
layout: post
title: Wild Marriage
category: blog
tags:
- science
- annihilation
- matter
- antimatter
- audio
name: wild-marriage
thumb: https://unsplash.com/photos/hBzrr6m6-pc/download?w=437
summary: Mutual Suicide of an Electron
image: https://unsplash.com/photos/hBzrr6m6-pc/download?w=437
author: Tushar Sharma
---

"Marriages are made in heaven" is an old adage quite prevalent across all cultures. Whether heaven harbors any interest in the mortal affair has still scant empirical evidence. However, there is a rare marriage that not only invites heaven's fury but also is consummated by mutual suicide.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML-full"></script>

<link rel="stylesheet" type="text/css" href="{{ root_url }}/css/chat.css">
{% capture audio_url %}
{{ root_url }}/sounds/{{ page.path | split:'/'  | last | replace: '.md' '' }}.mp3
{% endcapture %}
{% include embed-audio.html src=audio_url %}
<br>
<!--begin_of_post -->

"Marriages are made in heaven" is an old adage quite prevalent across all cultures. Whether heaven harbors any interest in the mortal affair has still scant empirical evidence. However there is a rare marriage that not only invites heaven's fury but also is consummated by mutual suicide.

"Wild marriage" was coined by Max Born in his book Atomic Physics. The phenomenon describes an encounter of a positron and an electron. Both particles will cease to exist and will annihilate each other by releasing intensive electromagnetic radiation (gamma [γ] rays).

<figure align="center">

<br><video class="asset-video" width="100%"
          height="75%" poster="https://svs.gsfc.nasa.gov/vis/a000000/a000100/a000182/annihilation.jpg"
          controls="controls" preload="metadata">
          <!-- MP4 for Safari, IE9, iPhone, iPad, Android, and Windows Phone 7 -->
<!-- movie assets *other movie type that works with Chrome* -->
            <source type="video/mp4" src="{{ root_url }}/img/a000182.mp4" />
<!-- WebM/VP8 for Firefox4, Opera, and Chrome -->
            <source type="video/webm" src="{{ root_url }}/img/a000182.webmhd.webm" />

              Your browser does not support HTML video.
</video><br>
<p>  Animation Courtesy <sup><a href='#fn:1' rel='footnote'>1</a></sup>
</p>
</figure>

# Conservation of energy

Antimatter is the same as ordinary matter except that it has the opposite electric charge. Positron is an antimatter equivalent for an electron. They have equal mass but opposite charges. Thanks to Einstein's equation, **E=mc<sup>2</sup>**, there's an equivalence between energy and mass. So a colliding positron and electron converts their rest mass to pure energy in form of two oppositely directed 0.511 MeV photons.

$$
\begin{align}
  e− + e+ → γ + γ (2x 0.511 MeV)
\end{align}
$$

# Prediction of antimatter

Paul Dirac had postulated that an infinitely dense totally homogeneous sea of these electrons was present everywhere in the universe called Dirac sea. If a light collides with a negative electron it can convert into positive energy state. The hole it leaves behind is called a Dirac hole. So the hole was called positron.

The homogeneous sea of electron can be described as an old Hindu story. A fish went to the Queen fish and asked: "I have always heard about the sea, but what is the sea? Where is it?" The Queen fish replied: "You live, move, and have your being in the sea. The sea is within you and without you, and you are made of sea and you will end in sea. The sea surrounds
you as your own being"<sup><a href='#fn:2' rel='footnote'>2</a></sup>

# Feynman's interpretation

Feynman described annihilation like an electron travelling forward interacts with some light energy and starts travelling backwards in time. So a positron is just an electron travelling backwards in time. Antimatter behaves mathematically equivalent to normal matter simply traveling backwards in time.

<figure>
<img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Feynman_EP_Annihilation.svg" >
</figure>


<div class="attention">
"It is as though a bombardier flying low over a road suddenly sees three roads and it is only when two of them come together and disappear again that he realizes that he has simply passed over a long switchback in a single road" - Richard Feynman</div>
<br>

# Deficiency of anti-matter


Marriage as an institution is unique in humans. It's a legal contract with bells and whistles depending upon the jurisdiction. Dissolving a friendship has no legal consequences but dissolving a marriage requires an acquiesce of the court.

The marriage of particle and anti-particle is an spectacular event in microscopic world. However future generation might be able to harvest this energy. 2 kilograms of antimatter would contains 85.92 megatons of destructive force. This is more yield than the most powerful H-bomb exploded to date<sup><a href='#fn:3' rel='footnote'>3</a></sup>. However the storage and generation of anti-matter is not feasible by our current technology.

Matter and anti matter are mostly identical twins mostly differing in electric charge and other differences in quantum numbers. Our universe owes its existence to the deficiency of anti matter else it would have been annihilated. Early universe probably had copious quantities of both matter and anti-matter. However the cards were dealt in favor of matter probably by a hand of God in favor of our universe.

<!--end_of_post -->


<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>

    <li id='fn:1'>
         <p> NASA/Goddard Space Flight Center Scientific Visualization Studio </p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>

    <li id='fn:2'>
         <p>P. Reps, Zen Flesh, Zen Bones pg. 211</p>
         <a href='#fnref:2' rev='footnote'>&#8617;</a>
    </li>

    <li id='fn:3'>
         <p><a target="_blank" href="https://www.edwardmuller.com/index.php#calculator">Anti matter calculator</a></p>
         <a href='#fnref:3' rev='footnote'>&#8617;</a>
    </li>

  </ol>
</div>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
