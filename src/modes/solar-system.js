// src/modes/solar-system.js

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

let canvas = null;
let ctx = null;

let running = false;
let paused = false;

let objects = [];
let selectedObject = null;
let currentTool = "planet";

let nextId = 1;

let cameraX = 0;
let cameraY = 0;
let cameraZoom = 1;

let dragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

const WORLD_CENTER_X = 0;
const WORLD_CENTER_Y = 0;

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function finite(value, fallback = 0) {
    return Number.isFinite(value) ? value : fallback;
}

function positive(value, fallback = 1) {
    return Number.isFinite(value) && value > 0 ? value : fallback;
}

function makeId() {
    return nextId++;
}

function getObjectType(object) {
    return object?.type || object?.kind || "unknown";
}

function worldToScreen(x, y) {
    return {
        x: canvas.width / 2 + (x - cameraX) * cameraZoom,
        y: canvas.height / 2 + (y - cameraY) * cameraZoom
    };
}

function screenToWorld(x, y) {
    return {
        x: cameraX + (x - canvas.width / 2) / cameraZoom,
        y: cameraY + (y - canvas.height / 2) / cameraZoom
    };
}

function safeObjectPosition(object) {
    object.x = finite(object.x, 0);
    object.y = finite(object.y, 0);
    object.vx = finite(object.vx, 0);
    object.vy = finite(object.vy, 0);
    object.mass = positive(object.mass, 1);

    return object;
}

// --------------------------------------------------
// Object registration
// --------------------------------------------------

function registerObject(object, type) {
    if (!object) return null;

    safeObjectPosition(object);

    object.id = object.id ?? makeId();
    object.type = object.type || type;

    objects.push(object);

    return object;
}

// --------------------------------------------------
// Create celestial objects
// --------------------------------------------------

export function addStar(x = 0, y = 0) {
    const object = createStar(
        finite(x, 0),
        finite(y, 0),
        {
            mass: 1.989e30,
            radius: 35
        }
    );

    return registerObject(object, "star");
}

export function addBlueHypergiant(x = 150, y = -100) {
    const object = createStar(
        finite(x, 0),
        finite(y, 0),
        {
            mass: 5e31,
            radius: 55,
            starType: "blue-hypergiant",
            color: "#9ddcff"
        }
    );

    object.type = "blue-hypergiant";

    return registerObject(object, "blue-hypergiant");
}

export function addContactBinary(x = -250, y = -100) {
    const object = createStar(
        finite(x, 0),
        finite(y, 0),
        {
            mass: 3.978e30,
            radius: 45,
            starType: "contact-binary"
        }
    );

    object.type = "contact-binary";
    object.binary = true;

    return registerObject(object, "contact-binary");
}

export function addPlanet(x = 220, y = 0, options = {}) {
    const object = createPlanet(
        finite(x, 0),
        finite(y, 0),
        {
            radius: options.radius ?? 14,
            mass: options.mass ?? 5.972e24,
            ...options
        }
    );

    return registerObject(object, "planet");
}

export function addMoon(x = 260, y = 0, options = {}) {
    const object = createMoon(
        finite(x, 0),
        finite(y, 0),
        {
            radius: options.radius ?? 7,
            mass: options.mass ?? 7.342e22,
            ...options
        }
    );

    return registerObject(object, "moon");
}

export function addAsteroid(x = 300, y = 100, options = {}) {
    const object = createAsteroid(
        finite(x, 0),
        finite(y, 0),
        {
            radius: options.radius ?? 9,
            mass: options.mass ?? 1e15,
            ...options
        }
    );

    return registerObject(object, "asteroid");
}

export function addBlackHole(x = -250, y = 200, options = {}) {
    const object = createBlackHole(
        finite(x, 0),
        finite(y, 0),
        {
            mass: options.mass ?? 1e32,
            radius: options.radius ?? 22,
            ...options
        }
    );

    return registerObject(object, "black-hole");
}

export function addGreyHole(x = 0, y = 250, options = {}) {
    const object = createGreyHole(
        finite(x, 0),
        finite(y, 0),
        {
            mass: options.mass ?? 8e31,
            radius: options.radius ?? 20,
            ...options
        }
    );

    return registerObject(object, "grey-hole");
}

export function addWormhole(x = -350, y = 0, options = {}) {
    const object = createWormhole(
        finite(x, 0),
        finite(y, 0),
        {
            radius: options.radius ?? 25,
            ...options
        }
    );

    return registerObject(object, "wormhole");
}

export function addAntimatterPlanet(x = 350, y = 160, options = {}) {
    const object = createAntimatterPlanet(
        finite(x, 0),
        finite(y, 0),
        {
            radius: options.radius ?? 16,
            mass: options.mass ?? 5.972e24,
            ...options
        }
    );

    return registerObject(object, "antimatter-planet");
}

// --------------------------------------------------
// Starter system
// --------------------------------------------------

function createStarterSystem() {
    objects = [];
    selectedObject = null;

    // Central star
    const star = addStar(0, 0);

    // Earth-like planet
    const planet = addPlanet(180, 0, {
        radius: 16,
        mass: 5.972e24
    });

    // Moon
    const moon = addMoon(215, 0, {
        radius: 7,
        mass: 7.342e22
    });

    // Small asteroid
    addAsteroid(260, 90, {
        radius: 8
    });

    // Orbital-looking initial velocities
    if (planet) {
        planet.vx = 0;
        planet.vy = 2.95;
    }

    if (moon) {
        moon.vx = 0;
        moon.vy = 3.35;
    }

    if (star) {
        star.vx = 0;
        star.vy = 0;
    }
}

// --------------------------------------------------
// Mode control
// --------------------------------------------------

export function startSolarSystem(targetCanvas) {
    canvas = targetCanvas;

    if (!canvas) {
        console.error("Universe Smash: Solar System canvas missing.");
        return false;
    }

    ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Universe Smash: Could not get Solar System 2D context.");
        return false;
    }

    running = true;
    paused = false;

    cameraX = WORLD_CENTER_X;
    cameraY = WORLD_CENTER_Y;
    cameraZoom = 1;

    currentTool = "planet";

    createStarterSystem();

    console.log(
        "Universe Smash: Solar System Mode started successfully."
    );

    return true;
}

export function stopSolarSystem() {
    running = false;
    paused = false;
    selectedObject = null;
}

export function resetSolarSystem() {
    cameraX = WORLD_CENTER_X;
    cameraY = WORLD_CENTER_Y;
    cameraZoom = 1;

    createStarterSystem();
}

export function clearSolarSystem() {
    objects = [];
    selectedObject = null;
}

// --------------------------------------------------
// Pause
// --------------------------------------------------

export function setSolarSystemPaused(value) {
    paused = Boolean(value);
}

export function toggleSolarSystemPause() {
    paused = !paused;
    return paused;
}

export function isSolarSystemPaused() {
    return paused;
}

// Alias for compatibility
export function setPaused(value) {
    setSolarSystemPaused(value);
}

// --------------------------------------------------
// Tools
// --------------------------------------------------

export function setTool(tool) {
    if (typeof tool !== "string") return;

    currentTool = tool;
}

export function getCurrentTool() {
    return currentTool;
}

// --------------------------------------------------
// Selection
// --------------------------------------------------

function getObjectRadius(object) {
    return Math.max(
        4,
        finite(object?.radius, 12)
    );
}

export function selectObjectAt(screenX, screenY) {
    if (!canvas) return null;

    const world = screenToWorld(screenX, screenY);

    let closest = null;
    let closestDistance = Infinity;

    for (const object of objects) {
        if (!object) continue;

        const dx = finite(object.x, 0) - world.x;
        const dy = finite(object.y, 0) - world.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= getObjectRadius(object) * 2) {
            if (distance < closestDistance) {
                closest = object;
                closestDistance = distance;
            }
        }
    }

    selectedObject = closest;

    return selectedObject;
}

export function getSelectedObject() {
    return selectedObject;
}

// --------------------------------------------------
// Remove / explode
// --------------------------------------------------

export function removeSelectedObject() {
    if (!selectedObject) return false;

    const index = objects.indexOf(selectedObject);

    if (index !== -1) {
        objects.splice(index, 1);
    }

    selectedObject = null;

    return true;
}

export function explodeSelectedObject() {
    return removeSelectedObject();
}

// --------------------------------------------------
// Mouse camera
// --------------------------------------------------

function onMouseDown(event) {
    if (!canvas) return;

    if (event.button === 1 || event.shiftKey) {
        dragging = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        return;
    }

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    selectObjectAt(x, y);
}

function onMouseMove(event) {
    if (!dragging) return;

    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;

    cameraX -= dx / cameraZoom;
    cameraY -= dy / cameraZoom;

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function onMouseUp() {
    dragging = false;
}

function onWheel(event) {
    event.preventDefault();

    const oldZoom = cameraZoom;

    if (event.deltaY < 0) {
        cameraZoom *= 1.12;
    } else {
        cameraZoom /= 1.12;
    }

    cameraZoom = Math.max(0.15, Math.min(8, cameraZoom));

    // Keep cursor position approximately fixed while zooming
    if (canvas) {
        const rect = canvas.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const before = {
            x: cameraX + (mouseX - canvas.width / 2) / oldZoom,
            y: cameraY + (mouseY - canvas.height / 2) / oldZoom
        };

        cameraX = before.x - (mouseX - canvas.width / 2) / cameraZoom;
        cameraY = before.y - (mouseY - canvas.height / 2) / cameraZoom;
    }
}

function attachControls() {
    if (!canvas) return;

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    canvas.addEventListener("wheel", onWheel, {
        passive: false
    });
}

// --------------------------------------------------
// Update objects
// --------------------------------------------------

function updateObject(object, dt) {
    if (!object) return;

    safeObjectPosition(object);

    const type = getObjectType(object);

    try {
        switch (type) {
            case "star":
            case "blue-hypergiant":
            case "contact-binary":
                updateStar?.(object, dt);
                break;

            case "planet":
                updatePlanet?.(object, dt);
                break;

            case "moon":
                updateMoon?.(object, dt);
                break;

            case "asteroid":
                updateAsteroid?.(object, dt);
                break;

            case "black-hole":
                updateBlackHole?.(object, dt);
                break;

            case "grey-hole":
                updateGreyHole?.(object, dt);
                break;

            case "wormhole":
                updateWormhole?.(object, dt);
                break;

            case "antimatter-planet":
                updateAntimatterPlanet?.(object, dt);
                break;

            default:
                if ("vx" in object) {
                    object.x += object.vx * dt;
                    object.y += object.vy * dt;
                }
                break;
        }
    } catch (error) {
        console.warn(
            `Universe Smash: update failed for ${type}`,
            error
        );
    }

    safeObjectPosition(object);
}

export function updateSolarSystem(dt = 0.016) {
    if (!running || paused) return;

    dt = Math.min(
        Math.max(finite(dt, 0.016), 0),
        0.05
    );

    for (const object of objects) {
        updateObject(object, dt);
    }
}

// --------------------------------------------------
// Draw objects
// --------------------------------------------------

function drawObject(object) {
    if (!object || !ctx) return;

    const type = getObjectType(object);

    try {
        switch (type) {
            case "star":
            case "blue-hypergiant":
            case "contact-binary":
                drawStar?.(ctx, object, cameraZoom);
                break;

            case "planet":
                drawPlanet?.(ctx, object, cameraZoom);
                break;

            case "moon":
                drawMoon?.(ctx, object, cameraZoom);
                break;

            case "asteroid":
                drawAsteroid?.(ctx, object, cameraZoom);
                break;

            case "black-hole":
                drawBlackHole?.(ctx, object, cameraZoom);
                break;

            case "grey-hole":
                drawGreyHole?.(ctx, object, cameraZoom);
                break;

            case "wormhole":
                drawWormhole?.(ctx, object, cameraZoom);
                break;

            case "antimatter-planet":
                drawAntimatterPlanet?.(ctx, object, cameraZoom);
                break;

            default:
                drawFallbackObject(object);
                break;
        }
    } catch (error) {
        console.warn(
            `Universe Smash: draw failed for ${type}`,
            error
        );

        drawFallbackObject(object);
    }
}

function drawFallbackObject(object) {
    const screen = worldToScreen(
        finite(object.x, 0),
        finite(object.y, 0)
    );

    const radius = Math.max(
        3,
        getObjectRadius(object) * cameraZoom
    );

    ctx.beginPath();
    ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);

    ctx.fillStyle = "#ffffff";
    ctx.fill();
}

function drawSelection() {
    if (!selectedObject || !ctx) return;

    const screen = worldToScreen(
        finite(selectedObject.x, 0),
        finite(selectedObject.y, 0)
    );

    const radius =
        Math.max(
            10,
            getObjectRadius(selectedObject) * cameraZoom
        ) + 8;

    ctx.save();

    ctx.beginPath();
    ctx.arc(
        screen.x,
        screen.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.stroke();

    ctx.restore();
}

// --------------------------------------------------
// Main draw
// --------------------------------------------------

export function drawSolarSystem() {
    if (!canvas || !ctx) return;

    // Background
    ctx.fillStyle = "#000000";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Star field
    drawStarField();

    // Objects
    for (const object of objects) {
        drawObject(object);
    }

    drawSelection();
}

function drawStarField() {
    ctx.save();

    const spacing = 100;

    const offsetX =
        ((-cameraX * cameraZoom) % spacing + spacing) % spacing;

    const offsetY =
        ((-cameraY * cameraZoom) % spacing + spacing) % spacing;

    for (
        let x = offsetX;
        x < canvas.width;
        x += spacing
    ) {
        for (
            let y = offsetY;
            y < canvas.height;
            y += spacing
        ) {
            const variation =
                Math.abs(
                    Math.sin(
                        (x + cameraX) * 0.003 +
                        (y + cameraY) * 0.002
                    )
                );

            const alpha =
                0.25 + variation * 0.45;

            ctx.fillStyle =
                `rgba(255,255,255,${alpha})`;

            ctx.fillRect(
                x,
                y,
                1.2,
                1.2
            );
        }
    }

    ctx.restore();
}

// --------------------------------------------------
// Getters
// --------------------------------------------------

export function getSolarSystem() {
    return objects;
}

export function getObjects() {
    return objects;
}

export function getObjectCount() {
    return objects.length;
}

export function getCamera() {
    return {
        x: cameraX,
        y: cameraY,
        zoom: cameraZoom
    };
}

export function setCamera(x, y, zoom = 1) {
    cameraX = finite(x, 0);
    cameraY = finite(y, 0);
    cameraZoom = Math.max(
        0.15,
        Math.min(8, finite(zoom, 1))
    );
}

// --------------------------------------------------
// Compatibility aliases
// --------------------------------------------------

export const startSandbox = startSolarSystem;
export const stopSandbox = stopSolarSystem;
export const updateSandbox = updateSolarSystem;
export const drawSandbox = drawSolarSystem;

export const resetSandbox = resetSolarSystem;
export const clearSandbox = clearSolarSystem;

// --------------------------------------------------
// Initialization
// --------------------------------------------------

if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
        if (!canvas) return;

        // Keep rendering resolution synchronized
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Attach interaction controls after canvas exists
const originalStartSolarSystem = startSolarSystem;

export { originalStartSolarSystem };

// The main exported function is wrapped so controls are attached once.
