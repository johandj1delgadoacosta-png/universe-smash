// src/physics.js

const G = 0.00045;
const MIN_DISTANCE = 18;
const MAX_ACCELERATION = 0.08;
const MAX_SPEED = 12;
const SOFTENING = 120;

function getMass(body) {
    if (!body) return 1;

    if (Number.isFinite(body.mass)) {
        return Math.max(0.01, body.mass);
    }

    switch (body.type) {
        case "black-hole":
            return 100000;
        case "grey-hole":
            return 50000;
        case "star":
            return 5000;
        case "blue-hypergiant":
            return 15000;
        case "contact-binary":
            return 10000;
        case "planet":
            return 100;
        case "antimatter-planet":
            return 100;
        case "moon":
            return 10;
        case "asteroid":
            return 1;
        default:
            return 1;
    }
}

function getRadius(body) {
    if (!body) return 10;

    if (Number.isFinite(body.radius)) {
        return Math.max(1, body.radius);
    }

    return 10;
}

function ensureVelocity(body) {
    if (!body.velocity) {
        body.velocity = {
            x: 0,
            y: 0
        };
    }

    if (!Number.isFinite(body.velocity.x)) {
        body.velocity.x = 0;
    }

    if (!Number.isFinite(body.velocity.y)) {
        body.velocity.y = 0;
    }
}

function ensurePosition(body) {
    if (!Number.isFinite(body.x)) body.x = 0;
    if (!Number.isFinite(body.y)) body.y = 0;
}

function limitVector(vector, maxLength) {
    const length = Math.sqrt(
        vector.x * vector.x +
        vector.y * vector.y
    );

    if (length > maxLength && length > 0) {
        vector.x = (vector.x / length) * maxLength;
        vector.y = (vector.y / length) * maxLength;
    }
}

function isStatic(body) {
    return (
        body.static === true ||
        body.isStatic === true ||
        body.type === "black-hole"
    );
}

function calculateGravity(bodyA, bodyB) {
    const dx = bodyB.x - bodyA.x;
    const dy = bodyB.y - bodyA.y;

    const distanceSquared =
        dx * dx +
        dy * dy +
        SOFTENING;

    const distance = Math.sqrt(distanceSquared);

    if (distance < 0.0001) {
        return {
            x: 0,
            y: 0
        };
    }

    const massB = getMass(bodyB);

    let acceleration =
        (G * massB) /
        distanceSquared;

    if (acceleration > MAX_ACCELERATION) {
        acceleration = MAX_ACCELERATION;
    }

    return {
        x: (dx / distance) * acceleration,
        y: (dy / distance) * acceleration
    };
}

function applyGravity(objects, deltaTime) {
    for (let i = 0; i < objects.length; i++) {
        const body = objects[i];

        if (!body || body.destroyed) continue;

        ensurePosition(body);
        ensureVelocity(body);

        if (isStatic(body)) continue;

        let accelerationX = 0;
        let accelerationY = 0;

        for (let j = 0; j < objects.length; j++) {
            if (i === j) continue;

            const other = objects[j];

            if (!other || other.destroyed) continue;

            ensurePosition(other);

            const gravity = calculateGravity(body, other);

            accelerationX += gravity.x;
            accelerationY += gravity.y;
        }

        const accelerationLength = Math.sqrt(
            accelerationX * accelerationX +
            accelerationY * accelerationY
        );

        if (accelerationLength > MAX_ACCELERATION) {
            accelerationX =
                (accelerationX / accelerationLength) *
                MAX_ACCELERATION;

            accelerationY =
                (accelerationY / accelerationLength) *
                MAX_ACCELERATION;
        }

        body.velocity.x +=
            accelerationX * deltaTime;

        body.velocity.y +=
            accelerationY * deltaTime;

        limitVector(body.velocity, MAX_SPEED);
    }
}

function updatePositions(objects, deltaTime) {
    for (const body of objects) {
        if (!body || body.destroyed) continue;

        ensurePosition(body);
        ensureVelocity(body);

        if (isStatic(body)) continue;

        body.x += body.velocity.x * deltaTime;
        body.y += body.velocity.y * deltaTime;

        if (Number.isFinite(body.rotationSpeed)) {
            body.rotation =
                (body.rotation || 0) +
                body.rotationSpeed * deltaTime;
        }
    }
}

function handleCollisions(objects) {
    for (let i = 0; i < objects.length; i++) {
        const a = objects[i];

        if (!a || a.destroyed) continue;

        for (let j = i + 1; j < objects.length; j++) {
            const b = objects[j];

            if (!b || b.destroyed) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;

            const distance = Math.sqrt(
                dx * dx +
                dy * dy
            );

            const minimumDistance =
                getRadius(a) +
                getRadius(b);

            if (
                distance <= minimumDistance &&
                distance > 0.001
            ) {
                resolveCollision(a, b, dx, dy, distance);
            }
        }
    }
}

function resolveCollision(a, b, dx, dy, distance) {
    const massA = getMass(a);
    const massB = getMass(b);

    const normalX = dx / distance;
    const normalY = dy / distance;

    ensureVelocity(a);
    ensureVelocity(b);

    const relativeVelocityX =
        b.velocity.x - a.velocity.x;

    const relativeVelocityY =
        b.velocity.y - a.velocity.y;

    const velocityAlongNormal =
        relativeVelocityX * normalX +
        relativeVelocityY * normalY;

    if (velocityAlongNormal > 0) {
        return;
    }

    const restitution = 0.65;

    const impulse =
        -(1 + restitution) *
        velocityAlongNormal /
        (1 / massA + 1 / massB);

    const impulseX = impulse * normalX;
    const impulseY = impulse * normalY;

    if (!isStatic(a)) {
        a.velocity.x -=
            (impulseX / massA);

        a.velocity.y -=
            (impulseY / massA);
    }

    if (!isStatic(b)) {
        b.velocity.x +=
            (impulseX / massB);

        b.velocity.y +=
            (impulseY / massB);
    }

    separateBodies(a, b, normalX, normalY, distance);
}

function separateBodies(a, b, normalX, normalY, distance) {
    const overlap =
        getRadius(a) +
        getRadius(b) -
        distance;

    if (overlap <= 0) return;

    const moveAmount = overlap * 0.5;

    if (!isStatic(a)) {
        a.x -= normalX * moveAmount;
        a.y -= normalY * moveAmount;
    }

    if (!isStatic(b)) {
        b.x += normalX * moveAmount;
        b.y += normalY * moveAmount;
    }
}

function applyBlackHoleEffects(objects) {
    const blackHoles = objects.filter(
        body =>
            body &&
            !body.destroyed &&
            body.type === "black-hole"
    );

    for (const hole of blackHoles) {
        const influenceRadius =
            Math.max(
                350,
                getRadius(hole) * 15
            );

        for (const body of objects) {
            if (
                !body ||
                body === hole ||
                body.destroyed
            ) {
                continue;
            }

            const dx = hole.x - body.x;
            const dy = hole.y - body.y;

            const distance = Math.sqrt(
                dx * dx +
                dy * dy
            );

            if (
                distance <= 0 ||
                distance > influenceRadius
            ) {
                continue;
            }

            const strength =
                0.0008 *
                (1 -
                    distance /
                    influenceRadius);

            if (!body.velocity) {
                ensureVelocity(body);
            }

            body.velocity.x +=
                (dx / distance) *
                strength;

            body.velocity.y +=
                (dy / distance) *
                strength;

            if (
                distance <
                getRadius(hole) * 1.2
            ) {
                if (
                    body.type !== "black-hole" &&
                    body.type !== "grey-hole"
                ) {
                    body.destroyed = true;

                    hole.mass =
                        getMass(hole) +
                        getMass(body) * 0.05;
                }
            }
        }
    }
}

function applyGreyHoleEffects(objects) {
    const greyHoles = objects.filter(
        body =>
            body &&
            !body.destroyed &&
            body.type === "grey-hole"
    );

    for (const hole of greyHoles) {
        const influenceRadius =
            Math.max(
                280,
                getRadius(hole) * 12
            );

        for (const body of objects) {
            if (
                !body ||
                body === hole ||
                body.destroyed
            ) {
                continue;
            }

            const dx = hole.x - body.x;
            const dy = hole.y - body.y;

            const distance = Math.sqrt(
                dx * dx +
                dy * dy
            );

            if (
                distance <= 0 ||
                distance > influenceRadius
            ) {
                continue;
            }

            const strength =
                0.00035 *
                (1 -
                    distance /
                    influenceRadius);

            if (!body.velocity) {
                ensureVelocity(body);
            }

            body.velocity.x +=
                (dx / distance) *
                strength;

            body.velocity.y +=
                (dy / distance) *
                strength;

            if (
                distance <
                getRadius(hole) * 1.05
            ) {
                body.velocity.x *= 0.7;
                body.velocity.y *= 0.7;
            }
        }
    }
}

function applyWormholeEffects(objects) {
    const wormholes = objects.filter(
        body =>
            body &&
            !body.destroyed &&
            body.type === "wormhole"
    );

    if (wormholes.length < 2) return;

    for (let i = 0; i < wormholes.length; i++) {
        const entrance = wormholes[i];

        if (!entrance.linkedTo) continue;

        const exit = entrance.linkedTo;

        for (const body of objects) {
            if (
                !body ||
                body === entrance ||
                body === exit ||
                body.destroyed
            ) {
                continue;
            }

            const dx = body.x - entrance.x;
            const dy = body.y - entrance.y;

            const distance = Math.sqrt(
                dx * dx +
                dy * dy
            );

            const triggerDistance =
                Math.max(
                    20,
                    getRadius(entrance) * 1.5
                );

            if (
                distance < triggerDistance &&
                !body.wormholeCooldown
            ) {
                body.x =
                    exit.x +
                    (Math.random() - 0.5) * 20;

                body.y =
                    exit.y +
                    (Math.random() - 0.5) * 20;

                body.wormholeCooldown = 20;
            }
        }
    }
}

function updateCooldowns(objects) {
    for (const body of objects) {
        if (!body) continue;

        if (body.wormholeCooldown > 0) {
            body.wormholeCooldown--;
        }
    }
}

function cleanObjects(objects) {
    return objects.filter(
        body =>
            body &&
            !body.destroyed &&
            Number.isFinite(body.x) &&
            Number.isFinite(body.y)
    );
}

export function updatePhysics(objects, deltaTime = 1) {
    if (!Array.isArray(objects)) {
        return;
    }

    if (!Number.isFinite(deltaTime)) {
        deltaTime = 1;
    }

    deltaTime = Math.max(
        0.05,
        Math.min(deltaTime, 2)
    );

    applyGravity(objects, deltaTime);

    applyBlackHoleEffects(objects);

    applyGreyHoleEffects(objects);

    applyWormholeEffects(objects);

    updatePositions(objects, deltaTime);

    handleCollisions(objects);

    updateCooldowns(objects);

    const cleaned =
        cleanObjects(objects);

    objects.length = 0;

    for (const body of cleaned) {
        objects.push(body);
    }
}

export function addOrbitalVelocity(
    body,
    center,
    speedMultiplier = 1
) {
    if (!body || !center) return;

    ensurePosition(body);
    ensurePosition(center);
    ensureVelocity(body);

    const dx = body.x - center.x;
    const dy = body.y - center.y;

    const distance = Math.sqrt(
        dx * dx +
        dy * dy
    );

    if (distance < 1) return;

    const centerMass =
        getMass(center);

    const orbitalSpeed =
        Math.sqrt(
            (G * centerMass) /
            Math.max(distance, MIN_DISTANCE)
        ) *
        12 *
        speedMultiplier;

    const tangentX =
        -dy / distance;

    const tangentY =
        dx / distance;

    body.velocity.x +=
        tangentX * orbitalSpeed;

    body.velocity.y +=
        tangentY * orbitalSpeed;

    limitVector(
        body.velocity,
        MAX_SPEED
    );
}

export function applyImpulse(
    body,
    x,
    y
) {
    if (!body) return;

    ensureVelocity(body);

    body.velocity.x += x;
    body.velocity.y += y;

    limitVector(
        body.velocity,
        MAX_SPEED
    );
}

export function setVelocity(
    body,
    x,
    y
) {
    if (!body) return;

    ensureVelocity(body);

    body.velocity.x = x;
    body.velocity.y = y;

    limitVector(
        body.velocity,
        MAX_SPEED
    );
}

export function distanceBetween(a, b) {
    if (!a || !b) return Infinity;

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}

export function getBodyMass(body) {
    return getMass(body);
}

export function getBodyRadius(body) {
    return getRadius(body);
}

export function isBodyStatic(body) {
    return isStatic(body);
}

export function resetPhysics(objects) {
    if (!Array.isArray(objects)) return;

    for (const body of objects) {
        if (!body) continue;

        ensurePosition(body);
        ensureVelocity(body);

        body.velocity.x = 0;
        body.velocity.y = 0;

        body.wormholeCooldown = 0;
    }
}
