// Universe Smash
// Physics Engine

const G = 0.00045;
const SOFTENING = 80;
const MAX_SPEED = 5000;
const MIN_DISTANCE = 8;

const collisionCooldowns = new WeakMap();

function numberOr(value, fallback = 0) {
    return Number.isFinite(Number(value))
        ? Number(value)
        : fallback;
}

function distanceBetween(a, b) {
    if (!a || !b) {
        return Infinity;
    }

    const dx =
        numberOr(b.x) -
        numberOr(a.x);

    const dy =
        numberOr(b.y) -
        numberOr(a.y);

    return Math.hypot(dx, dy);
}

function getBodyRadius(body) {
    if (!body) {
        return 0;
    }

    if (Number.isFinite(body.radius)) {
        return Math.max(0, body.radius);
    }

    return 0;
}

function getBodyMass(body) {
    if (!body) {
        return 0;
    }

    if (Number.isFinite(body.physicsMass)) {
        return Math.max(0, body.physicsMass);
    }

    if (Number.isFinite(body.mass)) {
        return Math.max(0, body.mass);
    }

    switch (body.type) {
        case "star":
            return 1000000;

        case "blueHypergiant":
        case "blue-hypergiant":
            return 8000000;

        case "contact-binary":
            return 3000000;

        case "black-hole":
            return 10000000;

        case "grey-hole":
            return 3500000;

        case "planet":
            return 1000;

        case "moon":
            return 120;

        case "asteroid":
            return 10;

        case "antimatter-planet":
            return 1000;

        default:
            return 1;
    }
}

function isBodyStatic(body) {
    return Boolean(
        body &&
        (
            body.static === true ||
            body.isStatic === true ||
            body.type === "black-hole"
        )
    );
}

function ensureVelocity(body) {
    if (!body) {
        return;
    }

    if (!Number.isFinite(body.vx)) {
        body.vx = 0;
    }

    if (!Number.isFinite(body.vy)) {
        body.vy = 0;
    }
}

function limitVelocity(body) {
    if (!body) {
        return;
    }

    ensureVelocity(body);

    const speed =
        Math.hypot(
            body.vx,
            body.vy
        );

    if (
        speed <= MAX_SPEED ||
        speed === 0
    ) {
        return;
    }

    const scale =
        MAX_SPEED / speed;

    body.vx *= scale;
    body.vy *= scale;
}

function getPairKey(a, b) {
    if (!a || !b) {
        return null;
    }

    if (!a.__physicsId) {
        a.__physicsId =
            Math.random()
                .toString(36)
                .slice(2);
    }

    if (!b.__physicsId) {
        b.__physicsId =
            Math.random()
                .toString(36)
                .slice(2);
    }

    return a.__physicsId < b.__physicsId
        ? `${a.__physicsId}:${b.__physicsId}`
        : `${b.__physicsId}:${a.__physicsId}`;
}

function canCollide(a, b) {
    if (!a || !b || a === b) {
        return false;
    }

    if (
        a.destroyed ||
        b.destroyed ||
        a.removed ||
        b.removed
    ) {
        return false;
    }

    const radiusA =
        getBodyRadius(a);

    const radiusB =
        getBodyRadius(b);

    if (
        radiusA <= 0 ||
        radiusB <= 0
    ) {
        return false;
    }

    const distance =
        distanceBetween(a, b);

    return (
        distance <=
        radiusA + radiusB
    );
}

function applyGravityBetween(
    a,
    b,
    deltaTime
) {
    if (!a || !b) {
        return;
    }

    if (
        isBodyStatic(a) &&
        isBodyStatic(b)
    ) {
        return;
    }

    const dx =
        numberOr(b.x) -
        numberOr(a.x);

    const dy =
        numberOr(b.y) -
        numberOr(a.y);

    let distanceSquared =
        dx * dx +
        dy * dy;

    if (
        !Number.isFinite(distanceSquared)
    ) {
        return;
    }

    distanceSquared =
        Math.max(
            distanceSquared,
            SOFTENING
        );

    const distance =
        Math.sqrt(
            distanceSquared
        );

    if (distance < 0.0001) {
        return;
    }

    const massA =
        getBodyMass(a);

    const massB =
        getBodyMass(b);

    if (
        massA <= 0 ||
        massB <= 0
    ) {
        return;
    }

    const force =
        G *
        massA *
        massB /
        distanceSquared;

    const nx =
        dx / distance;

    const ny =
        dy / distance;

    const timeScale =
        Math.max(
            0,
            numberOr(deltaTime, 16.67)
        ) / 16.67;

    if (!isBodyStatic(a)) {
        a.vx +=
            nx *
            force /
            massA *
            timeScale;

        a.vy +=
            ny *
            force /
            massA *
            timeScale;
    }

    if (!isBodyStatic(b)) {
        b.vx -=
            nx *
            force /
            massB *
            timeScale;

        b.vy -=
            ny *
            force /
            massB *
            timeScale;
    }
}

function applyBlackHoleEffect(
    body,
    blackHole,
    deltaTime
) {
    if (
        !body ||
        !blackHole ||
        body === blackHole
    ) {
        return;
    }

    const dx =
        blackHole.x -
        body.x;

    const dy =
        blackHole.y -
        body.y;

    const distance =
        Math.hypot(dx, dy);

    if (
        !Number.isFinite(distance) ||
        distance <= 0
    ) {
        return;
    }

    const influence =
        numberOr(
            blackHole.influenceRadius,
            Math.max(
                800,
                getBodyRadius(blackHole) * 30
            )
        );

    if (distance > influence) {
        return;
    }

    const mass =
        getBodyMass(
            blackHole
        );

    const strength =
        Math.min(
            0.75,
            G *
            mass /
            Math.max(
                distance * distance,
                MIN_DISTANCE
            )
        );

    const timeScale =
        Math.max(
            0,
            numberOr(deltaTime, 16.67)
        ) / 16.67;

    body.vx +=
        dx / distance *
        strength *
        timeScale;

    body.vy +=
        dy / distance *
        strength *
        timeScale;

    if (
        distance <
        getBodyRadius(blackHole) * 1.5
    ) {
        body.blackHoleCapture = true;
    }
}

function applyGreyHoleEffect(
    body,
    greyHole,
    deltaTime
) {
    if (
        !body ||
        !greyHole ||
        body === greyHole
    ) {
        return;
    }

    const dx =
        greyHole.x -
        body.x;

    const dy =
        greyHole.y -
        body.y;

    const distance =
        Math.hypot(dx, dy);

    if (
        !Number.isFinite(distance) ||
        distance <= 0
    ) {
        return;
    }

    const influence =
        numberOr(
            greyHole.influenceRadius,
            Math.max(
                600,
                getBodyRadius(greyHole) * 25
            )
        );

    if (distance > influence) {
        return;
    }

    const mass =
        getBodyMass(
            greyHole
        );

    const strength =
        Math.min(
            0.35,
            G *
            mass /
            Math.max(
                distance * distance,
                MIN_DISTANCE
            )
        );

    const timeScale =
        Math.max(
            0,
            numberOr(deltaTime, 16.67)
        ) / 16.67;

    body.vx +=
        dx / distance *
        strength *
        timeScale;

    body.vy +=
        dy / distance *
        strength *
        timeScale;
}

function separateBodies(a, b) {
    const dx =
        numberOr(b.x) -
        numberOr(a.x);

    const dy =
        numberOr(b.y) -
        numberOr(a.y);

    let distance =
        Math.hypot(dx, dy);

    if (
        distance < 0.0001
    ) {
        distance = 0.0001;
    }

    const radiusA =
        getBodyRadius(a);

    const radiusB =
        getBodyRadius(b);

    const overlap =
        radiusA +
        radiusB -
        distance;

    if (overlap <= 0) {
        return;
    }

    const nx =
        dx / distance;

    const ny =
        dy / distance;

    const staticA =
        isBodyStatic(a);

    const staticB =
        isBodyStatic(b);

    if (
        staticA &&
        staticB
    ) {
        return;
    }

    if (staticA) {
        b.x +=
            nx *
            overlap;

        b.y +=
            ny *
            overlap;

        return;
    }

    if (staticB) {
        a.x -=
            nx *
            overlap;

        a.y -=
            ny *
            overlap;

        return;
    }

    const massA =
        Math.max(
            0.001,
            getBodyMass(a)
        );

    const massB =
        Math.max(
            0.001,
            getBodyMass(b)
        );

    const totalMass =
        massA + massB;

    const moveA =
        overlap *
        (massB / totalMass);

    const moveB =
        overlap *
        (massA / totalMass);

    a.x -=
        nx *
        moveA;

    a.y -=
        ny *
        moveA;

    b.x +=
        nx *
        moveB;

    b.y +=
        ny *
        moveB;
}

function resolveCollision(a, b) {
    if (!canCollide(a, b)) {
        return;
    }

    const key =
        getPairKey(a, b);

    if (!key) {
        return;
    }

    const now =
        performance.now();

    const last =
        collisionCooldowns.get(key) || 0;

    if (
        now - last <
        150
    ) {
        return;
    }

    collisionCooldowns.set(
        key,
        now
    );

    separateBodies(a, b);

    const dx =
        numberOr(b.x) -
        numberOr(a.x);

    const dy =
        numberOr(b.y) -
        numberOr(a.y);

    const distance =
        Math.max(
            0.0001,
            Math.hypot(dx, dy)
        );

    const nx =
        dx / distance;

    const ny =
        dy / distance;

    const relativeVX =
        numberOr(b.vx) -
        numberOr(a.vx);

    const relativeVY =
        numberOr(b.vy) -
        numberOr(a.vy);

    const velocityAlongNormal =
        relativeVX * nx +
        relativeVY * ny;

    if (
        velocityAlongNormal > 0
    ) {
        return;
    }

    const restitution =
        0.65;

    const massA =
        Math.max(
            0.001,
            getBodyMass(a)
        );

    const massB =
        Math.max(
            0.001,
            getBodyMass(b)
        );

    const impulse =
        -(
            1 + restitution
        ) *
        velocityAlongNormal /
        (
            1 / massA +
            1 / massB
        );

    const impulseX =
        impulse * nx;

    const impulseY =
        impulse * ny;

    if (!isBodyStatic(a)) {
        a.vx -=
            impulseX /
            massA;

        a.vy -=
            impulseY /
            massA;
    }

    if (!isBodyStatic(b)) {
        b.vx +=
            impulseX /
            massB;

        b.vy +=
            impulseY /
            massB;
    }

    a.lastCollision = b;
    b.lastCollision = a;
}

function updatePositions(
    bodies,
    deltaTime
) {
    const timeScale =
        Math.max(
            0,
            numberOr(deltaTime, 16.67)
        ) / 16.67;

    for (const body of bodies) {
        if (
            !body ||
            body.destroyed ||
            body.removed ||
            isBodyStatic(body)
        ) {
            continue;
        }

        ensureVelocity(body);

        body.x +=
            body.vx *
            timeScale;

        body.y +=
            body.vy *
            timeScale;

        limitVelocity(body);
    }
}

function cleanupPhysicsState(
    bodies
) {
    const validIds =
        new Set();

    for (const body of bodies) {
        if (
            body &&
            body.__physicsId
        ) {
            validIds.add(
                body.__physicsId
            );
        }
    }

    for (
        const [key] of
        collisionCooldowns
    ) {
        const parts =
            key.split(":");

        if (
            !validIds.has(parts[0]) ||
            !validIds.has(parts[1])
        ) {
            collisionCooldowns.delete(
                key
            );
        }
    }
}

function updatePhysics(
    bodies = [],
    deltaTime = 16.67
) {
    if (!Array.isArray(bodies)) {
        return bodies;
    }

    const activeBodies =
        bodies.filter(
            body =>
                body &&
                !body.destroyed &&
                !body.removed
        );

    // Make sure every body has velocity.
    for (const body of activeBodies) {
        ensureVelocity(body);
    }

    // Gravity between all bodies.
    for (
        let i = 0;
        i < activeBodies.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < activeBodies.length;
            j++
        ) {
            applyGravityBetween(
                activeBodies[i],
                activeBodies[j],
                deltaTime
            );
        }
    }

    // Special gravitational objects.
    for (const body of activeBodies) {
        if (
            body.type === "black-hole"
        ) {
            for (
                const other of activeBodies
            ) {
                applyBlackHoleEffect(
                    other,
                    body,
                    deltaTime
                );
            }
        }

        if (
            body.type === "grey-hole"
        ) {
            for (
                const other of activeBodies
            ) {
                applyGreyHoleEffect(
                    other,
                    body,
                    deltaTime
                );
            }
        }
    }

    // Move bodies.
    updatePositions(
        activeBodies,
        deltaTime
    );

    // Collision handling.
    for (
        let i = 0;
        i < activeBodies.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < activeBodies.length;
            j++
        ) {
            resolveCollision(
                activeBodies[i],
                activeBodies[j]
            );
        }
    }

    cleanupPhysicsState(
        activeBodies
    );

    return bodies;
}

function addOrbitalVelocity(
    body,
    centerBody,
    clockwise = false
) {
    if (
        !body ||
        !centerBody ||
        body === centerBody
    ) {
        return body;
    }

    ensureVelocity(body);

    const dx =
        body.x -
        centerBody.x;

    const dy =
        body.y -
        centerBody.y;

    const distance =
        Math.max(
            MIN_DISTANCE,
            Math.hypot(dx, dy)
        );

    const centerMass =
        getBodyMass(
            centerBody
        );

    const orbitalSpeed =
        Math.sqrt(
            Math.max(
                0,
                G *
                centerMass /
                distance
            )
        );

    const nx =
        dx / distance;

    const ny =
        dy / distance;

    if (clockwise) {
        body.vx +=
            ny *
            orbitalSpeed;

        body.vy -=
            nx *
            orbitalSpeed;
    } else {
        body.vx -=
            ny *
            orbitalSpeed;

        body.vy +=
            nx *
            orbitalSpeed;
    }

    return body;
}

function applyImpulse(
    body,
    impulseX = 0,
    impulseY = 0
) {
    if (
        !body ||
        isBodyStatic(body)
    ) {
        return body;
    }

    const mass =
        Math.max(
            0.001,
            getBodyMass(body)
        );

    ensureVelocity(body);

    body.vx +=
        numberOr(impulseX) /
        mass;

    body.vy +=
        numberOr(impulseY) /
        mass;

    limitVelocity(body);

    return body;
}

function setVelocity(
    body,
    vx = 0,
    vy = 0
) {
    if (!body) {
        return body;
    }

    body.vx =
        numberOr(vx);

    body.vy =
        numberOr(vy);

    limitVelocity(body);

    return body;
}

function resetPhysics(
    bodies = []
) {
    if (!Array.isArray(bodies)) {
        return;
    }

    for (const body of bodies) {
        if (!body) {
            continue;
        }

        body.vx = 0;
        body.vy = 0;

        delete body.lastCollision;
        delete body.blackHoleCapture;
    }

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

window.UniverseSmashPhysics = {
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
