---
layout: post
title: Create a Dummy JSON API with JSON-Server
category: blog
tags:
  - api
thumb: https://unsplash.com/photos/rfqaMzumGQQ/download?w=437
image: https://unsplash.com/photos/rfqaMzumGQQ/download?w=437
author: Tushar Sharma
published: true
---

JSON-Server is a popular tool for creating fake REST APIs quickly and easily. It's a great option for testing purposes when you need to mock up an API to see how your application interacts with it.<!-- truncate_here -->

JSON-Server is a popular tool for creating fake REST APIs quickly and easily. It's a great option for testing purposes when you need to mock up an API to see how your application interacts with it.

Here's how you can use JSON-Server to create a dummy JSON API that you can access via curl on your local machine:

Install JSON-Server globally on your machine using npm.

```javascript
$ npm install -g json-server
```

Create a JSON file that will act as your API endpoint. For example, you could create a file named db.json and add the following JSON data to it:


```javascript
{
  "posts": [
    { "id": 1, "title": "Hello World!", "author": "Tushar Sharma" },
    { "id": 2, "title": "Foo Bar", "author": "Neo Matrix" }
  ]
}
```

Start the JSON-Server using the following command, specifying the db.json file you created in step 2 as the source of your data:

```javascript
$ json-server --watch db.json --port 3003
```

Make a curl request to your localhost to access the data from your dummy JSON API.

```bash
$ curl http://localhost:3003/posts
```

You should see the JSON data that you added to your db.json file returned in the curl response. JSON-Server is not intended for use in production, it is only meant for use in development and testing environments.