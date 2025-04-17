---
layout: post
title: MongoDB Crib Sheet
image: https://unsplash.com/photos/tWedmSHDF94/download?w=437
thumb: https://unsplash.com/photos/tWedmSHDF94/download?w=437
author: tushar sharma
category: blog
tags: [mongodb]
---

MongoDB Crib Sheet.<!-- truncate_here -->

MongoDB Crib Sheet. Mongo uses BSON to store data


## Document Structure (BSON)

```json
{
  _id: ObjectId("507f191e810c19729de860ea"),
  name: "Alice Chen",
  salary: NumberLong(230000),
  designation: "Principal Engineer",
  teams: ["platform-engineering", "database-ops"],
  meta: {
    badge: "SDE-III",
    clearance: "Level-5"
  }
}
```

- Binary JSON format with type-rich encoding

- Flexible schema (no fixed column structure)

- Nested documents (up to 100 levels deep)

- Automatic `_id` generation (12-byte unique identifier)