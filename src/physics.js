// =========================================
// UNIVERSE SMASH
// PHYSICS ENGINE
// =========================================

// Simplified game physics.
// Values are intentionally scaled for a fun,
// visible space simulation rather than real-world units.

export const PHYSICS = {
  gravityConstant: 0.04,
  minimumDistance: 0.5,
  collisionMultiplier: 0.9
};


// =========================================
// CREATE PHYSICS DATA
// =========================================

export function createPhysicsBody(options = {}) {
  return {
    mass: options.mass ?? 1,

    position: {
      x: options.x ?? 0,
      y: options.y ?? 0,
      z: options.z ?? 0
    },

    velocity: {
      x: options.vx ?? 0,
      y: options.vy ?? 0,
      z: options.vz ?? 0
    },

    radius: options.radius ?? 1,

    fixed: options.fixed ?? false,

    destroyed: false
  };
}


// =========================================
// DISTANCE BETWEEN TWO OBJECTS
// =========================================

export function getDistance(a, b) {
  const dx = b.position.x - a.position.x;
  const dy = b.position.y - a.position.y;
  const dz = b.position.z - a.position.z;

  return Math.sqrt(
    dx * dx +
    dy * dy +
    dz * dz
  );
}


// =========================================
// GRAVITY
// =========================================

export function applyGravity(a, b, deltaTime = 1) {

  if (a.destroyed || b.destroyed) return;

  const dx = b.position.x - a.position.x;
  const dy = b.position.y - a.position.y;
  const dz = b.position.z - a.position.z;

  let distanceSquared =
    dx * dx + dy * dy + dz * dz;

  distanceSquared = Math.max(
    distanceSquared,
    PHYSICS.minimumDistance
  );

  const distance = Math.sqrt(distanceSquared);

  const force =
    (PHYSICS.gravityConstant *
      a.mass *
      b.mass) /
    distanceSquared;

  const nx = dx / distance;
  const ny = dy / distance;
  const nz = dz / distance;


  // Accelerate object A toward B

  if (!a.fixed) {

    const accelerationA =
      force / Math.max(a.mass, 0.01);

    a.velocity.x +=
      nx * accelerationA * deltaTime;

    a.velocity.y +=
      ny * accelerationA * deltaTime;

    a.velocity.z +=
      nz * accelerationA * deltaTime;
  }


  // Accelerate object B toward A

  if (!b.fixed) {

    const accelerationB =
      force / Math.max(b.mass, 0.01);

    b.velocity.x -=
      nx * accelerationB * deltaTime;

    b.velocity.y -=
      ny * accelerationB * deltaTime;

    b.velocity.z -=
      nz * accelerationB * deltaTime;
  }

}


// =========================================
// APPLY GRAVITY TO ALL OBJECTS
// =========================================

export function applyAllGravity(
  objects,
  deltaTime = 1
) {

  for (let i = 0; i < objects.length; i++) {

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


// =========================================
// UPDATE POSITION
// =========================================

export function updatePosition(
  body,
  deltaTime = 1
) {

  if (body.fixed || body.destroyed) return;

  body.position.x +=
    body.velocity.x * deltaTime;

  body.position.y +=
    body.velocity.y * deltaTime;

  body.position.z +=
    body.velocity.z * deltaTime;

}


// =========================================
// UPDATE ALL OBJECTS
// =========================================

export function updatePhysics(
  objects,
  deltaTime = 1
) {

  // Apply gravity between everything

  applyAllGravity(
    objects,
    deltaTime
  );

  // Move everything

  objects.forEach((object) => {

    updatePosition(
      object,
      deltaTime
    );

  });

}


// =========================================
// COLLISION DETECTION
// =========================================

export function areColliding(a, b) {

  if (a.destroyed || b.destroyed) {
    return false;
  }

  const distance =
    getDistance(a, b);

  const collisionDistance =
    (a.radius + b.radius) *
    PHYSICS.collisionMultiplier;

  return distance <= collisionDistance;

}


// =========================================
// FIND COLLISIONS
// =========================================

export function findCollisions(objects) {

  const collisions = [];

  for (let i = 0; i < objects.length; i++) {

    for (
      let j = i + 1;
      j < objects.length;
      j++
    ) {

      if (
        areColliding(
          objects[i],
          objects[j]
        )
      ) {

        collisions.push({
          a: objects[i],
          b: objects[j]
        });

      }

    }

  }

  return collisions;

}


// =========================================
// CREATE ORBIT VELOCITY
// =========================================

// Gives an object an approximate sideways velocity
// so it can orbit around a central body.

export function setOrbitVelocity(
  object,
  center,
  direction = 1
) {

  const dx =
    object.position.x -
    center.position.x;

  const dz =
    object.position.z -
    center.position.z;

  const distance = Math.sqrt(
    dx * dx + dz * dz
  );

  if (distance <= 0.01) return;

  // Simplified orbital speed

  const speed = Math.sqrt(
    (PHYSICS.gravityConstant *
      center.mass) /
    distance
  );

  // Perpendicular direction

  const nx = -dz / distance;
  const nz = dx / distance;

  object.velocity.x =
    nx * speed * direction;

  object.velocity.z =
    nz * speed * direction;

}


// =========================================
// BLACK HOLE ABSORPTION CHECK
// =========================================

export function canAbsorb(
  blackHole,
  object
) {

  if (
    blackHole.destroyed ||
    object.destroyed
  ) {
    return false;
  }

  const distance =
    getDistance(
      blackHole,
      object
    );

  const absorbDistance =
    blackHole.radius * 1.2;

  return distance < absorbDistance;

}


// =========================================
// ABSORB OBJECT
// =========================================

export function absorbObject(
  blackHole,
  object
) {

  if (
    !canAbsorb(
      blackHole,
      object
    )
  ) {
    return false;
  }

  object.destroyed = true;

  // Black hole grows based on absorbed mass

  blackHole.mass += object.mass;

  blackHole.radius +=
    Math.cbrt(
      Math.max(object.mass, 0.01)
    ) * 0.08;

  console.log(
    `🕳️ Black hole absorbed ${object.name || "object"}`
  );

  return true;

}
