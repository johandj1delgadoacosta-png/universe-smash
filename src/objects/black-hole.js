// src/objects/black-hole.js

export function createBlackHole(x = 0, y = 0, options = {}) {
    return {
        type: "black-hole",
        name: "Black Hole",

        x,
        y,

        radius: options.radius || 38,

        mass: options.mass || 100000,

        velocity: {
            x: options.velocityX || 0,
            y: options.velocityY || 0
        },

        rotation: 0,

        rotationSpeed: 0.025,

        accretion: 0,

        pulse: Math.random() * Math.PI * 2,

        eventHorizon: options.eventHorizon || 1,

        static: true,

        destroyed: false
    };
}

export function updateBlackHole(
    blackHole,
    deltaTime = 1
) {
    if (!blackHole || blackHole.destroyed) {
        return;
    }

    blackHole.rotation =
        (blackHole.rotation || 0) +
        blackHole.rotationSpeed *
        deltaTime;

    blackHole.pulse +=
        0.02 * deltaTime;

    blackHole.accretion =
        0.5 +
        Math.sin(blackHole.pulse) *
        0.15;
}

export function drawBlackHole(
    ctx,
    blackHole,
    camera = null
) {
    if (!ctx || !blackHole) {
        return;
    }

    let x = blackHole.x;
    let y = blackHole.y;
    let scale = 1;

    if (camera) {
        const screen =
            camera.worldToScreen(
                blackHole.x,
                blackHole.y
            );

        x = screen.x;
        y = screen.y;

        scale = camera.zoom || 1;
    }

    const radius =
        Math.max(
            3,
            blackHole.radius * scale
        );

    drawBlackHoleGlow(
        ctx,
        x,
        y,
        radius
    );

    drawAccretionDisk(
        ctx,
        x,
        y,
        radius,
        blackHole.rotation
    );

    ctx.save();

    const shadowGradient =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.05,
            x,
            y,
            radius
        );

    shadowGradient.addColorStop(
        0,
        "#000000"
    );

    shadowGradient.addColorStop(
        0.75,
        "#000000"
    );

    shadowGradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
        shadowGradient;

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

    drawPhotonRing(
        ctx,
        x,
        y,
        radius
    );
}

function drawBlackHoleGlow(
    ctx,
    x,
    y,
    radius
) {
    const glowRadius =
        radius * 3.5;

    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.5,
            x,
            y,
            glowRadius
        );

    gradient.addColorStop(
        0,
        "rgba(120,60,255,0.20)"
    );

    gradient.addColorStop(
        0.35,
        "rgba(70,30,180,0.12)"
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

function drawPhotonRing(
    ctx,
    x,
    y,
    radius
) {
    ctx.save();

    ctx.strokeStyle =
        "rgba(255,190,80,0.85)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.06
        );

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius * 1.08,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawAccretionDisk(
    ctx,
    x,
    y,
    radius,
    rotation
) {
    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(rotation);

    const outerRadius =
        radius * 2.1;

    const innerRadius =
        radius * 1.05;

    const gradient =
        ctx.createRadialGradient(
            0,
            0,
            innerRadius,
            0,
            0,
            outerRadius
        );

    gradient.addColorStop(
        0,
        "rgba(255,220,120,0)"
    );

    gradient.addColorStop(
        0.35,
        "rgba(255,150,40,0.65)"
    );

    gradient.addColorStop(
        0.65,
        "rgba(170,70,255,0.38)"
    );

    gradient.addColorStop(
        1,
        "rgba(60,30,140,0)"
    );

    ctx.fillStyle =
        gradient;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        outerRadius,
        outerRadius * 0.35,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

export function isBlackHole(object) {
    return (
        object &&
        object.type === "black-hole"
    );
}

export function getBlackHoleInfluence(
    blackHole,
    object
) {
    if (
        !blackHole ||
        !object ||
        blackHole === object
    ) {
        return 0;
    }

    const dx =
        blackHole.x - object.x;

    const dy =
        blackHole.y - object.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const influenceRadius =
        Math.max(
            350,
            blackHole.radius * 15
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
