// Universe Smash - Star Objects
// Safe, finite-value star system objects

function finite(value, fallback = 0) {
    return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function positive(value, fallback = 10) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

function safeColor(value, fallback) {
    return typeof value === "string" && value.length > 0
        ? value
        : fallback;
}

export function createStar(options = {}) {
    const star = {
        type: "star",

        x: finite(options.x, 0),
        y: finite(options.y, 0),

        radius: positive(options.radius, 35),
        mass: positive(options.mass, 1000),

        vx: finite(options.vx, 0),
        vy: finite(options.vy, 0),

        rotation: finite(options.rotation, 0),
        rotationSpeed: finite(options.rotationSpeed, 0.002),

        temperature: positive(options.temperature, 5778),

        color: safeColor(options.color, "#fff4c2"),
        coreColor: safeColor(options.coreColor, "#ffffff"),
        glowColor: safeColor(options.glowColor, "#ffcc66"),

        static: Boolean(options.static),

        pulse: finite(options.pulse, 0),
        pulseSpeed: finite(options.pulseSpeed, 0.003)
    };

    return star;
}

export function createBlueHypergiant(options = {}) {
    return {
        ...createStar({
            ...options,
            radius: positive(options.radius, 75),
            mass: positive(options.mass, 50000),
            temperature: positive(options.temperature, 30000),
            color: "#8fc7ff",
            coreColor: "#ffffff",
            glowColor: "#4da6ff"
        }),

        type: "blueHypergiant"
    };
}

export function createContactBinary(options = {}) {
    const x = finite(options.x, 0);
    const y = finite(options.y, 0);

    const radius = positive(options.radius, 45);

    return {
        type: "contact-binary",

        x,
        y,

        radius,
        mass: positive(options.mass, 3000),

        vx: finite(options.vx, 0),
        vy: finite(options.vy, 0),

        rotation: finite(options.rotation, 0),
        rotationSpeed: finite(options.rotationSpeed, 0.01),

        orbitAngle: finite(options.orbitAngle, 0),
        orbitSpeed: finite(options.orbitSpeed, 0.02),

        separation: positive(options.separation, radius * 0.75),

        colorA: "#fff0a8",
        colorB: "#8fbfff",

        static: Boolean(options.static)
    };
}

export function updateStar(star, deltaTime = 16) {
    if (!star || typeof star !== "object") return;

    const dt = Math.min(Math.max(finite(deltaTime, 16), 0), 100);

    star.x = finite(star.x, 0);
    star.y = finite(star.y, 0);
    star.radius = positive(star.radius, 35);
    star.mass = positive(star.mass, 1000);

    star.vx = finite(star.vx, 0);
    star.vy = finite(star.vy, 0);

    star.rotation = finite(star.rotation, 0);
    star.rotationSpeed = finite(star.rotationSpeed, 0.002);

    star.pulse = finite(star.pulse, 0);
    star.pulseSpeed = finite(star.pulseSpeed, 0.003);

    if (!star.static) {
        star.x += star.vx * (dt / 16);
        star.y += star.vy * (dt / 16);
    }

    star.rotation += star.rotationSpeed * dt;
    star.pulse += star.pulseSpeed * dt;

    star.x = finite(star.x, 0);
    star.y = finite(star.y, 0);
}

export function updateContactBinary(binary, deltaTime = 16) {
    if (!binary || typeof binary !== "object") return;

    const dt = Math.min(Math.max(finite(deltaTime, 16), 0), 100);

    binary.x = finite(binary.x, 0);
    binary.y = finite(binary.y, 0);

    binary.radius = positive(binary.radius, 45);
    binary.mass = positive(binary.mass, 3000);

    binary.vx = finite(binary.vx, 0);
    binary.vy = finite(binary.vy, 0);

    binary.orbitAngle = finite(binary.orbitAngle, 0);
    binary.orbitSpeed = finite(binary.orbitSpeed, 0.02);

    binary.separation = positive(
        binary.separation,
        binary.radius * 0.75
    );

    if (!binary.static) {
        binary.x += binary.vx * (dt / 16);
        binary.y += binary.vy * (dt / 16);
    }

    binary.orbitAngle += binary.orbitSpeed * dt;

    binary.x = finite(binary.x, 0);
    binary.y = finite(binary.y, 0);
}

function drawGlow(ctx, x, y, radius, inner, outer) {
    if (!ctx) return;

    x = finite(x, 0);
    y = finite(y, 0);
    radius = positive(radius, 10);

    try {
        const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius * 2.5
        );

        gradient.addColorStop(0, inner);
        gradient.addColorStop(0.35, outer);
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
    } catch (error) {
        // Never allow a drawing error to destroy the game loop.
        ctx.fillStyle = outer;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawStar(ctx, star) {
    if (!ctx || !star) return;

    const x = finite(star.x, 0);
    const y = finite(star.y, 0);
    const radius = positive(star.radius, 35);

    const color = safeColor(star.color, "#fff4c2");
    const coreColor = safeColor(star.coreColor, "#ffffff");
    const glowColor = safeColor(star.glowColor, "#ffcc66");

    drawGlow(
        ctx,
        x,
        y,
        radius,
        "rgba(255,255,255,0.9)",
        glowColor
    );

    try {
        const gradient = ctx.createRadialGradient(
            x - radius * 0.3,
            y - radius * 0.3,
            radius * 0.05,
            x,
            y,
            radius
        );

        gradient.addColorStop(0, coreColor);
        gradient.addColorStop(0.35, color);
        gradient.addColorStop(1, glowColor);

        ctx.fillStyle = gradient;
    } catch {
        ctx.fillStyle = color;
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Bright core
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.beginPath();
    ctx.arc(
        x - radius * 0.25,
        y - radius * 0.25,
        radius * 0.25,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

export function drawContactBinary(ctx, binary) {
    if (!ctx || !binary) return;

    const x = finite(binary.x, 0);
    const y = finite(binary.y, 0);
    const radius = positive(binary.radius, 45);
    const separation = positive(binary.separation, radius * 0.75);
    const angle = finite(binary.orbitAngle, 0);

    const ax = x + Math.cos(angle) * separation;
    const ay = y + Math.sin(angle) * separation;

    const bx = x - Math.cos(angle) * separation;
    const by = y - Math.sin(angle) * separation;

    drawGlow(
        ctx,
        x,
        y,
        radius,
        "rgba(255,255,255,0.8)",
        "rgba(100,160,255,0.4)"
    );

    ctx.fillStyle = "#fff0a8";
    ctx.beginPath();
    ctx.arc(ax, ay, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8fbfff";
    ctx.beginPath();
    ctx.arc(bx, by, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(
        ax - radius * 0.25,
        ay - radius * 0.25,
        radius * 0.22,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
        bx - radius * 0.25,
        by - radius * 0.25,
        radius * 0.22,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

export function updateStarObject(object, deltaTime = 16) {
    if (!object) return;

    if (object.type === "contact-binary") {
        updateContactBinary(object, deltaTime);
    } else {
        updateStar(object, deltaTime);
    }
}

export function drawStarObject(ctx, object) {
    if (!object) return;

    if (object.type === "contact-binary") {
        drawContactBinary(ctx, object);
    } else {
        drawStar(ctx, object);
    }
}
