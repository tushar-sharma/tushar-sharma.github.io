---
layout: post
title: How ViM Saved My Day
category: blog
tags: 
- vi
- vim
- editor
- code
name: vim-saved-day
thumb: /img/vim.png
---

It was just another day in Gurgaon. The hot scorching sun was parading the city. The inescapable life of riding with the autowalas is the common sight of this concrete jungle. Though I am a FOSS enthusiast, my first job landed me to just another India's IT company. I vividly remember the countless occasions when ViM saved my day.<!-- truncate_here -->

<div>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </div>
<div style="clear:both;padding-top:20px;padding-bottom:20px;"></div>

<div>
<p>
It was just another day in Gurgaon. The hot scorching sun was parading the city. The inescapable life of riding with the autowalas is the common sight of this concrete jungle.       Though I am a FOSS enthusiast, my first job landed me to just another India's IT company. I vividly remember the countless occasions when ViM saved my day.
</p>
</div>

<img src="{{ root_url }}/img/vim.png" >


#### Early Days

I mostly received rudimentary tasks in early days of my work. I received one such task just few days after my joining. I was slouching on my chair when I heard this commanding voice.

“New joining”.

“Yes, sir”,  I replied looking around trying to find the source of the voice.

A tall thin man with the air of authority stood glaring over my shoulders.

“Come, I have a work for you”, he said and drew me to his cabin.  

He showed me a csv file. Unfortunately I can't post the original files but I've tried to create resemblance of original file. See the picture 1 below.

![Picture1](/img/figure1.png "The CSV file")

He began scrolling down the file. It took him more than two minutes to get to the middle of the file while my eyes remained glued to the screen counting the number of lines. At last when he reached the bottom, deducing my curiosity he said, “It has 2000 lines”.

“All you have to do”, he said, “is to pick each line of this CSV file and paste it to another text file with slight alteration”. He showed me another text file which resembled to Picture 2. 
 
![Picture2](/img/figure2.png "The SQL File")

“Each line should be similar to the other file”, he said pointing to Picture 2.  Not only did I have to rearrange items of the line but also had to insert some extra text to match Picture 2. 

“How do you do it here”, I asked hoping if there was a trick.

“You have to do it manually”, he continued, “No other way”. Taking cognisance of my crestfallen face he said, “Don't worry. There's no hurry. You can take few days as you are new”, he said. 

With those words he left me with this task. Nothing peeves a programmer more than doing a monotonous repetitive work. But as every cloud has a sliver lining, similarly every problem too has a smarter solution.

####  Hello ViM

ViM stands for Vi Improved which is clone based on VI editor. If you've never heard of vi, chances are you are still accustomed to the world of WYSIWYG editors like Notepad, etc. Well, those editors are great if you're daily tasks are to simply edit, copy, paste, search, etc but if you want to get you're hands dirty, vim is the panacea every programmer wants. Of course few other editors like emacs are equally powerful (or more[^1]), but this post is about my romance with ViM (Sorry Emacs). 

Ideally I would want to lay my hands on some Unix clone to get such task done. But my system was running legacy operating system, I did not have that luxury. Nevertheless most free[^2] softwares today easily run on non-Unix operating systems (like Windows). I fired internet explorer (to download firefox :) ) and downloaded a portable version of ViM.

#### Smart Way

ViM is a modal editor. Unlike other common editors, you can't start typing text in it straight away. ViM opens in command mode. To switch to insert mode, you have to press `i`. If you love typing and rarely use mouse (which most programmers do) then you'll love ViM. Navigation in ViM is by using classic `hjkl` keys. 

Now its time to return to our problem i.e the file in Picture 1. I had to edit to look similar to file in Picture 2. To acomplish this task, I use a nifty feature of ViM called macros. Macros help to record my sequence of steps and play it again and again. In simple words, what I do for one line, I can repeat it for 1999 lines. These were sequence of steps

1. Start recording the macro
2. Jump to Fourth element of the file
3. Cut the whole line from this element up to the end
4. Paste in the beginning of file
5. Go to last element
6. Cut the last element 
7. Paste it before last two elements
8. Add extra text wherever required 
9. Stop the macro
10. Repeat the macro of 1999 lines

To translate the above steps in ViM

1. Press `qa` to start the macro and save it in register a
2. Press `/` to search for comma. Press `n` 2 times to reach fourth element
3. Press `v` + `$` + `d` to cut the line from fourth element to end
4. Press `0` to go to beginning of file. Press `p` to paste.
5. Press `$` to reach last element. 
6. Press `v` + `?` + `'` to cut the last element
7. Press `?` to reverse search comma and press `n`. Press `p` to paste.  
8. Copy paste extra text where required. Press `i` to enter insert mode and to paste  press `SHIFT` + `CTRL` + `V`
9. Press `Enter` to jump off the line and press `q` to stop the macro
10. Press `1999@a` to repeat macro

Of course you can reduce the number of steps by a more elegant solution. But this alone helped me solve my task. See my resulted file in Picture 3 below. 

![Picture3](/img/figure3.png "The Result")

#### Even More Smart Way

Imagine if you have to repeat this task again and again. It's cumbersome to write the same macro again and again after you switch off your machine. There's a way to store macro so that you don't need to remember them. First copy the value of your macro. To see your macro's value type

	:anew

	:"ap

And copy paste this value of macro in your `.vimrc` file 

	let @a = 'MACRO_VALUE'

Just replace MACRO_VALUE with the value of your own macro. Here's value of my own macro 

	0/,^Mnnlv$hd0i ^[p^[0^[lu^[uuuuuuuuuuuuuuu


And Voila! Your Macro is saved. 

#### Conclusion

ViM is a wonderful editor if only you get to know it. The following task took me less than 15 minutes to complete. Of course less than 15 minutes feat dazzled my supervisor but more than the approval it's the satisfaction that comes from solving problems smartly. So what's your story? Have ViM ever saved your day? 

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a> 	{% endif %}
</nav>

[^1]: There's a famous editor war between VI and Emacs
[^2]: Free means as if freedom not gratis


