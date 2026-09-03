// src/startup.js
// Universe Smash - Startup / Loading Screen

let startupFinished = false;
let startupSkipped = false;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function get(id) {
  return document.getElementById(id);
}

function hideElement(element) {
  if (!element) return;
  element.style.display = "none";
  element.classList.remove("visible");
  element.classList.add("hidden");
}

function showElement(element, display = "block") {
  if (!element) return;
  element.style.display = display;
  element.classList.remove("hidden");
  element.classList.add("visible");
}

function hideAllStartupStages() {
  hideElement(get("startup-logo"));
  hideElement(get("startup-warning"));
  hideElement(get("startup-loading"));
  hideElement(get("startup-title"));
  hideElement(get("start-button"));
  hideElement(get("skip-startup"));
}

function createStartControls() {
  let container = get("startup-controls");

  if (!container) {
    container = document.createElement("div");
    container.id = "startup-controls";

    const startupScreen = get("startup-screen");

    if (startupScreen) {
      startupScreen.appendChild(container);
    } else {
      document.body.appendChild(container);
    }
  }

  container.innerHTML = "";

  const startButton = document.createElement("button");
  startButton.id = "start-button";
  startButton.type = "button";
  startButton.textContent = "PRESS START";

  const skipButton = document.createElement("button");
  skipButton.id = "skip-startup";
  skipButton.type = "button";
  skipButton.textContent = "SKIP";

  container.appendChild(startButton);
  container.appendChild(skipButton);

  return {
    container,
    startButton,
    skipButton
  };
}

function updateLoading(percent, status = "") {
  const bar = get("loading-bar");
  const progress = get("loading-progress");
  const percentText = get("loading-percent");
  const statusText = get("loading-status");

  const value = Math.max(0, Math.min(100, percent));

  if (bar) {
    bar.style.width = `${value}%`;
  }

  if (progress) {
    progress.style.width = `${value}%`;
  }

  if (percentText) {
    percentText.textContent = `${Math.round(value)}%`;
  }

  if (statusText) {
    statusText.textContent = status;
  }
}

function showLoading() {
  hideAllStartupStages();

  const loading = get("startup-loading");

  if (loading) {
    showElement(loading, "flex");
  }

  updateLoading(0, "INITIALIZING...");
}

function finishStartupScreen() {
  startupFinished = true;

  const screen = get("startup-screen");

  if (screen) {
    screen.style.display = "none";
    screen.classList.remove("visible");
    screen.classList.add("hidden");
  }
}

export function skipStartup() {
  if (startupFinished) return;

  startupSkipped = true;
  finishStartupScreen();
}

export async function runStartup() {
  startupFinished = false;
  startupSkipped = false;

  const screen = get("startup-screen");

  if (!screen) {
    startupFinished = true;
    return;
  }

  // Make sure the startup screen is visible.
  screen.style.display = "flex";
  screen.classList.remove("hidden");
  screen.classList.add("visible");

  // IMPORTANT:
  // Hide EVERYTHING before beginning.
  hideAllStartupStages();

  /*
   * --------------------------------
   * 1. LOGO
   * --------------------------------
   */

  const logo = get("startup-logo");

  if (logo) {
    showElement(logo, "flex");
  }

  await sleep(1800);

  if (startupSkipped) return;

  /*
   * --------------------------------
   * 2. WARNING
   * --------------------------------
   */

  hideAllStartupStages();

  const warning = get("startup-warning");

  if (warning) {
    showElement(warning, "flex");
  }

  await sleep(2200);

  if (startupSkipped) return;

  /*
   * --------------------------------
   * 3. LOADING
   * --------------------------------
   */

  showLoading();

  const loadingSteps = [
    [5, "LOADING CORE..."],
    [15, "LOADING PHYSICS..."],
    [25, "LOADING CELESTIAL OBJECTS..."],
    [35, "LOADING PARTICLE SYSTEM..."],
    [45, "LOADING CAMERA..."],
    [55, "LOADING AUDIO..."],
    [65, "LOADING PLANET MODE..."],
    [75, "LOADING SOLAR SYSTEM MODE..."],
    [85, "LOADING INTERFACE..."],
    [95, "FINALIZING..."],
    [100, "READY"]
  ];

  for (const [percent, status] of loadingSteps) {
    if (startupSkipped) return;

    updateLoading(percent, status);

    await sleep(percent === 100 ? 700 : 250);
  }

  if (startupSkipped) return;

  /*
   * --------------------------------
   * 4. PRESS START
   * --------------------------------
   */

  hideAllStartupStages();

  const title = get("startup-title");

  if (title) {
    title.textContent = "PRESS START";
    showElement(title, "flex");
  }

  const controls = createStartControls();

  showElement(controls.container, "flex");

  return new Promise((resolve) => {
    let started = false;

    function start() {
      if (started) return;

      started = true;
      startupFinished = true;

      document.removeEventListener("keydown", keyHandler);

      finishStartupScreen();

      resolve();
    }

    function skip() {
      if (started) return;

      started = true;
      startupSkipped = true;
      startupFinished = true;

      document.removeEventListener("keydown", keyHandler);

      finishStartupScreen();

      resolve();
    }

    function keyHandler(event) {
      if (
        event.code === "Enter" ||
        event.code === "Space"
      ) {
        event.preventDefault();
        start();
      }
    }

    controls.startButton.addEventListener("click", start);
    controls.skipButton.addEventListener("click", skip);

    document.addEventListener("keydown", keyHandler);
  });
}

export function finishStartup() {
  finishStartupScreen();
}

export function isStartupFinished() {
  return startupFinished;
}

export function isStartupSkipped() {
  return startupSkipped;
}

export function resetStartup() {
  startupFinished = false;
  startupSkipped = false;

  const screen = get("startup-screen");

  if (screen) {
    screen.style.display = "flex";
    screen.classList.remove("hidden");
    screen.classList.add("visible");
  }

  hideAllStartupStages();
}

export function initializeStartup() {
  resetStartup();
}

// Global access for debugging / other scripts.
window.UniverseSmashStartup = {
  runStartup,
  skipStartup,
  finishStartup,
  isStartupFinished,
  isStartupSkipped,
  resetStartup,
  initializeStartup
};
