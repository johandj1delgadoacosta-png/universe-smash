// ============================================
// UNIVERSE SMASH
// Planet Object
// ============================================

export function createPlanet(x = 0, y = 0, options = {}) {
    return {
        type: "planet",

        x,
        y,

        radius: options.radius ?? 30,
        mass: options.mass ?? 5.972e15,

        vx: options.vx ?? 0,
        vy: options.vy ?? 0,

        rotation: options.rotation ?? 0,
        rotationSpeed: options.rotationSpeed ?? 0.005,

        color: options.color ?? "#4d8cff",
        secondaryColor: options.secondaryColor ?? "#36b56e",

        atmosphere: options.atmosphere ?? true,
        atmosphereStrength: options.atmosphereStrength ?? 0.7,

        destroyed: false,

        health: options.health ?? 100,
        maxHealth: options.maxHealth ?? 100,

        age: 0,

        temperature: options.temperature ?? 1,

        rings: options.rings ?? false,

        ringColor: options.ringColor ?? "#c9b58a"
    };
}


// ============================================
// UPDATE PLANET
// ============================================

export function updatePlanet(planet, deltaTime = 1) {
    if (!planet || planet.destroyed) {
        return;
    }

    planet.age += deltaTime;

    planet.x += planet.vx * deltaTime;
    planet.y += planet.vy * deltaTime;

    planet.rotation +=
        planet.rotationSpeed * deltaTime;

    if (planet.health < 0) {
        planet.health = 0;
    }

    if (planet.health > planet.maxHealth) {
        planet.health = planet.maxHealth;
    }

    if (planet.temperature < 0) {
        planet.temperature = 0;
    }

    // A planet disappears when its health reaches zero.
    if (planet.health <= 0) {
        planet.destroyed = true;
    }
}


// ============================================
// DRAW PLANET
// ============================================

export function drawPlanet(
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
        if (
            typeof camera.worldToScreen ===
            "function"
        ) {
            const position =
                camera.worldToScreen(
                    planet.x,
                    planet.y
                );

            screenX = position.x;
            screenY = position.y;

            radius *= camera.zoom ?? 1;
        } else {
            const zoom =
                camera.zoom ?? 1;

            screenX =
                (planet.x - camera.x) *
                    zoom +
                ctx.canvas.width / 2;

            screenY =
                (planet.y - camera.y) *
                    zoom +
                ctx.canvas.height / 2;

            radius *= zoom;
        }
    }

    if (radius <= 0) {
        return;
    }

    ctx.save();

    // ----------------------------------------
    // Atmosphere glow
    // ----------------------------------------

    if (planet.atmosphere) {
        const atmosphereRadius =
            radius *
            (1.15 +
                planet.atmosphereStrength *
                    0.15);

        const atmosphere =
            ctx.createRadialGradient(
                screenX,
                screenY,
                radius * 0.7,
                screenX,
                screenY,
                atmosphereRadius
            );

        atmosphere.addColorStop(
            0,
            "rgba(100,180,255,0)"
        );

        atmosphere.addColorStop(
            0.75,
            "rgba(100,190,255,0.12)"
        );

        atmosphere.addColorStop(
            1,
            "rgba(100,190,255,0)"
        );

        ctx.fillStyle = atmosphere;

        ctx.beginPath();

        ctx.arc(
            screenX,
            screenY,
            atmosphereRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // ----------------------------------------
    // Planet body
    // ----------------------------------------

    const planetGradient =
        ctx.createRadialGradient(
            screenX - radius * 0.35,
            screenY - radius * 0.35,
            radius * 0.08,
            screenX,
            screenY,
            radius
        );

    planetGradient.addColorStop(
        0,
        "#d9f2ff"
    );

    planetGradient.addColorStop(
        0.2,
        planet.color
    );

    planetGradient.addColorStop(
        0.65,
        planet.secondaryColor
    );

    planetGradient.addColorStop(
        1,
        "#142b55"
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
    // Surface details
    // ----------------------------------------

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        screenX,
        screenY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.clip();

    ctx.translate(
        screenX,
        screenY
    );

    ctx.rotate(
        planet.rotation
    );

    // Continents / surface patches
    ctx.fillStyle =
        "rgba(40,120,70,0.55)";

    for (let i = 0; i < 6; i++) {
        const angle =
            i * 1.7;

        const distance =
            radius * 0.35;

        const patchX =
            Math.cos(angle) *
            distance;

        const patchY =
            Math.sin(angle) *
            distance;

        ctx.beginPath();

        ctx.ellipse(
            patchX,
            patchY,
            radius * 0.25,
            radius * 0.12,
            angle,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    // ----------------------------------------
    // Cloud bands
    // ----------------------------------------

    ctx.strokeStyle =
        "rgba(255,255,255,0.18)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.04
        );

    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();

        ctx.ellipse(
            0,
            i * radius * 0.35,
            radius * 0.9,
            radius * 0.12,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    ctx.restore();

    // ----------------------------------------
    // Planet outline
    // ----------------------------------------

    ctx.strokeStyle =
        "rgba(180,225,255,0.65)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.035
        );

    ctx.beginPath();

    ctx.arc(
        screenX,
        screenY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    // ----------------------------------------
    // Rings
    // ----------------------------------------

    if (planet.rings) {
        ctx.save();

        ctx.translate(
            screenX,
            screenY
        );

        ctx.rotate(
            planet.rotation * 0.5
        );

        ctx.strokeStyle =
            planet.ringColor;

        ctx.globalAlpha = 0.7;

        ctx.lineWidth =
            Math.max(
                1,
                radius * 0.06
            );

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            radius * 1.7,
            radius * 0.45,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.lineWidth =
            Math.max(
                1,
                radius * 0.025
            );

        ctx.globalAlpha = 0.45;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            radius * 1.95,
            radius * 0.52,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.restore();
    }

    // ----------------------------------------
    // Highlight
    // ----------------------------------------

    ctx.fillStyle =
        "rgba(255,255,255,0.5)";

    ctx.beginPath();

    ctx.arc(
        screenX - radius * 0.32,
        screenY - radius * 0.34,
        radius * 0.12,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


// ============================================
// PLANET TYPE CHECK
// ============================================

export function isPlanet(object) {
    return (
        object &&
        object.type === "planet"
    );
}


// ============================================
// DAMAGE PLANET
// ============================================

export function damagePlanet(
    planet,
    amount = 10
) {
    if (!planet || planet.destroyed) {
        return false;
    }

    const damage =
        Math.max(
            0,
            Number(amount) || 0
        );

    planet.health -= damage;

    if (planet.health <= 0) {
        planet.health = 0;
        planet.destroyed = true;
    }

    return true;
}


// ============================================
// HEAL PLANET
// ============================================

export function healPlanet(
    planet,
    amount = 10
) {
    if (!planet || planet.destroyed) {
        return false;
    }

    const healing =
        Math.max(
            0,
            Number(amount) || 0
        );

    planet.health += healing;

    if (
        planet.health >
        planet.maxHealth
    ) {
        planet.health =
            planet.maxHealth;
    }

    return true;
}


// ============================================
// SET PLANET VELOCITY
// ============================================

export function setPlanetVelocity(
    planet,
    vx = 0,
    vy = 0
) {
    if (!planet) {
        return false;
    }

    planet.vx =
        Number(vx) || 0;

    planet.vy =
        Number(vy) || 0;

    return true;
}


// ============================================
// GET PLANET HEALTH
// ============================================

export function getPlanetHealth(planet) {
    if (!planet) {
        return 0;
    }

    return planet.health ?? 0;
}


// ============================================
// GET PLANET MASS
// ============================================

export function getPlanetMass(planet) {
    if (!planet) {
        return 0;
    }

    return planet.mass ?? 0;
}
