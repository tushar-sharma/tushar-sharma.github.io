---
layout: post
title: Digging on the secret codes of the Past
category: blog
tags: 
- code
- cryptography
- cipher
- monoalphabetic
name: digging-past
thumb: /img/ancient.jpg
---

<link rel="stylsheet" type="text/css" href="{{ root_url }}/css/post.css" />

Different religion tells us about plethora of beautiful tales about the genesis of humans. But we humans, like any other trivial species, descended not from heaven (sigh) but from single cell organisms. And gradually we embraced bipedalism and various arts of survival. Languages replaced tedious gestures as a means of communication. We hunted animals and domesticated them. Such a long odysseys of humans is replete with footprints of the past. In these footprints we began to unearth what once our ancestors spoke. 

<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p> 

<div>
<img src="{{ root_url }}/img/ancient.jpg" class="thumb">
<p>
Different religion tells us about plethora of beautiful tales about the genesis of humans. But we humans, like any other trivial species, descended not from heaven (sigh) but from single cell organisms. And gradually we embraced bipedalism and various arts of survival. Languages replaced tedious gestures as a means of communication. We hunted animals and domesticated them. Such a long odysseys of humans is replete with footprints of the past. In these footprints we began to unearth what once our ancestors spoke. 
</p>
</div>

While the universe is pretty old (3.798±0.037 billion years), it was only few millions years ago did the early humans appeared. We did come a long way since then. We have cultivated colonies and also fought wars, became industrialized as well as ushered global warming, made technological breakthrough with also jeopardizing our own survival with the looming fear of nuclear winter and much more has happened in the annals of human history. Though I can not plunge into the whole labyrinth of human history, but I can dig into some of the codes of the Past.

#### Indus Valley Civilization

On the mounds of Mahanjo-Daro and Harappa, lays the ruins of some 5000 years old Indus Valley Civilization. It is considered as a cradle of early civilization along with Mesopotamia and Pharonic Egypt. It was noted for urban planning, baked brick houses, elaborate drainage systems, water supply systems, and clusters of large non-residential buildings <sup id='fnref:1'><a href='#fn:1' rel='footnote'>1</a></sup>.

<p>
<img style="float: left; margin: 0px 15px 15px 0px;" src="{{ root_url }}/img/seal.jpg" />
The excavations have recovered some of the seals used at that time. The seal is in Indus script. There two camps divided on how to interpret this script. First camp believe this is nothing more than semagrams. In this each letter represents  whole idea. Like the drawing of fish would represent fish. The other camp argues that this hieroglyphs represent phonograms based on rebus system . In this each letters represents a phoneme (speech sound). Unfortunately Indus script is yet to be deciphered.
</p>


#### Mlecchita Vikalpa

The Indus valley civilization thrived much to the presence of Indus river. The river basin not only provided cultivable land but also sea routes to other ancient civilizations like Sumerian, Mesopotamia, etc. 

Mleccha were the smiths that use to inscribe text of the mleccha language on the copper. Later mlecchita vikalpa, which means writing in cipher, was developed. It is the earliest use of cryptography. It was first mentioned in ancient Indian manuscript, Kama sutra, written around 4th century AD.

Mlecchita Vikalpa is one of the 64 arts recommended by Kama sutra to help women conceal details of their liaisons. It is a monoalphabetic substitution cipher. It means that it uses only one cipher alphabet to encrypt message. The cipher alphabet is randomly generated and each letter of the message is substituted to produce the cipher. Decipherment is simply re-substituting letters of the ciphers with the cipher alphabet. 

#### Recreating the ancient cipher

To encipher a secret message, a random cipher alphabet needs to be generated. Below is a random key.

	UDJLKNCRZEBTMHPFQVWOXAGSIY

Now bifurcate the key 

	UDJLKNCRZEBTM
	HPFQVWOXAGSIY

Let us suppose the message is 'password'. So the first letter of the message i.e. 'p' is searched in the cipher alphabet. 'p' is found opposite to 'D' which is then substituted

Similarly all the message is encrypted as 'DZBBNCXP'

	Note: As convention, message is written in small letters 
	where as resultant cipher is written in capital letters.


#### Javascript Implementation

{% highlight javascript %}
function encryption(message, alphabet) {
  for (i = 0; i < msg.length; ++i) {
    pos = alphabet.indexOf(msg.substr(i,1));
    if (pos > -1) {
      newPos = pos - 13;
      if (newPos < 0) {
        newPos += 26;
       }
       result += alphabet.charAt(newPos);
    } else  {
      result += msg.substr(i,1);
    }
  }
}
{% endhighlight %}



#### Fisher Yates shuffle

Each time a new message needs to be sent, a random key is also needed. In order to generate alphabet of random lettters, Fisher Yates algorithms is used. A random permutation of a finite sets is produced. Shuffling is similar to randomly picking numbered tickets out of a hat without replacement until there are none left <sup id='fnref:2'><a href='#fn:2' rel='footnote'>2</a></sup>.

Below is the implementation in Javascript. 

{% highlight javascript %}
/* shuffle an array of n elements 
   array.length = n */
for (i = array.length -1; i >0; i--) {

    /* Pick a random number j 
       between one and the number of unstruck numbers remaining */
    j = Math.floor(Math.random() * (i + 1));

    /* exchange array[i] and array[j]*/
    temp     = array[i];
    array[i] = array[j];
    array[j] = temp;
}
{% endhighlight %}

#### Demo

<form name="form1" id="form1" onsubmit="return false;">
  <label for="alphabet">Key</label><br>
  <input type="text" name="alphabet" id="alphabet" value="UDJLKNCRZEBTMHPFQVWOXAGSIY" maxlength="26" size="40"/> <input type="submit" value="Change" onclick="document.form1.alphabet.value=submitForm(this)"/><br>
  <label for="text">Plain Text</label> <br>
  <textarea name="cipher1" id="cipher1" rows="6" cols="40"> </textarea> <br> 
  <label for="result">Result</label> <br>
  <textarea name="result1" id="result1" rows="6" cols="40"> </textarea><br>
  <input type="button" value="Encrypt/Decrypt" onclick="return submitForm(this)" /> 
  <input type="submit" value="Clear Form" onclick="return submitForm(this)" />
</form>
<br>

#### Cryptanalysis

This is the demonstration of a simple  monoalphabetic cipher. It is not secure and could be easily broken by frequency analysis <sup id='fnref:3'><a href='#fn:3' rel='footnote'>3</a></sup>.



<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
     <p><a href="http://en.wikipedia.org/wiki/Indus_Valley_Civilization" targe="_blank">Indus Valley Civilization</a> </p>
     <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>
    <li id='fn:2'>
      <p><a href="http://en.wikipedia.org/wiki/Fisher–Yates_shuffle" target="_blank">Fisher–Yates shuffle</a></p>
     <a href='#fnref:2' rev='footnote'>&#8617;</a>
    </li>
    <li id='fn:3'>
      <p><a href="http://en.wikipedia.org/wiki/Frequency_analysis" target="_blank">Frequency Analysis</a></p>
     <a href='#fnref:3' rev='footnote'>&#8617;</a>
    </li>
  </ol>
</div>

<script type="text/javascript" src="{{ root_url }}/js/crypto.js"></script>

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>


