// =========================================
// UNIVERSE SMASH
// MAIN GAME CONTROLLER
// =========================================

import { startStartupSequence } from "./startup.js";
import { setupMenu } from "./menu.js";
import { setupPlanetMode } from "./modes/planet-mode.js";
import { setupSolarSystem } from "./modes/solar-system.js";

// Wait until the page is ready
document.addEventListener("DOMContentLoaded", () => {

  console.log("🌌 Universe Smash starting...");

  // Start all major game systems
  setupMenu();
  setupPlanetMode();
  setupSolarSystem();

  // Start the splash / loading sequence
  startStartupSequence();

});


// =========================================
// SCREEN MANAGEMENT
// =========================================

export function showScreen(screenId) {

  // Find every normal screen and game screen
  const screens = document.querySelectorAll(
    ".screen, .gameScreen"
  );

  // Hide them all
  screens.forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("active");
  });

  // Show the requested screen
  const target = document.getElementById(screenId);

  if (target) {
    target.classList.remove("hidden");
    target.classList.add("active");
  } else {
    console.warn(
      `Universe Smash: Screen "${screenId}" was not found.`
    );
  }

}


// =========================================
// GAME STATE
// =========================================

export const gameState = {

  currentMode: null,

  planet: {
    type: "NONE",
    health: 100
  },

  solarSystem: {
    objects: [],
    running: false
  },

  selectedTool: null,

  selectedObject: null

};


// =========================================
// GLOBAL HELPERS
// =========================================

export function setPlanetHealth(value) {

  // Keep health between 0 and 100
  gameState.planet.health = Math.max(
    0,
    Math.min(100, value)
  );

  const healthText =
    document.getElementById("planetHealth");

  const healthFill =
    document.getElementById("healthFill");

  if (healthText) {
    healthText.textContent =
      `${Math.round(gameState.planet.health)}%`;
  }

  if (healthFill) {
    healthFill.style.width =
      `${gameState.planet.health}%`;
  }

}


export function setPlanetType(type) {

  gameState.planet.type = type;

  const planetType =
    document.getElementById("planetType");

  if (planetType) {
    planetType.textContent = type;
  }

}


export function updateObjectCount() {

  const objectCount =
    document.getElementById("objectCount");

  if (objectCount) {
    objectCount.textContent =
      gameState.solarSystem.objects.length;
  }

}


// =========================================
// BACK BUTTONS
// =========================================

document.addEventListener("click", (event) => {

  const button =
    event.target.closest(".backButton");

  if (!button) return;

  const destination =
    button.dataset.back;

  if (destination === "menu") {

    gameState.currentMode = null;

    showScreen("mainMenu");

  }

});


// =========================================
// GLOBAL KEYBOARD CONTROLS
// =========================================

document.addEventListener("keydown", (event) => {

  // Escape returns to the menu
  if (event.key === "Escape") {

    const planetScreen =
      document.getElementById("planetModeScreen");

    const solarScreen =
      document.getElementById("solarSystemScreen");

    if (
      planetScreen &&
      !planetScreen.classList.contains("hidden")
    ) {

      showScreen("mainMenu");

    }

    if (
      solarScreen &&
      !solarScreen.classList.contains("hidden")
    ) {

      showScreen("mainMenu");

    }

  }

});


// =========================================
// START MESSAGE
// =========================================

console.log(`
======================================
          UNIVERSE SMASH
======================================

Game systems initialized.

Modes:
🪐 Planet Mode
☀️ Solar System Sandbox

Ready.
======================================
`);
