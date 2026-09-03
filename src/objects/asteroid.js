// =========================================
// UNIVERSE SMASH
// ASTEROID OBJECT SYSTEM
// =========================================


// =========================================
// ASTEROID TYPES
// =========================================

export const ASTEROID_TYPES = {

  small: {
    name: "Small Asteroid",
    size: 18,
    mass: 5,
    color: "#756052"
  },

  medium: {
    name: "Medium Asteroid",
    size: 35,
    mass: 20,
    color: "#806b5a"
  },

  large: {
    name: "Large Asteroid",
    size: 70,
    mass: 80,
    color: "#69513f"
  },

  giant: {
    name: "Giant Asteroid",
    size: 130,
    mass: 300,
    color: "#4d3a30"
  }

};


// =========================================
// CREATE ASTEROID
// =========================================

export function createAsteroid(
  type = "medium",
  x = 500,
  y = 300,
  options = {}
) {

  const asteroidType =
    ASTEROID_TYPES[type] ||
    ASTEROID_TYPES.medium;


  const asteroid = {

    id:
      `asteroid-${Date.now()}-${Math.random()}`,

    type:
      "asteroid",

    asteroidType:
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
      asteroidType.mass,

    radius:
      asteroidType.size / 2,


    // Appearance

    size:
      asteroidType.size,

    color:
      asteroidType.color,

    glow:
      "#55443a",


    // Rotation

    rotation:
      Math.random() * 360,

    rotationSpeed:
      options.rotationSpeed ??
      (Math.random() * 4 - 2),


    destroyed:
      false

  };


  return asteroid;

}


// =========================================
// UPDATE ASTEROID
// =========================================

export function updateAsteroid(
  asteroid,
  deltaTime = 1
) {

  if (
    !asteroid ||
    asteroid.destroyed
  ) {
    return;
  }


  // Move asteroid

  asteroid.position.x +=
    asteroid.velocity.x *
    deltaTime;

  asteroid.position.y +=
    asteroid.velocity.y *
    deltaTime;


  // Rotate asteroid

  asteroid.rotation +=
    asteroid.rotationSpeed *
    deltaTime;

}


// =========================================
// LAUNCH ASTEROID
// =========================================

export function launchAsteroid(
  asteroid,
  velocityX,
  velocityY
) {

  if (!asteroid) return;

  asteroid.velocity.x =
    velocityX;

  asteroid.velocity.y =
    velocityY;

}


// =========================================
// ASTEROID COLLISION DAMAGE
// =========================================

export function getAsteroidImpactPower(
  asteroid
) {

  if (!asteroid) return 0;


  const speed =
    Math.sqrt(

      asteroid.velocity.x *
      asteroid.velocity.x +

      asteroid.velocity.y *
      asteroid.velocity.y

    );


  // Fictional game impact value

  return Math.round(

    asteroid.mass *
    Math.max(speed, 1)

  );

}


// =========================================
// DESTROY ASTEROID
// =========================================

export function destroyAsteroid(
  asteroid
) {

  if (!asteroid) return;

  asteroid.destroyed = true;

}


// =========================================
// GET ASTEROID TYPES
// =========================================

export function getAsteroidTypes() {

  return Object.keys(
    ASTEROID_TYPES
  );

}
