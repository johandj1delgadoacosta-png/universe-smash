// =========================================
// UNIVERSE SMASH
// MAIN GAME CONTROLLER
// =========================================

import {
  runStartup
} from "./startup.js";

import {
  showMainMenu
} from "./menu.js";

import {
  startPlanetMode,
  stopPlanetMode,
  updatePlanetMode,
  drawPlanetMode,
  usePlanetWeapon
} from "./modes/planet-mode.js";

import {
  startSolarSystem,
  stopSolarSystem,
  updateSolarSystem,
  drawSolarSystem,
  handleSolarMouseDown,
  handleSolarMouseMove,
  handleSolarMouseUp
} from "./modes/solar-system.js";

import AudioSystem, {
  loadDefaultSounds
} from "./audio.js";


// =========================================
// GAME STATE
// =========================================

let currentMode = null;

let canvas = null;

let lastTime = 0;


// =========================================
// INITIALIZE GAME
// =========================================

function initializeGame() {

  canvas =
    document.getElementById("game-canvas");


  if (!canvas) {

    console.error(
      "Game canvas not found!"
    );

    return;

  }


  resizeCanvas();


  window.addEventListener(
    "resize",
    resizeCanvas
  );


  // Audio

  AudioSystem.init();

  loadDefaultSounds();


  // Mouse controls

  canvas.addEventListener(
    "mousedown",
    handleMouseDown
  );

  canvas.addEventListener(
    "mousemove",
    handleMouseMove
  );

  window.addEventListener(
    "mouseup",
    handleMouseUp
  );


  // Disable right-click menu on canvas

  canvas.addEventListener(
    "contextmenu",
    event => {

      event.preventDefault();

    }
  );


  // Start startup sequence

  runStartup(
    () => {

      showMenu();

    }
  );


  requestAnimationFrame(
    gameLoop
  );

}


// =========================================
// RESIZE CANVAS
// =========================================

function resizeCanvas() {

  if (!canvas) return;


  canvas.width =
    window.innerWidth;

  canvas.height =
    window.innerHeight;

}


// =========================================
// SHOW MENU
// =========================================

function showMenu() {

  stopCurrentMode();


  showMainMenu(
    mode => {

      startMode(mode);

    }
  );

}


// =========================================
// START MODE
// =========================================

function startMode(mode) {

  stopCurrentMode();


  currentMode = mode;


  if (mode === "planet") {

    startPlanetMode(
      canvas
    );

  }


  if (mode === "solar-system") {

    startSolarSystem(
      canvas
    );

  }

}


// =========================================
// STOP CURRENT MODE
// =========================================

function stopCurrentMode() {

  if (
    currentMode === "planet"
  ) {

    stopPlanetMode();

  }


  if (
    currentMode === "solar-system"
  ) {

    stopSolarSystem();

  }


  currentMode = null;

}


// =========================================
// MOUSE DOWN
// =========================================

function handleMouseDown(event) {

  if (!currentMode) return;


  if (
    currentMode === "planet"
  ) {

    const rect =
      canvas.getBoundingClientRect();


    const x =
      event.clientX -
      rect.left;


    const y =
      event.clientY -
      rect.top;


    usePlanetWeapon(
      x,
      y
    );

  }


  if (
    currentMode === "solar-system"
  ) {

    handleSolarMouseDown(
      event
    );

  }

}


// =========================================
// MOUSE MOVE
// =========================================

function handleMouseMove(event) {

  if (
    currentMode === "solar-system"
  ) {

    handleSolarMouseMove(
      event
    );

  }

}


// =========================================
// MOUSE UP
// =========================================

function handleMouseUp() {

  if (
    currentMode === "solar-system"
  ) {

    handleSolarMouseUp();

  }

}


// =========================================
// GAME LOOP
// =========================================

function gameLoop(timestamp) {

  let deltaTime =
    (timestamp - lastTime) /
    16.666;


  // Prevent huge jumps after lag

  deltaTime =
    Math.min(
      deltaTime || 1,
      3
    );


  lastTime =
    timestamp;


  // ---------------------------------------
  // PLANET MODE
  // ---------------------------------------

  if (
    currentMode === "planet"
  ) {

    updatePlanetMode(
      deltaTime
    );


    drawPlanetMode();

  }


  // ---------------------------------------
  // SOLAR SYSTEM MODE
  // ---------------------------------------

  if (
    currentMode === "solar-system"
  ) {

    updateSolarSystem(
      deltaTime
    );


    drawSolarSystem();

  }


  requestAnimationFrame(
    gameLoop
  );

}


// =========================================
// START GAME
// =========================================

document.addEventListener(
  "DOMContentLoaded",
  initializeGame
);
