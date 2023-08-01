---
layout: post
title: Observable Tutorial in Angular 
category: blog
tags:
  - angular
thumb: /img/cloud-girl.jpeg
image: /img/cloud-girl.jpeg
author: Tushar Sharma
published: true
---

Observables provide support for passing messages between parts of your application. They are use frequently in Angular applications for handling async data flows.<!-- truncate_here -->

Observables provide support for passing messages between parts of your application. They are use frequently in Angular applications for handling async data flows. 

### What are observables?

An observable is a stream of data that we can subscribe to. It emits new values over time that we can react to. 

For example, an Observable from a HTTP request would emit the response when the request completes. Or a time Observalbe could emit values at regular interval. 

Observable help us handle asynchronous data flows in a declarative style.  We define the Observable data stream and then subscribe to it to get notified of new values.


### Getting started

Create a new angular app. 

```bash
ng new angular-observables-demo
cd angular-observables-demo
```

Add Boostrap

```bash
npm install --save bootstrap@latest
```

and import it in  `src/styles.css`

```css
@import '~bootstrap/dist/css/bootstrap.min.css';
```

Building a UserService

```bash
ng generate service user
```

And add `user.service.ts`

{% template  customCode.html %}
---
id: abe9eec9e3361f5901b9221b5758e726
file: user.service.ts
---
{% endtemplate %}


It returns an observable of the HTTP response. 

### Subscribing in the component

Modify `app.component.ts`: 

{% template  customCode.html %}
---
id: abe9eec9e3361f5901b9221b5758e726
file: app.component.ts
---
{% endtemplate %}

For displaying data, you can modify `app.component.html`:

{% template  customCode.html %}
---
id: abe9eec9e3361f5901b9221b5758e726
file: app.component.html
---
{% endtemplate %}