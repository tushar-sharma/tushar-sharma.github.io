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

<nav class="pagination clear" style="padding-bottom:20px;">
{% if page.previous.url %} <a class="prev-item" href="{{page.previous.url}}" title="Previous Post: {{page.previous.title}}">&larr;Previous</a>   {% endif %}  {% if page.next.url %}<a class="next-item" href="{{page.next.url}}" title="Next Post: {{page.next.title}}">Next&rarr;</a>         {% endif %}
</nav>
