---
title: Implementing Dark Mode to Your Jekyll Site without learning CSS
category: blog
layout: post
tags:
- jekyll
featuredPost: true
image: https://unsplash.com/photos/Z895fnYRbog/download?w=437
thumb: https://unsplash.com/photos/Z895fnYRbog/download?w=437
---


Lots of website have added `dark themes` to their platform. [Twitter](https://twitter.com/) also has a dark mode which I really love while reading at night. Also there are [benefits](https://www.healthline.com/health/is-dark-mode-better-for-your-eyes#benefits-of-dark-mode) of using dark mode for the eyes.<!-- truncate_here -->


Lots of website have added `dark themes` to their platform. [Twitter](https://twitter.com/) also has a dark mode which I really love while reading at night. Also there are [benefits](https://www.healthline.com/health/is-dark-mode-better-for-your-eyes#benefits-of-dark-mode) of using dark mode for the eyes.


There are lots of tutorials that require adding separte `CSS` for light and dark theme. However I wanted to leverage a simple `javascript` solution to implement dark mode.

### Dependencies

First we need to import necessary files to our html file.

{% template  customCode.html %}
---
id: 58c77577dbff8a291523d9cc5a4f3731
file: darkmode2.html
---
{% endtemplate %}

### Create button for light and dark mode

We can use [FontAwesome](https://fontawesome.com/) to add `moon` icon for light mode and `sun` icon for dark mode.

{% template  customCode.html %}
---
id: 58c77577dbff8a291523d9cc5a4f3731
file: darkmode1.html
---
{% endtemplate %}

### Toggle between light and dark mode

On clicking the button, we need to call the function `darkmode`.

{% template  customCode.html %}
---
id: 58c77577dbff8a291523d9cc5a4f3731
file: darkmode3.js
---
{% endtemplate %}


The `localStorage` object allows you to save key/value pairs in the browser. This is useful to save the state of your application between page loads.


{% template  customCode.html %}
---
id: 58c77577dbff8a291523d9cc5a4f3731
file: darkmode4.js
---
{% endtemplate %}

Lastly we need to call `setFetchMethod` to check if the browser is using `darkmode` before enabling or disabling it.

{% template  customCode.html %}
---
id: 58c77577dbff8a291523d9cc5a4f3731
file: darkmode5.js
---
{% endtemplate %}

### Demo

![](/img/dark_mode.gif "Dark Mode")

