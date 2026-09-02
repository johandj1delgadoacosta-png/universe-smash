// =========================================
// UNIVERSE SMASH
// PLANET OBJECT SYSTEM
// =========================================


// =========================================
// PLANET TYPES
// =========================================

export const PLANET_TYPES = {

  earth: {
    name: "Earth-Like Planet",
    size: 60,
    mass: 60,
    color: "#25874e",
    glow: "#3b9fff",
    description:
      "A balanced rocky world with oceans and land."
  },


  desert: {
    name: "Desert Planet",
    size: 60,
    mass: 55,
    color: "#d99443",
    glow: "#c77732",
    description:
      "A dry rocky world covered in deserts."
  },


  ice: {
    name: "Ice Planet",
    size: 60,
    mass: 58,
    color: "#9deaff",
    glow: "#bff3ff",
    description:
      "A frozen world covered in ice."
  },


  lava: {
    name: "Lava Planet",
    size: 60,
    mass: 65,
    color: "#ff4b14",
    glow: "#ff6600",
    description:
      "A volcanic world with molten regions."
  },


  gasGiant: {
    name: "Gas Giant",
    size: 120,
    mass: 500,
    color: "#d99852",
    glow: "#e6b36b",
    description:
      "A massive planet made mostly of gas."
  },


  rocky: {
    name: "Rocky Planet",
    size: 55,
    mass: 70,
    color: "#806b5a",
    glow: "#99806b",
    description:
      "A dense rocky world."
  }

};


// =========================================
// CREATE PLANET
// =========================================

export function createPlanet(

  type = "earth",

  x = 500,

  y = 300

) {

  const planetType =
    PLANET_TYPES[type] ||
    PLANET_TYPES.earth;


  const planet = {

    id:
      `planet-${Date.now()}-${Math.random()}`,


    type:
      "planet",

    planetType:
      type,


    // Position

    position: {

      x: x,

      y: y

    },


    // Velocity

    velocity: {

      x: 0,

      y: 0

    },


    // Physics

    mass:
      planetType.mass,

    radius:
      planetType.size / 2,


    // Visual data

    size:
      planetType.size,

    color:
      planetType.color,

    glow:
      planetType.glow,


    description:
      planetType.description,


    // Game state

    health:
      100,

    frozen:
      false,

    burning:
      false,

    shielded:
      false,

    destroyed:
      false

  };


  return planet;

}


// =========================================
// DAMAGE PLANET
// =========================================

export function damagePlanet(
  planet,
  amount
) {

  if (!planet) return;

  if (planet.shielded) {

    amount *= 0.25;

  }


  planet.health -= amount;

  if (planet.health <= 0) {

    planet.health = 0;

    planet.destroyed = true;

  }


  return planet.health;

}


// =========================================
// FREEZE PLANET
// =========================================

export function freezePlanet(
  planet
) {

  if (!planet) return;

  planet.frozen = true;

  planet.burning = false;

  planet.color = "#9deaff";

  planet.glow = "#bff3ff";

}


// =========================================
// HEAT PLANET
// =========================================

export function heatPlanet(
  planet
) {

  if (!planet) return;

  planet.burning = true;

  planet.frozen = false;

  planet.color = "#ff4b14";

  planet.glow = "#ff6600";

}


// =========================================
// PLANET SHIELD
// =========================================

export function shieldPlanet(
  planet,
  enabled = true
) {

  if (!planet) return;

  planet.shielded = enabled;

}


// =========================================
// REPAIR PLANET
// =========================================

export function repairPlanet(
  planet
) {

  if (!planet) return;

  planet.health = 100;

  planet.destroyed = false;

}


// =========================================
// GET PLANET TYPES
// =========================================

export function getPlanetTypes() {

  return Object.keys(
    PLANET_TYPES
  );

}
