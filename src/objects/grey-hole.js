// =========================================
// UNIVERSE SMASH
// GREY HOLE / Q-STAR OBJECT SYSTEM
// =========================================


// =========================================
// CREATE GREY HOLE
// =========================================

export function createGreyHole(
  x = 500,
  y = 300,
  options = {}
) {

  const size =
    options.size ?? 90;

  return {

    id:
      `grey-hole-${Date.now()}-${Math.random()}`,

    type:
      "grey-hole",

    position: {
      x,
      y
    },

    velocity: {
      x: options.velocityX ?? 0,
      y: options.velocityY ?? 0
    },


    // Extremely massive object

    mass:
      options.mass ?? 12000,

    radius:
      size / 2,


    // Visual data

    size,

    color:
      "#555555",

    glow:
      "#7a1111",

    escapedLight:
      "#a83232",


    // Special properties

    isGreyHole: true,

    absorbedObjects: 0,

    impacts: 0,

    destroyed: false

  };

}


// =========================================
// DISTANCE
// =========================================

export function getGreyHoleDistance(
  greyHole,
  object
) {

  const dx =
    object.position.x -
    greyHole.position.x;

  const dy =
    object.position.y -
    greyHole.position.y;

  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}


// =========================================
// GRAVITY PULL
// =========================================

export function pullTowardGreyHole(
  greyHole,
  object,
  strength = 0.04
) {

  if (
    !greyHole ||
    !object ||
    object.destroyed
  ) return;


  const dx =
    greyHole.position.x -
    object.position.x;

  const dy =
    greyHole.position.y -
    object.position.y;


  const distance =
    Math.max(
      Math.sqrt(
        dx * dx +
        dy * dy
      ),
      1
    );


  const directionX =
    dx / distance;

  const directionY =
    dy / distance;


  const force =
    (
      greyHole.mass /
      (distance * distance)
    ) * strength;


  if (!object.velocity) {

    object.velocity = {
      x: 0,
      y: 0
    };

  }


  object.velocity.x +=
    directionX * force;

  object.velocity.y +=
    directionY * force;

}


// =========================================
// SURFACE IMPACT
// =========================================

export function impactGreyHole(
  greyHole,
  object
) {

  if (
    !greyHole ||
    !object ||
    object.destroyed
  ) {
    return false;
  }


  const distance =
    getGreyHoleDistance(
      greyHole,
      object
    );


  // The object reaches the physical surface

  if (
    distance <=
    greyHole.radius +
    (object.radius ?? 0)
  ) {

    object.destroyed = true;

    greyHole.impacts++;

    greyHole.absorbedObjects++;


    // Gain some mass

    greyHole.mass +=
      (object.mass ?? 1) * 0.8;


    // Slowly grow

    greyHole.size +=
      Math.max(
        0.5,
        (object.size ?? 10) * 0.04
      );

    greyHole.radius =
      greyHole.size / 2;


    console.log(
      `🩶 ${object.type} impacted the Grey Hole surface!`
    );


    return true;

  }


  return false;

}


// =========================================
// UPDATE GREY HOLE
// =========================================

export function updateGreyHole(
  greyHole,
  objects,
  deltaTime = 1
) {

  if (
    !greyHole ||
    greyHole.destroyed
  ) {
    return;
  }


  // Move Grey Hole

  greyHole.position.x +=
    greyHole.velocity.x *
    deltaTime;

  greyHole.position.y +=
    greyHole.velocity.y *
    deltaTime;


  objects.forEach(
    object => {

      if (
        object === greyHole ||
        object.destroyed
      ) {
        return;
      }


      // Pull object inward

      pullTowardGreyHole(
        greyHole,
        object
      );


      // Check physical surface impact

      impactGreyHole(
        greyHole,
        object
      );

    }
  );

}


// =========================================
// LAUNCH GREY HOLE
// =========================================

export function launchGreyHole(
  greyHole,
  velocityX,
  velocityY
) {

  if (!greyHole) return;

  greyHole.velocity.x =
    velocityX;

  greyHole.velocity.y =
    velocityY;

}


// =========================================
// GET INFO
// =========================================

export function getGreyHoleInfo(
  greyHole
) {

  if (!greyHole) return null;

  return {

    mass:
      greyHole.mass,

    size:
      greyHole.size,

    impacts:
      greyHole.impacts,

    absorbedObjects:
      greyHole.absorbedObjects,

    escapedLight:
      greyHole.escapedLight

  };

}
