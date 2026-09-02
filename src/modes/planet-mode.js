// =========================================
// UNIVERSE SMASH
// PLANET MODE
// =========================================

import {
  gameState,
  setPlanetHealth,
  setPlanetType
} from "../main.js";


// =========================================
// PLANET MODE STATE
// =========================================

let planetElement = null;

let selectedTool = null;

let mysteryEffects = [];


// =========================================
// SETUP PLANET MODE
// =========================================

export function setupPlanetMode() {

  console.log("🪐 Planet Mode ready.");

  const toolButtons =
    document.querySelectorAll(
      "#planetModeScreen .toolButton"
    );


  // Tool selection

  toolButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        selectTool(
          button.dataset.tool
        );

      }
    );

  });


  // Create mystery effects

  setupMysteryEffects();


  // Start Planet Mode event

  document.addEventListener(
    "universeSmashPlanetModeStart",
    () => {

      startPlanetMode();

    }
  );

}


// =========================================
// START PLANET MODE
// =========================================

function startPlanetMode() {

  console.log(
    "🌍 Planet Mode started!"
  );

  selectedTool = null;

  gameState.selectedTool = null;

  setPlanetHealth(100);

  setPlanetType("EARTH-LIKE");

  createPlanet();

}


// =========================================
// CREATE PLANET
// =========================================

function createPlanet() {

  const canvas =
    document.getElementById(
      "planetCanvas"
    );

  if (!canvas) return;


  // Remove previous planet

  const oldPlanet =
    document.getElementById(
      "planetObject"
    );

  if (oldPlanet) {
    oldPlanet.remove();
  }


  // Create visual planet

  planetElement =
    document.createElement("div");

  planetElement.id =
    "planetObject";

  planetElement.style.width =
    "350px";

  planetElement.style.height =
    "350px";

  planetElement.style.borderRadius =
    "50%";

  planetElement.style.position =
    "absolute";

  planetElement.style.left =
    "50%";

  planetElement.style.top =
    "50%";

  planetElement.style.transform =
    "translate(-50%, -50%)";


  // Earth-like appearance

  planetElement.style.background = `
    radial-gradient(
      circle at 30% 25%,
      #80d8ff 0%,
      #2188d4 25%,
      #176b40 45%,
      #0b4c32 65%,
      #052617 100%
    )
  `;


  // Lighting

  planetElement.style.boxShadow = `
    inset -45px -35px 70px rgba(0,0,0,0.85),
    inset 20px 20px 40px rgba(255,255,255,0.15),
    0 0 70px rgba(80,160,255,0.25)
  `;


  // Rotation

  planetElement.style.animation =
    "planetRotate 20s linear infinite";


  canvas.appendChild(
    planetElement
  );


  // Planet click interaction

  planetElement.addEventListener(
    "click",
    () => {

      if (!selectedTool) {

        console.log(
          "Select a weapon first!"
        );

        return;

      }

      useTool(
        selectedTool
      );

    }
  );

}


// =========================================
// SELECT TOOL
// =========================================

function selectTool(tool) {

  selectedTool = tool;

  gameState.selectedTool = tool;

  console.log(
    `🔧 Selected tool: ${tool}`
  );


  // Highlight selected button

  document
    .querySelectorAll(
      "#planetModeScreen .toolButton"
    )
    .forEach((button) => {

      button.style.outline =
        "none";

    });


  const selectedButton =
    document.querySelector(
      `[data-tool="${tool}"]`
    );

  if (selectedButton) {

    selectedButton.style.outline =
      "2px solid #8db7ff";

  }

}


// =========================================
// USE TOOL
// =========================================

function useTool(tool) {

  if (!planetElement) return;


  switch (tool) {


    // -------------------------------------
    // LASER
    // -------------------------------------

    case "laser":

      damagePlanet(5);

      flashPlanet(
        "#ff2222"
      );

      showEffectText(
        "🔴 LASER IMPACT!"
      );

      break;


    // -------------------------------------
    // ICE LASER
    // -------------------------------------

    case "ice-laser":

      flashPlanet(
        "#8fefff"
      );

      planetElement.style.boxShadow = `
        inset -45px -35px 70px rgba(0,0,0,0.85),
        0 0 100px rgba(100,220,255,0.9)
      `;

      showEffectText(
        "❄️ PLANET FROZEN!"
      );

      break;


    // -------------------------------------
    // HEAT BEAM
    // -------------------------------------

    case "heat-beam":

      damagePlanet(8);

      flashPlanet(
        "#ff5500"
      );

      showEffectText(
        "🔥 HEAT BEAM IMPACT!"
      );

      break;


    // -------------------------------------
    // METEOR
    // -------------------------------------

    case "meteor":

      damagePlanet(15);

      shakePlanet();

      showEffectText(
        "☄️ METEOR STRIKE!"
      );

      break;


    // -------------------------------------
    // UFO
    // -------------------------------------

    case "ufo":

      damagePlanet(10);

      showEffectText(
        "👽 UFO ATTACK!"
      );

      break;


    // -------------------------------------
    // MYSTERY MATTER GUN
    // -------------------------------------

    case "mystery-matter":

      activateMysteryMatter();

      break;

  }

}


// =========================================
// DAMAGE PLANET
// =========================================

function damagePlanet(amount) {

  const newHealth =
    gameState.planet.health - amount;

  setPlanetHealth(
    newHealth
  );


  // Destroy planet at zero health

  if (
    gameState.planet.health <= 0
  ) {

    destroyPlanet();

  }

}


// =========================================
// DESTROY PLANET
// =========================================

function destroyPlanet() {

  if (!planetElement) return;

  showEffectText(
    "💥 PLANET DESTROYED!"
  );

  planetElement.style.transition =
    "all 1.5s ease";

  planetElement.style.transform =
    "translate(-50%, -50%) scale(2)";

  planetElement.style.opacity =
    "0";


  setTimeout(() => {

    if (planetElement) {

      planetElement.remove();

    }

  }, 1500);

}


// =========================================
// PLANET FLASH
// =========================================

function flashPlanet(color) {

  if (!planetElement) return;

  const oldShadow =
    planetElement.style.boxShadow;

  planetElement.style.boxShadow = `
    0 0 120px ${color},
    inset -40px -30px 60px rgba(0,0,0,0.7)
  `;


  setTimeout(() => {

    if (planetElement) {

      planetElement.style.boxShadow =
        oldShadow;

    }

  }, 500);

}


// =========================================
// SHAKE PLANET
// =========================================

function shakePlanet() {

  if (!planetElement) return;

  planetElement.animate(
    [

      {
        transform:
          "translate(-50%, -50%) translateX(-15px)"
      },

      {
        transform:
          "translate(-50%, -50%) translateX(15px)"
      },

      {
        transform:
          "translate(-50%, -50%) translateX(-10px)"
      },

      {
        transform:
          "translate(-50%, -50%)"
      }

    ],
    {
      duration: 500
    }
  );

}


// =========================================
// MYSTERY MATTER EFFECTS
// =========================================

function setupMysteryEffects() {

  mysteryEffects = [

    {

      name:
        "❄️ FLASH FREEZE",

      rarity:
        "COMMON",

      run() {

        flashPlanet(
          "#9deaff"
        );

        showEffectText(
          "❄️ MYSTERY EFFECT: FLASH FREEZE!"
        );

      }

    },


    {

      name:
        "🌋 MOLTEN SURGE",

      rarity:
        "COMMON",

      run() {

        damagePlanet(10);

        flashPlanet(
          "#ff4400"
        );

        showEffectText(
          "🌋 MYSTERY EFFECT: MOLTEN SURGE!"
        );

      }

    },


    {

      name:
        "🪐 PLANET GROWTH",

      rarity:
        "UNCOMMON",

      run() {

        planetElement.animate(
          [
            {
              transform:
                "translate(-50%, -50%) scale(1)"
            },

            {
              transform:
                "translate(-50%, -50%) scale(1.4)"
            }
          ],
          {
            duration: 1000,
            fill: "forwards"
          }
        );

        showEffectText(
          "🪐 MYSTERY EFFECT: PLANET GROWTH!"
        );

      }

    },


    {

      name:
        "🔬 PLANET SHRINK",

      rarity:
        "UNCOMMON",

      run() {

        planetElement.animate(
          [
            {
              transform:
                "translate(-50%, -50%) scale(1)"
            },

            {
              transform:
                "translate(-50%, -50%) scale(0.55)"
            }
          ],
          {
            duration: 1000,
            fill: "forwards"
          }
        );

        showEffectText(
          "🔬 MYSTERY EFFECT: PLANET SHRINK!"
        );

      }

    },


    {

      name:
        "🛡️ ENERGY SHIELD",

      rarity:
        "RARE",

      run() {

        planetElement.style.outline =
          "10px solid rgba(100,180,255,0.5)";

        planetElement.style.boxShadow =
          "0 0 150px #4c9dff";

        showEffectText(
          "🛡️ MYSTERY EFFECT: ENERGY SHIELD!"
        );

      }

    },


    {

      name:
        "💥 ENERGY COLLAPSE",

      rarity:
        "LEGENDARY",

      run() {

        damagePlanet(50);

        flashPlanet(
          "#c45cff"
        );

        shakePlanet();

        showEffectText(
          "💥 LEGENDARY EFFECT: ENERGY COLLAPSE!"
        );

      }

    }

  ];

}


// =========================================
// ACTIVATE MYSTERY MATTER
// =========================================

function activateMysteryMatter() {

  if (!planetElement) return;

  showEffectText(
    "🔮 ANALYZING MYSTERY MATTER..."
  );


  setTimeout(() => {

    const randomEffect =
      mysteryEffects[
        Math.floor(
          Math.random() *
          mysteryEffects.length
        )
      ];

    console.log(
      "Mystery Matter:",
      randomEffect.name
    );


    randomEffect.run();


    const mysteryText =
      document.getElementById(
        "mysteryEffectText"
      );

    if (mysteryText) {

      mysteryText.textContent =
        randomEffect.name;

    }

  }, 800);

}


// =========================================
// SHOW EFFECT TEXT
// =========================================

function showEffectText(text) {

  const mysteryText =
    document.getElementById(
      "mysteryEffectText"
    );

  if (mysteryText) {

    mysteryText.textContent =
      text;

  }

  console.log(text);

}
