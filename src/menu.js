// =========================================
// UNIVERSE SMASH
// MENU CONTROLLER
// =========================================

import { showScreen, gameState } from "./main.js";


export function setupMenu() {

  console.log("📋 Setting up Universe Smash menu...");


  // =========================================
  // TITLE SCREEN BUTTONS
  // =========================================

  const pressStartButton =
    document.getElementById("pressStartButton");

  const titleSettingsButton =
    document.getElementById("titleSettingsButton");


  if (pressStartButton) {

    pressStartButton.addEventListener("click", () => {

      console.log("▶ Press Start!");

      showScreen("mainMenu");

    });

  }


  if (titleSettingsButton) {

    titleSettingsButton.addEventListener("click", () => {

      console.log("⚙ Opening settings...");

      showScreen("settingsScreen");

    });

  }


  // =========================================
  // MAIN MENU BUTTONS
  // =========================================

  const planetModeButton =
    document.getElementById("planetModeButton");

  const solarSystemButton =
    document.getElementById("solarSystemButton");

  const settingsButton =
    document.getElementById("settingsButton");


  // -----------------------------------------
  // PLANET MODE
  // -----------------------------------------

  if (planetModeButton) {

    planetModeButton.addEventListener("click", () => {

      console.log("🪐 Entering Planet Mode...");

      gameState.currentMode = "planet";

      showScreen("planetModeScreen");

      document.dispatchEvent(
        new CustomEvent("universeSmashPlanetModeStart")
      );

    });

  }


  // -----------------------------------------
  // SOLAR SYSTEM MODE
  // -----------------------------------------

  if (solarSystemButton) {

    solarSystemButton.addEventListener("click", () => {

      console.log("☀️ Entering Solar System Mode...");

      gameState.currentMode = "solar-system";

      gameState.solarSystem.running = true;

      showScreen("solarSystemScreen");

      document.dispatchEvent(
        new CustomEvent("universeSmashSolarSystemStart")
      );

    });

  }


  // -----------------------------------------
  // SETTINGS
  // -----------------------------------------

  if (settingsButton) {

    settingsButton.addEventListener("click", () => {

      console.log("⚙ Opening settings...");

      showScreen("settingsScreen");

    });

  }


  // =========================================
  // SETTINGS BACK BUTTON
  // =========================================

  const settingsScreen =
    document.getElementById("settingsScreen");

  if (settingsScreen) {

    const backButton =
      settingsScreen.querySelector(".backButton");

    if (backButton) {

      backButton.addEventListener("click", () => {

        showScreen("mainMenu");

      });

    }

  }


  // =========================================
  // SETTINGS CONTROLS
  // =========================================

  setupSettings();

}


// =========================================
// SETTINGS SYSTEM
// =========================================

function setupSettings() {

  const graphicsQuality =
    document.getElementById("graphicsQuality");

  const effectsQuality =
    document.getElementById("effectsQuality");

  const musicVolume =
    document.getElementById("musicVolume");

  const soundVolume =
    document.getElementById("soundVolume");


  if (graphicsQuality) {

    graphicsQuality.addEventListener("change", () => {

      console.log(
        "Graphics Quality:",
        graphicsQuality.value
      );

      localStorage.setItem(
        "universeSmashGraphics",
        graphicsQuality.value
      );

    });

  }


  if (effectsQuality) {

    effectsQuality.addEventListener("change", () => {

      console.log(
        "Effects Quality:",
        effectsQuality.value
      );

      localStorage.setItem(
        "universeSmashEffects",
        effectsQuality.value
      );

    });

  }


  if (musicVolume) {

    musicVolume.addEventListener("input", () => {

      localStorage.setItem(
        "universeSmashMusicVolume",
        musicVolume.value
      );

    });

  }


  if (soundVolume) {

    soundVolume.addEventListener("input", () => {

      localStorage.setItem(
        "universeSmashSoundVolume",
        soundVolume.value
      );

    });

  }


  // Load previously saved settings

  loadSavedSettings(
    graphicsQuality,
    effectsQuality,
    musicVolume,
    soundVolume
  );

}


// =========================================
// LOAD SAVED SETTINGS
// =========================================

function loadSavedSettings(
  graphicsQuality,
  effectsQuality,
  musicVolume,
  soundVolume
) {

  const savedGraphics =
    localStorage.getItem("universeSmashGraphics");

  const savedEffects =
    localStorage.getItem("universeSmashEffects");

  const savedMusic =
    localStorage.getItem("universeSmashMusicVolume");

  const savedSound =
    localStorage.getItem("universeSmashSoundVolume");


  if (savedGraphics && graphicsQuality) {
    graphicsQuality.value = savedGraphics;
  }

  if (savedEffects && effectsQuality) {
    effectsQuality.value = savedEffects;
  }

  if (savedMusic && musicVolume) {
    musicVolume.value = savedMusic;
  }

  if (savedSound && soundVolume) {
    soundVolume.value = savedSound;
  }

}
