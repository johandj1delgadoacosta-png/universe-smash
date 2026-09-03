// ============================================
// UNIVERSE SMASH
// Moon Object
// ============================================

export function createMoon(x = 0, y = 0, options = {}) {
    return {
        type: "moon",

        x,
        y,

        radius: options.radius ?? 12,
        mass: options.mass ?? 7.35e13,

        vx: options.vx ?? 0,
        vy: options.vy ?? 0,

        rotation: options.rotation ?? 0,
        rotationSpeed: options.rotationSpeed ?? 0.01,

        color: options.color ?? "#b8b8b8",
        secondaryColor:
            options.secondaryColor ?? "#666666",

        parent: options.parent ?? null,

        orbitRadius:
            options.orbitRadius ?? 100,

        orbitAngle:
            options.orbitAngle ?? 0,

        orbitSpeed:
            options.orbitSpeed ?? 0.01,

        destroyed: false,

        age: 0
    };
}


// ============================================
// UPDATE MOON
// ============================================

export function updateMoon(moon, deltaTime = 1) {
    if (!moon || moon.destroyed) {
        return;
    }

    moon.age += deltaTime;

    moon.rotation +=
        moon.rotationSpeed * deltaTime;

    // If the moon has a parent planet,
    // keep its orbital information updated.
    if (
        moon.parent &&
        !moon.parent.destroyed
    ) {
        moon.orbitAngle +=
            moon.orbitSpeed * deltaTime;

        moon.x =
            moon.parent.x +
            Math.cos(moon.orbitAngle) *
                moon.orbitRadius;

        moon.y =
            moon.parent.y +
            Math.sin(moon.orbitAngle) *
                moon.orbitRadius;
    } else {
        // Free-floating moon movement.
        moon.x +=
            moon.vx * deltaTime;

        moon.y +=
            moon.vy * deltaTime;
    }
}


// ============================================
// DRAW MOON
// ============================================

export function drawMoon(
    ctx,
    moon,
    camera = null
) {
    if (!ctx || !moon || moon.destroyed) {
        return;
    }

    let screenX = moon.x;
    let screenY = moon.y;
    let radius = moon.radius;

    if (camera) {
        if (
            typeof camera.worldToScreen ===
            "function"
        ) {
            const position =
                camera.worldToScreen(
                    moon.x,
                    moon.y
                );

            screenX = position.x;
            screenY = position.y;

            radius *= camera.zoom ?? 1;
        } else {
            const zoom =
                camera.zoom ?? 1;

            screenX =
                (moon.x - camera.x) *
                    zoom +
                ctx.canvas.width / 2;

            screenY =
                (moon.y - camera.y) *
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
    // Moon glow
    // ----------------------------------------

    const glow =
        ctx.createRadialGradient(
            screenX,
            screenY,
            radius * 0.5,
            screenX,
            screenY,
            radius * 1.5
        );

    glow.addColorStop(
        0,
        "rgba(220,220,220,0.16)"
    );

    glow.addColorStop(
        1,
        "rgba(220,220,220,0)"
    );

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
        screenX,
        screenY,
        radius * 1.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // ----------------------------------------
    // Moon surface
    // ----------------------------------------

    const moonGradient =
        ctx.createRadialGradient(
            screenX - radius * 0.3,
            screenY - radius * 0.35,
            radius * 0.05,
            screenX,
            screenY,
            radius
        );

    moonGradient.addColorStop(
        0,
        "#eeeeee"
    );

    moonGradient.addColorStop(
        0.45,
        moon.color
    );

    moonGradient.addColorStop(
        1,
        moon.secondaryColor
    );

    ctx.fillStyle = moonGradient;

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
    // Craters
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

    ctx.fillStyle =
        "rgba(50,50,50,0.22)";

    const craters = [
        {
            x: -0.35,
            y: -0.2,
            size: 0.18
        },
        {
            x: 0.25,
            y: -0.35,
            size: 0.12
        },
        {
            x: 0.35,
            y: 0.25,
            size: 0.2
        },
        {
            x: -0.2,
            y: 0.35,
            size: 0.1
        },
        {
            x: 0.02,
            y: 0.05,
            size: 0.08
        }
    ];

    for (const crater of craters) {
        ctx.beginPath();

        ctx.arc(
            screenX +
                crater.x * radius,
            screenY +
                crater.y * radius,
            crater.size * radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.restore();

    // ----------------------------------------
    // Moon outline
    // ----------------------------------------

    ctx.strokeStyle =
        "rgba(255,255,255,0.35)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.04
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
    // Highlight
    // ----------------------------------------

    ctx.fillStyle =
        "rgba(255,255,255,0.45)";

    ctx.beginPath();

    ctx.arc(
        screenX - radius * 0.32,
        screenY - radius * 0.3,
        radius * 0.09,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


// ============================================
// MOON TYPE CHECK
// ============================================

export function isMoon(object) {
    return (
        object &&
        object.type === "moon"
    );
}


// ============================================
// SET PARENT
// ============================================

export function setMoonParent(
    moon,
    parent,
    orbitRadius = 100
) {
    if (!moon) {
        return false;
    }

    moon.parent = parent ?? null;

    moon.orbitRadius =
        Math.max(
            1,
            orbitRadius
        );

    if (moon.parent) {
        moon.x =
            moon.parent.x +
            Math.cos(moon.orbitAngle) *
                moon.orbitRadius;

        moon.y =
            moon.parent.y +
            Math.sin(moon.orbitAngle) *
                moon.orbitRadius;
    }

    return true;
}


// ============================================
// REMOVE PARENT
// ============================================

export function removeMoonParent(moon) {
    if (!moon) {
        return false;
    }

    moon.parent = null;

    return true;
}


// ============================================
// GET MOON MASS
// ============================================

export function getMoonMass(moon) {
    if (!moon) {
        return 0;
    }

    return moon.mass ?? 0;
}


// ============================================
// GET MOON RADIUS
// ============================================

export function getMoonRadius(moon) {
    if (!moon) {
        return 0;
    }

    return moon.radius ?? 0;
}
