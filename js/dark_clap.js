$(document).ready(function() {
  const modelUrl = "https://teachablemachine.withgoogle.com/models/GWAYbcqlE/";
  const probabilityThreshold = 0.75;
  const clapCooldownMs = 1200;

  let recognizer = null;
  let listening = false;
  let lastClapAt = 0;

  const button = document.getElementsByClassName("ClapDark_Button")[0];
  const icon = document.getElementById("icon-clap-dark");
  const status = document.getElementById("clap-dark-status");
  const firstUseKey = "clap-dark-listener-explained";

  if (!button) {
    return;
  }

  button.onclick = async function() {
    if (listening) {
      stopListening();
      return;
    }

    await startListening();
  };

  async function startListening() {
    if (!window.speechCommands) {
      setStatus("Clap listener is unavailable.");
      return;
    }

    if (!hasSeenMicExplanation()) {
      const confirmed = window.confirm("This uses your microphone locally to detect claps and toggle dark mode. Audio is not sent to this site. Start listening?");
      if (!confirmed) {
        setStatus("Clap listener not started.");
        return;
      }
      localStorage.setItem(firstUseKey, "true");
    }

    button.classList.add("is-loading");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("title", "Loading clap listener");
    button.setAttribute("aria-label", "Loading clap listener");
    button.disabled = true;
    setStatus("Loading clap listener.");

    try {
      if (!recognizer) {
        recognizer = await createRecognizer();
      }

      const labels = recognizer.wordLabels();
      recognizer.listen(function(result) {
        const prediction = getPrediction(labels, result.scores);
        if (!prediction || prediction.label !== "Clap") {
          return;
        }

        const now = Date.now();
        if (prediction.score >= probabilityThreshold && now - lastClapAt > clapCooldownMs) {
          lastClapAt = now;
          if (window.toggleDarkMode) {
            window.toggleDarkMode();
            showClapDetected();
            setStatus("Clap detected. Dark mode toggled.");
          }
        }
      }, {
        includeSpectrogram: false,
        probabilityThreshold: probabilityThreshold,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.5
      });

      listening = true;
      setIconActive(true);
    } catch (error) {
      console.warn("Could not start clap dark mode.", error);
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("title", "Clap listener unavailable");
      button.setAttribute("aria-label", "Clap listener unavailable");
      setStatus("Clap listener could not start.");
    } finally {
      button.classList.remove("is-loading");
      button.disabled = false;
    }
  }

  function stopListening() {
    if (recognizer && recognizer.isListening()) {
      recognizer.stopListening();
    }

    listening = false;
    button.setAttribute("aria-pressed", "false");
    setIconActive(false);
    setStatus("Clap listener stopped.");
  }

  async function createRecognizer() {
    const checkpointUrl = modelUrl + "model.json";
    const metadataUrl = modelUrl + "metadata.json";
    const speechRecognizer = speechCommands.create(
      "BROWSER_FFT",
      undefined,
      checkpointUrl,
      metadataUrl
    );

    await speechRecognizer.ensureModelLoaded();
    return speechRecognizer;
  }

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

  function setIconActive(active) {
    if (!icon) {
      return;
    }

    icon.innerHTML = active ? "&#127908;" : "&#128079;";
    button.setAttribute("title", active ? "Clap listener on" : "Clap listener off");
    button.setAttribute("aria-label", active ? "Stop clap listener for dark mode" : "Start clap listener for dark mode");
  }

  function showClapDetected() {
    button.classList.add("is-detected");
    window.setTimeout(function() {
      button.classList.remove("is-detected");
    }, 250);
  }

  function hasSeenMicExplanation() {
    return localStorage.getItem(firstUseKey) === "true";
  }

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }
});
