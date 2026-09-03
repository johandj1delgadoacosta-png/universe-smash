// src/modes/solar-system.js
// Universe Smash - Solar System / Sandbox Mode

import {
    createStar,
    updateStar,
    drawStar
} from "../objects/star.js";

import {
    createPlanet,
    updatePlanet,
    drawPlanet
} from "../objects/planet.js";

import {
    createMoon,
    updateMoon,
    drawMoon
} from "../objects/moon.js";

import {
    createAsteroid,
    updateAsteroid,
    drawAsteroid
} from "../objects/asteroid.js";

import {
    createBlackHole,
    updateBlackHole,
    drawBlackHole
} from "../objects/black-hole.js";

import {
    createGreyHole,
    updateGreyHole,
    drawGreyHole
} from "../objects/grey-hole.js";

import {
    createWormhole,
    updateWormhole,
    drawWormhole
} from "../objects/wormhole.js";

import {
    createAntimatterPlanet,
    updateAntimatterPlanet,
    drawAntimatterPlanet
} from "../objects/antimatter-planet.js";


// ============================================================
// STATE
// ============================================================

let canvas = null;
let ctx = null;

let objects = [];

let running = false;
let paused = false;

let selectedObject = null;

let cameraX = 0;
let cameraY = 0;
let cameraZoom = 1;

let mouseX = 0;
let mouseY = 0;

let dragging = false;
let lastMouseX = 0;
let lastMouseY = 0;


// ============================================================
// HELPERS
// ============================================================

function finite(value, fallback = 0) {
    return Number.isFinite(value)
        ? value
        : fallback;
}

function clamp(value, min, max) {
    return Math.max(
        min,
        Math.min(max, value)
    );
}

function distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.sqrt(
        dx * dx + dy * dy
    );
}

function screenToWorld(x, y) {
    return {
        x:
            (x - canvas.width / 2) /
                cameraZoom +
            cameraX,

        y:
            (y - canvas.height / 2) /
                cameraZoom +
            cameraY
    };
}

function worldToScreen(x, y) {
    return {
        x:
            (x - cameraX) *
                cameraZoom +
            canvas.width / 2,

        y:
            (y - cameraY) *
                cameraZoom +
            canvas.height / 2
    };
}


// ============================================================
// STARFIELD
// ============================================================

let stars = [];

function createStarfield() {

    stars = [];

    const count = 500;

    for (let i = 0; i < count; i++) {

        stars.push({
            x: Math.random(),
            y: Math.random(),
            size:
                Math.random() *
                    2 +
                0.4,

            brightness:
                Math.random() *
                    0.8 +
                0.2
        });
    }
}

function drawStarfield() {

    if (!ctx || !canvas) return;

    ctx.save();

    ctx.fillStyle = "#02030a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (const star of stars) {

        ctx.fillStyle =
            `rgba(255,255,255,${star.brightness})`;

        ctx.beginPath();

        ctx.arc(
            star.x * canvas.width,
            star.y * canvas.height,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.restore();
}


// ============================================================
// ADD OBJECT
// ============================================================

function addObject(object) {

    if (!object) return null;

    if (
        !Number.isFinite(object.x)
    ) {
        object.x = 0;
    }

    if (
        !Number.isFinite(object.y)
    ) {
        object.y = 0;
    }

    if (
        !Number.isFinite(object.vx)
    ) {
        object.vx = 0;
    }

    if (
        !Number.isFinite(object.vy)
    ) {
        object.vy = 0;
    }

    objects.push(object);

    selectedObject = object;

    return object;
}


// ============================================================
// CREATE PLANET
// ============================================================

export function addPlanet(x = 0, y = 0) {

    const planet =
        createPlanet(
            x,
            y,
            40
        );

    return addObject(planet);
}


// ============================================================
// CREATE STAR
// ============================================================

export function addStar(x = 0, y = 0) {

    const star =
        createStar(
            x,
            y,
            70
        );

    return addObject(star);
}


// ============================================================
// CREATE BLUE HYPERGIANT
// ============================================================

export function addBlueHypergiant(
    x = 0,
    y = 0
) {

    let star = null;

    try {

        star = createStar(
            x,
            y,
            140
        );

        star.type =
            "blue-hypergiant";

        star.name =
            "Blue Hypergiant";

    } catch (error) {

        console.error(
            "Blue hypergiant error:",
            error
        );
    }

    return addObject(star);
}


// ============================================================
// CREATE CONTACT BINARY
// ============================================================

export function addContactBinary(
    x = 0,
    y = 0
) {

    let star = null;

    try {

        star = createStar(
            x,
            y,
            90
        );

        star.type =
            "contact-binary";

        star.name =
            "Contact Binary";

    } catch (error) {

        console.error(
            "Contact binary error:",
            error
        );
    }

    return addObject(star);
}


// ============================================================
// CREATE MOON
// ============================================================

export function addMoon(x = 0, y = 0) {

    const moon =
        createMoon(
            x,
            y,
            15
        );

    return addObject(moon);
}


// ============================================================
// CREATE ASTEROID
// ============================================================

export function addAsteroid(
    x = 0,
    y = 0
) {

    const asteroid =
        createAsteroid(
            x,
            y,
            12
        );

    return addObject(asteroid);
}


// ============================================================
// CREATE BLACK HOLE
// ============================================================

export function addBlackHole(
    x = 0,
    y = 0
) {

    const blackHole =
        createBlackHole(
            x,
            y,
            45
        );

    return addObject(
        blackHole
    );
}


// ============================================================
// CREATE GREY HOLE
// ============================================================

export function addGreyHole(
    x = 0,
    y = 0
) {

    const greyHole =
        createGreyHole(
            x,
            y,
            40
        );

    return addObject(
        greyHole
    );
}


// ============================================================
// CREATE WORMHOLE
// ============================================================

export function addWormhole(
    x = 0,
    y = 0
) {

    const wormhole =
        createWormhole(
            x,
            y,
            35
        );

    return addObject(
        wormhole
    );
}


// ============================================================
// CREATE ANTIMATTER PLANET
// ============================================================

export function addAntimatterPlanet(
    x = 0,
    y = 0
) {

    const planet =
        createAntimatterPlanet(
            x,
            y,
            40
        );

    return addObject(
        planet
    );
}


// ============================================================
// DEFAULT SOLAR SYSTEM
// ============================================================

function createDefaultSystem() {

    objects = [];

    selectedObject = null;

    // Star
    const star = addStar(
        0,
        0
    );

    if (star) {

        star.mass =
            Number.isFinite(star.mass)
                ? star.mass
                : 100000;
    }


    // Inner planet
    const planet1 =
        addPlanet(
            220,
            0
        );

    if (planet1) {

        planet1.vx = 0;
        planet1.vy = 2.8;
    }


    // Outer planet
    const planet2 =
        addPlanet(
            -360,
            0
        );

    if (planet2) {

        planet2.vx = 0;
        planet2.vy = -2.1;
    }


    // Moon
    const moon =
        addMoon(
            260,
            0
        );

    if (moon) {

        moon.vx = 0;
        moon.vy = 3.4;
    }


    // Asteroids
    addAsteroid(
        0,
        -300
    );

    addAsteroid(
        150,
        260
    );

    addAsteroid(
        -220,
        180
    );


    // Center camera
    cameraX = 0;
    cameraY = 0;
    cameraZoom = 1;

    console.log(
        `Universe Smash: Created ${objects.length} celestial objects.`
    );
}


// ============================================================
// START
// ============================================================

export function startSolarSystem(
    canvasElement
) {

    canvas =
        canvasElement;

    if (!canvas) {

        throw new Error(
            "Solar System canvas was not found."
        );
    }

    ctx =
        canvas.getContext("2d");

    if (!ctx) {

        throw new Error(
            "Could not create Solar System canvas context."
        );
    }

    running = true;
    paused = false;

    createStarfield();

    createDefaultSystem();

    setupMouse();

    console.log(
        "Universe Smash: Solar System initialized."
    );
}


// ============================================================
// STOP
// ============================================================

export function stopSolarSystem() {

    running = false;
    paused = false;

    objects = [];

    selectedObject = null;
}


// ============================================================
// PAUSE
// ============================================================

export function setSolarSystemPaused(
    value
) {

    paused = Boolean(value);
}

export function toggleSolarSystemPause() {

    paused = !paused;

    return paused;
}


// ============================================================
// UPDATE
// ============================================================

export function updateSolarSystem(
    deltaTime
) {

    if (!running || paused) {
        return;
    }

    const dt =
        clamp(
            finite(deltaTime, 0.016),
            0,
            0.05
        );


    for (const object of objects) {

        if (!object) continue;

        try {

            if (
                object.type ===
                    "black-hole"
            ) {

                updateBlackHole(
                    object,
                    dt
                );

            } else if (
                object.type ===
                    "grey-hole"
            ) {

                updateGreyHole(
                    object,
                    dt
                );

            } else if (
                object.type ===
                    "wormhole"
            ) {

                updateWormhole(
                    object,
                    dt
                );

            } else if (
                object.type ===
                    "antimatter-planet"
            ) {

                updateAntimatterPlanet(
                    object,
                    dt
                );

            } else if (
                object.type ===
                    "moon"
            ) {

                updateMoon(
                    object,
                    dt
                );

            } else if (
                object.type ===
                    "asteroid"
            ) {

                updateAsteroid(
                    object,
                    dt
                );

            } else if (
                object.type ===
                    "star" ||
                object.type ===
                    "blue-hypergiant" ||
                object.type ===
                    "contact-binary"
            ) {

                updateStar(
                    object,
                    dt
                );

            } else {

                updatePlanet(
                    object,
                    dt
                );
            }

        } catch (error) {

            console.warn(
                "Solar object update warning:",
                error
            );
        }


        // Basic velocity movement
        if (
            Number.isFinite(object.vx) &&
            Number.isFinite(object.vy)
        ) {

            object.x +=
                object.vx * dt * 60;

            object.y +=
                object.vy * dt * 60;
        }
    }
}


// ============================================================
// DRAW
// ============================================================

export function drawSolarSystem(
    context
) {

    if (context) {
        ctx = context;
    }

    if (!ctx || !canvas) {
        return;
    }

    drawStarfield();


    ctx.save();

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.scale(
        cameraZoom,
        cameraZoom
    );

    ctx.translate(
        -cameraX,
        -cameraY
    );


    // Draw objects
    for (const object of objects) {

        if (!object) continue;

        try {

            if (
                object.type ===
                    "black-hole"
            ) {

                drawBlackHole(
                    ctx,
                    object
                );

            } else if (
                object.type ===
                    "grey-hole"
            ) {

                drawGreyHole(
                    ctx,
                    object
                );

            } else if (
                object.type ===
                    "wormhole"
            ) {

                drawWormhole(
                    ctx,
                    object
                );

            } else if (
                object.type ===
                    "antimatter-planet"
            ) {

                drawAntimatterPlanet(
                    ctx,
                    object
                );

            } else if (
                object.type ===
                    "moon"
            ) {

                drawMoon(
                    ctx,
                    object
                );

            } else if (
                object.type ===
                    "asteroid"
            ) {

                drawAsteroid(
                    ctx,
                    object
                );

            } else if (
                object.type ===
                    "star" ||
                object.type ===
                    "blue-hypergiant" ||
                object.type ===
                    "contact-binary"
            ) {

                drawStar(
                    ctx,
                    object
                );

            } else {

                drawPlanet(
                    ctx,
                    object
                );
            }

        } catch (error) {

            console.warn(
                "Solar object draw warning:",
                error
            );
        }


        // Selection outline
        if (
            object ===
            selectedObject
        ) {

            const radius =
                Math.max(
                    20,
                    finite(
                        object.radius,
                        20
                    )
                );

            ctx.save();

            ctx.strokeStyle =
                "#ffffff";

            ctx.lineWidth =
                2 / cameraZoom;

            ctx.setLineDash([
                6 / cameraZoom,
                6 / cameraZoom
            ]);

            ctx.beginPath();

            ctx.arc(
                object.x,
                object.y,
                radius + 10 / cameraZoom,
                0,
                Math.PI * 2
            );

            ctx.stroke();

            ctx.restore();
        }
    }

    ctx.restore();


    // UI
    drawInterface();
}


// ============================================================
// UI
// ============================================================

function drawInterface() {

    ctx.save();

    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "14px Arial";

    ctx.textAlign =
        "left";

    ctx.fillText(
        "SOLAR SYSTEM MODE",
        20,
        30
    );

    ctx.fillStyle =
        "#9fb7d8";

    ctx.fillText(
        `Objects: ${objects.length}`,
        20,
        52
    );

    if (selectedObject) {

        const name =
            selectedObject.name ||
            selectedObject.type ||
            "Object";

        ctx.fillText(
            `Selected: ${name}`,
            20,
            74
        );
    }

    ctx.fillText(
        `Zoom: ${cameraZoom.toFixed(2)}x`,
        20,
        96
    );

    ctx.fillText(
        "Scroll = Zoom | Drag = Pan | Click = Select",
        20,
        118
    );

    ctx.restore();
}


// ============================================================
// MOUSE CONTROLS
// ============================================================

let mouseReady = false;

function setupMouse() {

    if (!canvas || mouseReady) {
        return;
    }

    mouseReady = true;


    canvas.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();

            const oldZoom =
                cameraZoom;

            if (event.deltaY < 0) {

                cameraZoom *= 1.12;

            } else {

                cameraZoom /= 1.12;
            }

            cameraZoom =
                clamp(
                    cameraZoom,
                    0.1,
                    8
                );

            const rect =
                canvas.getBoundingClientRect();

            const sx =
                event.clientX -
                rect.left;

            const sy =
                event.clientY -
                rect.top;

            const before =
                screenToWorld(
                    sx,
                    sy
                );

            const after =
                screenToWorld(
                    sx,
                    sy
                );

            cameraX +=
                before.x -
                after.x;

            cameraY +=
                before.y -
                after.y;

            void oldZoom;
        },
        { passive: false }
    );


    canvas.addEventListener(
        "pointerdown",
        (event) => {

            const rect =
                canvas.getBoundingClientRect();

            mouseX =
                event.clientX -
                rect.left;

            mouseY =
                event.clientY -
                rect.top;

            lastMouseX =
                mouseX;

            lastMouseY =
                mouseY;

            dragging = false;

            canvas.setPointerCapture(
                event.pointerId
            );
        }
    );


    canvas.addEventListener(
        "pointermove",
        (event) => {

            const rect =
                canvas.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;

            if (
                event.buttons &&
                canvas.hasPointerCapture(
                    event.pointerId
                )
            ) {

                const dx =
                    x -
                    lastMouseX;

                const dy =
                    y -
                    lastMouseY;

                if (
                    Math.abs(dx) > 1 ||
                    Math.abs(dy) > 1
                ) {

                    dragging = true;

                    cameraX -=
                        dx /
                        cameraZoom;

                    cameraY -=
                        dy /
                        cameraZoom;
                }
            }

            lastMouseX = x;
            lastMouseY = y;
        }
    );


    canvas.addEventListener(
        "pointerup",
        (event) => {

            const rect =
                canvas.getBoundingClientRect();

            const x =
                event.clientX -
                rect.left;

            const y =
                event.clientY -
                rect.top;

            if (!dragging) {

                selectAtScreenPosition(
                    x,
                    y
                );
            }

            try {

                canvas.releasePointerCapture(
                    event.pointerId
                );

            } catch (_) {}
        }
    );
}


// ============================================================
// SELECT OBJECT
// ============================================================

function selectAtScreenPosition(
    x,
    y
) {

    const world =
        screenToWorld(
            x,
            y
        );

    let closest = null;
    let closestDistance = Infinity;

    for (const object of objects) {

        if (!object) continue;

        const radius =
            Math.max(
                10,
                finite(
                    object.radius,
                    20
                )
            );

        const d =
            Math.sqrt(
                (object.x - world.x) ** 2 +
                (object.y - world.y) ** 2
            );

        if (
            d <= radius &&
            d < closestDistance
        ) {

            closest =
                object;

            closestDistance =
                d;
        }
    }

    selectedObject =
        closest;
}


// ============================================================
// DELETE SELECTED
// ============================================================

export function deleteSelectedObject() {

    if (!selectedObject) {
        return;
    }

    const index =
        objects.indexOf(
            selectedObject
        );

    if (index !== -1) {

        objects.splice(
            index,
            1
        );
    }

    selectedObject =
        null;
}


// ============================================================
// CLEAR
// ============================================================

export function clearSolarSystem() {

    objects = [];

    selectedObject = null;
}


// ============================================================
// RESET
// ============================================================

export function resetSolarSystem() {

    createDefaultSystem();
}


// ============================================================
// EXPLODE SELECTED
// ============================================================

export function explodeSelectedObject() {

    if (!selectedObject) {
        return;
    }

    const target =
        selectedObject;

    const index =
        objects.indexOf(
            target
        );

    if (index !== -1) {

        objects.splice(
            index,
            1
        );
    }

    selectedObject =
        null;
}


// ============================================================
// GETTERS
// ============================================================

export function getSolarSystemObjects() {
    return objects;
}

export function getSelectedObject() {
    return selectedObject;
}

export function getSolarSystem() {
    return {
        objects,
        selectedObject,
        cameraX,
        cameraY,
        cameraZoom,
        paused,
        running
    };
}

export function isSolarSystemRunning() {
    return running;
}

export function isSolarSystemPaused() {
    return paused;
}


// ============================================================
// CAMERA
// ============================================================

export function zoomIn() {

    cameraZoom =
        clamp(
            cameraZoom * 1.2,
            0.1,
            8
        );
}

export function zoomOut() {

    cameraZoom =
        clamp(
            cameraZoom / 1.2,
            0.1,
            8
        );
}

export function resetCamera() {

    cameraX = 0;
    cameraY = 0;
    cameraZoom = 1;
}

export function focusSelectedObject() {

    if (!selectedObject) {
        return;
    }

    cameraX =
        finite(
            selectedObject.x,
            0
        );

    cameraY =
        finite(
            selectedObject.y,
            0
        );
}


// ============================================================
// STARTUP ALIASES
// ============================================================

export const initializeSolarSystem =
    startSolarSystem;

export const stop =
    stopSolarSystem;
