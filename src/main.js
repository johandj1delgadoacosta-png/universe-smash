// src/main.js
// Universe Smash - Main Game Controller

import {
    runStartup,
    finishStartup
} from "./startup.js";

import {
    initializeMenu,
    showMainMenu,
    hideMenus
} from "./menu.js";

import {
    startPlanetMode,
    stopPlanetMode,
    updatePlanetMode,
    drawPlanetMode,
    resetPlanetMode,
    setPlanetModePaused
} from "./modes/planet-mode.js";

import {
    startSolarSystem,
    stopSolarSystem,
    updateSolarSystem,
    drawSolarSystem,
    resetSolarSystem,
    setSolarSystemPaused
} from "./modes/solar-system.js";

import {
    initAudio,
    resumeAudio
} from "./audio.js";


// ============================================================
// GAME STATE
// ============================================================

let canvas = null;
let ctx = null;

let currentMode = "menu";
let gameRunning = false;
let paused = false;

let lastTime = 0;

let canvasWidth = 0;
let canvasHeight = 0;


// ============================================================
// DOM HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}

function show(id, display = "block") {
    const element = $(id);

    if (!element) return;

    element.style.display = display;
    element.classList.remove("hidden");
    element.classList.add("visible");
}

function hide(id) {
    const element = $(id);

    if (!element) return;

    element.style.display = "none";
    element.classList.remove("visible");
    element.classList.add("hidden");
}


// ============================================================
// CANVAS
// ============================================================

function resizeCanvas() {
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    canvasWidth = width;
    canvasHeight = height;

    const devicePixelRatio =
        Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (ctx) {
        ctx.setTransform(
            devicePixelRatio,
            0,
            0,
            devicePixelRatio,
            0,
            0
        );
    }
}


// ============================================================
// INTERFACE
// ============================================================

function hideEverything() {
    hide("main-menu");
    hide("sandbox-menu");
    hide("planet-weapon-menu");
    hide("settings-menu");
    hide("pause-menu");
    hide("game-info");
}

function showGameInterface() {
    hideEverything();

    if (!canvas) return;

    canvas.style.display = "block";
    canvas.style.visibility = "visible";
    canvas.style.opacity = "1";

    show("game-info", "block");

    resizeCanvas();
}

function showMenuInterface() {
    if (canvas) {
        canvas.style.display = "none";
    }

    hide("sandbox-menu");
    hide("planet-weapon-menu");
    hide("settings-menu");
    hide("pause-menu");
    hide("game-info");

    show("main-menu", "flex");
}


// ============================================================
// CLEAR CANVAS
// ============================================================

function clearCanvas() {
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = "#02030a";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    resizeCanvas();
}


// ============================================================
// START PLANET MODE
// ============================================================

function enterPlanetMode() {
    console.log("Universe Smash: Starting Planet Mode");

    currentMode = "planet";
    paused = false;
    gameRunning = true;

    hideEverything();

    showGameInterface();

    try {
        startPlanetMode(canvas);

        setPlanetModePaused(false);

        console.log("Universe Smash: Planet Mode started");
    } catch (error) {
        console.error(
            "Universe Smash: Planet Mode start error:",
            error
        );

        clearCanvas();

        drawErrorMessage(
            "PLANET MODE ERROR",
            error
        );
    }

    resumeGameAudio();
}


// ============================================================
// START SOLAR SYSTEM MODE
// ============================================================

function enterSolarSystemMode() {
    console.log("Universe Smash: Starting Solar System Mode");

    currentMode = "solar";
    paused = false;
    gameRunning = true;

    hideEverything();

    showGameInterface();

    try {
        startSolarSystem(canvas);

        setSolarSystemPaused(false);

        console.log(
            "Universe Smash: Solar System Mode started"
        );
    } catch (error) {
        console.error(
            "Universe Smash: Solar System start error:",
            error
        );

        clearCanvas();

        drawErrorMessage(
            "SOLAR SYSTEM ERROR",
            error
        );
    }

    resumeGameAudio();
}


// ============================================================
// RETURN TO MAIN MENU
// ============================================================

function returnToMainMenu() {
    console.log("Universe Smash: Returning to main menu");

    gameRunning = false;
    paused = false;

    try {
        stopPlanetMode();
    } catch (error) {
        console.warn(
            "Planet Mode stop warning:",
            error
        );
    }

    try {
        stopSolarSystem();
    } catch (error) {
        console.warn(
            "Solar System stop warning:",
            error
        );
    }

    currentMode = "menu";

    hideEverything();

    showMenuInterface();

    console.log(
        "Universe Smash: Main menu displayed"
    );
}


// ============================================================
// PAUSE
// ============================================================

function togglePause() {
    if (!gameRunning) return;

    paused = !paused;

    try {
        setPlanetModePaused(paused);
    } catch (_) {}

    try {
        setSolarSystemPaused(paused);
    } catch (_) {}

    if (paused) {
        show("pause-menu", "flex");
    } else {
        hide("pause-menu");
    }

    console.log(
        `Universe Smash: ${paused ? "Paused" : "Resumed"}`
    );
}


// ============================================================
// AUDIO
// ============================================================

function resumeGameAudio() {
    try {
        resumeAudio();
    } catch (error) {
        console.warn(
            "Audio resume warning:",
            error
        );
    }
}


// ============================================================
// ERROR DISPLAY
// ============================================================

function drawErrorMessage(title, error) {
    if (!ctx) return;

    resizeCanvas();

    const message =
        error && error.message
            ? error.message
            : String(error);

    ctx.save();

    ctx.fillStyle = "#02030a";
    ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";

    ctx.fillText(
        title,
        canvasWidth / 2,
        canvasHeight / 2 - 35
    );

    ctx.fillStyle = "#9fb7d8";
    ctx.font = "16px Arial";

    ctx.fillText(
        message,
        canvasWidth / 2,
        canvasHeight / 2 + 5
    );

    ctx.fillStyle = "#6fa8ff";
    ctx.font = "15px Arial";

    ctx.fillText(
        "Press ESC to return to the main menu",
        canvasWidth / 2,
        canvasHeight / 2 + 45
    );

    ctx.restore();
}


// ============================================================
// KEYBOARD
// ============================================================

function setupKeyboard() {
    document.addEventListener("keydown", (event) => {

        // ESC = main menu
        if (event.code === "Escape") {
            event.preventDefault();

            if (currentMode !== "menu") {
                returnToMainMenu();
            }

            return;
        }

        // P = pause
        if (event.code === "KeyP") {
            event.preventDefault();

            togglePause();

            return;
        }

        // SPACE = pause
        if (
            event.code === "Space" &&
            currentMode !== "menu"
        ) {
            event.preventDefault();

            togglePause();

            return;
        }

        // R = reset current mode
        if (event.code === "KeyR") {
            event.preventDefault();

            if (currentMode === "planet") {
                try {
                    resetPlanetMode();
                } catch (error) {
                    console.error(
                        "Planet reset error:",
                        error
                    );
                }
            }

            if (currentMode === "solar") {
                try {
                    resetSolarSystem();
                } catch (error) {
                    console.error(
                        "Solar System reset error:",
                        error
                    );
                }
            }
        }
    });
}


// ============================================================
// MOUSE / TOUCH AUDIO UNLOCK
// ============================================================

function setupAudioUnlock() {
    const unlock = () => {
        resumeGameAudio();

        window.removeEventListener(
            "pointerdown",
            unlock
        );

        window.removeEventListener(
            "keydown",
            unlock
        );
    };

    window.addEventListener(
        "pointerdown",
        unlock,
        { once: true }
    );

    window.addEventListener(
        "keydown",
        unlock,
        { once: true }
    );
}


// ============================================================
// MENU BUTTONS
// ============================================================

function setupMenuButtons() {

    const planetButton = $("planet-mode-button");

    if (planetButton) {
        planetButton.addEventListener(
            "click",
            () => {
                enterPlanetMode();
            }
        );
    }

    const solarButton = $("solar-system-button");

    if (solarButton) {
        solarButton.addEventListener(
            "click",
            () => {
                enterSolarSystemMode();
            }
        );
    }

    const sandboxButton = $("sandbox-mode-button");

    if (sandboxButton) {
        sandboxButton.addEventListener(
            "click",
            () => {
                enterSolarSystemMode();
            }
        );
    }

    const mainMenuButton = $("main-menu-button");

    if (mainMenuButton) {
        mainMenuButton.addEventListener(
            "click",
            () => {
                returnToMainMenu();
            }
        );
    }

    const backButton = $("back-button");

    if (backButton) {
        backButton.addEventListener(
            "click",
            () => {
                returnToMainMenu();
            }
        );
    }

    const resumeButton = $("resume-button");

    if (resumeButton) {
        resumeButton.addEventListener(
            "click",
            () => {
                if (paused) {
                    togglePause();
                }
            }
        );
    }

    const pauseMenuButton = $("pause-menu-button");

    if (pauseMenuButton) {
        pauseMenuButton.addEventListener(
            "click",
            () => {
                returnToMainMenu();
            }
        );
    }
}


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop(timestamp) {

    if (!lastTime) {
        lastTime = timestamp;
    }

    const deltaTime =
        Math.min(
            (timestamp - lastTime) / 1000,
            0.05
        );

    lastTime = timestamp;

    if (gameRunning && !paused) {

        try {

            if (currentMode === "planet") {
                updatePlanetMode(deltaTime);
            }

            if (currentMode === "solar") {
                updateSolarSystem(deltaTime);
            }

        } catch (error) {

            console.error(
                "Universe Smash: Update error:",
                error
            );
        }
    }

    if (gameRunning) {

        try {

            if (currentMode === "planet") {
                drawPlanetMode(ctx);
            }

            if (currentMode === "solar") {
                drawSolarSystem(ctx);
            }

        } catch (error) {

            console.error(
                "Universe Smash: Draw error:",
                error
            );

            drawErrorMessage(
                "RENDER ERROR",
                error
            );
        }
    }

    requestAnimationFrame(gameLoop);
}


// ============================================================
// INITIALIZATION
// ============================================================

async function initializeGame() {

    console.log(
        "Universe Smash: Initializing..."
    );

    canvas = $("game-canvas");

    if (!canvas) {
        console.error(
            "Universe Smash: #game-canvas was not found."
        );

        return;
    }

    ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error(
            "Universe Smash: Could not create 2D canvas context."
        );

        return;
    }

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    setupKeyboard();
    setupAudioUnlock();
    setupMenuButtons();

    try {
        initAudio();
    } catch (error) {
        console.warn(
            "Audio initialization warning:",
            error
        );
    }

    try {
        initializeMenu();
    } catch (error) {
        console.warn(
            "Menu initialization warning:",
            error
        );
    }

    console.log(
        "Universe Smash: Main menu buttons ready."
    );
}


// ============================================================
// BOOT
// ============================================================

async function bootGame() {

    console.log(
        "Universe Smash: Booting..."
    );

    await initializeGame();

    try {
        await runStartup();
    } catch (error) {
        console.error(
            "Startup error:",
            error
        );
    }

    finishStartup();

    currentMode = "menu";
    gameRunning = false;
    paused = false;

    showMenuInterface();

    console.log(
        "================================"
    );

    console.log(
        "UNIVERSE SMASH READY!"
    );

    console.log(
        "================================"
    );

    requestAnimationFrame(gameLoop);
}


// ============================================================
// GLOBAL API
// ============================================================

window.UniverseSmash = {

    enterPlanetMode,

    enterSolarSystemMode,

    returnToMainMenu,

    togglePause,

    resizeCanvas,

    getCurrentMode: () => currentMode,

    isPaused: () => paused,

    isRunning: () => gameRunning
};


// Start game
bootGame();
