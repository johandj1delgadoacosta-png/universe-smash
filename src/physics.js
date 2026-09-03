// Universe Smash - Physics Engine
// Stable orbital physics, gravity, collisions, black holes,
// grey holes, and safe finite-value handling.

const G = 0.0008;
const MIN_DISTANCE = 8;
const MAX_ACCELERATION = 2.5;
const MAX_SPEED = 25;

const collisionCooldowns = new Map();

function finite(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
}

function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function distanceBetween(a, b) {
    if (!a || !b) return Infinity;

    const ax = finite(a.x);
    const ay = finite(a.y);
    const bx = finite(b.x);
    const by = finite(b.y);

    return Math.hypot(bx - ax, by - ay);
}

function getBodyRadius(body) {
    if (!body) return 1;

    const radius = safeNumber(
        body.radius ??
        body.size ??
        body.collisionRadius,
        1
    );

    return Math.max(0.1, radius);
}

function getBodyMass(body) {
    if (!body) return 1;

    if (Number.isFinite(body.mass)) {
        return Math.max(0.0001, body.mass);
    }

    switch (body.type) {
        case "star":
            return 100000;

        case "blueHypergiant":
        case "blue-hypergiant":
            return 500000;

        case "contact-binary":
            return 700000;

        case "black-hole":
            return 1000000;

        case "grey-hole":
            return 600000;

        case "planet":
            return 100;

        case "moon":
            return 10;

        case "asteroid":
            return 2;

        case "antimatter-planet":
            return 120;

        case "wormhole":
            return 500000;

        default:
            return 1;
    }
}

function isBodyStatic(body) {
    if (!body) return true;

    return (
        body.static === true ||
        body.isStatic === true ||
        body.type === "black-hole"
    );
}

function initializeBody(body) {
    if (!body) return;

    body.x = finite(body.x);
    body.y = finite(body.y);

    body.vx = finite(body.vx);
    body.vy = finite(body.vy);

    body.mass = Math.max(0.0001, getBodyMass(body));

    if (!Number.isFinite(body.radius)) {
        body.radius = 10;
    }

    if (!Number.isFinite(body.vx)) body.vx = 0;
    if (!Number.isFinite(body.vy)) body.vy = 0;
}

function clampVelocity(body) {
    if (!body) return;

    body.vx = finite(body.vx);
    body.vy = finite(body.vy);

    const speed = Math.hypot(body.vx, body.vy);

    if (!Number.isFinite(speed)) {
        body.vx = 0;
        body.vy = 0;
        return;
    }

    if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        body.vx *= scale;
        body.vy *= scale;
    }
}

function applyGravity(a, b, dt) {
    if (!a || !b || a === b) return;

    if (isBodyStatic(a) && isBodyStatic(b)) {
        return;
    }

    const dx = finite(b.x) - finite(a.x);
    const dy = finite(b.y) - finite(a.y);

    let distanceSquared = dx * dx + dy * dy;

    if (!Number.isFinite(distanceSquared)) return;

    distanceSquared = Math.max(
        MIN_DISTANCE * MIN_DISTANCE,
        distanceSquared
    );

    const distance = Math.sqrt(distanceSquared);

    if (!Number.isFinite(distance) || distance <= 0) {
        return;
    }

    const massA = getBodyMass(a);
    const massB = getBodyMass(b);

    const force = G * massA * massB / distanceSquared;

    if (!Number.isFinite(force)) return;

    let ax = force * dx / distance / massA;
    let ay = force * dy / distance / massA;

    let bx = force * dx / distance / massB;
    let by = force * dy / distance / massB;

    ax = Math.max(-MAX_ACCELERATION, Math.min(MAX_ACCELERATION, ax));
    ay = Math.max(-MAX_ACCELERATION, Math.min(MAX_ACCELERATION, ay));

    bx = Math.max(-MAX_ACCELERATION, Math.min(MAX_ACCELERATION, bx));
    by = Math.max(-MAX_ACCELERATION, Math.min(MAX_ACCELERATION, by));

    if (!isBodyStatic(a)) {
        a.vx += ax * dt;
        a.vy += ay * dt;
    }

    if (!isBodyStatic(b)) {
        b.vx -= bx * dt;
        b.vy -= by * dt;
    }
}

function applyBlackHoleEffect(body, hole, dt) {
    if (!body || !hole || body === hole) return;

    const dx = finite(hole.x) - finite(body.x);
    const dy = finite(hole.y) - finite(body.y);

    const distance = Math.hypot(dx, dy);

    if (!Number.isFinite(distance) || distance < 1) {
        return;
    }

    const influence =
        safeNumber(hole.influenceRadius, 800);

    if (distance > influence) {
        return;
    }

    const strength =
        safeNumber(hole.gravityStrength, 0.003);

    const falloff =
        Math.max(0.05, 1 - distance / influence);

    const force = strength * falloff;

    body.vx += (dx / distance) * force * dt;
    body.vy += (dy / distance) * force * dt;

    clampVelocity(body);
}

function applyGreyHoleEffect(body, hole, dt) {
    if (!body || !hole || body === hole) return;

    const dx = finite(hole.x) - finite(body.x);
    const dy = finite(hole.y) - finite(body.y);

    const distance = Math.hypot(dx, dy);

    if (!Number.isFinite(distance) || distance < 1) {
        return;
    }

    const influence =
        safeNumber(hole.influenceRadius, 500);

    if (distance > influence) {
        return;
    }

    const strength =
        safeNumber(hole.gravityStrength, 0.0015);

    const falloff =
        Math.max(0.05, 1 - distance / influence);

    const force = strength * falloff;

    body.vx += (dx / distance) * force * dt;
    body.vy += (dy / distance) * force * dt;

    clampVelocity(body);
}

function resolveCollision(a, b) {
    if (!a || !b || a === b) return;

    const dx = finite(b.x) - finite(a.x);
    const dy = finite(b.y) - finite(a.y);

    const distance = Math.hypot(dx, dy);

    if (!Number.isFinite(distance) || distance <= 0) {
        return;
    }

    const minDistance =
        getBodyRadius(a) +
        getBodyRadius(b);

    if (distance > minDistance) {
        return;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    const relativeVelocity =
        (finite(b.vx) - finite(a.vx)) * nx +
        (finite(b.vy) - finite(a.vy)) * ny;

    if (relativeVelocity > 0) {
        return;
    }

    const massA = getBodyMass(a);
    const massB = getBodyMass(b);

    const restitution = 0.55;

    const impulse =
        -(1 + restitution) *
        relativeVelocity /
        (1 / massA + 1 / massB);

    if (!Number.isFinite(impulse)) return;

    if (!isBodyStatic(a)) {
        a.vx -= impulse * nx / massA;
        a.vy -= impulse * ny / massA;
    }

    if (!isBodyStatic(b)) {
        b.vx += impulse * nx / massB;
        b.vy += impulse * ny / massB;
    }

    // Separate overlapping bodies.
    const overlap = minDistance - distance;

    if (overlap > 0) {
        const moveA = isBodyStatic(a)
            ? 0
            : overlap * (massB / (massA + massB));

        const moveB = isBodyStatic(b)
            ? 0
            : overlap * (massA / (massA + massB));

        if (!isBodyStatic(a)) {
            a.x -= nx * moveA;
            a.y -= ny * moveA;
        }

        if (!isBodyStatic(b)) {
            b.x += nx * moveB;
            b.y += ny * moveB;
        }
    }

    clampVelocity(a);
    clampVelocity(b);
}

function getPairKey(a, b) {
    if (!a || !b) return "";

    if (!a.__physicsId) {
        a.__physicsId =
            "body_" + Math.random().toString(36).slice(2);
    }

    if (!b.__physicsId) {
        b.__physicsId =
            "body_" + Math.random().toString(36).slice(2);
    }

    return a.__physicsId < b.__physicsId
        ? `${a.__physicsId}:${b.__physicsId}`
        : `${b.__physicsId}:${a.__physicsId}`;
}

function cleanupPhysicsState(now) {
    for (const [key, time] of collisionCooldowns.entries()) {
        if (now - time > 1000) {
            collisionCooldowns.delete(key);
        }
    }
}

function updatePhysics(objects, deltaTime = 1 / 60) {
    if (!Array.isArray(objects)) {
        return;
    }

    const dt = Math.min(
        0.05,
        Math.max(
            0,
            safeNumber(deltaTime, 1 / 60)
        )
    );

    const now = performance.now();

    // Make every object numerically safe first.
    for (const body of objects) {
        initializeBody(body);
    }

    // Gravity.
    for (let i = 0; i < objects.length; i++) {
        const a = objects[i];

        if (!a) continue;

        for (let j = i + 1; j < objects.length; j++) {
            const b = objects[j];

            if (!b) continue;

            applyGravity(a, b, dt);
        }
    }

    // Special cosmic-object effects.
    for (const body of objects) {
        if (!body || isBodyStatic(body)) continue;

        for (const object of objects) {
            if (!object || object === body) continue;

            if (object.type === "black-hole") {
                applyBlackHoleEffect(body, object, dt);
            }

            if (object.type === "grey-hole") {
                applyGreyHoleEffect(body, object, dt);
            }
        }
    }

    // Move bodies.
    for (const body of objects) {
        if (!body || isBodyStatic(body)) continue;

        body.x += finite(body.vx) * dt;
        body.y += finite(body.vy) * dt;

        body.rotation =
            finite(body.rotation) +
            finite(body.rotationSpeed) * dt;

        if (!Number.isFinite(body.x)) body.x = 0;
        if (!Number.isFinite(body.y)) body.y = 0;

        clampVelocity(body);
    }

    // Collision detection.
    for (let i = 0; i < objects.length; i++) {
        const a = objects[i];

        if (!a) continue;

        for (let j = i + 1; j < objects.length; j++) {
            const b = objects[j];

            if (!b) continue;

            const distance = distanceBetween(a, b);
            const collisionDistance =
                getBodyRadius(a) +
                getBodyRadius(b);

            if (
                Number.isFinite(distance) &&
                distance <= collisionDistance
            ) {
                const key = getPairKey(a, b);

                const previous =
                    collisionCooldowns.get(key) || 0;

                if (now - previous > 150) {
                    resolveCollision(a, b);
                    collisionCooldowns.set(key, now);
                }
            }
        }
    }

    cleanupPhysicsState(now);

    // Final safety pass.
    for (const body of objects) {
        if (!body) continue;

        if (!Number.isFinite(body.x)) body.x = 0;
        if (!Number.isFinite(body.y)) body.y = 0;
        if (!Number.isFinite(body.vx)) body.vx = 0;
        if (!Number.isFinite(body.vy)) body.vy = 0;

        clampVelocity(body);
    }
}

function addOrbitalVelocity(body, centerBody) {
    if (!body || !centerBody) return;

    const dx = finite(body.x) - finite(centerBody.x);
    const dy = finite(body.y) - finite(centerBody.y);

    const distance = Math.hypot(dx, dy);

    if (!Number.isFinite(distance) || distance < 1) {
        return;
    }

    const centerMass = getBodyMass(centerBody);

    const orbitalSpeed =
        Math.sqrt(
            Math.max(0, G * centerMass / distance)
        );

    if (!Number.isFinite(orbitalSpeed)) {
        return;
    }

    body.vx = -dy / distance * orbitalSpeed;
    body.vy = dx / distance * orbitalSpeed;

    clampVelocity(body);
}

function applyImpulse(body, impulseX, impulseY) {
    if (!body || isBodyStatic(body)) return;

    const mass = getBodyMass(body);

    const ix = safeNumber(impulseX);
    const iy = safeNumber(impulseY);

    body.vx += ix / mass;
    body.vy += iy / mass;

    clampVelocity(body);
}

function setVelocity(body, vx, vy) {
    if (!body) return;

    body.vx = safeNumber(vx);
    body.vy = safeNumber(vy);

    clampVelocity(body);
}

function resetPhysics() {
    collisionCooldowns.clear();
}

export {
    updatePhysics,
    addOrbitalVelocity,
    applyImpulse,
    setVelocity,
    distanceBetween,
    getBodyMass,
    getBodyRadius,
    isBodyStatic,
    resetPhysics
};

export default {
    updatePhysics,
    addOrbitalVelocity,
    applyImpulse,
    setVelocity,
    distanceBetween,
    getBodyMass,
    getBodyRadius,
    isBodyStatic,
    resetPhysics
};
