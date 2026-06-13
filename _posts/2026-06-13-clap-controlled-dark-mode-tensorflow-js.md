---
layout: post
date: 2026-06-13
title: Adding Clap Controlled Dark Mode With TensorFlow.js
author: tushar sharma
category: blog
skipImage: true
thumb: https://i.pinimg.com/736x/34/a5/44/34a544cdec18911e289935660ebe5eae.jpg
image: https://i.pinimg.com/736x/34/a5/44/34a544cdec18911e289935660ebe5eae.jpg
tags:
- javascript
- tensorflowjs
- ml
- jekyll
- dark-mode
---

I added a small experiment to this site: click a clap listener button, allow the microphone, clap your hands, and the site toggles dark mode. The interesting part is not the dark mode itself. The interesting part is how a static Jekyll site can run a small machine learning model in the browser without a backend server.<!-- truncate_here -->

This post explains the idea conceptually and technically. The implementation is inspired by [Charlie Gerard's dark-mode clap extension](https://github.com/charliegerard/dark-mode-clap-extension), which uses TensorFlow.js and a Teachable Machine audio model to detect claps.

## The Goal

I already had dark mode on this site using `DarkReader`. The manual flow was simple:

```text
user clicks dark mode button
  -> JavaScript calls DarkReader.enable() or DarkReader.disable()
  -> dark-mode state is saved in localStorage
```

The new goal was:

```text
user clicks clap listener button
  -> browser asks for microphone permission
  -> browser listens to microphone audio
  -> TensorFlow.js model predicts whether the sound is a clap
  -> if prediction is "Clap", call the same dark-mode toggle function
```

There are two important design choices:

1. The microphone and model run on the client, inside the browser.
2. The clap listener reuses the existing dark-mode function instead of creating a second theme system.

That keeps the feature small. The ML part only answers one question: "Was that sound a clap?"

## Why Not Use A Server?

One tempting idea is to send microphone audio to a serverless function and run a model there. That is unnecessary for this feature.

A clap toggle needs low latency. If every short audio window had to travel to a server and back, the interaction would feel slow. It would also create an avoidable privacy problem: users do not expect a personal blog to stream microphone audio to a backend.

The better architecture is:

```text
microphone audio
  -> browser audio APIs
  -> TensorFlow.js model in browser
  -> local prediction
  -> local UI action
```

The browser downloads the model files, but the actual inference happens locally.

## What TensorFlow.js Does Here

TensorFlow.js can do many things, but in this feature it is only doing inference.

Training and inference are different phases:

```text
training:
  many labeled audio examples
  -> model learns patterns
  -> model files are saved

inference:
  new microphone audio
  -> load saved model
  -> output probabilities for known labels
```

We are not training a model every time the page loads. That would be slow and unnecessary. We are loading a model that was trained earlier.

Conceptually, the model receives a transformed representation of sound and returns scores:

```js
{
  "Background Noise": 0.03,
  "Clap": 0.91,
  "Unknown": 0.06
}
```

Then the app logic is ordinary JavaScript:

```js
if (prediction.label === "Clap" && prediction.score >= 0.75) {
  window.toggleDarkMode();
}
```

The machine learning model does not know what "dark mode" is. It only classifies audio. The web app decides what to do with the classification.

## Why Use `https://teachablemachine.withgoogle.com/models/GWAYbcqlE/`

The inspiration project uses this model URL:

```js
const modelUrl = "https://teachablemachine.withgoogle.com/models/GWAYbcqlE/";
```

This is not an API endpoint where we upload audio and get a result back. It is a folder containing model assets exported by Google's Teachable Machine.

A TensorFlow.js audio model normally has files like:

```text
model.json
metadata.json
weights.bin
```

The JavaScript code builds URLs from the base path:

```js
const checkpointUrl = modelUrl + "model.json";
const metadataUrl = modelUrl + "metadata.json";
```

Then TensorFlow.js downloads those files into the browser and runs the model locally.

So the reason to use `https://teachablemachine.withgoogle.com/models/GWAYbcqlE/` was practical: it already contains a pretrained clap detector. That lets us implement and understand the full application flow before training our own model.

This is a good learning sequence:

1. First use someone else's pretrained model.
2. Understand the browser inference loop.
3. Replace the model URL later with your own exported model.

If the model disappears or its labels change, the feature can break. For a serious version, I would train my own model and host the exported model files inside this site.

## What Is Inside An Audio Classifier?

A browser does not pass "sound" to the model as a human concept. It passes numbers.

The rough pipeline is:

```text
microphone waveform
  -> short audio frames
  -> frequency features
  -> neural network
  -> class probabilities
```

Raw microphone audio is a waveform: amplitude over time. A clap has a sharp transient: a sudden burst of energy. But robust detection is harder than checking volume, because a dropped object or cough can also create a spike.

Audio ML models usually transform audio into frequency-domain features. In TensorFlow.js speech commands, the recognizer can use `BROWSER_FFT`.

FFT means Fast Fourier Transform. It converts a short window of audio from "how loud was the signal over time?" into "which frequencies were present, and how strong were they?"

That gives the model a better representation than raw volume:

```text
time-domain waveform
  -> FFT / spectrogram-like features
  -> classifier
```

The classifier has learned patterns from examples. During training, it saw examples labeled something like:

```text
Clap
Background Noise
Unknown
```

During inference, it outputs the probability that the current audio window belongs to each label.

## The Browser Code

The page loads three important scripts:

```html
<script defer src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.2/dist/tf.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/@tensorflow-models/speech-commands@0.5.4/dist/speech-commands.min.js"></script>
<script defer src="/js/dark_clap.js"></script>
```

The first script is TensorFlow.js. The second script is the speech commands helper library. The third script is my site-specific code.

The model is created like this:

```js
const speechRecognizer = speechCommands.create(
  "BROWSER_FFT",
  undefined,
  checkpointUrl,
  metadataUrl
);

await speechRecognizer.ensureModelLoaded();
```

The important pieces:

- `BROWSER_FFT` tells the recognizer to use browser FFT audio features.
- `checkpointUrl` points to `model.json`.
- `metadataUrl` points to `metadata.json`.
- `ensureModelLoaded()` downloads and initializes the model before listening.

Once the model is loaded, the recognizer starts listening:

```js
recognizer.listen(function(result) {
  const prediction = getPrediction(labels, result.scores);

  if (prediction.label === "Clap" && prediction.score >= 0.75) {
    window.toggleDarkMode();
  }
}, {
  includeSpectrogram: false,
  probabilityThreshold: 0.75,
  invokeCallbackOnNoiseAndUnknown: true,
  overlapFactor: 0.5
});
```

`result.scores` is an array of probabilities. The labels come from the model metadata:

```js
const labels = recognizer.wordLabels();
```

The code finds the highest scoring label:

```js
function getPrediction(labels, scores) {
  let bestIndex = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[bestIndex]) {
      bestIndex = i;
    }
  }

  return {
    label: labels[bestIndex],
    score: scores[bestIndex]
  };
}
```

Then it checks whether that label is `Clap`.

## Avoiding Repeated Toggles

Audio classifiers run continuously while listening. A single clap can be detected across more than one overlapping audio window.

Without protection, one clap might toggle dark mode on and then immediately off.

So the listener uses a cooldown:

```js
const clapCooldownMs = 1200;
let lastClapAt = 0;

const now = Date.now();
if (now - lastClapAt > clapCooldownMs) {
  lastClapAt = now;
  window.toggleDarkMode();
}
```

This is not an ML concept. It is interaction design. The model gives predictions; the product code still has to decide how to handle them.

## Reusing The Existing Dark Mode Function

The existing dark mode wrapper had internal `enable()`, `disable()`, and `darkmode()` functions. To let the clap listener reuse the same behavior, I exposed one public function:

```js
window.toggleDarkMode = darkmode;
```

That gives this structure:

```text
manual button click
  -> window.toggleDarkMode()

clap prediction
  -> window.toggleDarkMode()
```

Both paths update the same `localStorage` key and the same DarkReader state. This matters. If clap mode had its own dark-mode logic, the two controls could drift out of sync.

## UX Matters More With Microphones

The first version was technically interesting but not great UX. A clap icon beside a moon icon is ambiguous. Also, users should not be surprised by a microphone permission prompt.

The improved version uses two separate controls:

```text
moon/sun button
  -> toggles the theme

clap listener button
  -> starts or stops microphone listening
```

On first use, the site explains what is about to happen:

```js
window.confirm(
  "This uses your microphone locally to detect claps and toggle dark mode. Audio is not sent to this site. Start listening?"
);
```

This is not just politeness. It clarifies the privacy boundary:

- the model files are downloaded from Teachable Machine
- microphone audio is processed locally by TensorFlow.js
- the site does not need a backend to classify the clap

The controls are also real buttons, not links:

```html
<button type="button"
        class="DarkReader_Button theme-control"
        aria-label="Toggle dark mode"
        aria-pressed="false">
  <span id="icon-dark" aria-hidden="true">&#9790;</span>
</button>

<button type="button"
        class="ClapDark_Button theme-control"
        aria-label="Start clap listener for dark mode"
        aria-pressed="false">
  <span id="icon-clap-dark" aria-hidden="true">&#128079;</span>
</button>
```

That gives better keyboard behavior and better assistive technology semantics.

## What I Would Do Next

Using the pretrained model is fine for learning, but it is not ideal long term.

The next step is to train my own model:

1. Open Teachable Machine.
2. Create an audio project.
3. Record examples for `Clap`.
4. Record examples for `Background Noise`.
5. Add more negative examples: typing, speech, desk taps, coughs.
6. Export the model as TensorFlow.js.
7. Host `model.json`, `metadata.json`, and weights inside this repository.
8. Change `modelUrl` from the public Teachable Machine URL to a local path.

For example:

```js
const modelUrl = "/models/clap-dark-mode/";
```

At that point the site would not depend on someone else's model staying online.

## Mental Model

The main lesson is that TensorFlow.js lets a static website run pretrained ML models directly in the browser.

The full architecture is:

```text
trained Teachable Machine model
  -> exported as TensorFlow.js files
  -> browser downloads model files
  -> microphone audio becomes FFT features
  -> model predicts audio label
  -> app code checks label and confidence
  -> app toggles dark mode
```

The ML model is only one component. A usable feature also needs state management, cooldowns, permission handling, accessibility, and clear UI language.

That separation is the key concept:

```text
model responsibility:
  classify sound

application responsibility:
  decide what classification means for the user interface
```

Once that boundary is clear, replacing the model is straightforward. The rest of the site does not care whether the classifier came from Teachable Machine, a custom TensorFlow.js model, or some future audio model. It only needs a label and a confidence score.
