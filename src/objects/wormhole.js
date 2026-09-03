// src/objects/wormhole.js

export function createWormhole(x = 0, y = 0, options = {}) {
    return {
        type: "wormhole",
        name: options.name || "Wormhole",

        x,
        y,

        radius: options.radius || 30,

        mass: options.mass || 500,

        velocity: {
            x: options.velocityX || 0,
            y: options.velocityY || 0
        },

        rotation: options.rotation || 0,

        rotationSpeed:
            options.rotationSpeed || 0.035,

        pulse:
            Math.random() * Math.PI * 2,

        glow: 1,

        linkedTo: null,

        wormholeCooldown: 0,

        static: options.static === true,

        destroyed: false
    };
}

export function updateWormhole(
    wormhole,
    deltaTime = 1
) {
    if (!wormhole || wormhole.destroyed) {
        return;
    }

    wormhole.rotation =
        (wormhole.rotation || 0) +
        wormhole.rotationSpeed *
        deltaTime;

    wormhole.pulse +=
        0.04 * deltaTime;

    wormhole.glow =
        1 +
        Math.sin(wormhole.pulse) *
        0.15;

    if (
        wormhole.wormholeCooldown > 0
    ) {
        wormhole.wormholeCooldown =
            Math.max(
                0,
                wormhole.wormholeCooldown -
                deltaTime
            );
    }
}

export function linkWormholes(wormholes) {
    if (!Array.isArray(wormholes)) {
        return;
    }

    const validWormholes =
        wormholes.filter(
            wormhole =>
                wormhole &&
                !wormhole.destroyed &&
                wormhole.type === "wormhole"
        );

    for (const wormhole of validWormholes) {
        wormhole.linkedTo = null;
    }

    if (validWormholes.length < 2) {
        return;
    }

    for (
        let i = 0;
        i < validWormholes.length;
        i += 2
    ) {
        const entrance =
            validWormholes[i];

        const exit =
            validWormholes[i + 1];

        if (!exit) {
            break;
        }

        entrance.linkedTo = exit;
        exit.linkedTo = entrance;
    }
}

export function teleportThroughWormhole(
    object,
    entrance,
    exit
) {
    if (
        !object ||
        !entrance ||
        !exit
    ) {
        return false;
    }

    if (
        object === entrance ||
        object === exit
    ) {
        return false;
    }

    object.x =
        exit.x +
        (Math.random() - 0.5) *
        exit.radius;

    object.y =
        exit.y +
        (Math.random() - 0.5) *
        exit.radius;

    if (!object.velocity) {
        object.velocity = {
            x: 0,
            y: 0
        };
    }

    const speed =
        Math.sqrt(
            object.velocity.x *
            object.velocity.x +
            object.velocity.y *
            object.velocity.y
        );

    if (speed > 0) {
        const angle =
            Math.atan2(
                object.velocity.y,
                object.velocity.x
            );

        object.velocity.x =
            Math.cos(angle) * speed;

        object.velocity.y =
            Math.sin(angle) * speed;
    }

    object.wormholeCooldown = 30;

    return true;
}

export function isWormhole(object) {
    return (
        object &&
        object.type === "wormhole"
    );
}

export function getWormholeDistance(
    wormhole,
    object
) {
    if (
        !wormhole ||
        !object
    ) {
        return Infinity;
    }

    const dx =
        object.x -
        wormhole.x;

    const dy =
        object.y -
        wormhole.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}

export function isInsideWormhole(
    wormhole,
    object
) {
    if (
        !wormhole ||
        !object
    ) {
        return false;
    }

    const distance =
        getWormholeDistance(
            wormhole,
            object
        );

    return (
        distance <=
        wormhole.radius * 1.25
    );
}

export function drawWormhole(
    ctx,
    wormhole,
    camera = null
) {
    if (!ctx || !wormhole) {
        return;
    }

    let x = wormhole.x;
    let y = wormhole.y;
    let scale = 1;

    if (camera) {
        const screen =
            camera.worldToScreen(
                wormhole.x,
                wormhole.y
            );

        x = screen.x;
        y = screen.y;

        scale =
            camera.zoom || 1;
    }

    const radius =
        Math.max(
            3,
            wormhole.radius * scale
        );

    drawWormholeGlow(
        ctx,
        x,
        y,
        radius,
        wormhole.glow
    );

    drawWormholeRings(
        ctx,
        x,
        y,
        radius,
        wormhole.rotation
    );

    drawWormholeCore(
        ctx,
        x,
        y,
        radius
    );

    drawWormholeParticles(
        ctx,
        x,
        y,
        radius,
        wormhole.rotation
    );
}

function drawWormholeGlow(
    ctx,
    x,
    y,
    radius,
    strength = 1
) {
    const glowRadius =
        radius * 3.5;

    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.1,
            x,
            y,
            glowRadius
        );

    gradient.addColorStop(
        0,
        `rgba(80,180,255,${0.3 * strength})`
    );

    gradient.addColorStop(
        0.35,
        `rgba(100,70,255,${0.18 * strength})`
    );

    gradient.addColorStop(
        0.7,
        `rgba(190,50,255,${0.08 * strength})`
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

function drawWormholeRings(
    ctx,
    x,
    y,
    radius,
    rotation
) {
    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(rotation);

    for (let i = 0; i < 4; i++) {
        const ringRadius =
            radius *
            (0.9 + i * 0.35);

        ctx.globalAlpha =
            0.75 - i * 0.12;

        ctx.strokeStyle =
            i % 2 === 0
                ? "#65d9ff"
                : "#b86cff";

        ctx.lineWidth =
            Math.max(
                1,
                radius * 0.055
            );

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            ringRadius,
            ringRadius * 0.48,
            0,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    ctx.restore();
}

function drawWormholeCore(
    ctx,
    x,
    y,
    radius
) {
    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.05,
            x,
            y,
            radius
        );

    gradient.addColorStop(
        0,
        "#02030a"
    );

    gradient.addColorStop(
        0.55,
        "#08051a"
    );

    gradient.addColorStop(
        0.8,
        "#25115c"
    );

    gradient.addColorStop(
        1,
        "rgba(50,120,255,0.1)"
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

function drawWormholeParticles(
    ctx,
    x,
    y,
    radius,
    rotation
) {
    ctx.save();

    ctx.translate(x, y);

    for (let i = 0; i < 12; i++) {
        const angle =
            rotation +
            (Math.PI * 2 / 12) *
            i;

        const distance =
            radius *
            (1.1 + (i % 3) * 0.22);

        const particleX =
            Math.cos(angle) *
            distance;

        const particleY =
            Math.sin(angle) *
            distance;

        ctx.globalAlpha =
            0.35 +
            (i % 3) * 0.15;

        ctx.fillStyle =
            i % 2 === 0
                ? "#70e8ff"
                : "#c77dff";

        ctx.beginPath();

        ctx.arc(
            particleX,
            particleY,
            Math.max(
                1,
                radius * 0.035
            ),
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.restore();
}
