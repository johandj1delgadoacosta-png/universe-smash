// ============================================
// UNIVERSE SMASH
// Asteroid Object
// ============================================

export function createAsteroid(x = 0, y = 0, options = {}) {
    const radius = options.radius ?? 8;

    return {
        type: "asteroid",

        x,
        y,

        radius,

        mass: options.mass ?? radius * radius * 1000,

        vx: options.vx ?? 0,
        vy: options.vy ?? 0,

        rotation: options.rotation ?? 0,
        rotationSpeed:
            options.rotationSpeed ??
            (Math.random() - 0.5) * 0.04,

        color:
            options.color ??
            "#777777",

        destroyed: false,

        age: 0,

        health:
            options.health ??
            Math.max(10, radius * 5),

        maxHealth:
            options.maxHealth ??
            Math.max(10, radius * 5),

        // Random irregular shape.
        shape: createAsteroidShape(
            options.points ?? 9
        )
    };
}


// ============================================
// CREATE ASTEROID SHAPE
// ============================================

function createAsteroidShape(points = 9) {
    const shape = [];

    const count = Math.max(
        5,
        Math.min(16, points)
    );

    for (let i = 0; i < count; i++) {
        const angle =
            (Math.PI * 2 * i) /
            count;

        const variation =
            0.75 +
            Math.random() * 0.3;

        shape.push({
            angle,
            radius: variation
        });
    }

    return shape;
}


// ============================================
// UPDATE ASTEROID
// ============================================

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

    asteroid.age += deltaTime;

    asteroid.x +=
        asteroid.vx * deltaTime;

    asteroid.y +=
        asteroid.vy * deltaTime;

    asteroid.rotation +=
        asteroid.rotationSpeed *
        deltaTime;

    if (asteroid.health <= 0) {
        asteroid.health = 0;
        asteroid.destroyed = true;
    }
}


// ============================================
// DRAW ASTEROID
// ============================================

export function drawAsteroid(
    ctx,
    asteroid,
    camera = null
) {
    if (
        !ctx ||
        !asteroid ||
        asteroid.destroyed
    ) {
        return;
    }

    let screenX = asteroid.x;
    let screenY = asteroid.y;
    let radius = asteroid.radius;

    if (camera) {
        if (
            typeof camera.worldToScreen ===
            "function"
        ) {
            const position =
                camera.worldToScreen(
                    asteroid.x,
                    asteroid.y
                );

            screenX = position.x;
            screenY = position.y;

            radius *=
                camera.zoom ?? 1;
        } else {
            const zoom =
                camera.zoom ?? 1;

            screenX =
                (asteroid.x -
                    camera.x) *
                    zoom +
                ctx.canvas.width / 2;

            screenY =
                (asteroid.y -
                    camera.y) *
                    zoom +
                ctx.canvas.height / 2;

            radius *= zoom;
        }
    }

    if (radius <= 0) {
        return;
    }

    ctx.save();

    ctx.translate(
        screenX,
        screenY
    );

    ctx.rotate(
        asteroid.rotation
    );

    // ----------------------------------------
    // Asteroid shadow
    // ----------------------------------------

    ctx.fillStyle =
        "rgba(0,0,0,0.3)";

    ctx.beginPath();

    drawAsteroidPath(
        ctx,
        asteroid,
        radius,
        radius * 0.08,
        radius * 0.08
    );

    ctx.fill();

    // ----------------------------------------
    // Asteroid body
    // ----------------------------------------

    const gradient =
        ctx.createRadialGradient(
            -radius * 0.3,
            -radius * 0.35,
            radius * 0.1,
            0,
            0,
            radius
        );

    gradient.addColorStop(
        0,
        "#bdbdbd"
    );

    gradient.addColorStop(
        0.5,
        asteroid.color
    );

    gradient.addColorStop(
        1,
        "#292929"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    drawAsteroidPath(
        ctx,
        asteroid,
        radius,
        0,
        0
    );

    ctx.fill();

    // ----------------------------------------
    // Asteroid outline
    // ----------------------------------------

    ctx.strokeStyle =
        "rgba(220,220,220,0.5)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.05
        );

    ctx.beginPath();

    drawAsteroidPath(
        ctx,
        asteroid,
        radius,
        0,
        0
    );

    ctx.stroke();

    // ----------------------------------------
    // Craters
    // ----------------------------------------

    ctx.fillStyle =
        "rgba(30,30,30,0.35)";

    const craterPositions = [
        [-0.35, -0.25, 0.16],
        [0.25, -0.2, 0.12],
        [0.3, 0.3, 0.14],
        [-0.25, 0.35, 0.1]
    ];

    for (
        const crater of craterPositions
    ) {
        ctx.beginPath();

        ctx.arc(
            crater[0] * radius,
            crater[1] * radius,
            crater[2] * radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // ----------------------------------------
    // Highlight
    // ----------------------------------------

    ctx.fillStyle =
        "rgba(255,255,255,0.3)";

    ctx.beginPath();

    ctx.arc(
        -radius * 0.35,
        -radius * 0.35,
        radius * 0.08,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


// ============================================
// DRAW ASTEROID PATH
// ============================================

function drawAsteroidPath(
    ctx,
    asteroid,
    radius,
    offsetX,
    offsetY
) {
    if (
        !asteroid.shape ||
        asteroid.shape.length === 0
    ) {
        ctx.arc(
            offsetX,
            offsetY,
            radius,
            0,
            Math.PI * 2
        );

        return;
    }

    for (
        let i = 0;
        i < asteroid.shape.length;
        i++
    ) {
        const point =
            asteroid.shape[i];

        const x =
            offsetX +
            Math.cos(point.angle) *
                radius *
                point.radius;

        const y =
            offsetY +
            Math.sin(point.angle) *
                radius *
                point.radius;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();
}


// ============================================
// ASTEROID TYPE CHECK
// ============================================

export function isAsteroid(object) {
    return (
        object &&
        object.type === "asteroid"
    );
}


// ============================================
// DAMAGE ASTEROID
// ============================================

export function damageAsteroid(
    asteroid,
    amount = 10
) {
    if (
        !asteroid ||
        asteroid.destroyed
    ) {
        return false;
    }

    const damage =
        Math.max(
            0,
            Number(amount) || 0
        );

    asteroid.health -= damage;

    if (asteroid.health <= 0) {
        asteroid.health = 0;
        asteroid.destroyed = true;
    }

    return true;
}


// ============================================
// SET ASTEROID VELOCITY
// ============================================

export function setAsteroidVelocity(
    asteroid,
    vx = 0,
    vy = 0
) {
    if (!asteroid) {
        return false;
    }

    asteroid.vx =
        Number(vx) || 0;

    asteroid.vy =
        Number(vy) || 0;

    return true;
}


// ============================================
// GET ASTEROID MASS
// ============================================

export function getAsteroidMass(
    asteroid
) {
    if (!asteroid) {
        return 0;
    }

    return asteroid.mass ?? 0;
}


// ============================================
// GET ASTEROID RADIUS
// ============================================

export function getAsteroidRadius(
    asteroid
) {
    if (!asteroid) {
        return 0;
    }

    return asteroid.radius ?? 0;
}


// ============================================
// SPLIT ASTEROID
// ============================================

export function splitAsteroid(
    asteroid,
    count = 2
) {
    if (
        !asteroid ||
        asteroid.destroyed
    ) {
        return [];
    }

    const pieces = [];

    const pieceCount = Math.max(
        2,
        Math.min(6, count)
    );

    const pieceRadius =
        Math.max(
            2,
            asteroid.radius /
                Math.sqrt(pieceCount)
        );

    for (
        let i = 0;
        i < pieceCount;
        i++
    ) {
        const angle =
            (Math.PI * 2 * i) /
            pieceCount;

        const speed =
            0.5 +
            Math.random() * 1.5;

        pieces.push(
            createAsteroid(
                asteroid.x,
                asteroid.y,
                {
                    radius: pieceRadius,
                    mass:
                        asteroid.mass /
                        pieceCount,
                    vx:
                        asteroid.vx +
                        Math.cos(angle) *
                            speed,
                    vy:
                        asteroid.vy +
                        Math.sin(angle) *
                            speed
                }
            )
        );
    }

    asteroid.destroyed = true;

    return pieces;
}
