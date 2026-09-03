// src/objects/grey-hole.js

export function createGreyHole(x = 0, y = 0, options = {}) {
    return {
        type: "grey-hole",
        name: "Grey Hole",

        x,
        y,

        radius: options.radius || 32,

        // Theoretical/fictional game object.
        // Unlike the black hole, it has a physical surface.
        mass: options.mass || 50000,

        velocity: {
            x: options.velocityX || 0,
            y: options.velocityY || 0
        },

        rotation: 0,

        rotationSpeed:
            options.rotationSpeed || 0.012,

        pulse:
            Math.random() * Math.PI * 2,

        glow: 1,

        surfaceTemperature:
            options.surfaceTemperature || 9000,

        static: options.static === true,

        destroyed: false
    };
}

export function updateGreyHole(
    greyHole,
    deltaTime = 1
) {
    if (!greyHole || greyHole.destroyed) {
        return;
    }

    greyHole.rotation =
        (greyHole.rotation || 0) +
        greyHole.rotationSpeed *
        deltaTime;

    greyHole.pulse +=
        0.025 * deltaTime;

    greyHole.glow =
        1 +
        Math.sin(greyHole.pulse) *
        0.12;
}

export function drawGreyHole(
    ctx,
    greyHole,
    camera = null
) {
    if (!ctx || !greyHole) {
        return;
    }

    let x = greyHole.x;
    let y = greyHole.y;
    let scale = 1;

    if (camera) {
        const screen =
            camera.worldToScreen(
                greyHole.x,
                greyHole.y
            );

        x = screen.x;
        y = screen.y;

        scale = camera.zoom || 1;
    }

    const radius =
        Math.max(
            3,
            greyHole.radius * scale
        );

    drawGreyGlow(
        ctx,
        x,
        y,
        radius,
        greyHole.glow
    );

    drawGreyAccretionRing(
        ctx,
        x,
        y,
        radius,
        greyHole.rotation
    );

    drawGreySurface(
        ctx,
        x,
        y,
        radius
    );

    drawEscapingLight(
        ctx,
        x,
        y,
        radius,
        greyHole.rotation
    );
}

function drawGreyGlow(
    ctx,
    x,
    y,
    radius,
    strength = 1
) {
    const glowRadius =
        radius * 3.2;

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
        `rgba(255,70,45,${0.25 * strength})`
    );

    gradient.addColorStop(
        0.35,
        `rgba(180,35,25,${0.14 * strength})`
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.save();

    ctx.fillStyle = gradient;

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

function drawGreyAccretionRing(
    ctx,
    x,
    y,
    radius,
    rotation
) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.strokeStyle =
        "rgba(255,75,45,0.75)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.08
        );

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        radius * 1.75,
        radius * 0.55,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.strokeStyle =
        "rgba(255,170,90,0.45)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.035
        );

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        radius * 2.05,
        radius * 0.68,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawGreySurface(
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
        "#d8d8d8"
    );

    gradient.addColorStop(
        0.35,
        "#8f8f8f"
    );

    gradient.addColorStop(
        0.72,
        "#4c4c4c"
    );

    gradient.addColorStop(
        1,
        "#191919"
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

function drawEscapingLight(
    ctx,
    x,
    y,
    radius,
    rotation
) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation);

    ctx.globalAlpha = 0.65;

    ctx.strokeStyle =
        "#ff5a45";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.025
        );

    for (let i = 0; i < 8; i++) {
        const angle =
            (Math.PI * 2 / 8) * i;

        const inner =
            radius * 0.9;

        const outer =
            radius * (1.3 + (i % 2) * 0.35);

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

export function isGreyHole(object) {
    return (
        object &&
        object.type === "grey-hole"
    );
}

export function getGreyHoleInfluence(
    greyHole,
    object
) {
    if (
        !greyHole ||
        !object ||
        greyHole === object
    ) {
        return 0;
    }

    const dx =
        greyHole.x - object.x;

    const dy =
        greyHole.y - object.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const influenceRadius =
        Math.max(
            280,
            greyHole.radius * 12
        );

    if (
        distance >= influenceRadius
    ) {
        return 0;
    }

    return (
        1 -
        distance / influenceRadius
    );
}
