---
layout: post
title: Build and Deploy a YouTube-to-MP3 Converter
image: https://unsplash.com/photos/VltJrvovRbY/download?w=437
thumb: https://unsplash.com/photos/VltJrvovRbY/download?w=437
author: Tushar Sharma
category: blog
tags: [python, fastapi, docker, github actions, scaleway]
---


I often find myself searching for websites to convert YouTube videos to MP3. Most of these sites are full of spam and annoying ads, so I decided to build a simple website and learn along the way.<!-- truncate_here -->

I often find myself searching for websites to convert YouTube videos to MP3. Most of these sites are full of spam and annoying ads, so I decided to build a simple website and learn along the way.

<div style="text-align: center; margin: 20px 0;">
  <a href="https://nsstrangeheisenberge569cdbf-container-vigorous-torvalds.functions.fnc.fr-par.scw.cloud" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #39c; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">Live Demo</a>
</div>

> Use this project only for content you have permission to download and convert.

## Architecture at a Glance

This app has one frontend and three backend endpoints:
- `POST /api/convert` accepts a YouTube URL and returns a `job_id` immediately.
- `GET /api/status/{job_id}` returns `pending | processing | done | error`.
- `GET /api/download/{job_id}` streams the final MP3 once conversion is complete.

The frontend does not hold conversion state itself. It only stores the `job_id` and polls the status endpoint until the backend marks the job as `done`.


## Sequence Diagram

Before writing even a single line of code, let's think through the **APIs** responsible for the application's logic.

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

I usually refer to [Zalando](https://github.com/zalando/restful-api-guidelines) guidelines when designing APIs.

## Server

I chose **FastAPI** for the server code. It is an **ASGI** framework (Asynchronous Server Gateway Interface), which means it can handle many requests concurrently using Python's `asyncio` event loop. By contrast, traditional **WSGI** setups process one request per worker thread/process until the response is sent.

Another reason for choosing a Python framework is to use [yt-dlp](https://github.com/yt-dlp/yt-dlp) for downloading and **ffmpeg** for conversion.

## Project Structure

We start by creating a simple application. Open a terminal and create folders like this:

```bash
mkdir -p youtubeMp3Converter/{routers,schemas,services,static}
```

Next, create files like this:

```markdown
cd youtubeMp3Converter

youtubeMp3Converter/
├── main.py               # App entry point
├── routers/
│   └── convert.py        # HTTP routes and request handling
├── schemas/
│   └── convert.py        # Pydantic models for request and response
├── services/
│   └── converter.py      # Business logic: yt-dlp, ffmpeg, file management
└── static/
    └── index.html        # Frontend UI served as static site
```

**`main.py`** creates the `FastAPI` app instance, registers routers, and mounts the static file server. It is intentionally thin — no business logic lives here.

<div style="display:none;" markdown="1">
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routers.convert import router

app = FastAPI(title="OotobMp3", version="0.1.0")
app.include_router(router)
app.mount("/", StaticFiles(directory="static", html=True), name="static")
</div>

{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: main.py
---
{% endtemplate %}

One important constraint: `include_router` must come before `app.mount`. FastAPI evaluates routes in registration order. If `StaticFiles` is mounted first, its catch-all handler intercepts every request — including `/api/*` — before the API router sees them.

**`routers/convert.py`** contains only HTTP concerns: parsing request bodies, validating input, raising `HTTPException`, and returning response models. It knows nothing about how conversion actually works.

<div style="display:none;" markdown="1">
from fastapi import APIRouter, BackgroundTasks, HTTPException

router = APIRouter(prefix="/api", tags=["convert"])

@router.post("/convert", response_model=ConvertResponse)
def submit_conversion(body: ConvertRequest, background_tasks: BackgroundTasks):
    if not is_valid_youtube_url(body.url):
        raise HTTPException(status_code=422, detail="Invalid YouTube URL")

    job_id = str(uuid.uuid4())
    jobs[job_id] = {"status": "pending", "file_path": None, "title": None, "error": None}
    background_tasks.add_task(converter.convert_video, job_id, body.url, jobs)
    return ConvertResponse(job_id=job_id)
</div>

{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: convert.py
---
{% endtemplate %}

`BackgroundTasks` is FastAPI's built-in mechanism for running work after the response is sent. The conversion starts, the response returns immediately with the `job_id`, and the download happens in a thread pool in the background.

This is a good fit for lightweight jobs in a single service. For heavier or longer-running jobs, use an external queue (for example Celery/RQ/Arq with Redis) so work survives process restarts and can be retried.

**`schemas/convert.py`** defines Pydantic models — Python dataclasses with built-in validation, serialization, and JSON schema generation.

<div style="display:none;" markdown="1">
from pydantic import BaseModel

class ConvertRequest(BaseModel):
    url: str

class ConvertResponse(BaseModel):
    job_id: str

class StatusResponse(BaseModel):
    job_id: str
    status: str
    title: str | None = None
    error: str | None = None
</div>

{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: schemas.py
---
{% endtemplate %}

**`services/converter.py`** is the only place that knows about yt-dlp and ffmpeg. If we ever swap yt-dlp for another library, only this file changes.

<div style="display:none;" markdown="1">
def convert_video(job_id: str, url: str, jobs: dict) -> None:
    jobs[job_id]["status"] = "processing"
    try:
        output_path = f"/tmp/ootob/{job_id}.mp3"
        os.makedirs("/tmp/ootob", exist_ok=True)

        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": f"/tmp/ootob/{job_id}.%(ext)s",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "128",
            }],
            "quiet": True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            jobs[job_id]["title"] = info.get("title", job_id)

        jobs[job_id]["file_path"] = output_path
        jobs[job_id]["status"] = "done"
    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)
</div>

{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: services.py
---
{% endtemplate %}

## Important Production Caveat: In-Memory State

The `jobs` dictionary and `/tmp/ootob` files are local to one container instance. That is fine for a demo, but it has two implications in production:
- A restart loses in-memory job state.
- With multiple replicas, one request can hit instance A and the next request can hit instance B, where the job/file does not exist.

For production reliability, store state and artifacts outside the process:
- Job metadata in Redis/PostgreSQL.
- Audio files in object storage (for example S3-compatible storage).
- Conversion workers on a queue, with API instances handling only HTTP.

### OpenAPI and Swagger — Free Documentation

FastAPI generates an OpenAPI specification automatically from your Pydantic schemas and route decorators. No extra work required.

Once the server is running:
- `http://localhost:8080/docs` — **Swagger UI**: interactive documentation where you can call every endpoint directly from the browser
- `http://localhost:8080/redoc` — **ReDoc**: clean, readable reference documentation
- `http://localhost:8080/openapi.json` — the raw OpenAPI JSON schema

This is why we invested in Pydantic models for every request and response. The models do double duty: runtime validation *and* documentation generation. If you add a field to `StatusResponse`, it appears in Swagger automatically.

## The Frontend

The UI is a single `static/index.html` file — HTML, CSS, and JavaScript, no framework, no build step. FastAPI's `StaticFiles` serves it at `GET /`. The JavaScript polls `GET /api/status/{job_id}` every two seconds using `setInterval`.

<div style="display:none;" markdown="1">
async function pollStatus(jobId) {
  pollInterval = setInterval(async () => {
    const res  = await fetch(`/api/status/${jobId}`);
    const data = await res.json();
    if (data.status === 'done') {
      clearInterval(pollInterval);
      showReady(data.title, jobId);
    }
    if (data.status === 'error') {
      clearInterval(pollInterval);
      showError(data.error || 'Conversion failed');
    }
  }, 2000);
}
</div>

{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: ui.js
---
{% endtemplate %}


The UI has four explicit states — IDLE, CONVERTING, READY, ERROR — each showing and hiding the relevant cards. Theme (light/dark) is toggled via a CSS `data-theme` attribute on `<html>` and persisted to `localStorage`.

---

## Makefile — Local Development Workflow

A `Makefile` is a portable task runner. Every engineer on the project runs the same commands regardless of their local setup.

<div style="display:none;" markdown="1">
IMAGE     = ootobmp3
CONTAINER = ootobmp3
PORT      = 8080

start: ## Build image if needed, then run in foreground (Ctrl+C to stop)
	@docker image inspect $(IMAGE) > /dev/null 2>&1 || $(MAKE) build
	docker run --rm -p $(PORT):$(PORT) --name $(CONTAINER) $(IMAGE)

dev: ## Run locally without Docker (requires ffmpeg installed locally)
	uv run uvicorn main:app --reload

test: ## Run tests with coverage
	uv run pytest -v --cov=. --cov-report=term-missing --cov-report=html

coverage: ## Open HTML coverage report in browser
	open htmlcov/index.html
</div>

{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: Makefile
---
{% endtemplate %}

`make test` produces a coverage table in the terminal that shows exactly which lines are not covered:

```
Name                    Stmts   Miss  Cover   Missing
-----------------------------------------------------
main.py                     6      0   100%
routers/convert.py         43      2    95%   51, 58
schemas/convert.py         10      0   100%
services/converter.py      14     10    29%   9-33
-----------------------------------------------------
TOTAL                     164     12    93%
```

`services/converter.py` sits at 29% — intentionally. The real yt-dlp + ffmpeg code is mocked in tests. You would need an actual YouTube download to hit those lines, which is not appropriate for a fast, offline test suite.

---

## Dockerfile — Ship the Whole Environment

The Dockerfile is the answer to "it works on my machine". It packages Python, ffmpeg, your dependencies, and your code into a single artifact that runs identically everywhere.

<div style="display:none;" markdown="1">
FROM python:3.12-slim

# Pull uv from its official image — no pip install needed
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Install ffmpeg — this is the whole reason for Docker in this project
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy manifest first — this layer is cached unless dependencies change
COPY pyproject.toml uv.lock ./
RUN uv sync --no-dev --frozen

# Copy application source
COPY main.py ./
COPY routers/ ./routers/
COPY schemas/ ./schemas/
COPY services/ ./services/
COPY static/ ./static/

EXPOSE 8080

# PORT env var lets hosting platforms (Render, Scaleway) inject their assigned port
CMD ["sh", "-c", "uv run uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
</div>

{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: Dockerfile
---
{% endtemplate %}

**Layer ordering matters.** Docker caches layers. If you copy source code before installing dependencies, any code change invalidates the dependency cache — meaning `uv sync` re-runs on every build even when `pyproject.toml` did not change. By copying `pyproject.toml` and `uv.lock` first and running `uv sync` before copying source, dependency installation is cached as long as the lockfile is unchanged.

**`--frozen`** tells uv to install exactly the versions in `uv.lock` — no resolution, no version drift. Production builds should always pin exact versions.

**`${PORT:-8080}`** is a shell default: if the `PORT` environment variable is set (Render and Scaleway both inject it), use that. Otherwise fall back to 8080. This makes the container portable across hosting platforms without changing the Dockerfile.

---

## GitHub Actions -> GHCR

### What Is GHCR?

**GHCR (GitHub Container Registry)** is GitHub's hosted registry for Docker images — the same concept as AWS ECR or Docker Hub, but integrated directly into your GitHub account. It is free for public repositories and included in most GitHub plans for private ones.

When you push code to GitHub, your source lives at `github.com/username/repo`. When you push a Docker image to GHCR, it lives at `ghcr.io/username/image`. The registry stores the image layers and a manifest, so any server with Docker can pull and run your image without needing your source code at all.

### The Workflow

`.github/workflows/push_image.yml`:

<div style="display:none;" markdown="1">
name: Build and Push to GHCR

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write   # required to push to GHCR

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set lowercase owner name
        run: echo "OWNER_LC=${GITHUB_REPOSITORY_OWNER,,}" >> ${GITHUB_ENV}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/${{ env.OWNER_LC }}/ootobmp3:latest
</div>


{% template  customCode.html %}
---
id: cb3fbdf5a8663fb9b43807baebb00898
file: push.yaml
---
{% endtemplate %}

**What each step does:**

1. **Checkout** — pulls your repo into the GitHub Actions runner (a fresh Ubuntu VM).
2. **Login to GHCR** — authenticates using `GITHUB_TOKEN`, a secret that GitHub automatically injects into every workflow run. No manual secret setup needed.
3. **Lowercase owner** — GHCR image names must be lowercase. GitHub usernames can have uppercase letters. This step normalises the owner before using it in the image tag.
4. **Build and push** — runs `docker build` and `docker push` in one step. The resulting image is tagged `ghcr.io/username/ootobmp3:latest`.

Every `git push` to `main` now automatically builds and publishes a fresh image. Your CI pipeline is: code review → merge → image published → ready to deploy.

### The Full Picture

```
Developer pushes code to main
    ↓
GitHub Actions runner spins up (Ubuntu VM, free)
    ↓
docker build -t ghcr.io/username/ootobmp3:latest .
    ↓
docker push ghcr.io/username/ootobmp3:latest
    ↓
Image is stored at ghcr.io
    ↓
Any server can now: docker pull ghcr.io/username/ootobmp3:latest
```

---

## Deploying to Scaleway Serverless Containers

### What Are Serverless Containers?

Serverless containers sit between a raw VPS and a fully managed PaaS. You provide a Docker image. The platform handles:
- Running the container
- Scaling to zero when there is no traffic (you pay nothing while idle)
- Scaling up when requests arrive
- HTTPS termination
- Health checks and restarts

You do not manage a server. You do not SSH anywhere. You point at an image and the platform runs it.

Scaleway's Serverless Containers product is organised around **namespaces** (a logical grouping, like a project or environment) and **containers** (the actual running unit within a namespace).

### Step 1 — Make Your GHCR Image Accessible

By default, GHCR images are private. Scaleway needs credentials to pull them.

Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens. Create a token with `read:packages` scope. Copy it — you will use it in the next step.

Alternatively, you can make the GHCR package public: go to your GitHub profile → Packages → select the image → Package Settings → Change visibility → Public. Public images need no credentials to pull.

### Step 2 — Create a Namespace

In the Scaleway console, navigate to **Serverless → Containers → Create namespace**.

Choose:
- **Name:** `ootobmp3`
- **Region:** closest to your users (Paris `fr-par`, Amsterdam `nl-ams`, Warsaw `pl-waw`)

If your GHCR image is private, add registry credentials here:
- **Registry endpoint:** `ghcr.io`
- **Username:** your GitHub username
- **Password:** the PAT token from Step 1

Via the Scaleway CLI:

```bash
# Install CLI
brew install scaleway/tap/scw

# Authenticate
scw init

# Create namespace
scw container namespace create name=ootobmp3 region=fr-par
```

Note the `namespace-id` from the output — you need it in the next step.

### Step 3 — Create the Container

In the console, inside your namespace, click **Create Container**.

| Field | Value |
|-------|-------|
| Name | `ootobmp3` |
| Image URL | `ghcr.io/yourusername/ootobmp3:latest` |
| Port | `8080` |
| Min scale | `0` (scales to zero, no idle cost) |
| Max scale | `5` |
| Memory | `512 MB` |

Via CLI:

```bash
scw container container create \
  namespace-id=<YOUR_NAMESPACE_ID> \
  name=ootobmp3 \
  registry-image=ghcr.io/yourusername/ootobmp3:latest \
  port=8080 \
  min-scale=0 \
  max-scale=5 \
  memory-limit=512 \
  region=fr-par
```

### Step 4 — Deploy

Click **Deploy** in the console. Scaleway pulls your image from GHCR, runs it, and gives you an endpoint:

```
https://ootobmp3-<random>.containers.fnc.fr-par.scw.cloud
```

Your app is live. Open that URL — you will see the OotobMp3 UI.

### Step 5 — Redeploy After a Code Change

Because the GitHub Actions workflow pushes `ghcr.io/username/ootobmp3:latest` on every merge to main, a redeploy just means telling Scaleway to pull the new `latest` image:

```bash
scw container container deploy <CONTAINER_ID> region=fr-par
```

Or trigger it from the Scaleway console by clicking **Redeploy**.

For stronger release traceability, prefer immutable tags (for example commit SHA tags) in addition to `latest`, then deploy a specific tag.

---

## The Full Deployment Pipeline

```
Code change
    ↓
git push to main
    ↓
GitHub Actions builds Docker image
    ↓
Image pushed to ghcr.io/username/ootobmp3:latest
    ↓
scw container container deploy (or click Redeploy)
    ↓
Scaleway pulls new image from GHCR
    ↓
New version is live
```

---
