// =========================================
// UNIVERSE SMASH
// ANTIMATTER PLANET OBJECT SYSTEM
// =========================================


// =========================================
// CREATE ANTIMATTER PLANET
// =========================================

export function createAntimatterPlanet(
  x = 500,
  y = 300,
  options = {}
) {

  const size =
    options.size ?? 65;

  return {

    id:
      `antimatter-planet-${Date.now()}-${Math.random()}`,

    type:
      "antimatter-planet",

    position: {
      x,
      y
    },

    velocity: {
      x: options.velocityX ?? 0,
      y: options.velocityY ?? 0
    },


    // Physics

    mass:
      options.mass ?? 70,

    radius:
      size / 2,


    // Visual information

    size,

    color:
      "#b52cff",

    glow:
      "#e45cff",

    coreColor:
      "#ffd0ff",


    // Special game properties

    isAntimatter: true,

    stability: 100,

    destroyed: false

  };

}


// =========================================
// DISTANCE
// =========================================

export function getAntimatterDistance(
  antimatter,
  object
) {

  const dx =
    object.position.x -
    antimatter.position.x;

  const dy =
    object.position.y -
    antimatter.position.y;

  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}


// =========================================
// CHECK COLLISION
// =========================================

export function antimatterCollision(
  antimatter,
  object
) {

  if (
    !antimatter ||
    !object ||
    antimatter.destroyed ||
    object.destroyed
  ) {
    return null;
  }


  // Antimatter interacting with another
  // antimatter object does nothing special

  if (object.isAntimatter) {

    return null;

  }


  const distance =
    getAntimatterDistance(
      antimatter,
      object
    );


  const collisionDistance =
    antimatter.radius +
    (object.radius ?? 10);


  if (
    distance <= collisionDistance
  ) {

    return triggerAntimatterReaction(
      antimatter,
      object
    );

  }


  return null;

}


// =========================================
// FICTIONAL ANTIMATTER REACTION
// =========================================

export function triggerAntimatterReaction(
  antimatter,
  object
) {

  antimatter.destroyed = true;

  object.destroyed = true;


  // Calculate fictional game energy

  const totalMass =
    (antimatter.mass ?? 1) +
    (object.mass ?? 1);


  const energy =
    totalMass * 100;


  console.log(
    "🟣⚡ ANTIMATTER REACTION!"
  );


  return {

    type:
      "antimatter-reaction",

    position: {
      x: antimatter.position.x,
      y: antimatter.position.y
    },

    energy,

    size:
      Math.min(
        500,
        80 + totalMass * 2
      ),

    color:
      "#d84cff",

    glow:
      "#ffffff"

  };

}


// =========================================
// UPDATE ANTIMATTER PLANET
// =========================================

export function updateAntimatterPlanet(
  antimatter,
  objects,
  deltaTime = 1
) {

  if (
    !antimatter ||
    antimatter.destroyed
  ) {
    return null;
  }


  // Move

  antimatter.position.x +=
    antimatter.velocity.x *
    deltaTime;

  antimatter.position.y +=
    antimatter.velocity.y *
    deltaTime;


  // Check every object

  for (const object of objects) {

    if (
      object === antimatter ||
      object.destroyed
    ) {
      continue;
    }


    const reaction =
      antimatterCollision(
        antimatter,
        object
      );


    if (reaction) {

      return reaction;

    }

  }


  return null;

}


// =========================================
// LAUNCH ANTIMATTER PLANET
// =========================================

export function launchAntimatterPlanet(
  antimatter,
  velocityX,
  velocityY
) {

  if (!antimatter) return;

  antimatter.velocity.x =
    velocityX;

  antimatter.velocity.y =
    velocityY;

}


// =========================================
// GET INFO
// =========================================

export function getAntimatterInfo(
  antimatter
) {

  if (!antimatter) return null;

  return {

    mass:
      antimatter.mass,

    size:
      antimatter.size,

    stability:
      antimatter.stability,

    position:
      antimatter.position

  };

}
