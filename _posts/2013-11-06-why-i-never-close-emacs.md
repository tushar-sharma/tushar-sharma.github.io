---
layout: post
title: Why I never close Emacs
category: blog
tags: 
- emacs
- editor
name: never-close-emacs
thumb: /img/emacs.png
image: /img/emacs.png
summary: Tips and tricks in Emacs.
featuredPost: true
---

I once complained to my friend of his desktop on his computer. His desktop was a tangled mess of icons. "It's easier this way.", he chuckled, "I can quickly find all the softwares I need.". I showed him my desktop which was spick and span."Doesn't it consumes time in finding the softwares you need?", he asked.<!-- truncate_here -->

<div markdown="1">
<p>
I once complained to my friend of his desktop on his computer. His desktop was a tangled mess of icons. "It's easier this way.", he chuckled, "I can quickly find all the softwares I need.". I showed him my desktop which was spick and span."Doesn't it consumes time in finding the softwares you need?", he asked. I told him I have all the softwares I need on my desktop. His eyes rolled down my screen until they stumbled upon a solo icon of emacs. "You just use one software?", he asked."Mostly, yes", I said. "What about *editing*, *browsing*, *music*, etc?", he asked. "I do it all in emacs.", I quipped. Before he raised his eyebrows, I explained to him why emacs is informally called as a complete operating system and why I never close emacs.
</p>
</div>

<link rel="stylesheet" href="{{ root_url }}/css/books.css" />

<!-- disclaimer -->
<div style="margin: 0 auto" class="cl disclaimer">
  <i class="icon-star"></i>
    <span style="color:black"> &nbsp;&nbsp;This article has been published in <a href="http://www.linuxforu.com" target="_blank">LinuxforYou</a> magazine,January 2014 issue
</span> 
</div>
<br>


**Note:** For those who are unfamiliar with emacs, Key abbreviations used :

1. M – x means holding meta key (usually Esc) and x
2. C – Control
3. S – Shift
4. C-x f – means holding both Control and x, release both, and press f

<img src="{{ root_url }}/img/emacs.png" >

#### Emacs for Editing

Emacs is modeless editor which mean that unlike vim, you can start inserting text as soon as you open it. This is one of the reason why it's popular with newbies. But that doesn't mean you can't get your hands dirty with emacs.

Most people criticize emacs user for trying to do everything with emacs except editing. So let's begin with editing for which emacs was initially built.

Emacs can handle pretty much any type of file. Just type 
	
	$ emacs myFile.ext

Emacs also does syntax highlighting and indentation. It usually follows GNU style of indentation. The best thing about emacs is that you can customize it the way you want. I usually like [Allman] indentation when editing `C` code with `4 spaces`. To change it, add this to your `~/.emacs` file.

{% highlight common-lisp  %}
    (setq c-default-style "linux"
          c-basic-offset 4)
{% endhighlight %} 

#### Emacs for Backup

Emacs by default creates a backup file for every file it edits. It's usually named as the original file followed by tilde like FileName~. Though backup files are life saver, they are difficult to manage if they accumulate on the same folder. To save all your files in one place, let's say in folder `.saves`, add this to your `~/.emacs`

{% highlight common-lisp  %}
(setq backup-directory-alist `(("." . "~/.saves")))
{% endhighlight %}

#### Emacs for Browsing

If you are only interested in the content of a website and want to avoid those jarring javascript, emacs is a way to go. It uses an extension `w3m.el` which uses `w3m` which itself is a `text-browser`. Of course there are `Lynx` and other text editors, but integrating w3m with emacs is very fast. 

{% highlight common-lisp  %} 
(add-to-list 'load-path "~/emacs-w3m")
(require 'w3m-load)
(setq browse-url-browser-function 'w3m-browse-url)
(autoload 'w3m-browse-url "w3m" "Ask a WWW browser to show a URL." t)
;; optional keyboard short-cut
(global-set-key "\C-xm" 'browse-url-at-point)
{% endhighlight %}

Here's a snapshot of my website in emacs.

![myblog](/img/myblog.png "My Blog")

#### Emacs for Email

How about integrating emacs to view your email. You could do this by `GNUS`. Add this to your `~/.gnus` file

{% highlight common-lisp %}
(setq gnus-select-method
      '(nnimap "gmail"
	       (nnimap-address "imap.gmail.com")
	       (nnimap-server-port 993)
	       (nnimap-stream ssl)))

(setq message-send-mail-function 'smtpmail-send-it
      smtpmail-starttls-credentials '(("smtp.gmail.com" 587 nil nil))
      smtpmail-auth-credentials '(("smtp.gmail.com" 587
				   "user@gmail.com" nil))
      smtpmail-default-smtp-server "smtp.gmail.com"
      smtpmail-smtp-server "smtp.gmail.com"
      smtpmail-smtp-service 587
      gnus-ignored-newsgroups "^to\\.\\|^[0-9. ]+\\( \\|$\\)\\|^[\"]\"[#'()]")
{% endhighlight %}

Replace user with you're gmail username.Also add this to your `~/.authinfo` file

	machine imap.gmail.com login user@gmail.com password secret port 993
	machine smtp.gmail.com login user@gmail.com password secret port 587


The password field is optional. Type `M-x gnus` to start GNUS. To compose email, type `m`. Press `C-c C-c` to send mail.

![gnus](/img/gnus.png "GNUS")


#### Emacs for Photo Editing

The other task I usually do is look up few photos. Emacs can do more than just viewing the pictures, it has an inbuilt powerful power editor called `Image-Dired`. Simply press `M-x image-dired` on your emacs.

![Image-dired](/img/image_dired.png "Image Dired")  

#### Emacs for composing Documents

This is one of the feature I find unparalleled to emacs. The official website says about org mode, "Org mode is for keeping notes, maintaining TODO lists, planning projects, and authoring documents with a fast and effective plain-text system". 

![orgMode](/img/orgMode.png "Org")

If you love *LaTeX*, then there are more reasons to love `org mode`. You could integrated *TeX* support and export your work in *PDF*.For this add this to your ~/.emacs file

{% highlight common-lisp %}
(require 'org-latex)
(unless (boundp 'org-export-latex-classes)
  (setq org-export-latex-classes nil))
(add-to-list 'org-export-latex-classes
             '("article"
               "\\documentclass{article}"
               ("\\section{ %s}" . "\\section*{ %s}")))
{% endhighlight %}

#### Emacs for Secret Writing

If you happen to maintain a personal diary, you must be paranoid about it's secrecy. Emacs could be used to store your personal information. It uses `GNU GPG` to save the file. Open any file in emacs with `gpg` extension.To save it, press `C-s` which asks for which type of encryption method to use. Just use the default and press OK. This would prompt for a passphrase for saving. 

![secretGPG](/img/secretGPG.png "GPG")

#### Emacs for Playing Music

First install mplayer.

In Linux (Ubuntu/Debian) try 

	$ sudo apt-get install mplayer

In Mac try

	$ brew install mplayer

Clone `emms` 

	 $ git clone git://git.sv.gnu.org/emms.git

If it fails try this

	 $ git clone git://git.sv.gnu.org/r/emms.git

It will clone the folder emms. Inside the folder, there are `*el` file inside `lisp`. Copy them all to `~/.emacs.d/site-lisp/emms`. Find the executable of `mplayer` which is usually in `/usr/local/bin/`. Then add this to your `~/.emacs`


{% highlight common-lisp %}
(setq exec-path (append exec-path '("/usr/local/bin")))
(add-to-list 'load-path "~/.emacs.d/site-lisp/emms/lisp")
(require 'emms-setup)
(require 'emms-player-mplayer)
(emms-standard)
(emms-default-players)
(define-emms-simple-player mplayer '(file url)
      (regexp-opt '(".ogg" ".mp3" ".wav" ".mpg" ".mpeg" ".wmv" ".wma"
                    ".mov" ".avi" ".divx" ".ogm" ".asf" ".mkv" "http://" "mms://"
                    ".rm" ".rmvb" ".mp4" ".flac" ".vob" ".m4a" ".flv" ".ogv" ".pls"))
      "mplayer" "-slave" "-quiet" "-really-quiet" "-fullscreen")
{% endhighlight %}

Then type `M-x emms-play-directory` to navigate to music directory and play files. 

#### Emacs for Social Networking

If you cling for user experience, it's better to use regular browsers for social networking. And it sometimes becomes difficult to replicate all functionality of websites in emacs. Nevertheless, there's a ways to circumvent some of the limitations and use social networking in emacs. 

To use facebook, visit `http://m.facebook.com`. If you want login information to remain store, add cookie information in emacs. 
{% highlight common-lisp %}
(setq w3m-use-cookies t)
{% endhighlight %}
 
To use twitter, download `twittering-mode.el` and store it somewhere. Add this to your `~/.emacs`
{% highlight common-lisp %}
(add-to-list 'load-path "/PATH/TO/")
{% endhighlight %}

 
#### Emacs for Amusement

Last but not least, emacs also has lots of interesting features for amusement. 

![doctor](/img/doctor.png "doctor")

1. Type `M-x doctor` to talk to a psychologist. 
2. Type `M-x tetris` to play tetris. 
3. Type `M-x snake` to play classic snake game.
4. Type `M-x pong` to play ping pong.
5. Type `M-x mpuz` for multiplication puzzle. 
6. Type `M-x hanoi` for computer solving towers of hanoi game 
7. Type `M-x gomoku` for five-in-a-row against the computer 
8.Type `M-x dunnet` for text based adventure game.
9. Type `M-x life` to grow your own cell in emacs. 
10. Type `M-x butterfly` if you're a [xkcd] fan.

For more visit emac's [games].

#### Conclusion

Emacs is not meant to be an **all-in-one** substitute for all softwares. Of course certain softwares are better at doing specific tasks. Emacs wins over the fact that I rarely needs to close it. One can easily customize and extend emacs using elisp, a dialect of lisp. If you're convinced of the power of emacs, let me welcome you to the [Church of Emacs]. If not, let's part ways with an old joke, "*The Emacs operaating system needs a better editor*".

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a> 	{% endif %}
</nav>

[^1]: There's a famous editor war between VI and Emacs
[^2]: Free means as if freedom not gratis
[xkcd]: http://xkcd.com/378/ 
[games]: http://www.emacswiki.org/emacs/CategoryGames 
[Church of Emacs]: http://www.emacswiki.org/emacs/ChurchOfEmacs
[Allman]: http://en.wikipedia.org/wiki/Indent_style#Allman_style
