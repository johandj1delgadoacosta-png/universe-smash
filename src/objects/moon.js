// =========================================
// UNIVERSE SMASH
// MOON OBJECT SYSTEM
// =========================================


// =========================================
// MOON TYPES
// =========================================

export const MOON_TYPES = {

  rocky: {
    name: "Rocky Moon",
    size: 30,
    mass: 10,
    color: "#999999",
    glow: "#cccccc"
  },

  ice: {
    name: "Ice Moon",
    size: 32,
    mass: 9,
    color: "#bfefff",
    glow: "#d9f8ff"
  },

  volcanic: {
    name: "Volcanic Moon",
    size: 35,
    mass: 15,
    color: "#8a3b22",
    glow: "#ff5522"
  },

  giant: {
    name: "Giant Moon",
    size: 70,
    mass: 80,
    color: "#777777",
    glow: "#aaaaaa"
  }

};


// =========================================
// CREATE MOON
// =========================================

export function createMoon(
  type = "rocky",
  x = 500,
  y = 300,
  options = {}
) {

  const moonType =
    MOON_TYPES[type] ||
    MOON_TYPES.rocky;


  return {

    id:
      `moon-${Date.now()}-${Math.random()}`,

    type:
      "moon",

    moonType:
      type,


    // Position

    position: {
      x,
      y
    },


    // Velocity

    velocity: {

      x:
        options.velocityX ?? 0,

      y:
        options.velocityY ?? 0

    },


    // Physics

    mass:
      options.mass ??
      moonType.mass,

    radius:
      moonType.size / 2,


    // Appearance

    size:
      moonType.size,

    color:
      moonType.color,

    glow:
      moonType.glow,


    // Rotation

    rotation:
      Math.random() * 360,

    rotationSpeed:
      options.rotationSpeed ??
      0.5,


    // Optional parent planet

    parentPlanet:
      options.parentPlanet ?? null,


    destroyed:
      false

  };

}


// =========================================
// UPDATE MOON
// =========================================

export function updateMoon(
  moon,
  deltaTime = 1
) {

  if (
    !moon ||
    moon.destroyed
  ) {
    return;
  }


  // Movement

  moon.position.x +=
    moon.velocity.x *
    deltaTime;

  moon.position.y +=
    moon.velocity.y *
    deltaTime;


  // Rotation

  moon.rotation +=
    moon.rotationSpeed *
    deltaTime;

}


// =========================================
// LAUNCH MOON
// =========================================

export function launchMoon(
  moon,
  velocityX,
  velocityY
) {

  if (!moon) return;

  moon.velocity.x =
    velocityX;

  moon.velocity.y =
    velocityY;

}


// =========================================
// SET PARENT PLANET
// =========================================

export function setMoonParent(
  moon,
  planet
) {

  if (
    !moon ||
    !planet
  ) {
    return false;
  }


  moon.parentPlanet =
    planet.id;


  return true;

}


// =========================================
// DESTROY MOON
// =========================================

export function destroyMoon(
  moon
) {

  if (!moon) return;

  moon.destroyed = true;

}


// =========================================
// GET MOON TYPES
// =========================================

export function getMoonTypes() {

  return Object.keys(
    MOON_TYPES
  );

}
