// ============================================================
// UNIVERSE SMASH - PHYSICS ENGINE
// Safe, fault-tolerant orbital physics
// ============================================================

const G = 0.00008;
const MAX_ACCELERATION = 5000;
const MAX_SPEED = 50000;

const collisionCooldowns = new Map();


// ============================================================
// SAFE NUMBER
// ============================================================

function finite(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}


// ============================================================
// SAFE BODY
// ============================================================

function validBody(body) {
    return !!body && typeof body === "object";
}


// ============================================================
// MASS
// ============================================================

export function getBodyMass(body) {

    if (!validBody(body)) {
        return 0;
    }

    if (body.static === true) {
        return Math.max(
            1,
            finite(body.mass, 1)
        );
    }

    let mass = finite(body.mass, 1);

    if (mass <= 0) {
        mass = 1;
    }

    switch (body.type) {

        case "star":
            mass = Math.max(mass, 100000);
            break;

        case "blueHypergiant":
        case "blue-hypergiant":
            mass = Math.max(mass, 500000);
            break;

        case "contact-binary":
            mass = Math.max(mass, 300000);
            break;

        case "black-hole":
            mass = Math.max(mass, 1000000);
            break;

        case "grey-hole":
            mass = Math.max(mass, 500000);
            break;

        case "planet":
            mass = Math.max(mass, 1000);
            break;

        case "moon":
            mass = Math.max(mass, 100);
            break;

        case "asteroid":
            mass = Math.max(mass, 10);
            break;

        case "antimatter-planet":
            mass = Math.max(mass, 1500);
            break;

        default:
            break;
    }

    return mass;
}


// ============================================================
// RADIUS
// ============================================================

export function getBodyRadius(body) {

    if (!validBody(body)) {
        return 0;
    }

    let radius = finite(
        body.radius,
        10
    );

    if (radius <= 0) {
        radius = 10;
    }

    return Math.min(
        radius,
        100000
    );
}


// ============================================================
// STATIC CHECK
// ============================================================

export function isBodyStatic(body) {

    if (!validBody(body)) {
        return true;
    }

    return body.static === true ||
           body.type === "black-hole";
}


// ============================================================
// DISTANCE
// ============================================================

export function distanceBetween(a, b) {

    if (!validBody(a) || !validBody(b)) {
        return Infinity;
    }

    const ax = finite(a.x, 0);
    const ay = finite(a.y, 0);
    const bx = finite(b.x, 0);
    const by = finite(b.y, 0);

    const dx = bx - ax;
    const dy = by - ay;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );
}


// ============================================================
// ORBITAL VELOCITY
// ============================================================

export function addOrbitalVelocity(
    body,
    center,
    direction = 1
) {

    if (
        !validBody(body) ||
        !validBody(center)
    ) {
        return;
    }

    const dx =
        finite(body.x, 0) -
        finite(center.x, 0);

    const dy =
        finite(body.y, 0) -
        finite(center.y, 0);

    const distance =
        Math.max(
            20,
            Math.sqrt(
                dx * dx +
                dy * dy
            )
        );

    const centerMass =
        getBodyMass(center);

    const speed =
        Math.sqrt(
            Math.max(
                0,
                G *
                centerMass /
                distance
            )
        );

    const length =
        Math.max(
            0.0001,
            distance
        );

    const nx = dx / length;
    const ny = dy / length;

    const tangentX =
        -ny * direction;

    const tangentY =
        nx * direction;

    body.vx =
        finite(body.vx, 0) +
        tangentX * speed;

    body.vy =
        finite(body.vy, 0) +
        tangentY * speed;

    clampVelocity(body);
}


// ============================================================
// SET VELOCITY
// ============================================================

export function setVelocity(
    body,
    vx = 0,
    vy = 0
) {

    if (!validBody(body)) {
        return;
    }

    body.vx = finite(vx, 0);
    body.vy = finite(vy, 0);

    clampVelocity(body);
}


// ============================================================
// IMPULSE
// ============================================================

export function applyImpulse(
    body,
    impulseX = 0,
    impulseY = 0
) {

    if (
        !validBody(body) ||
        isBodyStatic(body)
    ) {
        return;
    }

    const mass =
        Math.max(
            1,
            getBodyMass(body)
        );

    body.vx =
        finite(body.vx, 0) +
        finite(impulseX, 0) / mass;

    body.vy =
        finite(body.vy, 0) +
        finite(impulseY, 0) / mass;

    clampVelocity(body);
}


// ============================================================
// CLAMP VELOCITY
// ============================================================

function clampVelocity(body) {

    if (!validBody(body)) {
        return;
    }

    let vx = finite(body.vx, 0);
    let vy = finite(body.vy, 0);

    const speed =
        Math.sqrt(
            vx * vx +
            vy * vy
        );

    if (
        !Number.isFinite(speed)
    ) {
        body.vx = 0;
        body.vy = 0;
        return;
    }

    if (speed > MAX_SPEED) {

        const scale =
            MAX_SPEED / speed;

        vx *= scale;
        vy *= scale;
    }

    body.vx = vx;
    body.vy = vy;
}


// ============================================================
// POSITION SANITIZATION
// ============================================================

function sanitizeBody(body) {

    if (!validBody(body)) {
        return false;
    }

    body.x = finite(body.x, 0);
    body.y = finite(body.y, 0);

    body.vx = finite(body.vx, 0);
    body.vy = finite(body.vy, 0);

    body.radius =
        Math.max(
            1,
            getBodyRadius(body)
        );

    body.mass =
        Math.max(
            1,
            getBodyMass(body)
        );

    return true;
}


// ============================================================
// GRAVITY
// ============================================================

function applyGravity(
    body,
    other,
    deltaTime
) {

    if (
        !validBody(body) ||
        !validBody(other) ||
        body === other
    ) {
        return;
    }

    if (
        isBodyStatic(body)
    ) {
        return;
    }

    const dx =
        finite(other.x, 0) -
        finite(body.x, 0);

    const dy =
        finite(other.y, 0) -
        finite(body.y, 0);

    let distanceSquared =
        dx * dx +
        dy * dy;

    if (
        !Number.isFinite(distanceSquared)
    ) {
        return;
    }

    const minDistance =
        Math.max(
            10,
            getBodyRadius(other) * 0.5
        );

    distanceSquared =
        Math.max(
            distanceSquared,
            minDistance * minDistance
        );

    const distance =
        Math.sqrt(
            distanceSquared
        );

    if (
        !Number.isFinite(distance) ||
        distance <= 0
    ) {
        return;
    }

    const mass =
        getBodyMass(other);

    let acceleration =
        G *
        mass /
        distanceSquared;

    acceleration =
        Math.min(
            MAX_ACCELERATION,
            Math.max(
                0,
                finite(
                    acceleration,
                    0
                )
            )
        );

    const nx =
        dx / distance;

    const ny =
        dy / distance;

    const dt =
        Math.min(
            0.1,
            Math.max(
                0,
                finite(
                    deltaTime,
                    0.016
                )
            )
        );

    body.vx +=
        nx *
        acceleration *
        dt;

    body.vy +=
        ny *
        acceleration *
        dt;

    clampVelocity(body);
}


// ============================================================
// BLACK HOLE EFFECT
// ============================================================

function applyBlackHoleEffect(
    body,
    hole,
    deltaTime
) {

    if (
        !validBody(body) ||
        !validBody(hole) ||
        body === hole
    ) {
        return;
    }

    if (
        isBodyStatic(body)
    ) {
        return;
    }

    const dx =
        finite(hole.x, 0) -
        finite(body.x, 0);

    const dy =
        finite(hole.y, 0) -
        finite(body.y, 0);

    const distance =
        Math.max(
            20,
            Math.sqrt(
                dx * dx +
                dy * dy
            )
        );

    if (
        !Number.isFinite(distance)
    ) {
        return;
    }

    const influence =
        Math.max(
            200,
            getBodyRadius(hole) * 12
        );

    if (
        distance > influence
    ) {
        return;
    }

    const strength =
        Math.min(
            1000,
            getBodyMass(hole) /
            Math.max(
                100,
                distance * distance
            )
        );

    const nx =
        dx / distance;

    const ny =
        dy / distance;

    const dt =
        Math.min(
            0.1,
            Math.max(
                0,
                finite(
                    deltaTime,
                    0.016
                )
            )
        );

    body.vx +=
        nx *
        strength *
        dt;

    body.vy +=
        ny *
        strength *
        dt;

    clampVelocity(body);
}


// ============================================================
// GREY HOLE EFFECT
// ============================================================

function applyGreyHoleEffect(
    body,
    hole,
    deltaTime
) {

    if (
        !validBody(body) ||
        !validBody(hole) ||
        body === hole
    ) {
        return;
    }

    if (
        isBodyStatic(body)
    ) {
        return;
    }

    const dx =
        finite(hole.x, 0) -
        finite(body.x, 0);

    const dy =
        finite(hole.y, 0) -
        finite(body.y, 0);

    const distance =
        Math.max(
            25,
            Math.sqrt(
                dx * dx +
                dy * dy
            )
        );

    const influence =
        Math.max(
            250,
            getBodyRadius(hole) * 15
        );

    if (
        distance > influence
    ) {
        return;
    }

    const strength =
        Math.min(
            500,
            getBodyMass(hole) /
            Math.max(
                150,
                distance * distance
            )
        );

    const nx =
        dx / distance;

    const ny =
        dy / distance;

    const dt =
        Math.min(
            0.1,
            Math.max(
                0,
                finite(
                    deltaTime,
                    0.016
                )
            )
        );

    body.vx +=
        nx *
        strength *
        dt;

    body.vy +=
        ny *
        strength *
        dt;

    clampVelocity(body);
}


// ============================================================
// COLLISIONS
// ============================================================

function handleCollision(
    a,
    b,
    now
) {

    if (
        !validBody(a) ||
        !validBody(b)
    ) {
        return;
    }

    if (
        a === b
    ) {
        return;
    }

    const key =
        getPairKey(a, b);

    const last =
        collisionCooldowns.get(key) || 0;

    if (
        now - last < 150
    ) {
        return;
    }

    const dx =
        finite(b.x, 0) -
        finite(a.x, 0);

    const dy =
        finite(b.y, 0) -
        finite(a.y, 0);

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const minimumDistance =
        getBodyRadius(a) +
        getBodyRadius(b);

    if (
        !Number.isFinite(distance) ||
        distance > minimumDistance
    ) {
        return;
    }

    collisionCooldowns.set(
        key,
        now
    );

    const nx =
        distance > 0
            ? dx / distance
            : 1;

    const ny =
        distance > 0
            ? dy / distance
            : 0;

    const avx =
        finite(a.vx, 0);

    const avy =
        finite(a.vy, 0);

    const bvx =
        finite(b.vx, 0);

    const bvy =
        finite(b.vy, 0);

    const relativeVelocity =
        (bvx - avx) * nx +
        (bvy - avy) * ny;

    if (
        relativeVelocity > 0
    ) {
        return;
    }

    const massA =
        getBodyMass(a);

    const massB =
        getBodyMass(b);

    const invA =
        isBodyStatic(a)
            ? 0
            : 1 / massA;

    const invB =
        isBodyStatic(b)
            ? 0
            : 1 / massB;

    const restitution = 0.65;

    const impulse =
        -(1 + restitution) *
        relativeVelocity /
        Math.max(
            0.000001,
            invA + invB
        );

    if (!isBodyStatic(a)) {

        a.vx -=
            impulse *
            invA *
            nx;

        a.vy -=
            impulse *
            invA *
            ny;
    }

    if (!isBodyStatic(b)) {

        b.vx +=
            impulse *
            invB *
            nx;

        b.vy +=
            impulse *
            invB *
            ny;
    }

    // Separate overlapping bodies.
    const overlap =
        minimumDistance -
        distance;

    if (
        overlap > 0 &&
        Number.isFinite(overlap)
    ) {

        const totalInverse =
            invA + invB;

        if (
            totalInverse > 0
        ) {

            if (!isBodyStatic(a)) {

                a.x -=
                    nx *
                    overlap *
                    (invA / totalInverse);
            }

            if (!isBodyStatic(b)) {

                b.x +=
                    nx *
                    overlap *
                    (invB / totalInverse);
            }

            if (!isBodyStatic(a)) {

                a.y -=
                    ny *
                    overlap *
                    (invA / totalInverse);
            }

            if (!isBodyStatic(b)) {

                b.y +=
                    ny *
                    overlap *
                    (invB / totalInverse);
            }
        }
    }

    sanitizeBody(a);
    sanitizeBody(b);
    clampVelocity(a);
    clampVelocity(b);
}


// ============================================================
// PAIR KEY
// ============================================================

function getPairKey(a, b) {

    if (!validBody(a) || !validBody(b)) {
        return "";
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


// ============================================================
// MAIN PHYSICS UPDATE
// ============================================================

export function updatePhysics(
    bodies = [],
    deltaTime = 0.016
) {

    if (
        !Array.isArray(bodies)
    ) {
        return bodies;
    }

    const dt =
        Math.min(
            0.1,
            Math.max(
                0,
                finite(
                    deltaTime,
                    0.016
                )
            )
        );

    const now =
        performance.now();

    // --------------------------------------------------------
    // CLEAN INVALID BODIES
    // --------------------------------------------------------

    const validBodies =
        bodies.filter(
            body =>
                sanitizeBody(body)
        );

    // --------------------------------------------------------
    // GRAVITY
    // --------------------------------------------------------

    for (
        let i = 0;
        i < validBodies.length;
        i++
    ) {

        const body =
            validBodies[i];

        if (
            isBodyStatic(body)
        ) {
            continue;
        }

        for (
            let j = 0;
            j < validBodies.length;
            j++
        ) {

            if (i === j) {
                continue;
            }

            const other =
                validBodies[j];

            applyGravity(
                body,
                other,
                dt
            );

            if (
                other.type ===
                "black-hole"
            ) {

                applyBlackHoleEffect(
                    body,
                    other,
                    dt
                );
            }

            if (
                other.type ===
                "grey-hole"
            ) {

                applyGreyHoleEffect(
                    body,
                    other,
                    dt
                );
            }
        }
    }

    // --------------------------------------------------------
    // MOVE BODIES
    // --------------------------------------------------------

    for (
        const body of validBodies
    ) {

        if (
            isBodyStatic(body)
        ) {
            continue;
        }

        body.x +=
            finite(body.vx, 0) *
            dt;

        body.y +=
            finite(body.vy, 0) *
            dt;

        sanitizeBody(body);
    }

    // --------------------------------------------------------
    // COLLISIONS
    // --------------------------------------------------------

    for (
        let i = 0;
        i < validBodies.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < validBodies.length;
            j++
        ) {

            handleCollision(
                validBodies[i],
                validBodies[j],
                now
            );
        }
    }

    // --------------------------------------------------------
    // CLEAN COOLDOWNS
    // --------------------------------------------------------

    if (
        collisionCooldowns.size > 1000
    ) {

        for (
            const [key, time]
            of collisionCooldowns
        ) {

            if (
                now - time > 5000
            ) {
                collisionCooldowns.delete(
                    key
                );
            }
        }
    }

    return bodies;
}


// ============================================================
// RESET PHYSICS
// ============================================================

export function resetPhysics() {

    collisionCooldowns.clear();
}
