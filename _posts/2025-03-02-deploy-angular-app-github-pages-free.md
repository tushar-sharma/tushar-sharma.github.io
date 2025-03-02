---
layout: post
title: Deploy an Angular App to GitHub Pages for Free
image: https://unsplash.com/photos/ZATo07FA5v8/download?w=437
thumb: https://unsplash.com/photos/ZATo07FA5v8/download?w=437
description: "A step-by-step guide to building and deploying an Angular application to GitHub Pages."
author: tushar sharma
category: blog
tags: [angular, gitHub pages]
---

GitHub Pages provides a simple way to host static websites for free. In this guide, we'll create a basic Angular app, build it for production, and deploy it to GitHub Pages.<!-- truncate_here -->

GitHub Pages provides a simple way to host static websites for free. In this guide, we'll create a basic Angular app, build it for production, and deploy it to GitHub Pages.

## Prerequisites
Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)

- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

- A [GitHub](https://github.com/) account

## Step 1: Create an Angular App

First, generate a new Angular project:

{% template  customCode.html %}
---
id: ff86d6ee1733cd796f39ffa2877b5b15
file: create.sh
---
{% endtemplate %}


This creates a new Angular project with default settings.

## Step 2: Build the Angular App

To deploy the app, we need to create a production-ready build:

{% template  customCode.html %}
---
id: ff86d6ee1733cd796f39ffa2877b5b15
file: build.sh
---
{% endtemplate %}


**Explanation:**

- `--configuration production`: Optimizes the build for production.

- `--base-href "/my-angular-app/"`: Required for GitHub Pages (replace `my-angular-app` with your repository name).

The output files will be in the `dist/my-angular-app` directory.

## Step 3: Create a GitHub Repository

1. Go to [GitHub](https://github.com/).

2. Click **New repository**.

3. Name it `my-angular-app`.

4. Initialize with a README (optional).

5. Click **Create repository**.

## Step 4: Deploy to GitHub Pages

We’ll use the `gh-pages` branch for deployment.

### Initialize Git and Push Code

{% template  customCode.html %}
---
id: ff86d6ee1733cd796f39ffa2877b5b15
file: git.sh
---
{% endtemplate %}


### Deploy the Build to GitHub Pages

1. Install the GitHub Pages deployment package:

{% template  customCode.html %}
---
id: ff86d6ee1733cd796f39ffa2877b5b15
file: buildAngular.sh
---
{% endtemplate %}

2. Deploy the app:

{% template  customCode.html %}
---
id: ff86d6ee1733cd796f39ffa2877b5b15
file: deployAngular.sh
---
{% endtemplate %}

## Step 5: Enable GitHub Pages


1. Go to your GitHub repository.

2. Navigate to **Settings > Pages**.

3. Under **Branch**, select `gh-pages`.

4. Click **Save**.

## Step 6: Access Your Live App

After a few minutes, your app will be available at:

```bash
https://YOUR_USERNAME.github.io/my-angular-app/
```

## Conclusion
You’ve successfully deployed an Angular app to GitHub Pages! This method is ideal for hosting small projects, demos, or personal portfolios.


### Troubleshooting

- **404 Errors?** Ensure the `base-href` is correctly set.

- **Changes Not Reflecting?** Try:

{% template  customCode.html %}
---
id: ff86d6ee1733cd796f39ffa2877b5b15
file: verify.sh
---
{% endtemplate %}

- **GitHub Pages Not Loading?** Double-check that GitHub Pages is enabled under `Settings > Pages`.

Now, you can easily share your Angular project with the world! 🚀