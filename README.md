tushar-sharma.github.io
=======================

![Build](https://github.com/tushar-sharma/tushar-sharma.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)


## About 

This is my [personal website](https://randomwits.com). It is supported by [Jekyll](https://github.com/mojombo/jekyll) platform.


Content in the `_posts` folder is copyrighted. 

## License

This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.


## Posts

### Inserting an image

Images are stored in `img` folder. To insert an image, 

```bash
| <img align="center"  loading="lazy" src="{{ root_url }}/img/sample.jpg" alt="Sample Image" />|
```

### Inserting a video

Here, sample is video url.

```bash
<iframe
  style="position: relative;  width: 100%;" 
   height="500"
  src="https://www.youtube.com/embed/sample?autoplay=1"
  srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/sample?autoplay=1><img src=https://img.youtube.com/vi/sample/hqdefault.jpg alt='Sample'><span>▶</span></a>"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="Sample"
></iframe><br>
```

### Footnotes

add this : 

```
<sup id='fnref:1'><a href='#fn:1' rel='footnote'>1</a></sup>



<div class='footnotes'><h3>Footnotes</h3><hr />
  <ol>
    <li id='fn:1'>
         <p> <a href="http://localhost:8080" target="_blank">text</a> </p>
         <a href='#fnref:1' rev='footnote'>&#8617;</a>
    </li>

  </ol>
</div>

```
### Tweet

Go to [Poet.so](https://poet.so/) to download the screenshot.

```bash
| <a href="https://twitter.com/status/?"><img align="center"  loading="lazy" src="{{ root_url }}/img/downloaded.png" /> </a>|
```

### Highlight Code

#### Backtick

simply use triple backtick to higlight code. 

#### Gists

There are two ways to add Gist code : 

##### Single Tab

Just add this code 

```
{% template  customCode.html %}
---
id: <ID>
file: file1.py
---
{% endtemplate %}

```

##### Multitab

Enable multitab in post to include libraries

```yaml
mutipleTab: true
```

and this code

```md
{% template  customTab.html %}
---
id: <ID>
files:
  - file: File1.java
    language: java
  - file: File1.js
    language: javascript
---
{% endtemplate %}
```


### Encrypting page

Create a html page in `encrypted` folder. This will contain the protected text

```
# write secret post in myPost.md
$  pandoc encrypted/myPost.md -o encrypted/myPost.html
$ npm i -g staticrypt
$ export password=
$ staticrypt encrypted/myPost.html -p ${password}
```

Then add this 

```
<iframe
  id="dynamicIframe"
  style="position: relative; width: 100%; height: 400px;"
  src="{{ root_url }}/encrypted/{{ page.path | split:'/'  | last | replace: '.md' '' }}.html"
  frameborder="0"
  scrolling="no"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="Sample"
></iframe>

<script src="{{ root_url }}/js/resizeIframe.js"></script>
```

### Tags

Dont create tags with upper case name. Always use lowercase.

### Searching

Update index in algolia with admin API Key. 

```
ALGOLIA_API_KEY='' bundle exec jekyll algolia
```

### Build this website

```
$ g clone git@github.com:tushar-sharma/tushar-sharma.github.io.git
$ cd $_ 
$ g clone git@github.com:tushar-sharma/tushar-sharma.github.io.git _site
$ make build && make verify
$ cd _site
$ g a .
```
