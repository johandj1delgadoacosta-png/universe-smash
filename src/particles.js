// =========================================
// UNIVERSE SMASH
// PARTICLE EFFECTS SYSTEM
// =========================================

// This system works with Three.js once the
// renderer and scenes are connected.

// =========================================
// PARTICLE STORAGE
// =========================================

const activeParticles = [];


// =========================================
// CREATE PARTICLE BURST
// =========================================

export function createParticleBurst(
  THREE,
  scene,
  position,
  options = {}
) {

  const count = options.count ?? 80;
  const size = options.size ?? 0.12;
  const speed = options.speed ?? 4;
  const lifetime = options.lifetime ?? 2;
  const color = options.color ?? 0xffffff;

  const geometry =
    new THREE.BufferGeometry();

  const positions = [];
  const velocities = [];

  for (let i = 0; i < count; i++) {

    positions.push(
      position.x,
      position.y,
      position.z
    );

    const direction =
      new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

    velocities.push({
      x: direction.x * speed * Math.random(),
      y: direction.y * speed * Math.random(),
      z: direction.z * speed * Math.random()
    });

  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      positions,
      3
    )
  );

  const material =
    new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity: 1,
      depthWrite: false
    });

  const particles =
    new THREE.Points(
      geometry,
      material
    );

  scene.add(particles);

  activeParticles.push({
    particles,
    velocities,
    lifetime,
    age: 0
  });

  return particles;

}


// =========================================
// IMPACT EXPLOSION
// =========================================

export function createImpactEffect(
  THREE,
  scene,
  position
) {

  return createParticleBurst(
    THREE,
    scene,
    position,
    {
      count: 100,
      size: 0.15,
      speed: 5,
      lifetime: 1.5,
      color: 0xffaa33
    }
  );

}


// =========================================
// PLANET EXPLOSION
// =========================================

export function createPlanetExplosion(
  THREE,
  scene,
  position
) {

  return createParticleBurst(
    THREE,
    scene,
    position,
    {
      count: 350,
      size: 0.25,
      speed: 8,
      lifetime: 4,
      color: 0xff6633
    }
  );

}


// =========================================
// SUPERNOVA
// =========================================

export function createSupernovaEffect(
  THREE,
  scene,
  position
) {

  return createParticleBurst(
    THREE,
    scene,
    position,
    {
      count: 700,
      size: 0.3,
      speed: 15,
      lifetime: 6,
      color: 0xffe0a0
    }
  );

}


// =========================================
// ICE EFFECT
// =========================================

export function createIceEffect(
  THREE,
  scene,
  position
) {

  return createParticleBurst(
    THREE,
    scene,
    position,
    {
      count: 100,
      size: 0.12,
      speed: 2,
      lifetime: 3,
      color: 0x9deaff
    }
  );

}


// =========================================
// LAVA EFFECT
// =========================================

export function createLavaEffect(
  THREE,
  scene,
  position
) {

  return createParticleBurst(
    THREE,
    scene,
    position,
    {
      count: 150,
      size: 0.18,
      speed: 4,
      lifetime: 3,
      color: 0xff3b0a
    }
  );

}


// =========================================
// ANTIMATTER EFFECT
// =========================================

export function createAntimatterEffect(
  THREE,
  scene,
  position
) {

  return createParticleBurst(
    THREE,
    scene,
    position,
    {
      count: 400,
      size: 0.22,
      speed: 10,
      lifetime: 5,
      color: 0xc45cff
    }
  );

}


// =========================================
// UPDATE PARTICLES
// =========================================

export function updateParticles(
  deltaTime
) {

  for (
    let i = activeParticles.length - 1;
    i >= 0;
    i--
  ) {

    const effect =
      activeParticles[i];

    effect.age += deltaTime;

    const positions =
      effect.particles.geometry.attributes.position;

    for (
      let p = 0;
      p < effect.velocities.length;
      p++
    ) {

      const velocity =
        effect.velocities[p];

      positions.array[p * 3] +=
        velocity.x * deltaTime;

      positions.array[p * 3 + 1] +=
        velocity.y * deltaTime;

      positions.array[p * 3 + 2] +=
        velocity.z * deltaTime;

      // Small gravity effect

      velocity.y -=
        0.5 * deltaTime;

    }

    positions.needsUpdate = true;

    // Fade out

    const remaining =
      1 -
      effect.age / effect.lifetime;

    effect.particles.material.opacity =
      Math.max(0, remaining);

    // Remove finished particles

    if (
      effect.age >=
      effect.lifetime
    ) {

      const parent =
        effect.particles.parent;

      if (parent) {
        parent.remove(
          effect.particles
        );
      }

      effect.particles.geometry.dispose();
      effect.particles.material.dispose();

      activeParticles.splice(
        i,
        1
      );

    }

  }

}


// =========================================
// CLEAR ALL PARTICLES
// =========================================

export function clearParticles() {

  activeParticles.forEach(
    (effect) => {

      const parent =
        effect.particles.parent;

      if (parent) {
        parent.remove(
          effect.particles
        );
      }

      effect.particles.geometry.dispose();
      effect.particles.material.dispose();

    }
  );

  activeParticles.length = 0;

}
