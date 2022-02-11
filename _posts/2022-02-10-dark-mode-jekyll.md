---
title: Implementing Dark Mode to Your Jekyll Site without learning CSS
category: blog
layout: post
tags:
- jekyll
featuredPost: false
image: https://unsplash.com/photos/Z895fnYRbog/download?w=800
thumb: https://unsplash.com/photos/Z895fnYRbog/download?w=800
---


Lots of website have added `dark themes` to their platform. [Twitter](https://twitter.com/) also has a dark mode which I really love while reading at night. Also there are [benefits](https://www.healthline.com/health/is-dark-mode-better-for-your-eyes#benefits-of-dark-mode) of using dark mode for the eyes.<!-- truncate_here -->

<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %}</p>



Lots of website have added `dark themes` to their platform. [Twitter](https://twitter.com/) also has a dark mode which I really love while reading at night. Also there are [benefits](https://www.healthline.com/health/is-dark-mode-better-for-your-eyes#benefits-of-dark-mode) of using dark mode for the eyes.


There are lots of tutorials that require adding separte `CSS` for light and dark theme. However I wanted to leverage a simple `javascript` solution to implement dark mode.


## Create button for light and dark mode

We can use [FontAwesome](https://fontawesome.com/) to add `moon` icon for light mode and `sun` icon for dark mode.


```html
<a class="dark-mode-button" >
  <i id="icon-dark" class="fa fa-moon"></i>
  <span id="dark-text">Sunset</span>
</a>
```

Next we need to add `darkreader.js` to our html file.

```html
<script src="https://cdn.jsdelivr.net/npm/darkreader@4.9.44/darkreader.js"></script>
```

## Toggle between light and dark mode

On clicking the button, we need to call the function `darkmode`.

```javascript
document.getElementsByClassName('dark-mode-button')[0].onclick = function() {
    darkmode()
}
```

The `localStorage` object allows you to save key/value pairs in the browser. This is useful to save the state of your application between page loads.


```javascript

function darkmode() {
  let enabled = localStorage.getItem('dark-mode')

  if (enabled === null) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enable();
    }
  } else if (enabled === 'true') {
    enable()
  }

  if (localStorage.getItem('dark-mode') === 'false') {
      enable();
  } else {
      disable();
  }
}
```

Lastly we need to call `setFetchMethod` to check if the browser is using `darkmode` before enabling or disabling it.

```javascript
function enable()  {
  DarkReader.setFetchMethod(window.fetch)
  DarkReader.enable();
  localStorage.setItem('dark-mode', 'true');
}

function disable() {
  DarkReader.disable();
  localStorage.setItem('dark-mode', 'false');
}
```

## Demo

![](/img/dark_mode.gif "Dark Mode")

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
