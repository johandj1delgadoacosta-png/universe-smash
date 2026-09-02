// =========================================
// UNIVERSE SMASH
// STARTUP SEQUENCE
// =========================================

import { showScreen } from "./main.js";


export function startStartupSequence() {

  console.log("🚀 Starting Universe Smash startup sequence...");

  const startupScreen = document.getElementById("startupScreen");

  const studioSplash = document.getElementById("studioSplash");
  const techSplash = document.getElementById("techSplash");
  const warningSplash = document.getElementById("warningSplash");
  const loadingSplash = document.getElementById("loadingSplash");

  const warningButton = document.getElementById(
    "warningContinueButton"
  );

  // Make sure startup screen is visible
  startupScreen.classList.remove("hidden");
  startupScreen.classList.add("active");

  // -----------------------------------------
  // HELPER: SHOW ONE STARTUP PANEL
  // -----------------------------------------

  function showPanel(panel) {

    const panels = [
      studioSplash,
      techSplash,
      warningSplash,
      loadingSplash
    ];

    panels.forEach((item) => {
      item.classList.add("hidden");
    });

    panel.classList.remove("hidden");

  }


  // -----------------------------------------
  // STUDIO SPLASH
  // -----------------------------------------

  showPanel(studioSplash);

  setTimeout(() => {

    // -----------------------------------------
    // TECHNOLOGY SPLASH
    // -----------------------------------------

    showPanel(techSplash);

    setTimeout(() => {

      // -----------------------------------------
      // SAFETY NOTICE
      // -----------------------------------------

      showPanel(warningSplash);

    }, 2500);

  }, 2500);


  // -----------------------------------------
  // CONTINUE BUTTON
  // -----------------------------------------

  warningButton.addEventListener("click", () => {

    beginLoading();

  }, { once: true });

}


// =========================================
// LOADING SEQUENCE
// =========================================

function beginLoading() {

  const studioSplash = document.getElementById("studioSplash");
  const techSplash = document.getElementById("techSplash");
  const warningSplash = document.getElementById("warningSplash");
  const loadingSplash = document.getElementById("loadingSplash");

  // Hide previous panels
  studioSplash.classList.add("hidden");
  techSplash.classList.add("hidden");
  warningSplash.classList.add("hidden");

  // Show loading screen
  loadingSplash.classList.remove("hidden");


  // Progress bars
  const planetProgress =
    document.getElementById("planetProgress");

  const starProgress =
    document.getElementById("starProgress");

  const physicsProgress =
    document.getElementById("physicsProgress");

  const effectsProgress =
    document.getElementById("effectsProgress");

  const loadingText =
    document.getElementById("loadingText");


  let progress = 0;


  // -----------------------------------------
  // FAKE LOADING PROGRESS
  // -----------------------------------------

  const loadingInterval = setInterval(() => {

    progress += 2;

    planetProgress.style.width =
      `${Math.min(progress + 10, 100)}%`;

    starProgress.style.width =
      `${Math.min(progress + 20, 100)}%`;

    physicsProgress.style.width =
      `${Math.min(progress, 100)}%`;

    effectsProgress.style.width =
      `${Math.min(progress + 5, 100)}%`;


    // Update text

    if (progress < 30) {

      loadingText.textContent =
        "GENERATING PLANETS...";

    } else if (progress < 55) {

      loadingText.textContent =
        "IGNITING STARS...";

    } else if (progress < 80) {

      loadingText.textContent =
        "INITIALIZING PHYSICS...";

    } else {

      loadingText.textContent =
        "UNIVERSE READY...";

    }


    // -----------------------------------------
    // FINISHED LOADING
    // -----------------------------------------

    if (progress >= 100) {

      clearInterval(loadingInterval);

      setTimeout(() => {

        console.log("🌌 Universe initialized!");

        showScreen("titleScreen");

      }, 700);

    }

  }, 45);

}
