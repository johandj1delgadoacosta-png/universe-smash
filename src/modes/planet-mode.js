// =========================================
// UNIVERSE SMASH
// PLANET MODE
// =========================================

import {
  createPlanet
} from "../objects/planet.js";

import {
  createExplosion,
  createImpact,
  createAntimatterEffect,
  updateParticles,
  drawParticles
} from "../particles.js";


// =========================================
// PLANET MODE STATE
// =========================================

const PlanetMode = {

  active: false,

  planet: null,

  selectedWeapon: "laser",

  canvas: null,

  ctx: null

};


// =========================================
// START PLANET MODE
// =========================================

export function startPlanetMode(
  canvas
) {

  PlanetMode.active = true;

  PlanetMode.canvas = canvas;

  PlanetMode.ctx =
    canvas.getContext("2d");


  // Create one planet in the center

  PlanetMode.planet =
    createPlanet(
      "earth",
      canvas.width / 2,
      canvas.height / 2,
      {
        fixed: true
      }
    );


  console.log(
    "🌍 Planet Mode Started"
  );


  createPlanetWeaponMenu();

}


// =========================================
// STOP PLANET MODE
// =========================================

export function stopPlanetMode() {

  PlanetMode.active = false;

  PlanetMode.planet = null;


  const weaponMenu =
    document.getElementById(
      "planet-weapon-menu"
    );


  if (weaponMenu) {

    weaponMenu.remove();

  }

}


// =========================================
// CREATE WEAPON MENU
// =========================================

function createPlanetWeaponMenu() {

  let menu =
    document.getElementById(
      "planet-weapon-menu"
    );


  if (menu) {

    menu.remove();

  }


  menu =
    document.createElement("div");


  menu.id =
    "planet-weapon-menu";


  menu.innerHTML = `

    <h2>🌍 PLANET MODE</h2>

    <p>Select a fictional game effect:</p>

    <button data-weapon="laser">
      🔴 Laser
    </button>

    <button data-weapon="ice-laser">
      ❄️ Ice Laser
    </button>

    <button data-weapon="asteroid">
      ☄️ Asteroid Impact
    </button>

    <button data-weapon="mystery">
      ❓ Mystery Matter
    </button>

    <button data-weapon="alien">
      👾 Alien Effect
    </button>

    <button data-weapon="antimatter">
      🟣 Antimatter Effect
    </button>

  `;


  document.body.appendChild(
    menu
  );


  menu
    .querySelectorAll(
      "button[data-weapon]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            PlanetMode.selectedWeapon =
              button.dataset.weapon;

            console.log(
              "Selected:",
              PlanetMode.selectedWeapon
            );

          }
        );

      }
    );

}


// =========================================
// USE SELECTED GAME EFFECT
// =========================================

export function usePlanetWeapon(
  x,
  y
) {

  if (
    !PlanetMode.active ||
    !PlanetMode.planet
  ) {
    return;
  }


  const planet =
    PlanetMode.planet;


  switch (
    PlanetMode.selectedWeapon
  ) {


    // -------------------------------------
    // LASER
    // -------------------------------------

    case "laser":

      createImpact(
        x,
        y,
        "#ff3333"
      );

      break;


    // -------------------------------------
    // ICE LASER
    // -------------------------------------

    case "ice-laser":

      createImpact(
        x,
        y,
        "#55ddff"
      );

      break;


    // -------------------------------------
    // ASTEROID
    // -------------------------------------

    case "asteroid":

      createExplosion(
        x,
        y,
        {

          count: 35,

          color: "#ff8833",

          size: 8,

          speed: 8

        }
      );

      break;


    // -------------------------------------
    // MYSTERY MATTER
    // -------------------------------------

    case "mystery":

      triggerMysteryEffect(
        planet,
        x,
        y
      );

      break;


    // -------------------------------------
    // ALIEN EFFECT
    // -------------------------------------

    case "alien":

      createExplosion(
        x,
        y,
        {

          count: 30,

          color: "#55ff88",

          size: 7,

          speed: 7

        }
      );

      break;


    // -------------------------------------
    // ANTIMATTER
    // -------------------------------------

    case "antimatter":

      createAntimatterEffect(
        x,
        y
      );

      break;

  }

}


// =========================================
// MYSTERY MATTER RANDOM EFFECT
// =========================================

function triggerMysteryEffect(
  planet,
  x,
  y
) {

  const effects = [

    () => {

      createExplosion(
        x,
        y,
        {
          count: 50,
          color: "#ff44ff",
          speed: 10
        }
      );

    },


    () => {

      planet.size *= 1.15;

      planet.radius =
        planet.size / 2;

    },


    () => {

      planet.size *= 0.85;

      planet.radius =
        planet.size / 2;

    },


    () => {

      createExplosion(
        x,
        y,
        {
          count: 60,
          color: "#44ffff",
          speed: 12
        }
      );

    },


    () => {

      planet.rotationSpeed =
        (planet.rotationSpeed ?? 0)
        + 4;

    }

  ];


  const effect =
    effects[
      Math.floor(
        Math.random() *
        effects.length
      )
    ];


  effect();

}


// =========================================
// UPDATE PLANET MODE
// =========================================

export function updatePlanetMode(
  deltaTime = 1
) {

  if (!PlanetMode.active) return;


  updateParticles(
    deltaTime
  );


  if (PlanetMode.planet) {

    PlanetMode.planet.rotation +=
      (PlanetMode.planet.rotationSpeed ?? 0)
      * deltaTime;

  }

}


// =========================================
// DRAW PLANET MODE
// =========================================

export function drawPlanetMode() {

  if (
    !PlanetMode.active ||
    !PlanetMode.ctx ||
    !PlanetMode.canvas
  ) {
    return;
  }


  const ctx =
    PlanetMode.ctx;

  const canvas =
    PlanetMode.canvas;

  const planet =
    PlanetMode.planet;


  // Clear screen

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  // Space background

  ctx.fillStyle =
    "#030712";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (planet) {

    ctx.save();


    // Planet glow

    ctx.shadowBlur =
      40;

    ctx.shadowColor =
      planet.glow ??
      "#44aaff";


    ctx.fillStyle =
      planet.color ??
      "#3388dd";


    ctx.beginPath();

    ctx.arc(
      planet.position.x,
      planet.position.y,
      planet.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

  }


  // Draw visual effects

  drawParticles(
    ctx,
    {
      zoom: 1,

      worldToScreen(
        x,
        y
      ) {

        return {
          x,
          y
        };

      }

    },
    canvas
  );

}


// =========================================
// GET PLANET MODE
// =========================================

export function getPlanetMode() {

  return PlanetMode;

}
