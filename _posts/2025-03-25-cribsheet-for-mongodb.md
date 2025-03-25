---
layout: post
title: Cribsheet for Mongodb
image: https://unsplash.com/photos//download?w=437
thumb: https://unsplash.com/photos//download?w=437
author: tushar sharma
category: blog
tags: [mongo]
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.<!-- truncate_here -->


- NoSQL database

- Store data in form of BSON (Binary JSON) e.g.

```
{
    name: "T",
    salary: 230000,
    designation: “Computer Scientist”,
    teams: [ “front-end”, “database” ]
}
```

- Collection : Group of related documents with shared common index

### Read Preference

- default is primary

- determines where to route read operations

- read from secondary may fetch stale data

- strong vs Eventual consistency


### Write Concern

- default is acknowledged

- determines the guarantee that mongodb provides on the success of write operations

- weaker write concern is faster write time

- default case, primary replicas acknowledge success of write operations

## Journaling 

- mongodb first write to journal \& it periodically get flushed to Mongodb memory
