// =========================================
// UNIVERSE SMASH
// SOLAR SYSTEM / SANDBOX MODE
// =========================================

import {
  gameState,
  updateObjectCount
} from "../main.js";

import {
  createPhysicsBody,
  updatePhysics,
  findCollisions,
  absorbObject,
  setOrbitVelocity
} from "../physics.js";


// =========================================
// STATE
// =========================================

let canvas = null;

let objects = [];

let animationRunning = false;

let selectedObjectType = null;


// =========================================
// SETUP
// =========================================

export function setupSolarSystem() {

  console.log("☀️ Solar System Mode ready.");

  canvas =
    document.getElementById(
      "solarSystemCanvas"
    );


  // -----------------------------------------
  // OBJECT BUTTONS
  // -----------------------------------------

  const objectButtons =
    document.querySelectorAll(
      "#solarSystemScreen .toolButton"
    );


  objectButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        selectedObjectType =
          button.dataset.object;

        gameState.selectedObject =
          selectedObjectType;


        highlightSelectedButton(button);

        console.log(
          `Selected object: ${selectedObjectType}`
        );

      }
    );

  });


  // -----------------------------------------
  // CLICK CANVAS TO ADD OBJECT
  // -----------------------------------------

  if (canvas) {

    canvas.addEventListener(
      "click",
      addObjectFromClick
    );

  }


  // -----------------------------------------
  // START EVENT
  // -----------------------------------------

  document.addEventListener(
    "universeSmashSolarSystemStart",
    startSolarSystem
  );

}


// =========================================
// START SOLAR SYSTEM
// =========================================

function startSolarSystem() {

  console.log(
    "🌌 Solar System Sandbox started!"
  );


  // Create default star if empty

  if (objects.length === 0) {

    createStar(
      0,
      0
    );

  }


  if (!animationRunning) {

    animationRunning = true;

    requestAnimationFrame(
      gameLoop
    );

  }

}


// =========================================
// ADD OBJECT FROM CLICK
// =========================================

function addObjectFromClick(event) {

  if (!selectedObjectType) {

    showMessage(
      "SELECT AN OBJECT FIRST"
    );

    return;

  }


  const rect =
    canvas.getBoundingClientRect();


  const x =
    event.clientX -
    rect.left;

  const y =
    event.clientY -
    rect.top;


  switch (selectedObjectType) {

    case "star":
      createStar(x, y);
      break;

    case "planet":
      createPlanet(x, y);
      break;

    case "moon":
      createMoon(x, y);
      break;

    case "asteroid":
      createAsteroid(x, y);
      break;

    case "black-hole":
      createBlackHole(x, y);
      break;

    case "wormhole":
      createWormhole(x, y);
      break;

    case "grey-hole":
      createGreyHole(x, y);
      break;

    case "antimatter-planet":
      createAntimatterPlanet(x, y);
      break;

  }

}


// =========================================
// CREATE BASE OBJECT
// =========================================

function createObject(
  type,
  x,
  y,
  options = {}
) {

  const element =
    document.createElement("div");


  element.className =
    `spaceObject ${type}`;


  element.style.position =
    "absolute";

  element.style.left =
    `${x}px`;

  element.style.top =
    `${y}px`;

  element.style.transform =
    "translate(-50%, -50%)";

  element.style.width =
    `${options.size}px`;

  element.style.height =
    `${options.size}px`;

  element.style.borderRadius =
    "50%";

  element.style.background =
    options.background;

  element.style.boxShadow =
    options.shadow || "none";


  canvas.appendChild(element);


  const body =
    createPhysicsBody({

      mass:
        options.mass ?? 10,

      radius:
        options.radius ?? 1,

      x,
      y,
      z: 0,

      vx:
        options.vx ?? 0,

      vy:
        options.vy ?? 0,

      vz: 0,

      fixed:
        options.fixed ?? false

    });


  body.type = type;

  body.name = type;

  body.element = element;

  body.size = options.size;


  objects.push(body);

  gameState.solarSystem.objects =
    objects;

  updateObjectCount();


  return body;

}


// =========================================
// STAR
// =========================================

function createStar(x, y) {

  const star =
    createObject(
      "star",
      x,
      y,
      {

        size: 100,

        mass: 5000,

        radius: 50,

        fixed: true,

        background:
          "radial-gradient(circle, #fff7b0 0%, #ffcc33 40%, #ff6600 100%)",

        shadow:
          "0 0 80px #ffbb33"

      }
    );


  showMessage(
    "⭐ STAR CREATED"
  );


  return star;

}


// =========================================
// PLANET
// =========================================

function createPlanet(x, y) {

  const planet =
    createObject(
      "planet",
      x,
      y,
      {

        size: 50,

        mass: 50,

        radius: 25,

        background:
          "radial-gradient(circle at 30% 30%, #6fd4ff, #176baf 50%, #082b52)",

        shadow:
          "0 0 20px #3b9fff"

      }
    );


  // Find first star and create orbit

  const star =
    objects.find(
      object =>
        object.type === "star"
    );


  if (star) {

    setOrbitVelocity(
      planet,
      star
    );

  }


  showMessage(
    "🪐 PLANET CREATED"
  );


  return planet;

}


// =========================================
// MOON
// =========================================

function createMoon(x, y) {

  return createObject(
    "moon",
    x,
    y,
    {

      size: 25,

      mass: 8,

      radius: 12,

      background:
        "radial-gradient(circle at 30% 30%, #eeeeee, #777777)",

      shadow:
        "0 0 10px #999"

    }
  );

}


// =========================================
// ASTEROID
// =========================================

function createAsteroid(x, y) {

  return createObject(
    "asteroid",
    x,
    y,
    {

      size: 18,

      mass: 5,

      radius: 9,

      background:
        "radial-gradient(circle, #9b8068, #3b2b24)"

    }
  );

}


// =========================================
// BLACK HOLE
// =========================================

function createBlackHole(x, y) {

  const blackHole =
    createObject(
      "black-hole",
      x,
      y,
      {

        size: 80,

        mass: 10000,

        radius: 40,

        background:
          "radial-gradient(circle, #000 40%, #331166 60%, #8c35ff 75%, transparent 76%)",

        shadow:
          "0 0 60px #8a2dff"

      }
    );


  blackHole.isBlackHole = true;


  showMessage(
    "🕳️ BLACK HOLE CREATED"
  );


  return blackHole;

}


// =========================================
// WORMHOLE
// =========================================

function createWormhole(x, y) {

  const wormhole =
    createObject(
      "wormhole",
      x,
      y,
      {

        size: 70,

        mass: 500,

        radius: 35,

        background:
          "conic-gradient(#4cffff, #572cff, #ff4cff, #4cffff)",

        shadow:
          "0 0 50px #45eaff"

      }
    );


  wormhole.isWormhole = true;

  wormhole.element.style.animation =
    "wormholeSpin 4s linear infinite";


  return wormhole;

}


// =========================================
// GREY HOLE
// =========================================

function createGreyHole(x, y) {

  const greyHole =
    createObject(
      "grey-hole",
      x,
      y,
      {

        size: 75,

        mass: 7000,

        radius: 38,

        background:
          "radial-gradient(circle, #777 0%, #333 45%, #aaa 65%, #222 100%)",

        shadow:
          "0 0 45px #bbbbbb"

      }
    );


  greyHole.isGreyHole = true;


  return greyHole;

}


// =========================================
// ANTIMATTER PLANET
// =========================================

function createAntimatterPlanet(x, y) {

  const antimatter =
    createObject(
      "antimatter-planet",
      x,
      y,
      {

        size: 55,

        mass: 45,

        radius: 27,

        background:
          "radial-gradient(circle at 30% 30%, #ffb0ff, #b22cff 45%, #3d0066)",

        shadow:
          "0 0 35px #c13cff"

      }
    );


  antimatter.isAntimatter = true;


  showMessage(
    "🟣 ANTIMATTER PLANET CREATED"
  );


  return antimatter;

}


// =========================================
// GAME LOOP
// =========================================

let lastTime =
  performance.now();


function gameLoop(time) {

  if (!animationRunning) return;


  const deltaTime =
    Math.min(
      (time - lastTime) / 1000,
      0.05
    );

  lastTime = time;


  // Update gravity and movement

  updatePhysics(
    objects,
    deltaTime * 60
  );


  // Black hole absorption

  updateBlackHoles();


  // Collisions

  handleCollisions();


  // Update visuals

  updateObjectVisuals();


  // Remove destroyed objects

  removeDestroyedObjects();


  requestAnimationFrame(
    gameLoop
  );

}


// =========================================
// BLACK HOLE SYSTEM
// =========================================

function updateBlackHoles() {

  const blackHoles =
    objects.filter(
      object =>
        object.isBlackHole &&
        !object.destroyed
    );


  blackHoles.forEach(
    blackHole => {

      objects.forEach(
        object => {

          if (
            object === blackHole ||
            object.destroyed
          ) {
            return;
          }


          const absorbed =
            absorbObject(
              blackHole,
              object
            );


          if (absorbed) {

            // Grow visual size

            blackHole.size += 2;

            blackHole.element.style.width =
              `${blackHole.size}px`;

            blackHole.element.style.height =
              `${blackHole.size}px`;

            blackHole.element.style.boxShadow =
              `0 0 ${blackHole.size}px #8a2dff`;


            showMessage(
              "🕳️ BLACK HOLE ABSORBED AN OBJECT!"
            );

          }

        }
      );

    }
  );

}


// =========================================
// COLLISIONS
// =========================================

function handleCollisions() {

  const collisions =
    findCollisions(objects);


  collisions.forEach(
    collision => {

      const a =
        collision.a;

      const b =
        collision.b;


      if (
        a.destroyed ||
        b.destroyed
      ) {
        return;
      }


      // Antimatter reaction

      if (
        a.isAntimatter ||
        b.isAntimatter
      ) {

        a.destroyed = true;
        b.destroyed = true;

        showMessage(
          "🟣⚡ ANTIMATTER REACTION!"
        );

        return;

      }


      // Normal collision:
      // smaller object is destroyed

      if (a.mass >= b.mass) {

        b.destroyed = true;

      } else {

        a.destroyed = true;

      }


      showMessage(
        "💥 CELESTIAL COLLISION!"
      );

    }
  );

}


// =========================================
// UPDATE VISUALS
// =========================================

function updateObjectVisuals() {

  objects.forEach(
    object => {

      if (
        object.destroyed ||
        !object.element
      ) {
        return;
      }


      object.element.style.left =
        `${object.position.x}px`;

      object.element.style.top =
        `${object.position.y}px`;

    }
  );

}


// =========================================
// REMOVE DESTROYED OBJECTS
// =========================================

function removeDestroyedObjects() {

  for (
    let i = objects.length - 1;
    i >= 0;
    i--
  ) {

    const object =
      objects[i];


    if (
      object.destroyed
    ) {

      if (
        object.element
      ) {

        object.element.remove();

      }


      objects.splice(
        i,
        1
      );

    }

  }


  gameState.solarSystem.objects =
    objects;

  updateObjectCount();

}


// =========================================
// UI
// =========================================

function highlightSelectedButton(button) {

  document
    .querySelectorAll(
      "#solarSystemScreen .toolButton"
    )
    .forEach(
      item => {

        item.style.outline =
          "none";

      }
    );


  button.style.outline =
    "2px solid #8db7ff";

}


// =========================================
// MESSAGE
// =========================================

function showMessage(text) {

  const label =
    canvas?.querySelector(
      ".simulationLabel"
    );


  if (!label) return;


  label.textContent = text;


  clearTimeout(
    label.messageTimeout
  );


  label.messageTimeout =
    setTimeout(
      () => {

        label.textContent =
          "BUILD YOUR OWN UNIVERSE";

      },
      2000
    );

}
