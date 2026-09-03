// =========================================
// UNIVERSE SMASH
// PHYSICS ENGINE
// =========================================


// -----------------------------------------
// CONFIGURATION
// -----------------------------------------

export const PHYSICS = {

  // Simplified fictional gravity constant
  gravity: 0.08,

  // Prevent extremely close objects
  // from creating huge forces
  minimumDistance: 25,

  // Maximum speed for normal objects
  maxSpeed: 25,

  // Collision response
  bounce: 0.35

};


// -----------------------------------------
// APPLY GRAVITY
// -----------------------------------------

export function applyGravity(
  objectA,
  objectB,
  deltaTime = 1
) {

  if (
    !objectA ||
    !objectB ||
    objectA.destroyed ||
    objectB.destroyed
  ) {
    return;
  }


  const dx =
    objectB.position.x -
    objectA.position.x;

  const dy =
    objectB.position.y -
    objectA.position.y;


  const distanceSquared =
    dx * dx +
    dy * dy;


  const safeDistance =
    Math.max(
      Math.sqrt(distanceSquared),
      PHYSICS.minimumDistance
    );


  const directionX =
    dx / safeDistance;

  const directionY =
    dy / safeDistance;


  // Simplified gravity calculation

  const force =
    (
      PHYSICS.gravity *
      objectA.mass *
      objectB.mass
    ) /
    (
      safeDistance *
      safeDistance
    );


  const accelerationA =
    force /
    Math.max(objectA.mass, 1);

  const accelerationB =
    force /
    Math.max(objectB.mass, 1);


  // Make sure velocity objects exist

  if (!objectA.velocity) {

    objectA.velocity = {
      x: 0,
      y: 0
    };

  }


  if (!objectB.velocity) {

    objectB.velocity = {
      x: 0,
      y: 0
    };

  }


  // Pull objects toward each other

  if (!objectA.fixed) {

    objectA.velocity.x +=
      directionX *
      accelerationA *
      deltaTime;

    objectA.velocity.y +=
      directionY *
      accelerationA *
      deltaTime;

  }


  if (!objectB.fixed) {

    objectB.velocity.x -=
      directionX *
      accelerationB *
      deltaTime;

    objectB.velocity.y -=
      directionY *
      accelerationB *
      deltaTime;

  }

}


// -----------------------------------------
// LIMIT SPEED
// -----------------------------------------

export function limitSpeed(
  object
) {

  if (
    !object ||
    !object.velocity
  ) {
    return;
  }


  const speed =
    Math.sqrt(

      object.velocity.x *
      object.velocity.x +

      object.velocity.y *
      object.velocity.y

    );


  if (
    speed >
    PHYSICS.maxSpeed
  ) {

    const multiplier =
      PHYSICS.maxSpeed /
      speed;


    object.velocity.x *=
      multiplier;

    object.velocity.y *=
      multiplier;

  }

}


// -----------------------------------------
// UPDATE POSITION
// -----------------------------------------

export function updatePosition(
  object,
  deltaTime = 1
) {

  if (
    !object ||
    object.destroyed ||
    object.fixed
  ) {
    return;
  }


  if (!object.velocity) return;


  object.position.x +=
    object.velocity.x *
    deltaTime;

  object.position.y +=
    object.velocity.y *
    deltaTime;


  limitSpeed(object);

}


// -----------------------------------------
// CHECK COLLISION
// -----------------------------------------

export function checkCollision(
  objectA,
  objectB
) {

  if (
    !objectA ||
    !objectB ||
    objectA.destroyed ||
    objectB.destroyed
  ) {
    return false;
  }


  const dx =
    objectB.position.x -
    objectA.position.x;

  const dy =
    objectB.position.y -
    objectA.position.y;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  const minimumDistance =
    (objectA.radius ?? 10) +
    (objectB.radius ?? 10);


  return (
    distance <=
    minimumDistance
  );

}


// -----------------------------------------
// COLLISION RESPONSE
// -----------------------------------------

export function resolveCollision(
  objectA,
  objectB
) {

  if (
    !checkCollision(
      objectA,
      objectB
    )
  ) {
    return false;
  }


  if (
    objectA.fixed &&
    objectB.fixed
  ) {
    return true;
  }


  // Swap a portion of velocity
  // for a simple arcade-style bounce

  const tempX =
    objectA.velocity.x;

  const tempY =
    objectA.velocity.y;


  if (!objectA.fixed) {

    objectA.velocity.x =
      objectB.velocity.x *
      PHYSICS.bounce;

    objectA.velocity.y =
      objectB.velocity.y *
      PHYSICS.bounce;

  }


  if (!objectB.fixed) {

    objectB.velocity.x =
      tempX *
      PHYSICS.bounce;

    objectB.velocity.y =
      tempY *
      PHYSICS.bounce;

  }


  return true;

}


// -----------------------------------------
// UPDATE ALL GRAVITY
// -----------------------------------------

export function updateGravity(
  objects,
  deltaTime = 1
) {

  for (
    let i = 0;
    i < objects.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < objects.length;
      j++
    ) {

      applyGravity(
        objects[i],
        objects[j],
        deltaTime
      );

    }

  }

}


// -----------------------------------------
// UPDATE PHYSICS WORLD
// -----------------------------------------

export function updatePhysics(
  objects,
  deltaTime = 1
) {

  if (!objects) return;


  // Apply gravity first

  updateGravity(
    objects,
    deltaTime
  );


  // Update movement

  objects.forEach(
    object => {

      updatePosition(
        object,
        deltaTime
      );

    }
  );


  // Check collisions

  for (
    let i = 0;
    i < objects.length;
    i++
  ) {

    for (
      let j = i + 1;
      j < objects.length;
      j++
    ) {

      resolveCollision(
        objects[i],
        objects[j]
      );

    }

  }

}
