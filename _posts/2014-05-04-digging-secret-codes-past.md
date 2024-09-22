---
layout: post
title: Digging on the codes of the Past
category: blog
tags:
- code
- cryptography
- cipher
- monoalphabetic
name: digging-past
thumb: /img/ancient.jpg
image: /img/ancient.jpg
---

Different religion tells us about plethora of beautiful tales about the genesis of humans. We humans, like any other trivial species, descended not from heaven (sigh!) but due to mitosis in single cell organisms.<!-- truncate_here -->

Different religion tells us about plethora of beautiful tales about the genesis of humans. We humans, like any other trivial species, descended not from heaven (sigh!) but due to mitosis in single cell organisms. And gradually we embraced bipedalism and various arts of survival. Languages replaced tedious gestures as a means of communication. We hunted animals and domesticated them. Such a long odysseys of humans is replete with footprints of the past. In these footprints we try to decipher bits and pieces of lives of our ancestors.

While the universe is pretty old (3.7987 billion years and counting), it has been only few million years since the chapter of humans commenced. We had come a long way since. From time in memorial, numerous civilizations thrived and collapsed leaving behind their legacy. The episodes of both glory and horror are conspicuous part of history. Distant from the hurly burly of the present civilization, on the mounds of Mahanjo-Daro and Harrapa, an entirely different civilization spoke another language.

## Indus Valley Civilization

Indus Valley Civilization is considered as a cradle of early civilization along with Mesopotamia and Pharonic Egypt. It was noted for urban planning, baked brick houses, elaborate drainage systems, water supply systems, and clusters of large non-residential buildings <sup id='fnref:1'><a href='#fn:1' rel='footnote'>1</a></sup>.

<p>
<img style="float: left; margin: 0px 15px 15px 0px;" src="{{ root_url }}/img/seal.jpg" />
The excavations have recovered some of the seals used at that time. The seal is in Indus script. There two camps divided on how to interpret this script. First camp believe this is nothing more than <b>semagrams</b>. In this each letter represents  whole idea. Like the drawing of fish would represent fish. The other camp argues that this hieroglyphs represent <b>phonograms</b> based on rebus system . In this each letters represents a phoneme (speech sound). Unfortunately Indus script is yet to be deciphered.
</p>


## Mlecchita Vikalpa

The Indus valley civilization thrived much to the presence of Indus river. The river basin not only provided cultivable land but also sea routes to other ancient civilizations like Sumerian, Mesopotamia, etc.

Mleccha were the smiths that use to inscribe text of the mleccha language on the copper. Later mlecchita vikalpa, which means writing in cipher, was developed. It is the earliest use of cryptography. It was first mentioned in ancient Indian manuscript, Kama sutra, written around 4th century AD.

Mlecchita Vikalpa is one of the 64 arts recommended by Kama sutra to help women conceal details of their liaisons. It is a monoalphabetic substitution cipher. It means that it uses only one cipher alphabet to encrypt message. The cipher alphabet is randomly generated and each letter of the message is substituted to produce the cipher. Decipherment is simply re-substituting letters of the ciphers with the cipher alphabet.

## Recreating the ancient cipher

To encipher a secret message, a random cipher alphabet needs to be generated. Below is a random key.

	UDJLKNCRZEBTMHPFQVWOXAGSIY

Now bifurcate the key

	UDJLKNCRZEBTM
	HPFQVWOXAGSIY

Let us suppose the message is 'password'. So the first letter of the message i.e. 'p' is searched in the cipher alphabet. 'p' is found opposite to 'D' which is then substituted

Similarly all the message is encrypted as 'DZBBNCXP'

	Note: As convention, message is written in small letters
	where as resultant cipher is written in capital letters.


## Javascript Implementation

<script src="https://gist.github.com/tushar-sharma/faff62bd0c2eb93b18c74b935b523dcd.js"></script>

## Fisher Yates shuffle

Each time a new message needs to be sent, a random key is also needed. In order to generate alphabet of random lettters, Fisher Yates algorithms is used. A random permutation of a finite sets is produced. Shuffling is similar to randomly picking numbered tickets out of a hat without replacement until there are none left <sup id='fnref:2'><a href='#fn:2' rel='footnote'>2</a></sup>.

Below is the implementation in Javascript.

<script src="https://gist.github.com/tushar-sharma/c5fb05f1f0ce5f34df612a2d53c12da8.js"></script>

## Demo

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

## Cryptanalysis

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
    <li id='fn:4'>
      <p><a href="http://www.lib.utexas.edu/maps/middle_east_and_asia/pakistan_rel96.jpg" target="_blank">Image courtesy</a></p>
    </li>
  </ol>
</div>

<script type="text/javascript" src="{{ root_url }}/js/crypto.js"></script>

