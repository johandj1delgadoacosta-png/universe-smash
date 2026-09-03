// src/objects/star.js

export function createStar(x = 0, y = 0, options = {}) {
    const type = options.type || "star";

    const presets = {
        star: {
            name: "Star",
            radius: 45,
            mass: 5000,
            temperature: 5800,
            luminosity: 1,
            color: "#fff4c4"
        },

        blueHypergiant: {
            name: "Blue Hypergiant",
            radius: 85,
            mass: 15000,
            temperature: 30000,
            luminosity: 25,
            color: "#8fd7ff"
        }
    };

    const preset =
        presets[type] || presets.star;

    return {
        type,
        name: preset.name,

        x,
        y,

        radius: options.radius || preset.radius,
        mass: options.mass || preset.mass,

        temperature: preset.temperature,
        luminosity: preset.luminosity,

        color: options.color || preset.color,

        velocity: {
            x: options.velocityX || 0,
            y: options.velocityY || 0
        },

        rotation: 0,
        rotationSpeed: 0.0005,

        glow: 1,
        pulse: Math.random() * Math.PI * 2,

        static: options.static === true,

        destroyed: false
    };
}

export function createBlueHypergiant(
    x = 0,
    y = 0,
    options = {}
) {
    return createStar(x, y, {
        ...options,
        type: "blueHypergiant"
    });
}

export function updateStar(star, deltaTime = 1) {
    if (!star || star.destroyed) return;

    star.pulse +=
        0.015 * deltaTime;

    star.glow =
        1 +
        Math.sin(star.pulse) * 0.08;

    star.rotation =
        (star.rotation || 0) +
        (star.rotationSpeed || 0) *
        deltaTime;
}

function drawGlow(
    ctx,
    x,
    y,
    radius,
    color,
    strength = 1
) {
    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            radius * 0.15,
            x,
            y,
            radius * 3.5
        );

    gradient.addColorStop(
        0,
        color
    );

    gradient.addColorStop(
        0.25,
        color
    );

    gradient.addColorStop(
        0.6,
        "rgba(255,255,255,0.08)"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.save();

    ctx.globalAlpha =
        0.35 * strength;

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius * 3.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

export function drawStar(
    ctx,
    star,
    camera = null
) {
    if (!ctx || !star) return;

    let screenX = star.x;
    let screenY = star.y;

    let scale = 1;

    if (camera) {
        const screen =
            camera.worldToScreen(
                star.x,
                star.y
            );

        screenX = screen.x;
        screenY = screen.y;

        scale = camera.zoom || 1;
    }

    const radius =
        Math.max(
            2,
            star.radius * scale
        );

    const isHypergiant =
        star.type === "blueHypergiant";

    const glowColor =
        isHypergiant
            ? "rgba(80,180,255,0.8)"
            : "rgba(255,210,80,0.8)";

    drawGlow(
        ctx,
        screenX,
        screenY,
        radius,
        glowColor,
        star.glow || 1
    );

    const surfaceGradient =
        ctx.createRadialGradient(
            screenX - radius * 0.3,
            screenY - radius * 0.3,
            radius * 0.05,
            screenX,
            screenY,
            radius
        );

    if (isHypergiant) {
        surfaceGradient.addColorStop(
            0,
            "#ffffff"
        );

        surfaceGradient.addColorStop(
            0.35,
            "#bfeaff"
        );

        surfaceGradient.addColorStop(
            0.75,
            "#62bfff"
        );

        surfaceGradient.addColorStop(
            1,
            "#2479c9"
        );
    } else {
        surfaceGradient.addColorStop(
            0,
            "#ffffff"
        );

        surfaceGradient.addColorStop(
            0.35,
            "#fff7c7"
        );

        surfaceGradient.addColorStop(
            0.75,
            "#ffd75c"
        );

        surfaceGradient.addColorStop(
            1,
            "#e87918"
        );
    }

    ctx.save();

    ctx.fillStyle =
        surfaceGradient;

    ctx.beginPath();

    ctx.arc(
        screenX,
        screenY,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

    drawCorona(
        ctx,
        screenX,
        screenY,
        radius,
        isHypergiant
    );
}

function drawCorona(
    ctx,
    x,
    y,
    radius,
    hypergiant
) {
    ctx.save();

    ctx.globalAlpha = 0.28;

    ctx.strokeStyle =
        hypergiant
            ? "#9bdcff"
            : "#ffe89a";

    ctx.lineWidth =
        Math.max(1, radius * 0.035);

    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius * (1 + i * 0.18),
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }

    ctx.restore();
}

export function createContactBinary(
    x = 0,
    y = 0,
    options = {}
) {
    const separation =
        options.separation || 55;

    const primaryRadius =
        options.primaryRadius || 50;

    const secondaryRadius =
        options.secondaryRadius || 42;

    return {
        type: "contact-binary",
        name: "Contact Binary",

        x,
        y,

        radius:
            separation / 2 +
            Math.max(
                primaryRadius,
                secondaryRadius
            ),

        mass:
            (options.primaryMass || 5000) +
            (options.secondaryMass || 4500),

        velocity: {
            x: options.velocityX || 0,
            y: options.velocityY || 0
        },

        primary: {
            x: -separation / 2,
            y: 0,
            radius: primaryRadius,
            mass: options.primaryMass || 5000,
            color: "#fff2ad"
        },

        secondary: {
            x: separation / 2,
            y: 0,
            radius: secondaryRadius,
            mass: options.secondaryMass || 4500,
            color: "#ffbf6b"
        },

        separation,

        rotation: 0,

        angularSpeed:
            options.angularSpeed || 0.012,

        pulse: 0,

        static:
            options.static === true,

        destroyed: false
    };
}

export function updateContactBinary(
    binary,
    deltaTime = 1
) {
    if (!binary || binary.destroyed) return;

    binary.rotation =
        (binary.rotation || 0) +
        binary.angularSpeed *
        deltaTime;

    binary.pulse +=
        0.02 * deltaTime;
}

export function drawContactBinary(
    ctx,
    binary,
    camera = null
) {
    if (!ctx || !binary) return;

    let centerX = binary.x;
    let centerY = binary.y;
    let scale = 1;

    if (camera) {
        const screen =
            camera.worldToScreen(
                binary.x,
                binary.y
            );

        centerX = screen.x;
        centerY = screen.y;

        scale = camera.zoom || 1;
    }

    const angle =
        binary.rotation || 0;

    const distance =
        binary.separation * 0.5 * scale;

    const primaryX =
        centerX +
        Math.cos(angle) *
        distance;

    const primaryY =
        centerY +
        Math.sin(angle) *
        distance;

    const secondaryX =
        centerX -
        Math.cos(angle) *
        distance;

    const secondaryY =
        centerY -
        Math.sin(angle) *
        distance;

    drawGlow(
        ctx,
        centerX,
        centerY,
        Math.max(
            binary.primary.radius,
            binary.secondary.radius
        ) * scale,
        "rgba(255,190,80,0.7)",
        1
    );

    drawBinaryStar(
        ctx,
        primaryX,
        primaryY,
        binary.primary.radius * scale,
        binary.primary.color
    );

    drawBinaryStar(
        ctx,
        secondaryX,
        secondaryY,
        binary.secondary.radius * scale,
        binary.secondary.color
    );
}

function drawBinaryStar(
    ctx,
    x,
    y,
    radius,
    color
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
        "#ffffff"
    );

    gradient.addColorStop(
        0.4,
        color
    );

    gradient.addColorStop(
        1,
        "#d86f18"
    );

    ctx.save();

    ctx.fillStyle = gradient;

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

export function updateStarObject(
    object,
    deltaTime = 1
) {
    if (!object) return;

    if (
        object.type === "contact-binary"
    ) {
        updateContactBinary(
            object,
            deltaTime
        );

        return;
    }

    updateStar(
        object,
        deltaTime
    );
}

export function drawStarObject(
    ctx,
    object,
    camera = null
) {
    if (!object) return;

    if (
        object.type === "contact-binary"
    ) {
        drawContactBinary(
            ctx,
            object,
            camera
        );

        return;
    }

    drawStar(
        ctx,
        object,
        camera
    );
}
