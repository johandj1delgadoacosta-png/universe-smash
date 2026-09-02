// =========================================
// UNIVERSE SMASH
// BLACK HOLE OBJECT SYSTEM
// =========================================


// =========================================
// CREATE BLACK HOLE
// =========================================

export function createBlackHole(

  x = 500,

  y = 300,

  options = {}

) {

  const size =
    options.size ?? 90;

  const mass =
    options.mass ?? 15000;


  return {

    id:
      `black-hole-${Date.now()}-${Math.random()}`,

    type:
      "black-hole",


    // Position

    position: {

      x: x,

      y: y

    },


    // Black holes CAN move

    velocity: {

      x:
        options.velocityX ?? 0,

      y:
        options.velocityY ?? 0

    },


    // Physics

    mass: mass,

    radius:
      size / 2,


    // Visual data

    size: size,

    color:
      "#000000",

    glow:
      "#8a2dff",


    // Special mechanics

    isBlackHole:
      true,

    absorbedObjects:
      0,

    destroyed:
      false

  };

}


// =========================================
// CALCULATE DISTANCE
// =========================================

export function getDistance(
  blackHole,
  object
) {

  const dx =
    object.position.x -
    blackHole.position.x;

  const dy =
    object.position.y -
    blackHole.position.y;


  return Math.sqrt(

    dx * dx +

    dy * dy

  );

}


// =========================================
// PULL OBJECT
// =========================================

export function pullObject(
  blackHole,
  object,
  strength = 0.05
) {

  if (
    !blackHole ||
    !object ||
    object.destroyed
  ) {
    return;
  }


  const dx =
    blackHole.position.x -
    object.position.x;

  const dy =
    blackHole.position.y -
    object.position.y;


  const distance =
    Math.max(

      Math.sqrt(
        dx * dx +
        dy * dy
      ),

      1

    );


  // Direction toward black hole

  const directionX =
    dx / distance;

  const directionY =
    dy / distance;


  // Stronger gravity when closer

  const force =
    (blackHole.mass /
      (distance * distance)) *
    strength;


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
// ABSORB OBJECT
// =========================================

export function absorbObject(
  blackHole,
  object
) {

  if (
    !blackHole ||
    !object ||
    object.destroyed
  ) {
    return false;
  }


  const distance =
    getDistance(
      blackHole,
      object
    );


  // Absorption zone

  const absorbDistance =
    blackHole.radius;


  if (
    distance <= absorbDistance
  ) {

    object.destroyed = true;


    // Increase black hole mass

    blackHole.mass +=
      object.mass ?? 1;


    // Grow based on object size

    const objectSize =
      object.size ?? 10;


    blackHole.size +=
      Math.max(
        1,
        objectSize * 0.08
      );


    blackHole.radius =
      blackHole.size / 2;


    blackHole.absorbedObjects++;


    console.log(
      `🕳️ Black hole absorbed ${object.type}!`
    );


    return true;

  }


  return false;

}


// =========================================
// UPDATE BLACK HOLE
// =========================================

export function updateBlackHole(
  blackHole,
  objects,
  deltaTime = 1
) {

  if (
    !blackHole ||
    blackHole.destroyed
  ) {
    return;
  }


  // Move black hole

  blackHole.position.x +=
    blackHole.velocity.x *
    deltaTime;

  blackHole.position.y +=
    blackHole.velocity.y *
    deltaTime;


  // Pull and absorb objects

  objects.forEach(
    object => {

      if (
        object === blackHole ||
        object.destroyed
      ) {
        return;
      }


      pullObject(
        blackHole,
        object
      );


      absorbObject(
        blackHole,
        object
      );

    }
  );

}


// =========================================
// CHANGE BLACK HOLE VELOCITY
// =========================================

export function launchBlackHole(
  blackHole,
  velocityX,
  velocityY
) {

  if (!blackHole) return;

  blackHole.velocity.x =
    velocityX;

  blackHole.velocity.y =
    velocityY;

}


// =========================================
// GET BLACK HOLE INFO
// =========================================

export function getBlackHoleInfo(
  blackHole
) {

  return {

    mass:
      blackHole.mass,

    size:
      blackHole.size,

    absorbedObjects:
      blackHole.absorbedObjects

  };

}
