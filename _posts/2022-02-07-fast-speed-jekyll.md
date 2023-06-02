---
title: Speed up your jekyll website
category: blog
layout: post
tags:
- jekyll
name: fast-jeykll-sites
published: false
featuredPost: false
image: https://unsplash.com/photos/uXLgmicKSi4/download?w=800
thumb: https://unsplash.com/photos/uXLgmicKSi4/download?w=800
---

<!-- truncate_here -->
<p>Tags: {% for tag in page.tags %} <a class="mytag" href="/tag/{{ tag }}" title="View posts tagged with &quot;{{ tag }}&quot;">{{ tag }}</a>  {% if forloop.last != true %} {% endif %} {% endfor %} </p>

## jekyll-include-cache

Modify `Gemfile` like

```sh
group :jekyll_plugings do
  gem 'jekyll-include-cache'
end
```

Add in your `_config.yml` like

```sh
plugings:
  - jkeyll-include-cache
```

Replace
```sh
{\% include foo.html \%}
```

With

```sh
{\% include_cached foo.html \%}
```

