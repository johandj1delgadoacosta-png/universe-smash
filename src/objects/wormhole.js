// =========================================
// UNIVERSE SMASH
// WORMHOLE OBJECT SYSTEM
// =========================================


// =========================================
// CREATE WORMHOLE
// =========================================

export function createWormhole(
  x = 500,
  y = 300,
  options = {}
) {

  const size =
    options.size ?? 85;

  return {

    id:
      `wormhole-${Date.now()}-${Math.random()}`,

    type:
      "wormhole",


    // Position

    position: {

      x: x,
      y: y

    },


    // Wormholes can move

    velocity: {

      x:
        options.velocityX ?? 0,

      y:
        options.velocityY ?? 0

    },


    // Physics

    mass:
      options.mass ?? 500,

    radius:
      size / 2,


    // Visual data

    size: size,

    color:
      "#46eaff",

    glow:
      "#8b4dff",


    // Special properties

    isWormhole:
      true,

    linkedWormhole:
      null,

    destroyed:
      false

  };

}


// =========================================
// LINK TWO WORMHOLES
// =========================================

export function linkWormholes(
  wormholeA,
  wormholeB
) {

  if (
    !wormholeA ||
    !wormholeB
  ) {
    return false;
  }


  wormholeA.linkedWormhole =
    wormholeB.id;

  wormholeB.linkedWormhole =
    wormholeA.id;


  console.log(
    "🌀 Wormholes linked!"
  );

  return true;

}


// =========================================
// GET LINKED WORMHOLE
// =========================================

export function getLinkedWormhole(
  wormhole,
  objects
) {

  if (
    !wormhole ||
    !wormhole.linkedWormhole
  ) {
    return null;
  }


  return objects.find(
    object =>
      object.id ===
      wormhole.linkedWormhole
  );

}


// =========================================
// DISTANCE
// =========================================

export function getWormholeDistance(
  wormhole,
  object
) {

  const dx =
    object.position.x -
    wormhole.position.x;

  const dy =
    object.position.y -
    wormhole.position.y;


  return Math.sqrt(
    dx * dx +
    dy * dy
  );

}


// =========================================
// TELEPORT OBJECT
// =========================================

export function teleportObject(
  wormhole,
  object,
  objects
) {

  if (
    !wormhole ||
    !object ||
    object.destroyed
  ) {
    return false;
  }


  const destination =
    getLinkedWormhole(
      wormhole,
      objects
    );


  if (!destination) {

    return false;

  }


  const distance =
    getWormholeDistance(
      wormhole,
      object
    );


  // Enter wormhole

  if (
    distance <=
    wormhole.radius
  ) {

    // Move object near destination

    object.position.x =
      destination.position.x +
      destination.radius +
      10;

    object.position.y =
      destination.position.y;


    // Prevent immediate teleport loop

    object.wormholeCooldown =
      1;


    console.log(
      `🌀 ${object.type} traveled through a wormhole!`
    );


    return true;

  }


  return false;

}


// =========================================
// UPDATE WORMHOLE
// =========================================

export function updateWormhole(
  wormhole,
  objects,
  deltaTime = 1
) {

  if (
    !wormhole ||
    wormhole.destroyed
  ) {
    return;
  }


  // Move wormhole

  wormhole.position.x +=
    wormhole.velocity.x *
    deltaTime;

  wormhole.position.y +=
    wormhole.velocity.y *
    deltaTime;


  objects.forEach(
    object => {

      if (
        object === wormhole ||
        object.destroyed
      ) {
        return;
      }


      // Update cooldown

      if (
        object.wormholeCooldown > 0
      ) {

        object.wormholeCooldown -=
          deltaTime;

        return;

      }


      teleportObject(
        wormhole,
        object,
        objects
      );

    }
  );

}


// =========================================
// LAUNCH WORMHOLE
// =========================================

export function launchWormhole(
  wormhole,
  velocityX,
  velocityY
) {

  if (!wormhole) return;

  wormhole.velocity.x =
    velocityX;

  wormhole.velocity.y =
    velocityY;

}


// =========================================
// UNLINK WORMHOLES
// =========================================

export function unlinkWormholes(
  wormholeA,
  wormholeB
) {

  if (wormholeA) {

    wormholeA.linkedWormhole =
      null;

  }


  if (wormholeB) {

    wormholeB.linkedWormhole =
      null;

  }


  console.log(
    "🌀 Wormholes unlinked."
  );

}
