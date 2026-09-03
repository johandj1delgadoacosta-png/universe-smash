// ============================================
// UNIVERSE SMASH
// SOLAR SYSTEM MODE
// ============================================

import {
    updatePhysics,
    addOrbitalVelocity
} from "../physics.js";

import {
    Camera,
    enableCameraZoom
} from "../camera.js";

import {
    createExplosion,
    updateParticles,
    drawParticles
} from "../particles.js";

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
    createStar,
    createBlueHypergiant,
    createContactBinary,
    updateStarObject,
    drawStarObject
} from "../objects/star.js";

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
    drawWormhole,
    linkWormholes
} from "../objects/wormhole.js";

import {
    createAntimatterPlanet,
    updateAntimatterPlanet,
    drawAntimatterPlanet
} from "../objects/antimatter-planet.js";


// ============================================
// STATE
// ============================================

const solarSystem = {
    canvas: null,
    ctx: null,

    camera: null,

    objects: [],

    particles: [],

    running: false,

    paused: false,

    selectedTool: "planet",

    selectedObject: null,

    dragging: false,

    lastMouseX: 0,
    lastMouseY: 0,

    lastTime: 0,

    zoomEnabled: false,

    wormholeSelection: null,

    starfield: [],

    initialized: false
};


// ============================================
// INITIALIZE
// ============================================

export function startSolarSystem(canvas) {
    if (!canvas) {
        console.error(
            "Universe Smash: Solar System canvas missing."
        );

        return false;
    }

    solarSystem.canvas = canvas;

    solarSystem.ctx =
        canvas.getContext("2d");

    if (!solarSystem.ctx) {
        console.error(
            "Universe Smash: Could not create 2D context."
        );

        return false;
    }

    solarSystem.camera =
        new Camera(
            canvas.width / 2,
            canvas.height / 2,
            1
        );

    if (!solarSystem.initialized) {
        createStarfield();

        attachSolarControls();

        solarSystem.initialized = true;
    }

    solarSystem.running = true;
    solarSystem.paused = false;
    solarSystem.lastTime = performance.now();

    try {
        if (!solarSystem.zoomEnabled) {
            enableCameraZoom(canvas);

            solarSystem.zoomEnabled = true;
        }
    } catch (error) {
        console.warn(
            "Camera zoom could not be enabled:",
            error
        );
    }

    return true;
}


// ============================================
// STOP
// ============================================

export function stopSolarSystem() {
    solarSystem.running = false;
    solarSystem.paused = false;
    solarSystem.dragging = false;
}


// ============================================
// GET STATE
// ============================================

export function getSolarSystem() {
    return solarSystem;
}


// ============================================
// CREATE STARFIELD
// ============================================

function createStarfield() {
    solarSystem.starfield = [];

    const count = 500;

    for (let i = 0; i < count; i++) {
        solarSystem.starfield.push({
            x: Math.random(),
            y: Math.random(),
            size:
                0.5 +
                Math.random() * 1.8,

            brightness:
                0.25 +
                Math.random() * 0.75
        });
    }
}


// ============================================
// TOOL BUTTONS
// ============================================

function attachSolarControls() {
    const buttons =
        document.querySelectorAll(
            "[data-solar-tool]"
        );

    buttons.forEach((button) => {
        button.addEventListener(
            "click",
            () => {
                const tool =
                    button.dataset.solarTool;

                if (tool) {
                    solarSystem.selectedTool =
                        tool;
                }
            }
        );
    });
}


// ============================================
// ADD OBJECT
// ============================================

export function addSolarObject(
    type,
    screenX,
    screenY,
    options = {}
) {
    if (
        !solarSystem.canvas ||
        !solarSystem.camera
    ) {
        return null;
    }

    const position =
        screenToWorld(
            screenX,
            screenY
        );

    let object = null;

    switch (type) {
        case "planet":
            object = createPlanet(
                position.x,
                position.y,
                options
            );
            break;

        case "moon":
            object = createMoon(
                position.x,
                position.y,
                options
            );
            break;

        case "asteroid":
            object = createAsteroid(
                position.x,
                position.y,
                options
            );
            break;

        case "star":
            object = createStar(
                position.x,
                position.y,
                options
            );
            break;

        case "blue-hypergiant":
            object =
                createBlueHypergiant(
                    position.x,
                    position.y,
                    options
                );
            break;

        case "contact-binary":
            object =
                createContactBinary(
                    position.x,
                    position.y,
                    options
                );
            break;

        case "black-hole":
            object =
                createBlackHole(
                    position.x,
                    position.y,
                    options
                );
            break;

        case "grey-hole":
            object =
                createGreyHole(
                    position.x,
                    position.y,
                    options
                );
            break;

        case "wormhole":
            object =
                createWormhole(
                    position.x,
                    position.y,
                    options
                );
            break;

        case "antimatter-planet":
            object =
                createAntimatterPlanet(
                    position.x,
                    position.y,
                    options
                );
            break;

        default:
            console.warn(
                "Unknown Solar System object:",
                type
            );

            return null;
    }

    if (!object) {
        return null;
    }

    solarSystem.objects.push(object);

    solarSystem.selectedObject =
        object;

    handleSpecialObjectCreation(
        object
    );

    return object;
}


// ============================================
// SPECIAL CREATION
// ============================================

function handleSpecialObjectCreation(
    object
) {
    if (
        object.type === "wormhole"
    ) {
        if (
            !solarSystem.wormholeSelection
        ) {
            solarSystem.wormholeSelection =
                object;

            return;
        }

        if (
            solarSystem.wormholeSelection !==
            object
        ) {
            linkWormholes(
                solarSystem.wormholeSelection,
                object
            );

            solarSystem.wormholeSelection =
                null;
        }
    }
}


// ============================================
// SCREEN TO WORLD
// ============================================

function screenToWorld(
    screenX,
    screenY
) {
    if (
        solarSystem.camera &&
        typeof solarSystem.camera
            .screenToWorld ===
            "function"
    ) {
        return solarSystem.camera.screenToWorld(
            screenX,
            screenY
        );
    }

    const camera =
        solarSystem.camera;

    const zoom =
        camera?.zoom ?? 1;

    return {
        x:
            (screenX -
                solarSystem.canvas.width /
                    2) /
                zoom +
            (camera?.x ?? 0),

        y:
            (screenY -
                solarSystem.canvas.height /
                    2) /
                zoom +
            (camera?.y ?? 0)
    };
}


// ============================================
// UPDATE
// ============================================

export function updateSolarSystem(
    deltaTime = 1
) {
    if (
        !solarSystem.running ||
        solarSystem.paused
    ) {
        return;
    }

    const objects =
        solarSystem.objects;

    // Physics
    try {
        updatePhysics(
            objects,
            deltaTime
        );
    } catch (error) {
        console.warn(
            "Physics update error:",
            error
        );
    }

    // Object updates
    for (const object of objects) {
        if (
            !object ||
            object.destroyed
        ) {
            continue;
        }

        switch (object.type) {
            case "planet":
                updatePlanet(
                    object,
                    deltaTime
                );
                break;

            case "moon":
                updateMoon(
                    object,
                    deltaTime
                );
                break;

            case "asteroid":
                updateAsteroid(
                    object,
                    deltaTime
                );
                break;

            case "star":
            case "blueHypergiant":
            case "contact-binary":
                updateStarObject(
                    object,
                    deltaTime
                );
                break;

            case "black-hole":
                updateBlackHole(
                    object,
                    deltaTime
                );
                break;

            case "grey-hole":
                updateGreyHole(
                    object,
                    deltaTime
                );
                break;

            case "wormhole":
                updateWormhole(
                    object,
                    deltaTime
                );
                break;

            case "antimatter-planet":
                updateAntimatterPlanet(
                    object,
                    deltaTime
                );
                break;
        }
    }

    updateSolarParticles(
        deltaTime
    );

    cleanupDestroyedObjects();
}


// ============================================
// PARTICLES
// ============================================

function updateSolarParticles(
    deltaTime
) {
    try {
        updateParticles(
            solarSystem.particles,
            deltaTime
        );
    } catch {
        // Particle system can operate
        // independently from the main simulation.
    }
}


// ============================================
// DRAW
// ============================================

export function drawSolarSystem() {
    const canvas =
        solarSystem.canvas;

    const ctx =
        solarSystem.ctx;

    if (!canvas || !ctx) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawSpaceBackground();

    // Draw wormholes first so objects
    // appear above their portals.
    for (const object of solarSystem.objects) {
        if (
            object &&
            object.type === "wormhole" &&
            !object.destroyed
        ) {
            drawWormhole(
                ctx,
                object,
                solarSystem.camera
            );
        }
    }

    // Draw normal objects.
    for (const object of solarSystem.objects) {
        if (
            !object ||
            object.destroyed
        ) {
            continue;
        }

        switch (object.type) {
            case "planet":
                drawPlanet(
                    ctx,
                    object,
                    solarSystem.camera
                );
                break;

            case "moon":
                drawMoon(
                    ctx,
                    object,
                    solarSystem.camera
                );
                break;

            case "asteroid":
                drawAsteroid(
                    ctx,
                    object,
                    solarSystem.camera
                );
                break;

            case "star":
            case "blueHypergiant":
            case "contact-binary":
                drawStarObject(
                    ctx,
                    object,
                    solarSystem.camera
                );
                break;

            case "black-hole":
                drawBlackHole(
                    ctx,
                    object,
                    solarSystem.camera
                );
                break;

            case "grey-hole":
                drawGreyHole(
                    ctx,
                    object,
                    solarSystem.camera
                );
                break;

            case "antimatter-planet":
                drawAntimatterPlanet(
                    ctx,
                    object,
                    solarSystem.camera
                );
                break;
        }
    }

    // Particles
    try {
        drawParticles(
            ctx,
            solarSystem.particles,
            solarSystem.camera
        );
    } catch {
        // Ignore particle rendering
        // errors so the simulation continues.
    }

    drawSelection();

    drawSolarHUD();
}


// ============================================
// BACKGROUND
// ============================================

function drawSpaceBackground() {
    const canvas =
        solarSystem.canvas;

    const ctx =
        solarSystem.ctx;

    ctx.fillStyle = "#02030a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    for (
        const star of solarSystem.starfield
    ) {
        const x =
            star.x * canvas.width;

        const y =
            star.y * canvas.height;

        const pulse =
            0.85 +
            Math.sin(
                performance.now() * 0.001 +
                    x
            ) *
                0.15;

        ctx.globalAlpha =
            star.brightness * pulse;

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}


// ============================================
// SELECTION
// ============================================

function drawSelection() {
    const object =
        solarSystem.selectedObject;

    if (
        !object ||
        object.destroyed
    ) {
        return;
    }

    const ctx =
        solarSystem.ctx;

    const camera =
        solarSystem.camera;

    let position;

    if (
        camera &&
        typeof camera.worldToScreen ===
            "function"
    ) {
        position =
            camera.worldToScreen(
                object.x,
                object.y
            );
    } else {
        position = {
            x:
                object.x -
                (camera?.x ?? 0),

            y:
                object.y -
                (camera?.y ?? 0)
        };
    }

    const zoom =
        camera?.zoom ?? 1;

    const radius =
        Math.max(
            8,
            (object.radius ?? 10) *
                zoom *
                1.25
        );

    ctx.save();

    ctx.strokeStyle =
        "rgba(255,255,255,0.8)";

    ctx.lineWidth = 1.5;

    ctx.setLineDash([
        5,
        5
    ]);

    ctx.beginPath();

    ctx.arc(
        position.x,
        position.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}


// ============================================
// HUD
// ============================================

function drawSolarHUD() {
    const ctx =
        solarSystem.ctx;

    const objectCount =
        solarSystem.objects.filter(
            (object) =>
                object &&
                !object.destroyed
        ).length;

    ctx.save();

    ctx.fillStyle =
        "rgba(0,0,0,0.55)";

    ctx.fillRect(
        12,
        12,
        205,
        72
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "14px Arial";

    ctx.fillText(
        "SOLAR SYSTEM MODE",
        24,
        34
    );

    ctx.fillStyle =
        "#a9cfff";

    ctx.fillText(
        `Objects: ${objectCount}`,
        24,
        55
    );

    ctx.fillText(
        `Tool: ${solarSystem.selectedTool}`,
        24,
        75
    );

    ctx.restore();
}


// ============================================
// CLEANUP
// ============================================

function cleanupDestroyedObjects() {
    solarSystem.objects =
        solarSystem.objects.filter(
            (object) =>
                object &&
                !object.destroyed
        );

    if (
        solarSystem.selectedObject &&
        solarSystem.selectedObject.destroyed
    ) {
        solarSystem.selectedObject =
            null;
    }

    if (
        solarSystem.wormholeSelection &&
        solarSystem.wormholeSelection.destroyed
    ) {
        solarSystem.wormholeSelection =
            null;
    }
}


// ============================================
// RESET
// ============================================

export function resetSolarSystem() {
    solarSystem.objects = [];

    solarSystem.particles = [];

    solarSystem.selectedObject =
        null;

    solarSystem.wormholeSelection =
        null;

    if (solarSystem.camera) {
        if (
            typeof solarSystem.camera.reset ===
            "function"
        ) {
            solarSystem.camera.reset();
        } else {
            solarSystem.camera.x = 0;
            solarSystem.camera.y = 0;
            solarSystem.camera.zoom = 1;
        }
    }
}


// ============================================
// CLEAR SYSTEM
// ============================================

export function clearSolarSystem() {
    resetSolarSystem();
}


// ============================================
// PAUSE
// ============================================

export function toggleSolarPause() {
    solarSystem.paused =
        !solarSystem.paused;

    return solarSystem.paused;
}


// ============================================
// SELECT OBJECT
// ============================================

export function selectSolarObject(
    object
) {
    if (
        object &&
        !object.destroyed
    ) {
        solarSystem.selectedObject =
            object;

        return object;
    }

    solarSystem.selectedObject =
        null;

    return null;
}


// ============================================
// DELETE SELECTED
// ============================================

export function deleteSelectedObject() {
    const object =
        solarSystem.selectedObject;

    if (!object) {
        return false;
    }

    object.destroyed = true;

    solarSystem.selectedObject =
        null;

    cleanupDestroyedObjects();

    return true;
}


// ============================================
// EXPLODE SELECTED
// ============================================

export function explodeSelectedObject(
    strength = 1
) {
    const object =
        solarSystem.selectedObject;

    if (
        !object ||
        object.destroyed
    ) {
        return false;
    }

    try {
        createExplosion(
            solarSystem.particles,
            object.x,
            object.y,
            Math.max(
                10,
                (object.radius ?? 10) *
                    strength
            )
        );
    } catch {
        // Explosion is visual only.
    }

    object.destroyed = true;

    solarSystem.selectedObject =
        null;

    cleanupDestroyedObjects();

    return true;
}


// ============================================
// ADD ORBITAL VELOCITY
// ============================================

export function giveOrbitalVelocity(
    object,
    centralBody
) {
    if (
        !object ||
        !centralBody
    ) {
        return false;
    }

    try {
        addOrbitalVelocity(
            object,
            centralBody
        );

        return true;
    } catch {
        return false;
    }
}


// ============================================
// MOUSE CONTROLS
// ============================================

function attachCanvasMouseControls() {
    const canvas =
        solarSystem.canvas;

    if (!canvas) {
        return;
    }

    canvas.addEventListener(
        "click",
        handleCanvasClick
    );

    canvas.addEventListener(
        "mousedown",
        handleCanvasMouseDown
    );

    canvas.addEventListener(
        "mousemove",
        handleCanvasMouseMove
    );

    canvas.addEventListener(
        "mouseup",
        handleCanvasMouseUp
    );

    canvas.addEventListener(
        "mouseleave",
        handleCanvasMouseUp
    );
}


// ============================================
// CLICK
// ============================================

function handleCanvasClick(event) {
    if (!solarSystem.running) {
        return;
    }

    if (
        solarSystem.dragging
    ) {
        return;
    }

    const rect =
        solarSystem.canvas
            .getBoundingClientRect();

    const x =
        event.clientX -
        rect.left;

    const y =
        event.clientY -
        rect.top;

    const clicked =
        findObjectAtScreenPosition(
            x,
            y
        );

    if (clicked) {
        selectSolarObject(clicked);
        return;
    }

    addSolarObject(
        solarSystem.selectedTool,
        x,
        y
    );
}


// ============================================
// MOUSE DOWN
// ============================================

function handleCanvasMouseDown(event) {
    if (event.button !== 1) {
        return;
    }

    solarSystem.dragging = true;

    solarSystem.lastMouseX =
        event.clientX;

    solarSystem.lastMouseY =
        event.clientY;
}


// ============================================
// MOUSE MOVE
// ============================================

function handleCanvasMouseMove(event) {
    if (!solarSystem.dragging) {
        return;
    }

    const dx =
        event.clientX -
        solarSystem.lastMouseX;

    const dy =
        event.clientY -
        solarSystem.lastMouseY;

    solarSystem.lastMouseX =
        event.clientX;

    solarSystem.lastMouseY =
        event.clientY;

    if (solarSystem.camera) {
        if (
            typeof solarSystem.camera.move ===
            "function"
        ) {
            solarSystem.camera.move(
                -dx /
                    (solarSystem.camera.zoom ||
                        1),
                -dy /
                    (solarSystem.camera.zoom ||
                        1)
            );
        } else {
            solarSystem.camera.x -=
                dx /
                (solarSystem.camera.zoom ||
                    1);

            solarSystem.camera.y -=
                dy /
                (solarSystem.camera.zoom ||
                    1);
        }
    }
}


// ============================================
// MOUSE UP
// ============================================

function handleCanvasMouseUp() {
    solarSystem.dragging = false;
}


// ============================================
// FIND OBJECT
// ============================================

function findObjectAtScreenPosition(
    screenX,
    screenY
) {
    const world =
        screenToWorld(
            screenX,
            screenY
        );

    let closest = null;

    let closestDistance =
        Infinity;

    for (const object of solarSystem.objects) {
        if (
            !object ||
            object.destroyed
        ) {
            continue;
        }

        const dx =
            object.x -
            world.x;

        const dy =
            object.y -
            world.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        const hitRadius =
            object.radius ?? 10;

        if (
            distance <= hitRadius &&
            distance <
                closestDistance
        ) {
            closest =
                object;

            closestDistance =
                distance;
        }
    }

    return closest;
}


// ============================================
// ATTACH CONTROLS ONCE
// ============================================

attachCanvasMouseControls();


// ============================================
// DEFAULT STARTER SYSTEM
// ============================================

export function createDefaultSolarSystem() {
    resetSolarSystem();

    const star =
        createStar(
            0,
            0,
            {
                radius: 45,
                mass: 1.989e17
            }
        );

    const planet =
        createPlanet(
            180,
            0,
            {
                radius: 24,
                mass: 5.972e15
            }
        );

    const moon =
        createMoon(
            220,
            0,
            {
                radius: 9,
                mass: 7.35e13,

                parent: planet,

                orbitRadius: 40,

                orbitAngle: 0
            }
        );

    addOrbitalVelocity(
        planet,
        star
    );

    solarSystem.objects.push(
        star,
        planet,
        moon
    );

    solarSystem.selectedObject =
        planet;

    return solarSystem.objects;
}
