// ============================================================
// UNIVERSE SMASH - PLANET OBJECT
// ============================================================

function finite(value, fallback = 0) {
    return Number.isFinite(Number(value))
        ? Number(value)
        : fallback;
}


// ============================================================
// CREATE PLANET
// ============================================================

export function createPlanet(options = {}) {

    const planet = {

        type: "planet",

        x: finite(
            options.x,
            0
        ),

        y: finite(
            options.y,
            0
        ),

        radius: Math.max(
            5,
            finite(
                options.radius,
                80
            )
        ),

        mass: Math.max(
            1,
            finite(
                options.mass,
                1000
            )
        ),

        vx: finite(
            options.vx,
            0
        ),

        vy: finite(
            options.vy,
            0
        ),

        rotation: finite(
            options.rotation,
            0
        ),

        rotationSpeed: finite(
            options.rotationSpeed,
            0.15
        ),

        health: Math.max(
            1,
            finite(
                options.health,
                100
            )
        ),

        maxHealth: Math.max(
            1,
            finite(
                options.maxHealth,
                100
            )
        ),

        temperature: finite(
            options.temperature,
            288
        ),

        atmosphere:
            options.atmosphere !== false,

        rings:
            options.rings === true,

        color:
            options.color ||
            "#3d79b8",

        secondaryColor:
            options.secondaryColor ||
            "#6fa8dc",

        atmosphereColor:
            options.atmosphereColor ||
            "#65b7ff",

        ringColor:
            options.ringColor ||
            "#b7a98c",

        name:
            options.name ||
            "Planet",

        destroyed: false

    };

    return planet;
}


// ============================================================
// UPDATE PLANET
// ============================================================

export function updatePlanet(
    planet,
    deltaTime = 0.016
) {

    if (!planet) {
        return;
    }

    const dt = Math.max(
        0,
        Math.min(
            0.1,
            finite(deltaTime, 0.016)
        )
    );

    planet.x =
        finite(planet.x, 0) +
        finite(planet.vx, 0) * dt;

    planet.y =
        finite(planet.y, 0) +
        finite(planet.vy, 0) * dt;

    planet.rotation =
        finite(planet.rotation, 0) +
        finite(planet.rotationSpeed, 0) * dt;

    planet.vx =
        finite(planet.vx, 0);

    planet.vy =
        finite(planet.vy, 0);

    planet.radius =
        Math.max(
            5,
            finite(
                planet.radius,
                80
            )
        );

    planet.mass =
        Math.max(
            1,
            finite(
                planet.mass,
                1000
            )
        );

    planet.health =
        Math.max(
            0,
            finite(
                planet.health,
                100
            )
        );

    planet.maxHealth =
        Math.max(
            1,
            finite(
                planet.maxHealth,
                100
            )
        );
}


// ============================================================
// DRAW PLANET
// ============================================================

export function drawPlanet(
    ctx,
    planet
) {

    if (!ctx || !planet) {
        return;
    }

    // --------------------------------------------------------
    // SANITIZE ALL VALUES BEFORE CANVAS OPERATIONS
    // --------------------------------------------------------

    const x = finite(
        planet.x,
        ctx.canvas.width / 2
    );

    const y = finite(
        planet.y,
        ctx.canvas.height / 2
    );

    const radius = Math.max(
        5,
        finite(
            planet.radius,
            80
        )
    );

    const rotation = finite(
        planet.rotation,
        0
    );

    // --------------------------------------------------------
    // SAVE CANVAS STATE
    // --------------------------------------------------------

    ctx.save();

    // --------------------------------------------------------
    // RINGS
    // --------------------------------------------------------

    if (planet.rings === true) {

        ctx.save();

        ctx.translate(
            x,
            y
        );

        ctx.rotate(
            -0.25
        );

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            radius * 1.65,
            radius * 0.42,
            0,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            planet.ringColor ||
            "#b7a98c";

        ctx.globalAlpha = 0.65;

        ctx.lineWidth =
            Math.max(
                2,
                radius * 0.08
            );

        ctx.stroke();

        ctx.restore();
    }

    // --------------------------------------------------------
    // PLANET SHADOW / BASE
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        planet.color ||
        "#3d79b8";

    ctx.fill();

    // --------------------------------------------------------
    // PLANET GRADIENT
    // --------------------------------------------------------

    const gradient = ctx.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.40,
        Math.max(
            1,
            radius * 0.08
        ),

        x,
        y,
        radius
    );

    gradient.addColorStop(
        0,
        planet.secondaryColor ||
        "#8cc7ff"
    );

    gradient.addColorStop(
        0.45,
        planet.color ||
        "#3d79b8"
    );

    gradient.addColorStop(
        1,
        "#081321"
    );

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        gradient;

    ctx.fill();

    // --------------------------------------------------------
    // SURFACE DETAILS
    // --------------------------------------------------------

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.clip();

    const patchCount = 8;

    for (
        let i = 0;
        i < patchCount;
        i++
    ) {

        const angle =
            rotation +
            i * 2.399;

        const distance =
            radius * (
                0.25 +
                (i % 3) * 0.18
            );

        const px =
            x +
            Math.cos(angle) *
            distance;

        const py =
            y +
            Math.sin(angle) *
            distance;

        const patchRadius =
            radius *
            (0.08 + (i % 3) * 0.025);

        ctx.beginPath();

        ctx.arc(
            px,
            py,
            patchRadius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            i % 2 === 0
                ? "rgba(35,90,55,0.30)"
                : "rgba(210,220,170,0.18)";

        ctx.fill();
    }

    // --------------------------------------------------------
    // CLOUD BANDS
    // --------------------------------------------------------

    ctx.globalAlpha = 0.18;

    for (
        let i = -2;
        i <= 2;
        i++
    ) {

        const bandY =
            y +
            i * radius * 0.28;

        ctx.beginPath();

        ctx.ellipse(
            x,
            bandY,
            radius * 0.9,
            radius * 0.08,
            rotation * 0.15,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "#ffffff";

        ctx.fill();
    }

    ctx.restore();

    // --------------------------------------------------------
    // ATMOSPHERE
    // --------------------------------------------------------

    if (
        planet.atmosphere !== false
    ) {

        const atmosphereGradient =
            ctx.createRadialGradient(
                x,
                y,
                radius * 0.82,
                x,
                y,
                radius * 1.18
            );

        atmosphereGradient.addColorStop(
            0,
            "rgba(80,170,255,0)"
        );

        atmosphereGradient.addColorStop(
            0.72,
            "rgba(80,170,255,0.08)"
        );

        atmosphereGradient.addColorStop(
            1,
            "rgba(80,190,255,0.45)"
        );

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius * 1.16,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            atmosphereGradient;

        ctx.fill();
    }

    // --------------------------------------------------------
    // HIGHLIGHT
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        x - radius * 0.32,
        y - radius * 0.34,
        radius * 0.18,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.20)";

    ctx.fill();

    // --------------------------------------------------------
    // OUTLINE
    // --------------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle =
        "rgba(180,220,255,0.55)";

    ctx.lineWidth =
        Math.max(
            1,
            radius * 0.025
        );

    ctx.stroke();

    // --------------------------------------------------------
    // HEALTH INDICATOR
    // --------------------------------------------------------

    const maxHealth =
        Math.max(
            1,
            finite(
                planet.maxHealth,
                100
            )
        );

    const health =
        Math.max(
            0,
            Math.min(
                maxHealth,
                finite(
                    planet.health,
                    maxHealth
                )
            )
        );

    if (
        health < maxHealth
    ) {

        const healthRatio =
            health / maxHealth;

        const barWidth =
            radius * 1.5;

        const barHeight =
            Math.max(
                3,
                radius * 0.06
            );

        const barX =
            x - barWidth / 2;

        const barY =
            y +
            radius +
            12;

        ctx.fillStyle =
            "rgba(0,0,0,0.65)";

        ctx.fillRect(
            barX,
            barY,
            barWidth,
            barHeight
        );

        ctx.fillStyle =
            "#58ff88";

        ctx.fillRect(
            barX,
            barY,
            barWidth *
                healthRatio,
            barHeight
        );
    }

    ctx.restore();
}


// ============================================================
// PLANET CHECK
// ============================================================

export function isPlanet(body) {

    return !!body &&
        body.type === "planet";
}


// ============================================================
// DAMAGE
// ============================================================

export function damagePlanet(
    planet,
    amount = 10
) {

    if (!planet) {
        return;
    }

    const damage =
        Math.max(
            0,
            finite(amount, 10)
        );

    planet.health =
        Math.max(
            0,
            finite(
                planet.health,
                planet.maxHealth || 100
            ) - damage
        );

    if (
        planet.health <= 0
    ) {
        planet.destroyed = true;
    }
}


// ============================================================
// HEAL
// ============================================================

export function healPlanet(
    planet,
    amount = 10
) {

    if (!planet) {
        return;
    }

    const maxHealth =
        Math.max(
            1,
            finite(
                planet.maxHealth,
                100
            )
        );

    planet.health =
        Math.min(
            maxHealth,
            finite(
                planet.health,
                maxHealth
            ) +
            Math.max(
                0,
                finite(amount, 10)
            )
        );

    planet.destroyed = false;
}


// ============================================================
// VELOCITY
// ============================================================

export function setPlanetVelocity(
    planet,
    vx = 0,
    vy = 0
) {

    if (!planet) {
        return;
    }

    planet.vx =
        finite(vx, 0);

    planet.vy =
        finite(vy, 0);
}


// ============================================================
// HEALTH
// ============================================================

export function getPlanetHealth(
    planet
) {

    if (!planet) {
        return 0;
    }

    return Math.max(
        0,
        finite(
            planet.health,
            0
        )
    );
}


// ============================================================
// MASS
// ============================================================

export function getPlanetMass(
    planet
) {

    if (!planet) {
        return 0;
    }

    return Math.max(
        1,
        finite(
            planet.mass,
            1000
        )
    );
}
