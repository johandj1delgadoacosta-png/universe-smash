// src/objects/antimatter-planet.js

export function createAntimatterPlanet(
    x = 0,
    y = 0,
    options = {}
) {
    return {
        type: "antimatter-planet",
        name: options.name || "Antimatter Planet",

        x,
        y,

        radius: options.radius || 28,

        mass: options.mass || 100,

        velocity: {
            x: options.velocityX || 0,
            y: options.velocityY || 0
        },

        rotation: options.rotation || 0,

        rotationSpeed:
            options.rotationSpeed || 0.01,

        pulse:
            Math.random() * Math.PI * 2,

        glow: 1,

        antimatterLevel:
            options.antimatterLevel || 1,

        destroyed: false,

        static: options.static === true
    };
}

export function updateAntimatterPlanet(
    planet,
    deltaTime = 1
) {
    if (!planet || planet.destroyed) {
        return;
    }

    planet.rotation =
        (planet.rotation || 0) +
        planet.rotationSpeed *
        deltaTime;

    planet.pulse +=
        0.045 * deltaTime;

    planet.glow =
        1 +
        Math.sin(planet.pulse) *
        0.15;

    if (
        planet.antimatterLevel > 0
    ) {
        planet.antimatterLevel =
            Math.max(
                0,
                planet.antimatterLevel -
                0.00001 * deltaTime
            );
    }
}

export function drawAntimatterPlanet(
    ctx,
    planet,
    camera = null
) {
    if (!ctx || !planet) {
        return;
    }

    let x = planet.x;
    let y = planet.y;
    let scale = 1;

    if (camera) {
        const screen =
            camera.worldToScreen(
                planet.x,
                planet.y
            );

        x = screen.x;
        y = screen.y;

        scale =
            camera.zoom || 1;
    }

    const radius =
        Math.max(
            3,
            planet.radius * scale
        );

    drawAntimatterGlow(
        ctx,
        x,
        y,
        radius,
        planet.glow
    );

    drawAntimatterAtmosphere(
        ctx,
        x,
        y,
        radius
    );

    drawPlanetSurface(
        ctx,
        x,
        y,
        radius
    );

    drawEnergyLines(
        ctx,
        x,
        y,
        radius,
        planet.rotation
    );
}

function drawAntimatterGlow(
    ctx,
    x,
    y,
    radius,
    strength = 1
) {
    const glowRadius =
        radius * 3;

    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.2,
            x,
            y,
            glowRadius
        );

    gradient.addColorStop(
        0,
        `rgba(255,70,255,${0.32 * strength})`
    );

    gradient.addColorStop(
        0.35,
        `rgba(130,50,255,${0.20 * strength})`
    );

    gradient.addColorStop(
        0.7,
        `rgba(50,180,255,${0.08 * strength})`
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.save();

    ctx.fillStyle =
        gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        glowRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

function drawAntimatterAtmosphere(
    ctx,
    x,
    y,
    radius
) {
    ctx.save();

    ctx.globalAlpha = 0.6;

    ctx.strokeStyle =
        "#d45cff";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.08
        );

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius * 1.12,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.strokeStyle =
        "#61d9ff";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.035
        );

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius * 1.22,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawPlanetSurface(
    ctx,
    x,
    y,
    radius
) {
    const gradient =
        ctx.createRadialGradient(
            x - radius * 0.3,
            y - radius * 0.3,
            radius * 0.05,
            x,
            y,
            radius
        );

    gradient.addColorStop(
        0,
        "#f0c8ff"
    );

    gradient.addColorStop(
        0.35,
        "#a34de8"
    );

    gradient.addColorStop(
        0.7,
        "#5420a5"
    );

    gradient.addColorStop(
        1,
        "#16052f"
    );

    ctx.save();

    ctx.fillStyle =
        gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

function drawEnergyLines(
    ctx,
    x,
    y,
    radius,
    rotation
) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation);

    for (let i = 0; i < 8; i++) {
        const angle =
            (Math.PI * 2 / 8) *
            i;

        const inner =
            radius * 0.8;

        const outer =
            radius * 1.35;

        ctx.globalAlpha =
            0.25 +
            (i % 2) * 0.15;

        ctx.strokeStyle =
            i % 2 === 0
                ? "#ff5cff"
                : "#62dfff";

        ctx.lineWidth =
            Math.max(
                1,
                radius * 0.025
            );

        ctx.beginPath();

        ctx.moveTo(
            Math.cos(angle) * inner,
            Math.sin(angle) * inner
        );

        ctx.lineTo(
            Math.cos(angle) * outer,
            Math.sin(angle) * outer
        );

        ctx.stroke();
    }

    ctx.restore();
}

export function isAntimatterPlanet(
    object
) {
    return (
        object &&
        object.type ===
            "antimatter-planet"
    );
}

export function triggerAntimatterReaction(
    planet
) {
    if (
        !planet ||
        planet.destroyed
    ) {
        return false;
    }

    planet.antimatterLevel = 0;

    planet.destroyed = true;

    return true;
}

export function getAntimatterLevel(
    planet
) {
    if (
        !planet ||
        !Number.isFinite(
            planet.antimatterLevel
        )
    ) {
        return 0;
    }

    return planet.antimatterLevel;
}

