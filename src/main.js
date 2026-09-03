// src/main.js
// Universe Smash - Main Controller

import {
    runStartup,
    finishStartup
} from "./startup.js";

import {
    initializeMenu
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
    resetSolarSystem
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
    element.style.visibility = "visible";
    element.classList.remove("hidden");
    element.classList.add("visible");
}

function hide(id) {
    const element = $(id);

    if (!element) return;

    element.style.display = "none";
    element.style.visibility = "hidden";
    element.classList.remove("visible");
    element.classList.add("hidden");
}


// ============================================================
// CANVAS
// ============================================================

function resizeCanvas() {
    if (!canvas) return;

    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    const dpr = Math.max(
        1,
        Math.min(2, window.devicePixelRatio || 1)
    );

    canvas.width = Math.floor(canvasWidth * dpr);
    canvas.height = Math.floor(canvasHeight * dpr);

    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    if (ctx) {
        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }
}


// ============================================================
// HIDE ALL MENUS
// ============================================================

function hideAllMenus() {
    hide("main-menu");
    hide("sandbox-menu");
    hide("planet-weapon-menu");
    hide("settings-menu");
    hide("pause-menu");
    hide("game-info");
}


// ============================================================
// SHOW GAME
// ============================================================

function showGame() {

    hideAllMenus();

    if (!canvas) return;

    canvas.style.display = "block";
    canvas.style.visibility = "visible";
    canvas.style.opacity = "1";

    resizeCanvas();

    show("game-info", "block");
}


// ============================================================
// SHOW MAIN MENU
// ============================================================

function showMainMenuScreen() {

    if (canvas) {
        canvas.style.display = "none";
        canvas.style.visibility = "hidden";
    }

    hide("sandbox-menu");
    hide("planet-weapon-menu");
    hide("settings-menu");
    hide("pause-menu");
    hide("game-info");

    show("main-menu", "flex");
}


// ============================================================
// PLANET MODE
// ============================================================

function enterPlanetMode() {

    console.log(
        "Universe Smash: Starting Planet Mode..."
    );

    currentMode = "planet";
    gameRunning = true;
    paused = false;

    showGame();

    try {

        startPlanetMode(canvas);

        setPlanetModePaused(false);

        console.log(
            "Universe Smash: Planet Mode started successfully."
        );

    } catch (error) {

        console.error(
            "Universe Smash: Planet Mode error:",
            error
        );

        drawError(
            "PLANET MODE ERROR",
            error
        );
    }

    unlockAudio();
}


// ============================================================
// SOLAR SYSTEM MODE
// ============================================================

function enterSolarSystemMode() {

    console.log(
        "Universe Smash: Starting Solar System Mode..."
    );

    currentMode = "solar";
    gameRunning = true;
    paused = false;

    showGame();

    try {

        startSolarSystem(canvas);

        console.log(
            "Universe Smash: Solar System Mode started successfully."
        );

    } catch (error) {

        console.error(
            "Universe Smash: Solar System Mode error:",
            error
        );

        drawError(
            "SOLAR SYSTEM ERROR",
            error
        );
    }

    unlockAudio();
}


// ============================================================
// RETURN TO MENU
// ============================================================

function returnToMainMenu() {

    console.log(
        "Universe Smash: Returning to main menu."
    );

    gameRunning = false;
    paused = false;
    currentMode = "menu";

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

    showMainMenuScreen();
}


// ============================================================
// PAUSE
// ============================================================

function togglePause() {

    if (!gameRunning) return;

    paused = !paused;

    if (currentMode === "planet") {

        try {
            setPlanetModePaused(paused);
        } catch (error) {
            console.warn(
                "Planet pause warning:",
                error
            );
        }
    }

    if (paused) {
        show("pause-menu", "flex");
    } else {
        hide("pause-menu");
    }

    console.log(
        `Universe Smash: ${
            paused ? "PAUSED" : "RESUMED"
        }`
    );
}


// ============================================================
// RESET
// ============================================================

function resetCurrentMode() {

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


// ============================================================
// AUDIO
// ============================================================

function unlockAudio() {

    try {
        resumeAudio();
    } catch (error) {
        console.warn(
            "Audio unlock warning:",
            error
        );
    }
}


// ============================================================
// ERROR SCREEN
// ============================================================

function drawError(title, error) {

    if (!ctx) return;

    resizeCanvas();

    ctx.save();

    ctx.setTransform(
        1,
        0,
        0,
        1,
        0,
        0
    );

    ctx.fillStyle = "#02030a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px Arial";

    ctx.fillText(
        title,
        canvas.width / 2,
        canvas.height / 2 - 40
    );

    ctx.fillStyle = "#9db8dc";
    ctx.font = "16px Arial";

    const message =
        error && error.message
            ? error.message
            : String(error);

    ctx.fillText(
        message,
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.fillStyle = "#6fa8ff";
    ctx.font = "15px Arial";

    ctx.fillText(
        "Press ESC to return to the main menu.",
        canvas.width / 2,
        canvas.height / 2 + 45
    );

    ctx.restore();
}


// ============================================================
// MENU BUTTONS
// ============================================================

function setupMenuButtons() {

    const planetButton =
        $("planet-mode-button");

    if (planetButton) {

        planetButton.onclick = () => {
            enterPlanetMode();
        };
    }


    const solarButton =
        $("solar-system-button");

    if (solarButton) {

        solarButton.onclick = () => {
            enterSolarSystemMode();
        };
    }


    const sandboxButton =
        $("sandbox-mode-button");

    if (sandboxButton) {

        sandboxButton.onclick = () => {
            enterSolarSystemMode();
        };
    }


    const mainMenuButton =
        $("main-menu-button");

    if (mainMenuButton) {

        mainMenuButton.onclick = () => {
            returnToMainMenu();
        };
    }


    const backButton =
        $("back-button");

    if (backButton) {

        backButton.onclick = () => {
            returnToMainMenu();
        };
    }


    const resumeButton =
        $("resume-button");

    if (resumeButton) {

        resumeButton.onclick = () => {

            if (paused) {
                togglePause();
            }
        };
    }


    const pauseMenuButton =
        $("pause-menu-button");

    if (pauseMenuButton) {

        pauseMenuButton.onclick = () => {
            returnToMainMenu();
        };
    }
}


// ============================================================
// KEYBOARD
// ============================================================

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        (event) => {

            // ESC
            if (event.code === "Escape") {

                event.preventDefault();

                if (currentMode !== "menu") {
                    returnToMainMenu();
                }

                return;
            }


            // P
            if (event.code === "KeyP") {

                event.preventDefault();

                togglePause();

                return;
            }


            // SPACE
            if (
                event.code === "Space" &&
                currentMode !== "menu"
            ) {

                event.preventDefault();

                togglePause();

                return;
            }


            // R
            if (event.code === "KeyR") {

                event.preventDefault();

                if (currentMode !== "menu") {
                    resetCurrentMode();
                }
            }
        }
    );
}


// ============================================================
// AUDIO UNLOCK
// ============================================================

function setupAudioUnlock() {

    const unlock = () => {

        unlockAudio();
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
// GAME LOOP
// ============================================================

function gameLoop(timestamp) {

    if (!lastTime) {
        lastTime = timestamp;
    }

    const deltaTime = Math.min(
        (timestamp - lastTime) / 1000,
        0.05
    );

    lastTime = timestamp;


    // UPDATE
    if (
        gameRunning &&
        !paused
    ) {

        try {

            if (currentMode === "planet") {

                updatePlanetMode(
                    deltaTime
                );
            }

            if (currentMode === "solar") {

                updateSolarSystem(
                    deltaTime
                );
            }

        } catch (error) {

            console.error(
                "Universe Smash: Update error:",
                error
            );
        }
    }


    // DRAW
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
        }
    }


    requestAnimationFrame(
        gameLoop
    );
}


// ============================================================
// INITIALIZATION
// ============================================================

async function initializeGame() {

    console.log(
        "Universe Smash: Initializing..."
    );

    canvas =
        $("game-canvas");

    if (!canvas) {

        console.error(
            "Universe Smash: game-canvas not found."
        );

        return;
    }

    ctx =
        canvas.getContext("2d");

    if (!ctx) {

        console.error(
            "Universe Smash: Canvas context unavailable."
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


    showMainMenuScreen();


    console.log(
        "================================"
    );

    console.log(
        "UNIVERSE SMASH READY!"
    );

    console.log(
        "================================"
    );


    requestAnimationFrame(
        gameLoop
    );
}


// ============================================================
// GLOBAL API
// ============================================================

window.UniverseSmash = {

    enterPlanetMode,

    enterSolarSystemMode,

    returnToMainMenu,

    togglePause,

    resetCurrentMode,

    resizeCanvas,

    getCurrentMode: () =>
        currentMode,

    isPaused: () =>
        paused,

    isRunning: () =>
        gameRunning
};


// ============================================================
// START
// ============================================================

bootGame();
