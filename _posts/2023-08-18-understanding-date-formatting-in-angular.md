---
layout: post
title: Understanding Date Formatting in Angular
image: /img/girlUI.jpeg
thumb: /img/girlUI.jpeg
author: Tushar Sharma;
category: blog
publish: true
tags:
 - angular
---

Angular provides the DatePipe for formatting dates. You can use it directly in your templates with the pipe syntax, or you can use it programmatically in your components.<!-- truncate_here -->

Angular provides the DatePipe for formatting dates. You can use it directly in your templates with the pipe syntax, or you can use it programmatically in your components.

### Using DatePipe in Templates

This is the simplest way to format a date in Angular. In your component's HTML template, you can use the DatePipe with the pipe syntax `|` to transform a date value.

For example, if you have a date value endDate in your component, you can format it in the template like this:

{% template  customCode.html %}
---
id: 3e9d22bd1078e502e7ca858134379f4d
file: component.html
---
{% endtemplate %}

Here, 'short' is one of the predefined format options. It will display the date in a short format.


### Using DatePipe in a Component

If you want to format a date in your component's TypeScript code, you can do so by injecting the DatePipe into your component.

First, add DatePipe to your providers array in `app.module.ts`. This step is necessary because when you want to use a service (like DatePipe) in your component, Angular needs to know where it should create or find an instance of that service. By adding it to the providers array, you're telling Angular that it should be available for injection in this module.


{% template  customCode.html %}
---
id: 3e9d22bd1078e502e7ca858134379f4d
file: app.module.ts
---
{% endtemplate %}

Next, import the DatePipe from @angular/common in your component file.

{% template  customCode.html %}
---
id: 3e9d22bd1078e502e7ca858134379f4d
file: component1.ts
---
{% endtemplate %}

In your component's TypeScript file, inject the DatePipe into your component's constructor.

{% template  customCode.html %}
---
id: 3e9d22bd1078e502e7ca858134379f4d
file: component2.ts
---
{% endtemplate %}

Lastly, use the DatePipe to format dates in your component's code

{% template  customCode.html %}
---
id: 3e9d22bd1078e502e7ca858134379f4d
file: component3.ts
---
{% endtemplate %}

Here, the transform method of DatePipe is used to format the date. The result is stored in the formattedDate variable, which you can then use in your template or anywhere else in your component.