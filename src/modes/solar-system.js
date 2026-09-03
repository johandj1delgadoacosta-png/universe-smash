// =========================================
// UNIVERSE SMASH
// SOLAR SYSTEM / SANDBOX MODE
// =========================================


// =========================================
// IMPORTS
// =========================================

import {
  updatePhysics
} from "../physics.js";


import Camera, {
  enableCameraZoom
} from "../camera.js";


import {
  updateParticles,
  drawParticles,
  createExplosion
} from "../particles.js";


import {
  createPlanet
} from "../objects/planet.js";


import {
  createMoon
} from "../objects/moon.js";


import {
  createAsteroid
} from "../objects/asteroid.js";


import {
  createAntimatterPlanet
} from "../objects/antimatter-planet.js";


// =========================================
// SOLAR SYSTEM STATE
// =========================================

const SolarSystem = {

  active: false,

  canvas: null,

  ctx: null,

  objects: [],

  selectedObject: "planet",

  dragging: false,

  lastMouseX: 0,

  lastMouseY: 0

};


// =========================================
// START SOLAR SYSTEM MODE
// =========================================

export function startSolarSystem(
  canvas
) {

  SolarSystem.active = true;

  SolarSystem.canvas = canvas;

  SolarSystem.ctx =
    canvas.getContext("2d");


  SolarSystem.objects = [];


  Camera.reset();

  enableCameraZoom(canvas);


  createSandboxMenu();


  console.log(
    "☀️ Solar System Mode Started"
  );

}


// =========================================
// STOP MODE
// =========================================

export function stopSolarSystem() {

  SolarSystem.active = false;

  SolarSystem.objects = [];


  const menu =
    document.getElementById(
      "sandbox-menu"
    );


  if (menu) {

    menu.remove();

  }

}


// =========================================
// CREATE SANDBOX MENU
// =========================================

function createSandboxMenu() {

  let menu =
    document.getElementById(
      "sandbox-menu"
    );


  if (menu) {

    menu.remove();

  }


  menu =
    document.createElement("div");


  menu.id =
    "sandbox-menu";


  menu.innerHTML = `

    <h2>☀️ SOLAR SYSTEM MODE</h2>

    <p>Add celestial objects:</p>

    <button data-object="planet">
      🌍 Planet
    </button>

    <button data-object="moon">
      🌕 Moon
    </button>

    <button data-object="asteroid">
      ☄️ Asteroid
    </button>

    <button data-object="antimatter">
      🟣 Antimatter Planet
    </button>

    <button id="clear-system">
      🗑️ Clear System
    </button>

  `;


  document.body.appendChild(
    menu
  );


  menu
    .querySelectorAll(
      "button[data-object]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",

          () => {

            SolarSystem.selectedObject =
              button.dataset.object;

          }

        );

      }
    );


  document
    .getElementById("clear-system")
    .addEventListener(
      "click",

      () => {

        SolarSystem.objects = [];

      }

    );

}


// =========================================
// ADD OBJECT
// =========================================

export function addSolarObject(
  screenX,
  screenY
) {

  if (
    !SolarSystem.active ||
    !SolarSystem.canvas
  ) {
    return;
  }


  const worldPosition =
    Camera.screenToWorld(
      screenX,
      screenY,
      SolarSystem.canvas
    );


  let object;


  switch (
    SolarSystem.selectedObject
  ) {


    // -------------------------------------
    // PLANET
    // -------------------------------------

    case "planet":

      object =
        createPlanet(
          "earth",
          worldPosition.x,
          worldPosition.y
        );

      break;


    // -------------------------------------
    // MOON
    // -------------------------------------

    case "moon":

      object =
        createMoon(
          "rocky",
          worldPosition.x,
          worldPosition.y
        );

      break;


    // -------------------------------------
    // ASTEROID
    // -------------------------------------

    case "asteroid":

      object =
        createAsteroid(
          "medium",
          worldPosition.x,
          worldPosition.y
        );

      break;


    // -------------------------------------
    // ANTIMATTER PLANET
    // -------------------------------------

    case "antimatter":

      object =
        createAntimatterPlanet(
          worldPosition.x,
          worldPosition.y
        );

      break;

  }


  if (object) {

    SolarSystem.objects.push(
      object
    );

  }

}


// =========================================
// UPDATE SOLAR SYSTEM
// =========================================

export function updateSolarSystem(
  deltaTime = 1
) {

  if (!SolarSystem.active) return;


  const activeObjects =
    SolarSystem.objects.filter(
      object => !object.destroyed
    );


  // Update physics

  updatePhysics(
    activeObjects,
    deltaTime
  );


  // Update particles

  updateParticles(
    deltaTime
  );


  // Remove destroyed objects

  SolarSystem.objects =
    SolarSystem.objects.filter(
      object => !object.destroyed
    );

}


// =========================================
// DRAW BACKGROUND
// =========================================

function drawBackground(
  ctx,
  canvas
) {

  ctx.fillStyle =
    "#02030a";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Simple stars

  ctx.fillStyle =
    "white";


  for (
    let i = 0;
    i < 120;
    i++
  ) {

    const x =
      (i * 137) %
      canvas.width;

    const y =
      (i * 73) %
      canvas.height;


    ctx.globalAlpha =
      0.2 +
      (i % 5) * 0.15;


    ctx.fillRect(
      x,
      y,
      1,
      1
    );

  }


  ctx.globalAlpha = 1;

}


// =========================================
// DRAW CELESTIAL OBJECT
// =========================================

function drawObject(
  ctx,
  object,
  canvas
) {

  const position =
    Camera.worldToScreen(
      object.position.x,
      object.position.y,
      canvas
    );


  const radius =
    (object.radius ?? 20) *
    Camera.zoom;


  ctx.save();


  // Glow

  ctx.shadowBlur =
    radius * 0.8;

  ctx.shadowColor =
    object.glow ??
    object.color ??
    "#ffffff";


  ctx.fillStyle =
    object.color ??
    "#888888";


  ctx.beginPath();

  ctx.arc(
    position.x,
    position.y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.restore();

}


// =========================================
// DRAW SOLAR SYSTEM
// =========================================

export function drawSolarSystem() {

  if (
    !SolarSystem.active ||
    !SolarSystem.ctx ||
    !SolarSystem.canvas
  ) {
    return;
  }


  const ctx =
    SolarSystem.ctx;

  const canvas =
    SolarSystem.canvas;


  drawBackground(
    ctx,
    canvas
  );


  SolarSystem.objects.forEach(
    object => {

      drawObject(
        ctx,
        object,
        canvas
      );

    }
  );


  drawParticles(
    ctx,
    Camera,
    canvas
  );

}


// =========================================
// HANDLE MOUSE DOWN
// =========================================

export function handleSolarMouseDown(
  event
) {

  if (!SolarSystem.active) return;


  const rect =
    SolarSystem.canvas
      .getBoundingClientRect();


  const x =
    event.clientX -
    rect.left;


  const y =
    event.clientY -
    rect.top;


  // Left click adds object

  if (event.button === 0) {

    addSolarObject(
      x,
      y
    );

  }


  // Middle/right drag moves camera

  if (
    event.button === 1 ||
    event.button === 2
  ) {

    SolarSystem.dragging =
      true;

    SolarSystem.lastMouseX =
      event.clientX;

    SolarSystem.lastMouseY =
      event.clientY;

  }

}


// =========================================
// HANDLE MOUSE MOVE
// =========================================

export function handleSolarMouseMove(
  event
) {

  if (
    !SolarSystem.active ||
    !SolarSystem.dragging
  ) {
    return;
  }


  const dx =
    event.clientX -
    SolarSystem.lastMouseX;


  const dy =
    event.clientY -
    SolarSystem.lastMouseY;


  Camera.move(
    -dx / Camera.zoom,
    -dy / Camera.zoom
  );


  SolarSystem.lastMouseX =
    event.clientX;

  SolarSystem.lastMouseY =
    event.clientY;

}


// =========================================
// HANDLE MOUSE UP
// =========================================

export function handleSolarMouseUp() {

  SolarSystem.dragging =
    false;

}


// =========================================
// GET SOLAR SYSTEM
// =========================================

export function getSolarSystem() {

  return SolarSystem;

}
