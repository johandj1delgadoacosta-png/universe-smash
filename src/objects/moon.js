// ============================================
// UNIVERSE SMASH
// Moon Object
// Safe, finite-value version
// ============================================

function finite(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
}

function positive(value, fallback = 1) {
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// --------------------------------------------
// CREATE MOON
// --------------------------------------------

export function createMoon(options = {}) {
    const moon = {
        type: "moon",

        x: finite(options.x, 0),
        y: finite(options.y, 0),

        radius: positive(options.radius, 18),
        mass: positive(options.mass, 1),

        vx: finite(options.vx, 0),
        vy: finite(options.vy, 0),

        rotation: finite(options.rotation, 0),
        rotationSpeed: finite(options.rotationSpeed, 0.002),

        parent: options.parent || null,

        orbitRadius: positive(options.orbitRadius, 100),
        orbitAngle: finite(options.orbitAngle, 0),
        orbitSpeed: finite(options.orbitSpeed, 0.01),

        color: options.color || "#aeb4bd",
        darkColor: options.darkColor || "#555b66",
        lightColor: options.lightColor || "#d8dce2",

        craters: Array.isArray(options.craters)
            ? options.craters
            : createDefaultCraters(),

        destroyed: false
    };

    sanitizeMoon(moon);

    return moon;
}

// --------------------------------------------
// DEFAULT CRATERS
// --------------------------------------------

function createDefaultCraters() {
    return [
        { x: -0.30, y: -0.20, r: 0.12 },
        { x: 0.20, y: -0.28, r: 0.08 },
        { x: 0.35, y: 0.12, r: 0.14 },
        { x: -0.18, y: 0.30, r: 0.09 },
        { x: 0.02, y: 0.05, r: 0.06 },
        { x: -0.42, y: 0.15, r: 0.06 }
    ];
}

// --------------------------------------------
// SANITIZE
// --------------------------------------------

function sanitizeMoon(moon) {
    if (!moon) return;

    moon.x = finite(moon.x, 0);
    moon.y = finite(moon.y, 0);

    moon.vx = finite(moon.vx, 0);
    moon.vy = finite(moon.vy, 0);

    moon.radius = positive(moon.radius, 18);
    moon.mass = positive(moon.mass, 1);

    moon.rotation = finite(moon.rotation, 0);
    moon.rotationSpeed = finite(moon.rotationSpeed, 0);

    moon.orbitRadius = positive(moon.orbitRadius, 100);
    moon.orbitAngle = finite(moon.orbitAngle, 0);
    moon.orbitSpeed = finite(moon.orbitSpeed, 0);

    // Prevent absurd values from entering canvas calculations.
    moon.x = clamp(moon.x, -1e9, 1e9);
    moon.y = clamp(moon.y, -1e9, 1e9);

    moon.vx = clamp(moon.vx, -1e6, 1e6);
    moon.vy = clamp(moon.vy, -1e6, 1e6);

    moon.radius = clamp(moon.radius, 1, 1e6);
    moon.mass = clamp(moon.mass, 0.000001, 1e12);
}

// --------------------------------------------
// UPDATE MOON
// --------------------------------------------

export function updateMoon(moon, deltaTime = 16) {
    if (!moon || moon.destroyed) return moon;

    sanitizeMoon(moon);

    const dt = clamp(
        finite(deltaTime, 16) / 1000,
        0,
        0.1
    );

    // ----------------------------------------
    // ORBIT AROUND PARENT
    // ----------------------------------------

    if (moon.parent && !moon.parent.destroyed) {
        const parentX = finite(moon.parent.x, 0);
        const parentY = finite(moon.parent.y, 0);

        moon.orbitRadius = positive(moon.orbitRadius, 100);
        moon.orbitAngle = finite(moon.orbitAngle, 0);

        moon.orbitAngle += moon.orbitSpeed * dt;

        if (!Number.isFinite(moon.orbitAngle)) {
            moon.orbitAngle = 0;
        }

        moon.x =
            parentX +
            Math.cos(moon.orbitAngle) * moon.orbitRadius;

        moon.y =
            parentY +
            Math.sin(moon.orbitAngle) * moon.orbitRadius;

        // Orbital velocity approximation.
        moon.vx =
            -Math.sin(moon.orbitAngle) *
            moon.orbitRadius *
            moon.orbitSpeed;

        moon.vy =
            Math.cos(moon.orbitAngle) *
            moon.orbitRadius *
            moon.orbitSpeed;
    } else {
        // ------------------------------------
        // FREE MOTION
        // ------------------------------------

        moon.x += moon.vx * dt;
        moon.y += moon.vy * dt;

        moon.rotation += moon.rotationSpeed * dt;
    }

    sanitizeMoon(moon);

    return moon;
}

// --------------------------------------------
// DRAW MOON
// --------------------------------------------

export function drawMoon(ctx, moon, camera = null) {
    if (!ctx || !moon || moon.destroyed) return;

    sanitizeMoon(moon);

    let x = moon.x;
    let y = moon.y;
    let radius = moon.radius;

    // Camera conversion.
    if (
        camera &&
        typeof camera.worldToScreen === "function"
    ) {
        const screen = camera.worldToScreen(x, y);

        if (
            screen &&
            Number.isFinite(screen.x) &&
            Number.isFinite(screen.y)
        ) {
            x = screen.x;
            y = screen.y;
        }
    }

    // Final safety check.
    if (
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        !Number.isFinite(radius) ||
        radius <= 0
    ) {
        return;
    }

    // Don't attempt to render absurdly large objects.
    radius = clamp(radius, 1, 100000);

    ctx.save();

    try {
        // ------------------------------------
        // ROTATION
        // ------------------------------------

        ctx.translate(x, y);

        const rotation = finite(moon.rotation, 0);

        ctx.rotate(rotation);

        // ------------------------------------
        // ATMOSPHERE / GLOW
        // ------------------------------------

        if (radius > 2) {
            const glowRadius = radius * 1.15;

            if (Number.isFinite(glowRadius)) {
                const glow = ctx.createRadialGradient(
                    0,
                    0,
                    Math.max(0.01, radius * 0.25),
                    0,
                    0,
                    glowRadius
                );

                glow.addColorStop(0, "rgba(220,225,235,0.16)");
                glow.addColorStop(1, "rgba(120,130,150,0)");

                ctx.fillStyle = glow;

                ctx.beginPath();
                ctx.arc(
                    0,
                    0,
                    glowRadius,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }

        // ------------------------------------
        // MOON BODY
        // ------------------------------------

        const innerRadius = Math.max(0.01, radius * 0.1);

        const gradient = ctx.createRadialGradient(
            -radius * 0.35,
            -radius * 0.35,
            innerRadius,
            0,
            0,
            radius
        );

        gradient.addColorStop(
            0,
            moon.lightColor || "#d8dce2"
        );

        gradient.addColorStop(
            0.45,
            moon.color || "#aeb4bd"
        );

        gradient.addColorStop(
            1,
            moon.darkColor || "#555b66"
        );

        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(
            0,
            0,
            radius,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // ------------------------------------
        // CRATERS
        // ------------------------------------

        if (Array.isArray(moon.craters)) {
            for (const crater of moon.craters) {
                if (!crater) continue;

                const cx = finite(crater.x, 0) * radius;
                const cy = finite(crater.y, 0) * radius;

                const craterRadius =
                    Math.max(
                        0.5,
                        Math.abs(finite(crater.r, 0.05)) * radius
                    );

                if (
                    !Number.isFinite(cx) ||
                    !Number.isFinite(cy) ||
                    !Number.isFinite(craterRadius)
                ) {
                    continue;
                }

                // Keep crater inside moon.
                const distance = Math.sqrt(
                    cx * cx + cy * cy
                );

                if (distance + craterRadius > radius) {
                    continue;
                }

                ctx.fillStyle = "rgba(50,55,65,0.30)";

                ctx.beginPath();

                ctx.arc(
                    cx,
                    cy,
                    craterRadius,
                    0,
                    Math.PI * 2
                );

                ctx.fill();

                ctx.strokeStyle =
                    "rgba(230,235,240,0.12)";

                ctx.lineWidth =
                    Math.max(0.5, radius * 0.012);

                ctx.stroke();
            }
        }

        // ------------------------------------
        // LIGHT SIDE
        // ------------------------------------

        ctx.fillStyle =
            "rgba(255,255,255,0.10)";

        ctx.beginPath();

        ctx.arc(
            -radius * 0.25,
            -radius * 0.28,
            radius * 0.72,
            Math.PI * 1.05,
            Math.PI * 1.85
        );

        ctx.fill();

        // ------------------------------------
        // OUTLINE
        // ------------------------------------

        ctx.strokeStyle =
            "rgba(255,255,255,0.25)";

        ctx.lineWidth =
            Math.max(0.7, radius * 0.018);

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            radius,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    } catch (error) {
        // Never let one broken celestial body
        // destroy the entire render loop.
        console.warn(
            "Universe Smash: Moon draw skipped.",
            error
        );
    }

    ctx.restore();
}

// --------------------------------------------
// TYPE CHECK
// --------------------------------------------

export function isMoon(object) {
    return !!object && object.type === "moon";
}

// --------------------------------------------
// PARENTING
// --------------------------------------------

export function setMoonParent(
    moon,
    parent,
    orbitRadius = 100
) {
    if (!moon) return;

    moon.parent = parent || null;

    moon.orbitRadius =
        positive(orbitRadius, 100);

    if (parent) {
        moon.orbitAngle =
            Math.atan2(
                finite(moon.y, 0) -
                    finite(parent.y, 0),
                finite(moon.x, 0) -
                    finite(parent.x, 0)
            );

        if (!Number.isFinite(moon.orbitAngle)) {
            moon.orbitAngle = 0;
        }
    }

    sanitizeMoon(moon);
}

// --------------------------------------------
// REMOVE PARENT
// --------------------------------------------

export function removeMoonParent(moon) {
    if (!moon) return;

    moon.parent = null;

    sanitizeMoon(moon);
}

// --------------------------------------------
// MASS
// --------------------------------------------

export function getMoonMass(moon) {
    if (!moon) return 0;

    return positive(moon.mass, 1);
}

// --------------------------------------------
// RADIUS
// --------------------------------------------

export function getMoonRadius(moon) {
    if (!moon) return 0;

    return positive(moon.radius, 18);
}

// --------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------

export default {
    createMoon,
    updateMoon,
    drawMoon,
    isMoon,
    setMoonParent,
    removeMoonParent,
    getMoonMass,
    getMoonRadius
};
