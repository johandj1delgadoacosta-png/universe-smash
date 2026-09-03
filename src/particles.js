// =========================================
// UNIVERSE SMASH
// PARTICLE SYSTEM
// =========================================

const particles = [];


// -----------------------------------------
// CREATE PARTICLE
// -----------------------------------------

export function createParticle(
  x,
  y,
  options = {}
) {

  const particle = {

    x,
    y,

    velocityX:
      options.velocityX ??
      (Math.random() - 0.5) * 4,

    velocityY:
      options.velocityY ??
      (Math.random() - 0.5) * 4,

    size:
      options.size ??
      4,

    color:
      options.color ??
      "#ffffff",

    life:
      options.life ??
      60,

    maxLife:
      options.life ??
      60,

    shrink:
      options.shrink ??
      true,

    gravity:
      options.gravity ??
      0,

    glow:
      options.glow ??
      false

  };


  particles.push(
    particle
  );


  return particle;

}


// -----------------------------------------
// CREATE PARTICLE EXPLOSION
// -----------------------------------------

export function createExplosion(
  x,
  y,
  options = {}
) {

  const count =
    options.count ?? 40;

  const color =
    options.color ?? "#ff7722";

  const size =
    options.size ?? 6;

  const speed =
    options.speed ?? 6;


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const angle =
      Math.random() *
      Math.PI * 2;


    const particleSpeed =
      Math.random() *
      speed;


    createParticle(
      x,
      y,
      {

        velocityX:
          Math.cos(angle) *
          particleSpeed,

        velocityY:
          Math.sin(angle) *
          particleSpeed,

        size:
          Math.random() *
          size +
          2,

        color,

        life:
          30 +
          Math.random() * 50,

        shrink:
          true,

        glow:
          true

      }
    );

  }

}


// -----------------------------------------
// CREATE IMPACT EFFECT
// -----------------------------------------

export function createImpact(
  x,
  y,
  color = "#ffffff"
) {

  createExplosion(
    x,
    y,
    {

      count: 18,

      color,

      size: 4,

      speed: 4

    }
  );

}


// -----------------------------------------
// ANTIMATTER EFFECT
// -----------------------------------------

export function createAntimatterEffect(
  x,
  y
) {

  createExplosion(
    x,
    y,
    {

      count: 100,

      color: "#d84cff",

      size: 10,

      speed: 12

    }
  );


  createExplosion(
    x,
    y,
    {

      count: 60,

      color: "#ffffff",

      size: 7,

      speed: 9

    }
  );

}


// -----------------------------------------
// UPDATE PARTICLES
// -----------------------------------------

export function updateParticles(
  deltaTime = 1
) {

  for (
    let i =
      particles.length - 1;
    i >= 0;
    i--
  ) {

    const particle =
      particles[i];


    particle.velocityY +=
      particle.gravity *
      deltaTime;


    particle.x +=
      particle.velocityX *
      deltaTime;

    particle.y +=
      particle.velocityY *
      deltaTime;


    particle.life -=
      deltaTime;


    if (
      particle.shrink
    ) {

      particle.size *=
        0.97;

    }


    if (
      particle.life <= 0 ||
      particle.size < 0.2
    ) {

      particles.splice(
        i,
        1
      );

    }

  }

}


// -----------------------------------------
// DRAW PARTICLES
// -----------------------------------------

export function drawParticles(
  ctx,
  camera,
  canvas
) {

  particles.forEach(
    particle => {

      const position =
        camera.worldToScreen(
          particle.x,
          particle.y,
          canvas
        );


      const alpha =
        Math.max(
          0,
          particle.life /
          particle.maxLife
        );


      ctx.save();

      ctx.globalAlpha =
        alpha;


      if (
        particle.glow
      ) {

        ctx.shadowBlur =
          particle.size * 3;

        ctx.shadowColor =
          particle.color;

      }


      ctx.fillStyle =
        particle.color;


      ctx.beginPath();

      ctx.arc(
        position.x,
        position.y,
        particle.size *
          camera.zoom,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.restore();

    }
  );

}


// -----------------------------------------
// CLEAR PARTICLES
// -----------------------------------------

export function clearParticles() {

  particles.length = 0;

}


// -----------------------------------------
// GET PARTICLES
// -----------------------------------------

export function getParticles() {

  return particles;

}
