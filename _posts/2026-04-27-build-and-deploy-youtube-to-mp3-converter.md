---
layout: post
title: Build & Deploy YouTube to MP3 Converter
image: https://unsplash.com/photos/VltJrvovRbY/download?w=437
thumb: https://unsplash.com/photos/VltJrvovRbY/download?w=437
author: tushar sharma
category: blog
tags: [python, fastapi, docker, github actions, scaleway]
published: false
---


I often find myself googling for websites to convert a youtube video to mp3. Most of these websistes are infected with spams and annoying ads. So decided to build a simple website and learn along the way.<!-- truncate_here -->

I often find myself googling for websites to convert a youtube video to mp3. Most of these websistes are infected with spams and annoying ads. So decided to build a simple website and learn along the way.

<div style="text-align: center; margin: 20px 0;">
  <a href="https://nsstrangeheisenberge569cdbf-container-vigorous-torvalds.functions.fnc.fr-par.scw.cloud" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #39c; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">Live Demo</a>
</div>


## Sequence Diagram

Before writing even a single piece of code , lets look think about the **APIs** responsible for the logic of the applicaiton. 

@startmermaid
sequenceDiagram
    participant U as User (Browser)
    participant API as Server
    participant BG as BackgroundThread

    U->>API: POST /api/convert {url}
    API->>BG: Start conversion (y-dlp + ffmpeg)
    API-->>U: 200 { job_id } <- returns immediately

    loop every 2 seconds 
       U->>API: GET /api/status/{job_id}
       API->>U: { status : "done" }

       U->>API: GET /api/download/{job_id}
       API-->>U: audio/mpeg (MP3 file)
    end
@endmermaid

I usually refer to [zalando](https://github.com/zalando/restful-api-guidelines) guidelines for desigining APIs. 

## Server

I chose **FastAPI** for the server code. IT's a **ASGI** -- The Asynchronous Server Gateway Interface which means it can handle many request concurrently using Python's `asyncio` event loop . Previous python frameworks like **Flask**, **Django** are **WSGI** -- the Web Server Gateway Interface which means one request occupies one thread until the response is sent.

Another reason for choosing python framework is to make use of [yt-dlp](https://github.com/yt-dlp/yt-dlp) to download the videos and **ffmpeg** for conversion. 

## Project Structure 

We start by creating a simple application:

```
mkdir -p youtubeMp3Converter/{routers,schemas,services,static}
cd youtubeMp3Converter

youtubeMp3Converter/
├── main.py               # App entry point
├── routers/
│   └── convert.py        # HTTP routes and request handling
├── schemas/
│   └── converter.py      # Pydantic models for request and response
├── services/
│   └── converter.py      # Business logic: yt-dlp, ffmpeg, file management
└── static/
    └── index.mht         # Frontend UI served as static site
```