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
  createStar
} from "../objects/star.js";


import {
  createBlackHole,
  updateBlackHole
} from "../objects/black-hole.js";


import {
  createGreyHole,
  updateGreyHole
} from "../objects/grey-hole.js";


import {
  createWormhole,
  updateWormhole,
  linkWormholes
} from "../objects/wormhole.js";


import {
  createAntimatterPlanet,
  updateAntimatterPlanet
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

  lastMouseY: 0,

  wormholes: [],

  zoomEnabled: false

};


// =========================================
// START SOLAR SYSTEM MODE
// =========================================

export function startSolarSystem(canvas) {

  SolarSystem.active = true;

  SolarSystem.canvas = canvas;

  SolarSystem.ctx =
    canvas.getContext("2d");

  SolarSystem.objects = [];

  SolarSystem.wormholes = [];


  Camera.reset();


  // Only add zoom listener once

  if (!SolarSystem.zoomEnabled) {

    enableCameraZoom(canvas);

    SolarSystem.zoomEnabled = true;

  }


  createSandboxMenu();


  console.log(
    "☀️ Solar System Mode Started"
  );

}


// =========================================
// STOP SOLAR SYSTEM MODE
// =========================================

export function stopSolarSystem() {

  SolarSystem.active = false;

  SolarSystem.objects = [];

  SolarSystem.wormholes = [];


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

    <h2>🌌 SOLAR SYSTEM MODE</h2>

    <p class="sandbox-description">
      Select an object, then click in space to place it.
    </p>


    <div class="object-section">

      <h3>⭐ STARS</h3>

      <button data-object="star">
        ⭐ Star
      </button>

    </div>


    <div class="object-section">

      <h3>🪐 PLANETS</h3>

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
        🟣 Antimatter World
      </button>

    </div>


    <div class="object-section">

      <h3>🌌 COSMIC OBJECTS</h3>

      <button data-object="black-hole">
        🕳️ Black Hole
      </button>

      <button data-object="grey-hole">
        🩶 Grey Hole
      </button>

      <button data-object="wormhole">
        🌀 Wormhole
      </button>

    </div>


    <div class="object-section">

      <h3>⚙️ SYSTEM</h3>

      <button id="reset-camera">
        🔭 Reset Camera
      </button>

      <button id="clear-system">
        🗑️ Clear System
      </button>

    </div>

  `;


  document.body.appendChild(menu);


  // ---------------------------------------
  // OBJECT BUTTONS
  // ---------------------------------------

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


            // Visual selected state

            menu
              .querySelectorAll(
                "button[data-object]"
              )
              .forEach(
                otherButton => {

                  otherButton.classList.remove(
                    "selected-object"
                  );

                }
              );


            button.classList.add(
              "selected-object"
            );

          }
        );

      }
    );


  // ---------------------------------------
  // RESET CAMERA
  // ---------------------------------------

  document
    .getElementById("reset-camera")
    .addEventListener(
      "click",
      () => {

        Camera.reset();

      }
    );


  // ---------------------------------------
  // CLEAR SYSTEM
  // ---------------------------------------

  document
    .getElementById("clear-system")
    .addEventListener(
      "click",
      () => {

        SolarSystem.objects = [];

        SolarSystem.wormholes = [];

      }
    );

}


// =========================================
// ADD SOLAR OBJECT
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


  let object = null;


  switch (
    SolarSystem.selectedObject
  ) {


    // =====================================
    // PLANET
    // =====================================

    case "planet":

      object =
        createPlanet(
          "earth",
          worldPosition.x,
          worldPosition.y
        );

      break;


    // =====================================
    // MOON
    // =====================================

    case "moon":

      object =
        createMoon(
          "rocky",
          worldPosition.x,
          worldPosition.y
        );

      break;


    // =====================================
    // ASTEROID
    // =====================================

    case "asteroid":

      object =
        createAsteroid(
          "medium",
          worldPosition.x,
          worldPosition.y
        );

      break;


    // =====================================
    // STAR
    // =====================================

    case "star":

      object =
        createStar(
          "yellow",
          worldPosition.x,
          worldPosition.y
        );

      break;


    // =====================================
    // BLACK HOLE
    // =====================================

    case "black-hole":

      object =
        createBlackHole(
          worldPosition.x,
          worldPosition.y
        );

      break;


    // =====================================
    // GREY HOLE
    // =====================================

    case "grey-hole":

      object =
        createGreyHole(
          worldPosition.x,
          worldPosition.y
        );

      break;


    // =====================================
    // WORMHOLE
    // =====================================

    case "wormhole":

      object =
        createWormhole(
          worldPosition.x,
          worldPosition.y
        );

      break;


    // =====================================
    // ANTIMATTER WORLD
    // =====================================

    case "antimatter":

      object =
        createAntimatterPlanet(
          worldPosition.x,
          worldPosition.y
        );

      break;

  }


  // ---------------------------------------
  // ADD OBJECT
  // ---------------------------------------

  if (object) {

    SolarSystem.objects.push(object);


    // -------------------------------------
    // WORMHOLE LINKING
    // -------------------------------------

    if (
      object.type === "wormhole"
    ) {

      SolarSystem.wormholes.push(
        object
      );


      // Link every pair of wormholes

      if (
        SolarSystem.wormholes.length >= 2
      ) {

        const total =
          SolarSystem.wormholes.length;


        const wormholeA =
          SolarSystem.wormholes[
            total - 2
          ];


        const wormholeB =
          SolarSystem.wormholes[
            total - 1
          ];


        linkWormholes(
          wormholeA,
          wormholeB
        );

      }

    }


    console.log(
      `Added ${object.type}`
    );

  }

}


// =========================================
// UPDATE SPECIAL OBJECTS
// =========================================

function updateSpecialObjects(
  deltaTime
) {

  const objects =
    SolarSystem.objects;


  for (
    const object of objects
  ) {


    // BLACK HOLE

    if (
      object.type === "black-hole"
    ) {

      updateBlackHole(
        object,
        objects,
        deltaTime
      );

    }


    // GREY HOLE

    if (
      object.type === "grey-hole"
    ) {

      updateGreyHole(
        object,
        objects,
        deltaTime
      );

    }


    // WORMHOLE

    if (
      object.type === "wormhole"
    ) {

      updateWormhole(
        object,
        objects,
        deltaTime
      );

    }


    // ANTIMATTER PLANET

    if (
      object.type ===
      "antimatter-planet"
    ) {

      const reaction =
        updateAntimatterPlanet(
          object,
          objects,
          deltaTime
        );


      if (reaction) {

        createExplosion(
          reaction.position.x,
          reaction.position.y,
          {

            count: 120,

            color:
              reaction.color,

            size: 12,

            speed: 14

          }
        );

      }

    }

  }

}


// =========================================
// UPDATE SOLAR SYSTEM
// =========================================

export function updateSolarSystem(
  deltaTime = 1
) {

  if (!SolarSystem.active) {

    return;

  }


  const activeObjects =
    SolarSystem.objects.filter(
      object =>
        !object.destroyed
    );


  // ---------------------------------------
  // NORMAL PHYSICS
  // ---------------------------------------

  updatePhysics(
    activeObjects,
    deltaTime
  );


  // ---------------------------------------
  // SPECIAL OBJECTS
  // ---------------------------------------

  updateSpecialObjects(
    deltaTime
  );


  // ---------------------------------------
  // PARTICLES
  // ---------------------------------------

  updateParticles(
    deltaTime
  );


  // ---------------------------------------
  // REMOVE DESTROYED OBJECTS
  // ---------------------------------------

  SolarSystem.objects =
    SolarSystem.objects.filter(
      object =>
        !object.destroyed
    );


  SolarSystem.wormholes =
    SolarSystem.wormholes.filter(
      wormhole =>
        !wormhole.destroyed
    );

}


// =========================================
// DRAW SPACE BACKGROUND
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


  // Deterministic star field

  for (
    let i = 0;
    i < 180;
    i++
  ) {

    const x =
      (i * 97) %
      canvas.width;


    const y =
      (i * 173) %
      canvas.height;


    const size =
      i % 8 === 0
        ? 2
        : 1;


    ctx.globalAlpha =
      0.25 +
      (i % 5) * 0.12;


    ctx.fillStyle =
      "#ffffff";


    ctx.fillRect(
      x,
      y,
      size,
      size
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
    Math.max(
      2,
      (object.radius ?? 20) *
      Camera.zoom
    );


  ctx.save();


  // ---------------------------------------
  // BLACK HOLE VISUAL
  // ---------------------------------------

  if (
    object.type === "black-hole"
  ) {

    // Purple outer glow

    ctx.shadowBlur =
      radius * 2;

    ctx.shadowColor =
      "#8a2dff";


    ctx.fillStyle =
      "#8a2dff";


    ctx.beginPath();

    ctx.arc(
      position.x,
      position.y,
      radius * 1.2,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // Dark center

    ctx.shadowBlur = 0;

    ctx.fillStyle =
      "#000000";


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

    return;

  }


  // ---------------------------------------
  // GREY HOLE VISUAL
  // ---------------------------------------

  if (
    object.type === "grey-hole"
  ) {

    ctx.shadowBlur =
      radius * 1.5;

    ctx.shadowColor =
      "#8a1111";


    ctx.fillStyle =
      "#555555";


    ctx.beginPath();

    ctx.arc(
      position.x,
      position.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.fill();


    // Dim red light

    ctx.fillStyle =
      "#a83232";


    ctx.globalAlpha =
      0.7;


    ctx.beginPath();

    ctx.arc(
      position.x,
      position.y,
      radius * 0.35,
      0,
      Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

    return;

  }


  // ---------------------------------------
  // WORMHOLE VISUAL
  // ---------------------------------------

  if (
    object.type === "wormhole"
  ) {

    ctx.shadowBlur =
      radius * 2;

    ctx.shadowColor =
      "#46eaff";


    ctx.strokeStyle =
      "#8b4dff";

    ctx.lineWidth =
      Math.max(
        2,
        radius * 0.25
      );


    ctx.beginPath();

    ctx.arc(
      position.x,
      position.y,
      radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();


    ctx.strokeStyle =
      "#46eaff";


    ctx.beginPath();

    ctx.arc(
      position.x,
      position.y,
      radius * 0.55,
      0,
      Math.PI * 2
    );

    ctx.stroke();


    ctx.restore();

    return;

  }


  // ---------------------------------------
  // NORMAL OBJECT
  // ---------------------------------------

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


  // Draw objects

  SolarSystem.objects.forEach(
    object => {

      drawObject(
        ctx,
        object,
        canvas
      );

    }
  );


  // Draw particles

  drawParticles(
    ctx,
    Camera,
    canvas
  );

}


// =========================================
// MOUSE DOWN
// =========================================

export function handleSolarMouseDown(
  event
) {

  if (!SolarSystem.active) {

    return;

  }


  const rect =
    SolarSystem.canvas
      .getBoundingClientRect();


  const x =
    event.clientX -
    rect.left;


  const y =
    event.clientY -
    rect.top;


  // LEFT CLICK = ADD OBJECT

  if (
    event.button === 0
  ) {

    addSolarObject(
      x,
      y
    );

  }


  // MIDDLE OR RIGHT CLICK = PAN CAMERA

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
// MOUSE MOVE
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
// MOUSE UP
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
