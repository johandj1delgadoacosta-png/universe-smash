import { runStartup } from "./startup.js";
import { showMainMenu } from "./menu.js";

import {
    startPlanetMode,
    stopPlanetMode,
    updatePlanetMode,
    drawPlanetMode
} from "./modes/planet-mode.js";

import {
    startSolarSystem,
    stopSolarSystem,
    updateSolarSystem,
    drawSolarSystem,
    resetSolarCamera
} from "./modes/solar-system.js";


const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let currentMode = "menu";

let paused = false;

let lastTime = performance.now();


function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


export function showGameUI() {

    document.getElementById("game-info").style.display =
        "block";
}


export function hideGameUI() {

    document.getElementById("game-info").style.display =
        "none";
}


export function updateGameInfo(objectCount, zoom, mode) {

    const count =
        document.getElementById("object-count");

    const zoomDisplay =
        document.getElementById("zoom-display");

    const modeDisplay =
        document.getElementById("mode-display");

    if (count) {
        count.textContent =
            `Objects: ${objectCount}`;
    }

    if (zoomDisplay) {
        zoomDisplay.textContent =
            `Zoom: ${Math.round(zoom * 100)}%`;
    }

    if (modeDisplay) {
        modeDisplay.textContent =
            mode;
    }
}


export function openMainMenu() {

    currentMode = "menu";

    paused = false;

    stopPlanetMode();
    stopSolarSystem();

    document.getElementById(
        "main-menu"
    ).style.display = "flex";

    document.getElementById(
        "sandbox-menu"
    ).style.display = "none";

    document.getElementById(
        "planet-weapon-menu"
    ).style.display = "none";

    hideGameUI();
}


function startPlanet() {

    currentMode = "planet";

    document.getElementById(
        "main-menu"
    ).style.display = "none";

    document.getElementById(
        "planet-weapon-menu"
    ).style.display = "block";

    document.getElementById(
        "sandbox-menu"
    ).style.display = "none";

    showGameUI();

    startPlanetMode(
        canvas,
        ctx,
        openMainMenu
    );
}


function startSolar() {

    currentMode = "solar";

    document.getElementById(
        "main-menu"
    ).style.display = "none";

    document.getElementById(
        "planet-weapon-menu"
    ).style.display = "none";

    document.getElementById(
        "sandbox-menu"
    ).style.display = "block";

    showGameUI();

    startSolarSystem(
        canvas,
        ctx,
        openMainMenu
    );
}


function setupMenu() {

    showMainMenu({

        onPlanetMode: startPlanet,

        onSolarSystem: startSolar
    });
}


window.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            if (
                currentMode === "planet" ||
                currentMode === "solar"
            ) {

                openMainMenu();
            }
        }

        if (event.key.toLowerCase() === "p") {

            if (
                currentMode === "planet" ||
                currentMode === "solar"
            ) {

                paused = !paused;
            }
        }

        if (
            currentMode === "solar" &&
            event.key.toLowerCase() === "r"
        ) {

            resetSolarCamera();
        }
    }
);


function update(deltaTime) {

    if (paused) {
        return;
    }

    if (currentMode === "planet") {

        updatePlanetMode(deltaTime);
    }

    if (currentMode === "solar") {

        updateSolarSystem(deltaTime);
    }
}


function draw() {

    if (currentMode === "planet") {

        drawPlanetMode();
    }

    else if (currentMode === "solar") {

        drawSolarSystem();
    }

    else {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}


function gameLoop(time) {

    const deltaTime =
        Math.min(
            (time - lastTime) / 16.6667,
            3
        );

    lastTime = time;

    update(deltaTime);

    draw();

    requestAnimationFrame(gameLoop);
}


async function startGame() {

    await runStartup();

    setupMenu();

    requestAnimationFrame(gameLoop);
}


startGame();
