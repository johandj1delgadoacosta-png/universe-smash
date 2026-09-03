// ============================================================
// UNIVERSE SMASH - MAIN GAME CONTROLLER
// ============================================================

import {
    runStartup
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
    setPlanetModePaused,
    togglePlanetModePause,
    resetPlanetMode
} from "./modes/planet-mode.js";

import {
    startSolarSystem,
    stopSolarSystem,
    updateSolarSystem,
    drawSolarSystem,
    createDefaultSolarSystem,
    clearSolarSystem,
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

const game = {
    canvas: null,
    ctx: null,

    width: 0,
    height: 0,

    currentMode: "menu",

    running: false,
    paused: false,

    lastTime: 0,

    initialized: false
};

// ============================================================
// CANVAS SETUP
// ============================================================

function setupCanvas() {
    game.canvas = document.getElementById("game-canvas");

    if (!game.canvas) {
        console.error("Universe Smash: game canvas not found.");
        return false;
    }

    game.ctx = game.canvas.getContext("2d");

    if (!game.ctx) {
        console.error("Universe Smash: could not get canvas context.");
        return false;
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    return true;
}

// ============================================================
// RESIZE
// ============================================================

function resizeCanvas() {
    if (!game.canvas) {
        return;
    }

    const dpr = Math.max(
        1,
        Math.min(2, window.devicePixelRatio || 1)
    );

    const width = window.innerWidth;
    const height = window.innerHeight;

    game.width = width;
    game.height = height;

    game.canvas.width = Math.floor(width * dpr);
    game.canvas.height = Math.floor(height * dpr);

    game.canvas.style.width = `${width}px`;
    game.canvas.style.height = `${height}px`;

    game.ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}

// ============================================================
// BASIC DOM HELPERS
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}

function showElement(element) {
    if (!element) {
        return;
    }

    element.style.display = "";
    element.style.visibility = "visible";
    element.style.opacity = "1";
    element.style.pointerEvents = "auto";
}

function hideElement(element) {
    if (!element) {
        return;
    }

    element.style.display = "none";
}

// ============================================================
// CREATE MAIN MENU IF NEEDED
// ============================================================

function buildMainMenu() {
    let menu = getElement("main-menu");

    if (!menu) {
        menu = document.createElement("div");
        menu.id = "main-menu";
        menu.setAttribute("aria-label", "Main menu");

        document.body.appendChild(menu);
    }

    // If the menu already contains buttons, keep them.
    const existingButtons = menu.querySelectorAll("button");

    if (existingButtons.length > 0) {
        return menu;
    }

    menu.innerHTML = `
        <div class="main-menu-inner">

            <div class="main-menu-title">
                UNIVERSE SMASH
            </div>

            <div class="main-menu-subtitle">
                COSMIC SIMULATION ENGINE
            </div>

            <div class="main-menu-buttons">

                <button
                    id="planet-mode-button"
                    class="menu-button"
                    type="button"
                >
                    PLANET MODE
                </button>

                <button
                    id="solar-system-button"
                    class="menu-button"
                    type="button"
                >
                    SOLAR SYSTEM MODE
                </button>

                <button
                    id="settings-button"
                    class="menu-button"
                    type="button"
                >
                    SETTINGS
                </button>

            </div>

        </div>
    `;

    return menu;
}

// ============================================================
// CREATE GAME INFO
// ============================================================

function setupGameInfo() {
    let info = getElement("game-info");

    if (!info) {
        info = document.createElement("div");
        info.id = "game-info";

        info.innerHTML = `
            <div id="game-mode-label">
                UNIVERSE SMASH
            </div>

            <button
                id="game-pause-button"
                type="button"
            >
                PAUSE
            </button>

            <button
                id="game-menu-button"
                type="button"
            >
                MENU
            </button>
        `;

        document.body.appendChild(info);
    }

    return info;
}

// ============================================================
// SHOW MAIN MENU
// ============================================================

function forceShowMainMenu() {
    const startup = getElement("startup-screen");
    const canvas = getElement("game-canvas");
    const info = getElement("game-info");

    hideElement(startup);
    hideElement(canvas);
    hideElement(info);

    const menu = buildMainMenu();

    // IMPORTANT:
    // Force the menu to become visible.
    menu.style.display = "flex";
    menu.style.visibility = "visible";
    menu.style.opacity = "1";
    menu.style.pointerEvents = "auto";

    menu.classList.add("active");

    game.currentMode = "menu";
    game.paused = false;

    console.log("Universe Smash: Main menu displayed.");
}

// ============================================================
// SHOW GAME
// ============================================================

function showGameInterface() {
    const startup = getElement("startup-screen");
    const menu = getElement("main-menu");
    const canvas = getElement("game-canvas");
    const info = setupGameInfo();

    hideElement(startup);
    hideElement(menu);

    showElement(canvas);
    showElement(info);

    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";

    canvas.style.zIndex = "1";

    info.style.zIndex = "20";
}

// ============================================================
// START PLANET MODE
// ============================================================

function launchPlanetMode() {
    console.log("Universe Smash: Starting Planet Mode.");

    activateAudio();

    try {
        stopSolarSystem();
    } catch (error) {
        console.warn("Solar System stop warning:", error);
    }

    game.currentMode = "planet";
    game.paused = false;

    showGameInterface();

    try {
        startPlanetMode(game.canvas);
    } catch (error) {
        console.error(
            "Failed to start Planet Mode:",
            error
        );
    }

    updateModeLabel("PLANET MODE");
}

// ============================================================
// START SOLAR SYSTEM MODE
// ============================================================

function launchSolarSystemMode() {
    console.log("Universe Smash: Starting Solar System Mode.");

    activateAudio();

    try {
        stopPlanetMode();
    } catch (error) {
        console.warn("Planet Mode stop warning:", error);
    }

    game.currentMode = "solar";
    game.paused = false;

    showGameInterface();

    try {
        startSolarSystem(game.canvas);
    } catch (error) {
        console.error(
            "Failed to start Solar System Mode:",
            error
        );
    }

    try {
        createDefaultSolarSystem();
    } catch (error) {
        console.warn(
            "Could not create default solar system:",
            error
        );
    }

    updateModeLabel("SOLAR SYSTEM MODE");
}

// ============================================================
// AUDIO
// ============================================================

function activateAudio() {
    try {
        resumeAudio();
    } catch (error) {
        console.warn(
            "Audio activation warning:",
            error
        );
    }
}

// ============================================================
// MODE LABEL
// ============================================================

function updateModeLabel(text) {
    const label = getElement("game-mode-label");

    if (label) {
        label.textContent = text;
    }
}

// ============================================================
// RETURN TO MENU
// ============================================================

function returnToMainMenu() {
    console.log("Universe Smash: Returning to main menu.");

    try {
        stopPlanetMode();
    } catch (error) {
        console.warn(error);
    }

    try {
        stopSolarSystem();
    } catch (error) {
        console.warn(error);
    }

    game.currentMode = "menu";
    game.paused = false;

    forceShowMainMenu();
}

// ============================================================
// SETTINGS
// ============================================================

function openSettings() {
    activateAudio();

    const mainMenu = getElement("main-menu");

    if (!mainMenu) {
        return;
    }

    mainMenu.innerHTML = `
        <div class="main-menu-inner">

            <div class="main-menu-title">
                SETTINGS
            </div>

            <div class="main-menu-buttons">

                <button
                    id="settings-back-button"
                    class="menu-button"
                    type="button"
                >
                    BACK
                </button>

            </div>

        </div>
    `;

    mainMenu.style.display = "flex";
    mainMenu.style.visibility = "visible";
    mainMenu.style.opacity = "1";
    mainMenu.style.pointerEvents = "auto";

    const back = getElement("settings-back-button");

    if (back) {
        back.addEventListener(
            "click",
            returnToMainMenu
        );
    }
}

// ============================================================
// PAUSE
// ============================================================

function togglePause() {
    if (game.currentMode === "menu") {
        return;
    }

    game.paused = !game.paused;

    if (game.currentMode === "planet") {
        try {
            setPlanetModePaused(game.paused);
        } catch (error) {
            console.warn(error);
        }
    }

    if (game.currentMode === "solar") {
        try {
            setSolarSystemPaused(game.paused);
        } catch (error) {
            console.warn(error);
        }
    }

    const button = getElement("game-pause-button");

    if (button) {
        button.textContent =
            game.paused
                ? "RESUME"
                : "PAUSE";
    }
}

// ============================================================
// RESET
// ============================================================

function resetCurrentMode() {
    if (game.currentMode === "planet") {
        try {
            resetPlanetMode();
        } catch (error) {
            console.warn(error);
        }

        return;
    }

    if (game.currentMode === "solar") {
        try {
            resetSolarSystem();
        } catch (error) {
            console.warn(error);
        }

        try {
            createDefaultSolarSystem();
        } catch (error) {
            console.warn(error);
        }
    }
}

// ============================================================
// MENU BUTTONS
// ============================================================

function setupMainMenuButtons() {
    const menu = buildMainMenu();

    const planetButton =
        getElement("planet-mode-button");

    const solarButton =
        getElement("solar-system-button");

    const settingsButton =
        getElement("settings-button");

    if (planetButton) {
        planetButton.onclick = () => {
            launchPlanetMode();
        };
    }

    if (solarButton) {
        solarButton.onclick = () => {
            launchSolarSystemMode();
        };
    }

    if (settingsButton) {
        settingsButton.onclick = () => {
            openSettings();
        };
    }

    return menu;
}

// ============================================================
// GAME BUTTONS
// ============================================================

function setupGameButtons() {
    const pauseButton =
        getElement("game-pause-button");

    const menuButton =
        getElement("game-menu-button");

    if (pauseButton) {
        pauseButton.onclick = () => {
            togglePause();
        };
    }

    if (menuButton) {
        menuButton.onclick = () => {
            returnToMainMenu();
        };
    }
}

// ============================================================
// KEYBOARD
// ============================================================

function setupKeyboard() {
    window.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {
                if (
                    game.currentMode !== "menu"
                ) {
                    returnToMainMenu();
                }

                return;
            }

            if (
                event.key === " " ||
                event.key.toLowerCase() === "p"
            ) {
                if (
                    game.currentMode !== "menu"
                ) {
                    event.preventDefault();
                    togglePause();
                }
            }

            if (
                event.key.toLowerCase() === "r"
            ) {
                if (
                    game.currentMode !== "menu"
                ) {
                    resetCurrentMode();
                }
            }
        }
    );
}

// ============================================================
// MOUSE / CANVAS
// ============================================================

function setupCanvasInteraction() {
    if (!game.canvas) {
        return;
    }

    game.canvas.addEventListener(
        "pointerdown",
        () => {
            activateAudio();
        }
    );
}

// ============================================================
// INITIALIZE GAME
// ============================================================

async function initializeGame() {
    if (game.initialized) {
        return true;
    }

    console.log(
        "Universe Smash: Initializing..."
    );

    if (!setupCanvas()) {
        return false;
    }

    setupGameInfo();

    setupMainMenuButtons();

    setupGameButtons();

    setupKeyboard();

    setupCanvasInteraction();

    try {
        initAudio();
    } catch (error) {
        console.warn(
            "Audio initialization warning:",
            error
        );
    }

    // Initialize the existing menu system too.
    try {
        initializeMenu();
    } catch (error) {
        console.warn(
            "Menu initialization warning:",
            error
        );
    }

    game.initialized = true;

    console.log(
        "Universe Smash: Initialization complete."
    );

    return true;
}

// ============================================================
// GAME LOOP
// ============================================================

function gameLoop(timestamp) {
    if (!game.lastTime) {
        game.lastTime = timestamp;
    }

    const deltaTime =
        Math.min(
            0.05,
            (timestamp - game.lastTime) / 1000
        );

    game.lastTime = timestamp;

    if (
        game.running &&
        !game.paused &&
        game.currentMode !== "menu"
    ) {
        updateGame(deltaTime);
    }

    drawGame();

    requestAnimationFrame(gameLoop);
}

// ============================================================
// UPDATE
// ============================================================

function updateGame(deltaTime) {
    if (
        game.currentMode === "planet"
    ) {
        try {
            updatePlanetMode(deltaTime);
        } catch (error) {
            console.error(
                "Planet Mode update error:",
                error
            );
        }

        return;
    }

    if (
        game.currentMode === "solar"
    ) {
        try {
            updateSolarSystem(deltaTime);
        } catch (error) {
            console.error(
                "Solar System update error:",
                error
            );
        }
    }
}

// ============================================================
// DRAW
// ============================================================

function drawGame() {
    if (!game.ctx) {
        return;
    }

    if (
        game.currentMode === "menu"
    ) {
        return;
    }

    game.ctx.clearRect(
        0,
        0,
        game.width,
        game.height
    );

    game.ctx.fillStyle = "#000000";

    game.ctx.fillRect(
        0,
        0,
        game.width,
        game.height
    );

    if (
        game.currentMode === "planet"
    ) {
        try {
            drawPlanetMode(
                game.ctx,
                game.width,
                game.height
            );
        } catch (error) {
            console.error(
                "Planet Mode draw error:",
                error
            );
        }

        return;
    }

    if (
        game.currentMode === "solar"
    ) {
        try {
            drawSolarSystem(
                game.ctx,
                game.width,
                game.height
            );
        } catch (error) {
            console.error(
                "Solar System draw error:",
                error
            );
        }
    }
}

// ============================================================
// BOOT
// ============================================================

async function bootGame() {
    try {
        console.log(
            "Universe Smash: Booting..."
        );

        const initialized =
            await initializeGame();

        if (!initialized) {
            console.error(
                "Universe Smash: Initialization failed."
            );
            return;
        }

        // Startup screen.
        try {
            await runStartup();
        } catch (error) {
            console.warn(
                "Startup warning:",
                error
            );
        }

        // IMPORTANT:
        // Always show the menu after startup.
        setupMainMenuButtons();
        forceShowMainMenu();

        game.running = true;

        game.lastTime = 0;

        requestAnimationFrame(
            gameLoop
        );

        console.log(
            "Universe Smash: READY!"
        );

    } catch (error) {
        console.error(
            "Universe Smash BOOT ERROR:",
            error
        );

        // Emergency fallback:
        // Even if another menu function fails,
        // create a working main menu.
        try {
            buildMainMenu();
            setupMainMenuButtons();
            forceShowMainMenu();
        } catch (fallbackError) {
            console.error(
                "Universe Smash emergency menu failed:",
                fallbackError
            );
        }
    }
}

// ============================================================
// GLOBAL API
// ============================================================

window.UniverseSmash = {
    game,

    initializeGame,

    startPlanetMode:
        launchPlanetMode,

    startSolarSystem:
        launchSolarSystemMode,

    returnToMainMenu,

    togglePause,

    resetCurrentMode,

    openSettings
};

// ============================================================
// START
// ============================================================

if (
    document.readyState === "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        bootGame,
        { once: true }
    );
} else {
    bootGame();
}
