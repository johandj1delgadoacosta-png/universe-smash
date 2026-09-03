// Universe Smash - Star Objects
// Stable stars, blue hypergiants, and contact binary stars.
// All drawing values are protected against NaN / Infinity.

function finite(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
}

function positive(value, fallback = 1) {
    const n = Number(value);

    if (!Number.isFinite(n) || n <= 0) {
        return fallback;
    }

    return n;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function safeContext(ctx) {
    return (
        ctx &&
        typeof ctx.beginPath === "function" &&
        typeof ctx.arc === "function"
    );
}

/* ---------------------------------------------------------
   STAR CREATION
--------------------------------------------------------- */

function createStar(options = {}) {
    const star = {
        type: "star",

        x: finite(options.x, 0),
        y: finite(options.y, 0),

        radius: positive(options.radius, 35),

        mass: positive(options.mass, 100000),

        vx: finite(options.vx, 0),
        vy: finite(options.vy, 0),

        rotation: finite(options.rotation, 0),
        rotationSpeed: finite(options.rotationSpeed, 0.001),

        temperature: positive(options.temperature, 5800),

        color: options.color || "#fff4d6",
        coreColor: options.coreColor || "#ffffff",

        glow: positive(options.glow, 1),

        static: options.static === true,

        pulse: finite(options.pulse, 0),
        pulseSpeed: finite(options.pulseSpeed, 0.002),

        name: options.name || "Star"
    };

    return sanitizeStar(star);
}

/* ---------------------------------------------------------
   BLUE HYPERGIANT
--------------------------------------------------------- */

function createBlueHypergiant(options = {}) {
    const star = createStar({
        ...options,

        type: "blueHypergiant",

        radius: positive(options.radius, 70),

        mass: positive(options.mass, 500000),

        temperature: positive(options.temperature, 30000),

        color: options.color || "#9fd7ff",

        coreColor: options.coreColor || "#eaf7ff",

        glow: positive(options.glow, 2.5),

        name: options.name || "Blue Hypergiant"
    });

    star.type = "blueHypergiant";

    return sanitizeStar(star);
}

/* ---------------------------------------------------------
   CONTACT BINARY
--------------------------------------------------------- */

function createContactBinary(options = {}) {
    const radius = positive(options.radius, 45);

    const binary = {
        type: "contact-binary",

        x: finite(options.x, 0),
        y: finite(options.y, 0),

        radius,

        mass: positive(options.mass, 700000),

        vx: finite(options.vx, 0),
        vy: finite(options.vy, 0),

        rotation: finite(options.rotation, 0),

        rotationSpeed: finite(
            options.rotationSpeed,
            0.003
        ),

        orbitAngle: finite(options.orbitAngle, 0),

        orbitSpeed: finite(
            options.orbitSpeed,
            0.01
        ),

        starRadius: radius * 0.72,

        colorA: options.colorA || "#fff2c7",
        colorB: options.colorB || "#ffd27a",

        coreA: options.coreA || "#ffffff",
        coreB: options.coreB || "#fff3c4",

        glow: positive(options.glow, 1.8),

        static: options.static === true,

        pulse: finite(options.pulse, 0),

        pulseSpeed: finite(
            options.pulseSpeed,
            0.003
        ),

        name: options.name || "Contact Binary"
    };

    return sanitizeStar(binary);
}

/* ---------------------------------------------------------
   SANITIZATION
--------------------------------------------------------- */

function sanitizeStar(star) {
    if (!star) {
        return null;
    }

    star.x = finite(star.x, 0);
    star.y = finite(star.y, 0);

    star.radius = positive(star.radius, 10);

    star.mass = positive(star.mass, 1);

    star.vx = finite(star.vx, 0);
    star.vy = finite(star.vy, 0);

    star.rotation = finite(star.rotation, 0);
    star.rotationSpeed = finite(
        star.rotationSpeed,
        0
    );

    star.temperature = positive(
        star.temperature,
        5800
    );

    star.glow = positive(
        star.glow,
        1
    );

    star.pulse = finite(
        star.pulse,
        0
    );

    star.pulseSpeed = finite(
        star.pulseSpeed,
        0.002
    );

    return star;
}

/* ---------------------------------------------------------
   UPDATE STAR
--------------------------------------------------------- */

function updateStar(star, deltaTime = 1 / 60) {
    if (!star) return;

    sanitizeStar(star);

    const dt = clamp(
        finite(deltaTime, 1 / 60),
        0,
        0.1
    );

    if (!star.static) {
        star.x += finite(star.vx) * dt;
        star.y += finite(star.vy) * dt;
    }

    star.rotation +=
        finite(star.rotationSpeed) * dt;

    star.pulse +=
        finite(star.pulseSpeed) * dt;

    sanitizeStar(star);
}

/* ---------------------------------------------------------
   UPDATE CONTACT BINARY
--------------------------------------------------------- */

function updateContactBinary(
    binary,
    deltaTime = 1 / 60
) {
    if (!binary) return;

    sanitizeStar(binary);

    const dt = clamp(
        finite(deltaTime, 1 / 60),
        0,
        0.1
    );

    if (!binary.static) {
        binary.x += finite(binary.vx) * dt;
        binary.y += finite(binary.vy) * dt;
    }

    binary.rotation +=
        finite(binary.rotationSpeed) * dt;

    binary.orbitAngle +=
        finite(binary.orbitSpeed) * dt;

    binary.pulse +=
        finite(binary.pulseSpeed) * dt;

    sanitizeStar(binary);
}

/* ---------------------------------------------------------
   SAFE GRADIENT
--------------------------------------------------------- */

function createSafeRadialGradient(
    ctx,
    x,
    y,
    innerRadius,
    outerRadius,
    innerColor,
    outerColor
) {
    if (!ctx || typeof ctx.createRadialGradient !== "function") {
        return null;
    }

    x = finite(x, 0);
    y = finite(y, 0);

    innerRadius = Math.max(
        0.1,
        positive(innerRadius, 1)
    );

    outerRadius = Math.max(
        innerRadius + 0.1,
        positive(outerRadius, innerRadius + 1)
    );

    try {
        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                innerRadius,
                x,
                y,
                outerRadius
            );

        gradient.addColorStop(
            0,
            innerColor
        );

        gradient.addColorStop(
            1,
            outerColor
        );

        return gradient;
    } catch (error) {
        console.warn(
            "Universe Smash: Star gradient skipped.",
            error
        );

        return null;
    }
}

/* ---------------------------------------------------------
   STAR GLOW
--------------------------------------------------------- */

function drawGlow(
    ctx,
    star,
    scale = 1
) {
    if (!safeContext(ctx) || !star) {
        return;
    }

    sanitizeStar(star);

    const x = finite(star.x, 0);
    const y = finite(star.y, 0);

    const radius = positive(
        star.radius,
        10
    );

    const glow = positive(
        star.glow,
        1
    );

    const safeScale = clamp(
        finite(scale, 1),
        0.05,
        100
    );

    const glowRadius =
        Math.max(
            radius * 1.5,
            radius * glow * 3
        ) * safeScale;

    if (!Number.isFinite(glowRadius)) {
        return;
    }

    const gradient =
        createSafeRadialGradient(
            ctx,
            x,
            y,
            radius * 0.1,
            glowRadius,
            star.coreColor || "#ffffff",
            "rgba(255,255,255,0)"
        );

    if (!gradient) {
        return;
    }

    ctx.save();

    ctx.globalCompositeOperation =
        "lighter";

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

/* ---------------------------------------------------------
   STAR BODY
--------------------------------------------------------- */

function drawStar(
    ctx,
    star,
    scale = 1
) {
    if (!safeContext(ctx) || !star) {
        return;
    }

    sanitizeStar(star);

    const x = finite(star.x, 0);
    const y = finite(star.y, 0);

    const radius = positive(
        star.radius,
        10
    );

    const safeScale = clamp(
        finite(scale, 1),
        0.05,
        100
    );

    const drawRadius =
        radius * safeScale;

    if (!Number.isFinite(drawRadius) ||
        drawRadius <= 0) {
        return;
    }

    drawGlow(
        ctx,
        star,
        safeScale
    );

    const gradient =
        createSafeRadialGradient(
            ctx,
            x - drawRadius * 0.25,
            y - drawRadius * 0.25,
            Math.max(
                0.1,
                drawRadius * 0.05
            ),
            Math.max(
                1,
                drawRadius
            ),
            star.coreColor || "#ffffff",
            star.color || "#fff4d6"
        );

    ctx.save();

    if (gradient) {
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle =
            star.color || "#fff4d6";
    }

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        drawRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Bright core.
    const coreRadius =
        Math.max(
            0.5,
            drawRadius * 0.3
        );

    ctx.fillStyle =
        star.coreColor || "#ffffff";

    ctx.globalAlpha = 0.8;

    ctx.beginPath();

    ctx.arc(
        x - drawRadius * 0.2,
        y - drawRadius * 0.2,
        coreRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Small star flare.
    ctx.globalAlpha = 0.35;

    ctx.strokeStyle =
        star.coreColor || "#ffffff";

    ctx.lineWidth =
        Math.max(
            0.5,
            drawRadius * 0.025
        );

    ctx.beginPath();

    ctx.moveTo(
        x - drawRadius * 1.5,
        y
    );

    ctx.lineTo(
        x + drawRadius * 1.5,
        y
    );

    ctx.moveTo(
        x,
        y - drawRadius * 1.5
    );

    ctx.lineTo(
        x,
        y + drawRadius * 1.5
    );

    ctx.stroke();

    ctx.restore();
}

/* ---------------------------------------------------------
   BLUE HYPERGIANT DRAW
--------------------------------------------------------- */

function drawBlueHypergiant(
    ctx,
    star,
    scale = 1
) {
    if (!safeContext(ctx) || !star) {
        return;
    }

    sanitizeStar(star);

    const x = finite(star.x, 0);
    const y = finite(star.y, 0);

    const radius = positive(
        star.radius,
        70
    );

    const safeScale = clamp(
        finite(scale, 1),
        0.05,
        100
    );

    const drawRadius =
        radius * safeScale;

    if (!Number.isFinite(drawRadius)) {
        return;
    }

    drawGlow(
        ctx,
        star,
        safeScale * 1.5
    );

    const gradient =
        createSafeRadialGradient(
            ctx,
            x - drawRadius * 0.2,
            y - drawRadius * 0.2,
            Math.max(
                0.1,
                drawRadius * 0.05
            ),
            Math.max(
                1,
                drawRadius
            ),
            "#ffffff",
            "#62b9ff"
        );

    ctx.save();

    ctx.fillStyle =
        gradient || "#62b9ff";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        drawRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Blue-white core.
    ctx.fillStyle = "#ffffff";

    ctx.globalAlpha = 0.75;

    ctx.beginPath();

    ctx.arc(
        x - drawRadius * 0.22,
        y - drawRadius * 0.22,
        Math.max(
            0.5,
            drawRadius * 0.35
        ),
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

/* ---------------------------------------------------------
   CONTACT BINARY DRAW
--------------------------------------------------------- */

function drawContactBinary(
    ctx,
    binary,
    scale = 1
) {
    if (!safeContext(ctx) || !binary) {
        return;
    }

    sanitizeStar(binary);

    const x = finite(binary.x, 0);
    const y = finite(binary.y, 0);

    const radius = positive(
        binary.radius,
        45
    );

    const safeScale = clamp(
        finite(scale, 1),
        0.05,
        100
    );

    const starRadius =
        Math.max(
            0.5,
            radius * 0.72 * safeScale
        );

    const separation =
        starRadius * 0.9;

    drawGlow(
        ctx,
        {
            ...binary,
            radius: radius * 1.3
        },
        safeScale
    );

    const angle =
        finite(binary.orbitAngle, 0);

    const ax =
        x + Math.cos(angle) * separation;

    const ay =
        y + Math.sin(angle) * separation;

    const bx =
        x - Math.cos(angle) * separation;

    const by =
        y - Math.sin(angle) * separation;

    const drawOneStar = (
        sx,
        sy,
        color,
        core
    ) => {
        if (!Number.isFinite(sx) ||
            !Number.isFinite(sy)) {
            return;
        }

        const gradient =
            createSafeRadialGradient(
                ctx,
                sx - starRadius * 0.2,
                sy - starRadius * 0.2,
                Math.max(
                    0.1,
                    starRadius * 0.05
                ),
                starRadius,
                core,
                color
            );

        ctx.fillStyle =
            gradient || color;

        ctx.beginPath();

        ctx.arc(
            sx,
            sy,
            starRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    };

    ctx.save();

    drawOneStar(
        ax,
        ay,
        binary.colorA || "#fff2c7",
        binary.coreA || "#ffffff"
    );

    drawOneStar(
        bx,
        by,
        binary.colorB || "#ffd27a",
        binary.coreB || "#fff3c4"
    );

    // Contact bridge.
    ctx.globalAlpha = 0.35;

    ctx.fillStyle =
        binary.colorA || "#fff2c7";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y,
        starRadius * 1.1,
        starRadius * 0.45,
        angle,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}

/* ---------------------------------------------------------
   GENERIC UPDATE
--------------------------------------------------------- */

function updateStarObject(
    object,
    deltaTime = 1 / 60
) {
    if (!object) return;

    if (object.type === "contact-binary") {
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

/* ---------------------------------------------------------
   GENERIC DRAW
--------------------------------------------------------- */

function drawStarObject(
    ctx,
    object,
    scale = 1
) {
    if (!object) return;

    if (object.type === "contact-binary") {
        drawContactBinary(
            ctx,
            object,
            scale
        );

        return;
    }

    if (
        object.type === "blueHypergiant" ||
        object.type === "blue-hypergiant"
    ) {
        drawBlueHypergiant(
            ctx,
            object,
            scale
        );

        return;
    }

    drawStar(
        ctx,
        object,
        scale
    );
}

/* ---------------------------------------------------------
   EXPORTS
--------------------------------------------------------- */

export {
    createStar,
    createBlueHypergiant,
    createContactBinary,

    updateStar,
    updateContactBinary,
    updateStarObject,

    drawStar,
    drawBlueHypergiant,
    drawContactBinary,
    drawStarObject,

    sanitizeStar
};

export default {
    createStar,
    createBlueHypergiant,
    createContactBinary,

    updateStar,
    updateContactBinary,
    updateStarObject,

    drawStar,
    drawBlueHypergiant,
    drawContactBinary,
    drawStarObject,

    sanitizeStar
};
