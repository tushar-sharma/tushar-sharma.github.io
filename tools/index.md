---
layout: comments
title: Tools
published: true
toc: true
toc_label: My Table of Contents
toc_icon: cog
---


<!-- dummy box begins -->
<div style="padding-bottom:60px; padding-top:20px; background : white;">
</div>

<div class="tools-page-hero tools-page-hero-centered">
  <h1 class="entry-title">Tools</h1>
</div>

<div class="feature-grid tools-feature-grid">
  {% for tool in site.data.showcase.tools %}
  <a class="feature-card feature-card-{{ tool.accent }}" href="{{ tool.url }}" {% if tool.url contains 'http' %}target="_blank" rel="noopener noreferrer"{% endif %}>
    <div class="feature-card-topline">
      <span class="feature-label">{{ tool.label }}</span>
      <span class="feature-arrow"><i class="fas fa-arrow-up-right-from-square"></i></span>
    </div>
    <div class="feature-icon-wrap">
      {% if tool.icon == 'youtube-mp3' %}
      <div class="feature-icon feature-icon-youtube-mp3" aria-hidden="true">
        <i class="fab fa-youtube"></i>
        <i class="fas fa-music"></i>
      </div>
      {% else %}
      <div class="feature-icon" aria-hidden="true">
        <i class="fas fa-hammer"></i>
      </div>
      {% endif %}
    </div>
    <h3>{{ tool.title }}</h3>
    <p>{{ tool.description }}</p>
    <span class="feature-cta">{{ tool.cta }}</span>
  </a>
  {% endfor %}
  {% for space in site.data.showcase.spaces %}
  <a class="feature-card feature-card-{{ space.accent }}" href="{{ root_url }}{{ space.url }}">
    <div class="feature-card-topline">
      <span class="feature-label">{{ space.label }}</span>
      <span class="feature-arrow"><i class="fas fa-arrow-right"></i></span>
    </div>
    <div class="feature-icon-wrap">
      <div class="feature-icon" aria-hidden="true">
        {% if space.icon == 'gamepad' %}
        <i class="fas fa-gamepad"></i>
        {% elsif space.icon == 'ball-hit' %}
        <i class="fas fa-table-tennis"></i>
        {% else %}
        <i class="fas fa-folder-open"></i>
        {% endif %}
      </div>
    </div>
    <h3>{{ space.title }}</h3>
    <p>{{ space.description }}</p>
    <small>{{ space.meta }}</small>
    <span class="feature-cta">{{ space.cta }}</span>
  </a>
  {% endfor %}
</div>
