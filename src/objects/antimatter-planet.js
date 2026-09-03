// ============================================
// UNIVERSE SMASH
// Antimatter Planet Object
// ============================================

export function createAntimatterPlanet(x = 0, y = 0, options = {}) {
    return {
        type: "antimatter-planet",

        x,
        y,

        radius: options.radius ?? 32,
        mass: options.mass ?? 8e14,

        vx: options.vx ?? 0,
        vy: options.vy ?? 0,

        rotation: options.rotation ?? 0,
        rotationSpeed: options.rotationSpeed ?? 0.01,

        color: options.color ?? "#d8ffff",
        glow: options.glow ?? 1,

        destroyed: false,

        antimatterLevel: options.antimatterLevel ?? 1,

        age: 0,

        reactionCooldown: 0,

        atmosphere: options.atmosphere ?? true
    };
}


// ============================================
// UPDATE
// ============================================

export function updateAntimatterPlanet(planet, deltaTime = 1) {
    if (!planet || planet.destroyed) {
        return;
    }

    planet.age += deltaTime;

    planet.x += planet.vx * deltaTime;
    planet.y += planet.vy * deltaTime;

    planet.rotation += planet.rotationSpeed * deltaTime;

    if (planet.reactionCooldown > 0) {
        planet.reactionCooldown -= deltaTime;

        if (planet.reactionCooldown < 0) {
            planet.reactionCooldown = 0;
        }
    }

    // Slowly animate the glow.
    planet.glow =
        1 +
        Math.sin(planet.age * 0.08) * 0.12;

    if (planet.antimatterLevel < 0) {
        planet.antimatterLevel = 0;
    }

    if (planet.antimatterLevel > 1) {
        planet.antimatterLevel = 1;
    }
}


// ============================================
// DRAW
// ============================================

export function drawAntimatterPlanet(
    ctx,
    planet,
    camera = null
) {
    if (!ctx || !planet || planet.destroyed) {
        return;
    }

    let screenX = planet.x;
    let screenY = planet.y;
    let radius = planet.radius;

    if (camera) {
        if (typeof camera.worldToScreen === "function") {
            const position = camera.worldToScreen(
                planet.x,
                planet.y
            );

            screenX = position.x;
            screenY = position.y;

            radius *= camera.zoom ?? 1;
        } else {
            screenX =
                (planet.x - camera.x) *
                    (camera.zoom ?? 1) +
                ctx.canvas.width / 2;

            screenY =
                (planet.y - camera.y) *
                    (camera.zoom ?? 1) +
                ctx.canvas.height / 2;

            radius *= camera.zoom ?? 1;
        }
    }

    ctx.save();

    // ----------------------------------------
    // Outer glow
    // ----------------------------------------

    const glowRadius =
        radius *
        (1.8 + planet.glow * 0.35);

    const glow = ctx.createRadialGradient(
        screenX,
        screenY,
        radius * 0.2,
        screenX,
        screenY,
        glowRadius
    );

    glow.addColorStop(
        0,
        "rgba(220,255,255,0.45)"
    );

    glow.addColorStop(
        0.45,
        "rgba(150,240,255,0.18)"
    );

    glow.addColorStop(
        1,
        "rgba(80,180,255,0)"
    );

    ctx.fillStyle = glow;

    ctx.beginPath();
    ctx.arc(
        screenX,
        screenY,
        glowRadius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // ----------------------------------------
    // Planet body
    // ----------------------------------------

    const planetGradient = ctx.createRadialGradient(
        screenX - radius * 0.35,
        screenY - radius * 0.35,
        radius * 0.1,
        screenX,
        screenY,
        radius
    );

    planetGradient.addColorStop(
        0,
        "#ffffff"
    );

    planetGradient.addColorStop(
        0.35,
        planet.color
    );

    planetGradient.addColorStop(
        0.75,
        "#8bdcff"
    );

    planetGradient.addColorStop(
        1,
        "#397ba8"
    );

    ctx.fillStyle = planetGradient;

    ctx.beginPath();
    ctx.arc(
        screenX,
        screenY,
        radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // ----------------------------------------
    // Antimatter surface rings
    // ----------------------------------------

    ctx.save();

    ctx.translate(
        screenX,
        screenY
    );

    ctx.rotate(
        planet.rotation
    );

    ctx.strokeStyle =
        "rgba(255,255,255,0.5)";

    ctx.lineWidth =
        Math.max(1, radius * 0.035);

    for (let i = 0; i < 3; i++) {
        const ringRadius =
            radius *
            (0.35 + i * 0.2);

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            ringRadius,
            ringRadius * 0.25,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    ctx.restore();

    // ----------------------------------------
    // Atmosphere
    // ----------------------------------------

    if (planet.atmosphere) {
        ctx.strokeStyle =
            "rgba(190,250,255,0.75)";

        ctx.lineWidth =
            Math.max(
                1,
                radius * 0.04
            );

        ctx.beginPath();

        ctx.arc(
            screenX,
            screenY,
            radius * 1.08,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    // ----------------------------------------
    // Antimatter symbol
    // ----------------------------------------

    ctx.strokeStyle =
        "rgba(255,255,255,0.85)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.055
        );

    ctx.beginPath();

    ctx.moveTo(
        screenX - radius * 0.3,
        screenY
    );

    ctx.lineTo(
        screenX + radius * 0.3,
        screenY
    );

    ctx.stroke();

    // ----------------------------------------
    // Highlight
    // ----------------------------------------

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";

    ctx.beginPath();

    ctx.arc(
        screenX - radius * 0.35,
        screenY - radius * 0.35,
        radius * 0.12,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


// ============================================
// CHECK TYPE
// ============================================

export function isAntimatterPlanet(object) {
    return (
        object &&
        object.type === "antimatter-planet"
    );
}


// ============================================
// TRIGGER ANTIMATTER REACTION
// ============================================

export function triggerAntimatterReaction(
    planet,
    strength = 1
) {
    if (!planet || planet.destroyed) {
        return false;
    }

    if (planet.reactionCooldown > 0) {
        return false;
    }

    const reactionStrength =
        Math.max(
            0,
            Math.min(
                1,
                strength
            )
        );

    planet.antimatterLevel -=
        reactionStrength * 0.2;

    planet.reactionCooldown = 30;

    if (planet.antimatterLevel <= 0) {
        planet.antimatterLevel = 0;
        planet.destroyed = true;
    }

    return true;
}


// ============================================
// GET ANTIMATTER LEVEL
// ============================================

export function getAntimatterLevel(planet) {
    if (!planet) {
        return 0;
    }

    return planet.antimatterLevel ?? 0;
}
