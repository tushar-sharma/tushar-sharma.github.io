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

There's a caveat in using github gist. It wont be searchable by algolia. so workaround is to add your code redundantly

```
<div style="display: none;">
    public class YourClass {
        // Your code here
    }
</div>

```

### Encrypting page

Create a html page in `encrypted` folder. This will contain the protected text

```
$ export password=
$ staticrypt myPost.html -p ${password}
```

Then add this 

```
iframe
  style="position: relative;  width: 100%;"
   height="400"
	   src="{{ root_url }}/encrypted/{{ page.path | split:'/'  | last | replace: '.md' '' }}.html"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="Sample"
></iframe>`
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
$ make build && make verify
```
