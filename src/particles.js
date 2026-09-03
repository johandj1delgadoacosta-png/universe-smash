// Universe Smash
// Particle Effects System

let particles = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function createParticle(x, y, options = {}) {
    const particle = {
        x,
        y,

        vx: options.vx ?? random(-2, 2),
        vy: options.vy ?? random(-2, 2),

        size: options.size ?? random(1, 4),

        life: options.life ?? random(500, 1200),
        maxLife: options.life ?? random(500, 1200),

        gravity: options.gravity ?? 0,

        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.05, 0.05),

        color: options.color ?? "#ffffff",

        alpha: options.alpha ?? 1,

        fade: options.fade ?? true,

        shape: options.shape ?? "circle"
    };

    particles.push(particle);

    return particle;
}

export function createExplosion(
    x,
    y,
    power = 50,
    options = {}
) {
    const count =
        options.count ??
        Math.max(20, Math.floor(power * 0.7));

    const colors =
        options.colors ?? [
            "#ffffff",
            "#ffd166",
            "#ff9f1c",
            "#ff5a36"
        ];

    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            random(
                power * 0.02,
                power * 0.08
            );

        createParticle(
            x,
            y,
            {
                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                size:
                    random(1, 5),

                life:
                    random(400, 1400),

                color:
                    colors[
                        Math.floor(
                            Math.random() *
                            colors.length
                        )
                    ],

                gravity:
                    options.gravity ?? 0
            }
        );
    }

    return particles;
}

export function createImpact(
    x,
    y,
    options = {}
) {
    const count =
        options.count ?? 20;

    const speed =
        options.speed ?? 3;

    const color =
        options.color ?? "#ffffff";

    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        const velocity =
            random(
                speed * 0.4,
                speed
            );

        createParticle(
            x,
            y,
            {
                vx:
                    Math.cos(angle) *
                    velocity,

                vy:
                    Math.sin(angle) *
                    velocity,

                size:
                    random(1, 3),

                life:
                    random(250, 800),

                color
            }
        );
    }

    return particles;
}

export function createAntimatterEffect(
    x,
    y,
    options = {}
) {
    const count =
        options.count ?? 80;

    const colors =
        options.colors ?? [
            "#ffffff",
            "#d9a3ff",
            "#b36cff",
            "#8b3dff"
        ];

    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            random(1, 7);

        createParticle(
            x,
            y,
            {
                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                size:
                    random(1, 5),

                life:
                    random(500, 1800),

                color:
                    colors[
                        Math.floor(
                            Math.random() *
                            colors.length
                        )
                    ]
            }
        );
    }

    return particles;
}

export function createShockwave(
    x,
    y,
    options = {}
) {
    const count =
        options.count ?? 35;

    const speed =
        options.speed ?? 6;

    const color =
        options.color ?? "#9eeaff";

    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        createParticle(
            x,
            y,
            {
                vx:
                    Math.cos(angle) *
                    random(
                        speed * 0.7,
                        speed
                    ),

                vy:
                    Math.sin(angle) *
                    random(
                        speed * 0.7,
                        speed
                    ),

                size:
                    random(1, 4),

                life:
                    random(500, 1100),

                color
            }
        );
    }

    return particles;
}

export function createGravityParticles(
    x,
    y,
    options = {}
) {
    const count =
        options.count ?? 30;

    const radius =
        options.radius ?? 100;

    const color =
        options.color ?? "#9b6cff";

    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            random(
                radius * 0.4,
                radius
            );

        const px =
            x +
            Math.cos(angle) *
            distance;

        const py =
            y +
            Math.sin(angle) *
            distance;

        const tangentX =
            -Math.sin(angle);

        const tangentY =
            Math.cos(angle);

        createParticle(
            px,
            py,
            {
                vx:
                    tangentX *
                    random(0.5, 2),

                vy:
                    tangentY *
                    random(0.5, 2),

                size:
                    random(1, 3),

                life:
                    random(800, 1800),

                color
            }
        );
    }

    return particles;
}

export function updateParticles(
    deltaTime
) {
    if (!Number.isFinite(deltaTime)) {
        deltaTime = 16.67;
    }

    const dt =
        Math.min(
            deltaTime,
            50
        ) / 16.67;

    for (const particle of particles) {
        particle.x +=
            particle.vx * dt;

        particle.y +=
            particle.vy * dt;

        particle.vy +=
            particle.gravity * dt;

        particle.rotation +=
            particle.rotationSpeed * dt;

        particle.life -=
            deltaTime;
    }

    particles =
        particles.filter(
            particle =>
                particle.life > 0 &&
                Number.isFinite(
                    particle.x
                ) &&
                Number.isFinite(
                    particle.y
                )
        );
}

export function drawParticles(
    ctx
) {
    if (!ctx) {
        return;
    }

    for (const particle of particles) {
        const lifeRatio =
            Math.max(
                0,
                Math.min(
                    1,
                    particle.life /
                    particle.maxLife
                )
            );

        const alpha =
            particle.fade
                ? particle.alpha *
                  lifeRatio
                : particle.alpha;

        if (alpha <= 0) {
            continue;
        }

        ctx.save();

        ctx.globalAlpha =
            alpha;

        ctx.fillStyle =
            particle.color;

        ctx.translate(
            particle.x,
            particle.y
        );

        ctx.rotate(
            particle.rotation
        );

        if (
            particle.shape ===
            "square"
        ) {
            ctx.fillRect(
                -particle.size,
                -particle.size,
                particle.size * 2,
                particle.size * 2
            );
        } else if (
            particle.shape ===
            "triangle"
        ) {
            ctx.beginPath();

            ctx.moveTo(
                particle.size,
                0
            );

            ctx.lineTo(
                -particle.size,
                -particle.size
            );

            ctx.lineTo(
                -particle.size,
                particle.size
            );

            ctx.closePath();

            ctx.fill();
        } else {
            ctx.beginPath();

            ctx.arc(
                0,
                0,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();
    }
}

export function clearParticles() {
    particles = [];
}

export function getParticles() {
    return particles;
}

export function getParticleCount() {
    return particles.length;
}

export function removeParticle(
    particle
) {
    const index =
        particles.indexOf(
            particle
        );

    if (index !== -1) {
        particles.splice(
            index,
            1
        );

        return true;
    }

    return false;
}

export function setParticleLimit(
    limit
) {
    if (
        !Number.isFinite(limit) ||
        limit < 0
    ) {
        return;
    }

    if (
        particles.length >
        limit
    ) {
        particles =
            particles.slice(
                particles.length -
                limit
            );
    }
}

export function burst(
    x,
    y,
    count = 25,
    color = "#ffffff"
) {
    for (let i = 0; i < count; i++) {
        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            random(1, 5);

        createParticle(
            x,
            y,
            {
                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                size:
                    random(1, 4),

                life:
                    random(300, 1000),

                color
            }
        );
    }
}
