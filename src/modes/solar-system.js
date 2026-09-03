import {
    updatePhysics
} from "../physics.js";

import {
    Camera,
    enableCameraZoom
} from "../camera.js";

import {
    createExplosion,
    updateParticles,
    drawParticles,
    clearParticles
} from "../particles.js";

import {
    createPlanet
} from "../objects/planet.js";

import {
    createMoon
} from "../objects/moon.js";

import {
    createAsteroid
} from "../objects/asteroid.js";

import {
    createStar
} from "../objects/star.js";

import {
    createBlackHole,
    updateBlackHole
} from "../objects/black-hole.js";

import {
    createGreyHole,
    updateGreyHole
} from "../objects/grey-hole.js";

import {
    createWormhole,
    updateWormhole,
    linkWormholes
} from "../objects/wormhole.js";

import {
    createAntimatterPlanet,
    updateAntimatterPlanet
} from "../objects/antimatter-planet.js";


let canvas = null;
let ctx = null;

let camera = null;

let objects = [];

let selectedType = "planet";

let dragging = false;

let lastMouseX = 0;
let lastMouseY = 0;

let running = false;

let menuBuilt = false;

let starfield = [];


function createStarfield() {

    starfield = [];

    for (
        let i = 0;
        i < 500;
        i++
    ) {

        starfield.push({

            x:
                Math.random() *
                5000 -
                2500,

            y:
                Math.random() *
                5000 -
                2500,

            size:
                Math.random() *
                2 +
                0.5,

            brightness:
                Math.random()
        });
    }
}


function addObject(
    screenX,
    screenY
) {

    const position =
        camera.screenToWorld(
            screenX,
            screenY,
            canvas
        );


    let object = null;


    if (
        selectedType ===
        "planet"
    ) {

        object =
            createPlanet(
                position.x,
                position.y
            );
    }


    if (
        selectedType ===
        "moon"
    ) {

        object =
            createMoon(
                position.x,
                position.y
            );
    }


    if (
        selectedType ===
        "asteroid"
    ) {

        object =
            createAsteroid(
                position.x,
                position.y
            );
    }


    if (
        selectedType ===
        "star"
    ) {

        object =
            createStar(
                position.x,
                position.y
            );
    }


    if (
        selectedType ===
        "blue-hypergiant"
    ) {

        object =
            createStar(
                position.x,
                position.y,
                {

                    radius: 90,

                    mass: 500000,

                    starType:
                        "blue-hypergiant",

                    temperature:
                        30000,

                    color:
                        "#7fc8ff"
                }
            );
    }


    if (
        selectedType ===
        "contact-binary"
    ) {

        object = {

            type: "contact-binary",

            x: position.x,

            y: position.y,

            radius: 55,

            mass: 180000,

            vx: 0,

            vy: 0,

            rotation: 0,

            destroyed: false
        };
    }


    if (
        selectedType ===
        "black-hole"
    ) {

        object =
            createBlackHole(
                position.x,
                position.y
            );
    }


    if (
        selectedType ===
        "grey-hole"
    ) {

        object =
            createGreyHole(
                position.x,
                position.y
            );
    }


    if (
        selectedType ===
        "wormhole"
    ) {

        object =
            createWormhole(
                position.x,
                position.y
            );
    }


    if (
        selectedType ===
        "antimatter"
    ) {

        object =
            createAntimatterPlanet(
                position.x,
                position.y
            );
    }


    if (object) {

        objects.push(object);

        if (
            object.type ===
            "wormhole"
        ) {

            linkWormholes(
                objects.filter(
                    item =>
                        item.type ===
                        "wormhole"
                )
            );
        }
    }
}


function clearSystem() {

    objects = [];

    clearParticles();
}


function createSolarMenu() {

    if (menuBuilt) {
        return;
    }

    menuBuilt = true;


    const menu =
        document.getElementById(
            "sandbox-menu"
        );


    menu.innerHTML = `

        <div class="menu-section-title">
            SOLAR SYSTEM
        </div>

        <button
            class="game-button"
            data-type="star">
            ⭐ STAR
        </button>

        <button
            class="game-button"
            data-type="blue-hypergiant">
            🔵 BLUE HYPERGIANT
        </button>

        <button
            class="game-button"
            data-type="contact-binary">
            ⭐ CONTACT BINARY
        </button>

        <button
            class="game-button"
            data-type="planet">
            🌎 PLANET
        </button>

        <button
            class="game-button"
            data-type="moon">
            🌙 MOON
        </button>

        <button
            class="game-button"
            data-type="asteroid">
            ☄️ ASTEROID
        </button>

        <button
            class="game-button"
            data-type="antimatter">
            💜 ANTIMATTER WORLD
        </button>

        <button
            class="game-button"
            data-type="black-hole">
            🕳️ BLACK HOLE
        </button>

        <button
            class="game-button"
            data-type="grey-hole">
            🔴 GREY HOLE
        </button>

        <button
            class="game-button"
            data-type="wormhole">
            🌀 WORMHOLE
        </button>

        <button
            class="game-button"
            id="solar-reset">
            🎯 RESET CAMERA
        </button>

        <button
            class="game-button"
            id="solar-clear">
            🗑️ CLEAR SYSTEM
        </button>

        <button
            class="game-button"
            id="solar-menu">
            ← MAIN MENU
        </button>
    `;


    menu
        .querySelectorAll(
            "[data-type]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedType =
                        button.dataset.type;
                }
            );
        });


    document
        .getElementById(
            "solar-reset"
        )
        .onclick =
        resetSolarCamera;


    document
        .getElementById(
            "solar-clear"
        )
        .onclick =
        clearSystem;


    document
        .getElementById(
            "solar-menu"
        )
        .onclick = () => {

            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-menu"
                )
            );
        };
}


export function startSolarSystem(
    gameCanvas,
    gameCtx,
    menuCallback
) {

    canvas = gameCanvas;
    ctx = gameCtx;

    camera =
        new Camera();

    objects = [];

    running = true;

    createStarfield();

    createSolarMenu();

    clearParticles();


    const menu =
        document.getElementById(
            "sandbox-menu"
        );

    menu.style.display =
        "block";


    enableCameraZoom(
        canvas,
        camera
    );


    if (!canvas.dataset.solarEvents) {

        canvas.dataset.solarEvents =
            "true";


        canvas.addEventListener(
            "pointerdown",
            solarPointerDown
        );

        canvas.addEventListener(
            "pointermove",
            solarPointerMove
        );

        canvas.addEventListener(
            "pointerup",
            solarPointerUp
        );

        canvas.addEventListener(
            "pointercancel",
            solarPointerUp
        );
    }


    if (
        !window.__universeMenuListener
    ) {

        window.__universeMenuListener =
            true;

        window.addEventListener(
            "universe-smash-menu",
            () => {

                if (menuCallback) {
                    menuCallback();
                }
            }
        );
    }
}


export function stopSolarSystem() {

    running = false;

    const menu =
        document.getElementById(
            "sandbox-menu"
        );

    if (menu) {
        menu.style.display =
            "none";
    }
}


export function resetSolarCamera() {

    if (camera) {

        camera.reset();
    }
}


function solarPointerDown(event) {

    if (!running) {
        return;
    }


    if (
        event.button === 1 ||
        event.button === 2
    ) {

        dragging = true;

        lastMouseX =
            event.clientX;

        lastMouseY =
            event.clientY;

        return;
    }


    if (event.button === 0) {

        addObject(
            event.clientX,
            event.clientY
        );
    }
}


function solarPointerMove(event) {

    if (!dragging) {
        return;
    }


    const dx =
        event.clientX -
        lastMouseX;

    const dy =
        event.clientY -
        lastMouseY;


    camera.move(
        -dx,
        -dy
    );


    lastMouseX =
        event.clientX;

    lastMouseY =
        event.clientY;
}


function solarPointerUp() {

    dragging = false;
}


export function updateSolarSystem(
    deltaTime = 1
) {

    if (!running) {
        return;
    }


    updatePhysics(
        objects,
        deltaTime
    );


    for (const object of objects) {

        if (
            object.type ===
            "black-hole"
        ) {

            updateBlackHole(
                object,
                deltaTime
            );
        }


        if (
            object.type ===
            "grey-hole"
        ) {

            updateGreyHole(
                object,
                deltaTime
            );
        }


        if (
            object.type ===
            "wormhole"
        ) {

            updateWormhole(
                object,
                deltaTime
            );
        }


        if (
            object.type ===
            "antimatter-planet"
        ) {

            updateAntimatterPlanet(
                object,
                deltaTime
            );
        }


        if (
            object.type ===
            "asteroid"
        ) {

            object.rotation +=
                object.rotationSpeed *
                deltaTime;
        }


        if (
            object.type ===
            "contact-binary"
        ) {

            object.rotation +=
                0.025 *
                deltaTime;
        }
    }


    updateParticles(
        deltaTime
    );


    objects =
        objects.filter(
            object =>
                !object.destroyed
        );
}


function drawStarfield() {

    ctx.fillStyle =
        "#000";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (const star of starfield) {

        const screen =
            camera.worldToScreen(
                star.x,
                star.y,
                canvas
            );


        if (
            screen.x < -10 ||
            screen.x >
                canvas.width + 10 ||
            screen.y < -10 ||
            screen.y >
                canvas.height + 10
        ) {

            continue;
        }


        ctx.globalAlpha =
            0.3 +
            star.brightness *
            0.7;


        ctx.fillStyle =
            "#ffffff";


        ctx.beginPath();

        ctx.arc(
            screen.x,
            screen.y,
            Math.max(
                0.5,
                star.size *
                Math.min(
                    camera.zoom,
                    1
                )
            ),
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.globalAlpha = 1;
}


function drawPlanet(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const radius =
        object.radius *
        camera.zoom;


    const gradient =
        ctx.createRadialGradient(
            p.x -
                radius * 0.35,
            p.y -
                radius * 0.35,
            radius * 0.1,
            p.x,
            p.y,
            radius
        );


    gradient.addColorStop(
        0,
        "#ffffff"
    );

    gradient.addColorStop(
        0.15,
        object.color
    );

    gradient.addColorStop(
        1,
        "#07101f"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "rgba(255,255,255,0.3)";

    ctx.stroke();
}


function drawMoon(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    ctx.fillStyle =
        "#aaa";


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        object.radius *
            camera.zoom,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


function drawAsteroid(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const radius =
        object.radius *
        camera.zoom;


    ctx.save();

    ctx.translate(
        p.x,
        p.y
    );

    ctx.rotate(
        object.rotation
    );


    ctx.fillStyle =
        object.color;


    ctx.beginPath();

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const angle =
            i *
            Math.PI /
            4;

        const r =
            radius *
            (
                0.7 +
                Math.random() *
                0.3
            );


        const x =
            Math.cos(angle) *
            r;

        const y =
            Math.sin(angle) *
            r;


        if (i === 0) {
            ctx.moveTo(x, y);
        }

        else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


function drawStar(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const radius =
        object.radius *
        camera.zoom;


    const glow =
        ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            radius * 2.5
        );


    glow.addColorStop(
        0,
        object.color
    );

    glow.addColorStop(
        0.3,
        object.color
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        glow;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        radius * 2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        object.color;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


function drawContactBinary(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const r =
        object.radius *
        camera.zoom;


    ctx.save();

    ctx.translate(
        p.x,
        p.y
    );

    ctx.rotate(
        object.rotation
    );


    for (
        let i = 0;
        i < 2;
        i++
    ) {

        const x =
            i === 0 ?
            -r * 0.42 :
            r * 0.42;


        const gradient =
            ctx.createRadialGradient(
                x - r * 0.15,
                -r * 0.15,
                1,
                x,
                0,
                r * 0.75
            );


        gradient.addColorStop(
            0,
            "#ffffff"
        );

        gradient.addColorStop(
            0.3,
            "#fff2a0"
        );

        gradient.addColorStop(
            1,
            "#ff7b00"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();

        ctx.arc(
            x,
            0,
            r * 0.65,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.restore();
}


function drawBlackHole(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const r =
        object.radius *
        camera.zoom;


    ctx.save();


    const glow =
        ctx.createRadialGradient(
            p.x,
            p.y,
            r * 0.4,
            p.x,
            p.y,
            r * 2
        );


    glow.addColorStop(
        0,
        "rgba(0,0,0,1)"
    );

    glow.addColorStop(
        0.55,
        "rgba(100,50,180,0.35)"
    );

    glow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        glow;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r * 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#8c5cff";

    ctx.lineWidth =
        Math.max(
            1,
            r * 0.12
        );


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r * 1.3,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.fillStyle =
        "#000";


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();
}


function drawGreyHole(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const r =
        object.radius *
        camera.zoom;


    const pulse =
        Math.sin(
            object.glow
        ) *
        0.2 +
        0.8;


    const gradient =
        ctx.createRadialGradient(
            p.x,
            p.y,
            r * 0.2,
            p.x,
            p.y,
            r * 2
        );


    gradient.addColorStop(
        0,
        "#050505"
    );

    gradient.addColorStop(
        0.45,
        `rgba(180,40,40,${pulse})`
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r * 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#080808";


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#b73535";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r * 1.25,
        0,
        Math.PI * 2
    );

    ctx.stroke();
}


function drawWormhole(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const r =
        object.radius *
        camera.zoom;


    ctx.save();

    ctx.translate(
        p.x,
        p.y
    );

    ctx.rotate(
        object.rotation
    );


    const gradient =
        ctx.createRadialGradient(
            0,
            0,
            r * 0.1,
            0,
            0,
            r * 1.7
        );


    gradient.addColorStop(
        0,
        "#000"
    );

    gradient.addColorStop(
        0.4,
        "#763cff"
    );

    gradient.addColorStop(
        0.7,
        "#22c7ff"
    );

    gradient.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();

    ctx.arc(
        0,
        0,
        r * 1.7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#b36cff";

    ctx.lineWidth =
        Math.max(
            1,
            r * 0.08
        );


    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        r * 1.3,
        r * 0.55,
        0,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    ctx.restore();
}


function drawAntimatter(
    object
) {

    const p =
        camera.worldToScreen(
            object.x,
            object.y,
            canvas
        );


    const r =
        object.radius *
        camera.zoom;


    const gradient =
        ctx.createRadialGradient(
            p.x - r * 0.3,
            p.y - r * 0.3,
            1,
            p.x,
            p.y,
            r * 1.5
        );


    gradient.addColorStop(
        0,
        "#ffffff"
    );

    gradient.addColorStop(
        0.2,
        "#ff7cff"
    );

    gradient.addColorStop(
        0.7,
        "#b000ff"
    );

    gradient.addColorStop(
        1,
        "#22002f"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#ff40ff";

    ctx.lineWidth =
        2;


    ctx.stroke();
}


export function drawSolarSystem() {

    if (
        !canvas ||
        !ctx ||
        !camera
    ) {
        return;
    }


    drawStarfield();


    for (const object of objects) {

        if (object.destroyed) {
            continue;
        }


        switch (object.type) {

            case "planet":
                drawPlanet(object);
                break;

            case "moon":
                drawMoon(object);
                break;

            case "asteroid":
                drawAsteroid(object);
                break;

            case "star":
            case "blue-hypergiant":
                drawStar(object);
                break;

            case "contact-binary":
                drawContactBinary(object);
                break;

            case "black-hole":
                drawBlackHole(object);
                break;

            case "grey-hole":
                drawGreyHole(object);
                break;

            case "wormhole":
                drawWormhole(object);
                break;

            case "antimatter-planet":
                drawAntimatter(object);
                break;
        }
    }


    drawParticles(
        ctx,
        camera,
        canvas
    );


    const count =
        document.getElementById(
            "object-count"
        );

    const zoom =
        document.getElementById(
            "zoom-display"
        );

    const mode =
        document.getElementById(
            "mode-display"
        );


    if (count) {
        count.textContent =
            `Objects: ${objects.length}`;
    }

    if (zoom) {
        zoom.textContent =
            `Zoom: ${Math.round(camera.zoom * 100)}%`;
    }

    if (mode) {
        mode.textContent =
            "SOLAR SYSTEM";
    }
}
