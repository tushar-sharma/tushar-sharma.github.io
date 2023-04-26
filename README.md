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
  src="https://www.youtube.com/embed/sample&autoplay=1"
  srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/sample?autoplay=1><img src=https://img.youtube.com/vi/sample/hqdefault.jpg alt='Sample'><span>▶</span></a>"
  frameborder="0"
  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  title="Sample"
></iframe>
```

### Tweet

```bash
| <a href="https://twitter.com/"><img align="center"  loading="lazy" src="https://i.imgur.com/" /> </a>|
```

### Gists

add this in markdown

```yaml
mutipleTab: true
```

and this code

```html
<div class="tab-container">
  <ul>
    <li class="tab Java1"><a href="#Java1">Java</a></li>
    <li class="tab Python1"><a href="#Python1">Python</a></li>
  </ul>

   <div class="codeSample Java1" id="Java1">
      <script src="https://gist.github.com/tushar-sharma/sample.js?file=ValidPath.java"></script>
   </div>

   <div class="codeSample Python" id="Python1">
      <script src="https://gist.github.com/tushar-sharma/sample.js?file=ValidPath.java"></script>
   </div>

</div>
```

### Build this website

```
$ make build
```

