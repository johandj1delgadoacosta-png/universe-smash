// ============================================
// UNIVERSE SMASH
// MAIN GAME CONTROLLER
// ============================================

import {
    runStartup
} from "./startup.js";

import {
    showMainMenu
} from "./menu.js";

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
    createDefaultSolarSystem
} from "./modes/solar-system.js";

import {
    initAudio,
    enableAudio,
    disableAudio,
    isAudioEnabled,
    setMasterVolume,
    getMasterVolume
} from "./audio.js";


// ============================================
// GAME STATE
// ============================================

const game = {
    canvas: null,
    ctx: null,

    currentMode: "menu",

    running: false,

    paused: false,

    lastTime: 0,

    width: 0,
    height: 0
};


// ============================================
// INITIALIZE
// ============================================

function initializeGame() {
    game.canvas =
        document.getElementById(
            "game-canvas"
        );

    if (!game.canvas) {
        console.error(
            "Universe Smash: game canvas not found."
        );

        return false;
    }

    game.ctx =
        game.canvas.getContext("2d");

    if (!game.ctx) {
        console.error(
            "Universe Smash: unable to create canvas context."
        );

        return false;
    }

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    initializeAudio();

    attachMainControls();

    game.running = true;

    return true;
}


// ============================================
// AUDIO
// ============================================

function initializeAudio() {
    try {
        initAudio();

        // Audio starts disabled until
        // the browser allows audio playback.
        if (isAudioEnabled()) {
            enableAudio();
        }
    } catch (error) {
        console.warn(
            "Audio initialization failed:",
            error
        );
    }
}


// ============================================
// RESIZE
// ============================================

function resizeCanvas() {
    if (!game.canvas) {
        return;
    }

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;

    const devicePixelRatio =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    game.width = width;
    game.height = height;

    game.canvas.width =
        width * devicePixelRatio;

    game.canvas.height =
        height * devicePixelRatio;

    game.canvas.style.width =
        `${width}px`;

    game.canvas.style.height =
        `${height}px`;

    game.ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
    );
}


// ============================================
// MAIN CONTROLS
// ============================================

function attachMainControls() {
    const planetButton =
        document.getElementById(
            "planet-mode-button"
        );

    const solarButton =
        document.getElementById(
            "solar-system-button"
        );

    const settingsButton =
        document.getElementById(
            "settings-button"
        );

    const mainMenuButton =
        document.getElementById(
            "main-menu-button"
        );

    const resetButton =
        document.getElementById(
            "reset-button"
        );

    const pauseButton =
        document.getElementById(
            "pause-button"
        );

    if (planetButton) {
        planetButton.addEventListener(
            "click",
            () => {
                startGameMode(
                    "planet"
                );
            }
        );
    }

    if (solarButton) {
        solarButton.addEventListener(
            "click",
            () => {
                startGameMode(
                    "solar"
                );
            }
        );
    }

    if (settingsButton) {
        settingsButton.addEventListener(
            "click",
            openSettings
        );
    }

    if (mainMenuButton) {
        mainMenuButton.addEventListener(
            "click",
            returnToMainMenu
        );
    }

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            resetCurrentMode
        );
    }

    if (pauseButton) {
        pauseButton.addEventListener(
            "click",
            togglePause
        );
    }

    // Keyboard controls
    window.addEventListener(
        "keydown",
        handleKeyboard
    );
}


// ============================================
// START GAME MODE
// ============================================

export function startGameMode(
    mode
) {
    stopCurrentMode();

    hideMenus();

    game.currentMode =
        mode;

    game.paused = false;

    if (mode === "planet") {
        startPlanetMode(
            game.canvas
        );
    }

    if (mode === "solar") {
        startSolarSystem(
            game.canvas
        );

        const solarObjects =
            getSolarObjects();

        if (
            solarObjects.length === 0
        ) {
            createDefaultSolarSystem();
        }
    }

    showGameInterface();

    game.lastTime =
        performance.now();
}


// ============================================
// STOP CURRENT MODE
// ============================================

function stopCurrentMode() {
    try {
        stopPlanetMode();
    } catch {
        // Planet Mode may not be running.
    }

    try {
        stopSolarSystem();
    } catch {
        // Solar System Mode may not be running.
    }
}


// ============================================
// RETURN TO MAIN MENU
// ============================================

export function returnToMainMenu() {
    stopCurrentMode();

    game.currentMode =
        "menu";

    game.paused = false;

    hideGameInterface();

    showMainMenu();
}


// ============================================
// HIDE MENUS
// ============================================

function hideMenus() {
    const mainMenu =
        document.getElementById(
            "main-menu"
        );

    const sandboxMenu =
        document.getElementById(
            "sandbox-menu"
        );

    const weaponMenu =
        document.getElementById(
            "planet-weapon-menu"
        );

    const settingsMenu =
        document.getElementById(
            "settings-menu"
        );

    if (mainMenu) {
        mainMenu.style.display =
            "none";
    }

    if (sandboxMenu) {
        sandboxMenu.style.display =
            "none";
    }

    if (weaponMenu) {
        weaponMenu.style.display =
            "none";
    }

    if (settingsMenu) {
        settingsMenu.style.display =
            "none";
    }
}


// ============================================
// SHOW GAME INTERFACE
// ============================================

function showGameInterface() {
    if (!game.canvas) {
        return;
    }

    game.canvas.style.display =
        "block";

    const info =
        document.getElementById(
            "game-info"
        );

    if (info) {
        info.style.display =
            "block";
    }

    const pauseMenu =
        document.getElementById(
            "pause-menu"
        );

    if (pauseMenu) {
        pauseMenu.style.display =
            "none";
    }
}


// ============================================
// HIDE GAME INTERFACE
// ============================================

function hideGameInterface() {
    const canvas =
        game.canvas;

    if (canvas) {
        canvas.style.display =
            "none";
    }

    const info =
        document.getElementById(
            "game-info"
        );

    if (info) {
        info.style.display =
            "none";
    }

    const pauseMenu =
        document.getElementById(
            "pause-menu"
        );

    if (pauseMenu) {
        pauseMenu.style.display =
            "none";
    }
}


// ============================================
// SETTINGS
// ============================================

function openSettings() {
    const settingsMenu =
        document.getElementById(
            "settings-menu"
        );

    if (!settingsMenu) {
        return;
    }

    const mainMenu =
        document.getElementById(
            "main-menu"
        );

    if (mainMenu) {
        mainMenu.style.display =
            "none";
    }

    settingsMenu.style.display =
        "flex";
}


// ============================================
// RESET CURRENT MODE
// ============================================

function resetCurrentMode() {
    if (
        game.currentMode ===
        "solar"
    ) {
        createDefaultSolarSystem();

        return;
    }

    if (
        game.currentMode ===
        "planet"
    ) {
        startPlanetMode(
            game.canvas
        );
    }
}


// ============================================
// PAUSE
// ============================================

function togglePause() {
    if (
        game.currentMode ===
        "menu"
    ) {
        return;
    }

    game.paused =
        !game.paused;

    const pauseMenu =
        document.getElementById(
            "pause-menu"
        );

    if (pauseMenu) {
        pauseMenu.style.display =
            game.paused
                ? "flex"
                : "none";
    }

    updatePauseButton();
}


// ============================================
// PAUSE BUTTON
// ============================================

function updatePauseButton() {
    const button =
        document.getElementById(
            "pause-button"
        );

    if (!button) {
        return;
    }

    button.textContent =
        game.paused
            ? "RESUME"
            : "PAUSE";
}


// ============================================
// KEYBOARD
// ============================================

function handleKeyboard(event) {
    const key =
        event.key.toLowerCase();

    if (key === "escape") {
        if (
            game.currentMode !==
            "menu"
        ) {
            returnToMainMenu();
        }

        return;
    }

    if (key === "p") {
        togglePause();

        return;
    }

    if (
        key === " " &&
        game.currentMode !==
            "menu"
    ) {
        event.preventDefault();

        togglePause();

        return;
    }

    if (
        key === "r" &&
        game.currentMode !==
            "menu"
    ) {
        resetCurrentMode();
    }
}


// ============================================
// SOLAR OBJECT ACCESS
// ============================================

function getSolarObjects() {
    try {
        const module =
            window.__universeSmashSolarSystem;

        if (
            module &&
            Array.isArray(
                module.objects
            )
        ) {
            return module.objects;
        }
    } catch {
        // Ignore.
    }

    return [];
}


// ============================================
// GAME LOOP
// ============================================

function gameLoop(timestamp) {
    if (!game.running) {
        return;
    }

    const deltaMilliseconds =
        timestamp -
        game.lastTime;

    game.lastTime =
        timestamp;

    let deltaTime =
        deltaMilliseconds /
        16.6667;

    // Protect against giant jumps when
    // the browser tab is inactive.
    deltaTime =
        Math.min(
            Math.max(
                deltaTime,
                0
            ),
            3
        );

    if (!game.paused) {
        updateGame(
            deltaTime
        );
    }

    drawGame();

    requestAnimationFrame(
        gameLoop
    );
}


// ============================================
// UPDATE GAME
// ============================================

function updateGame(
    deltaTime
) {
    if (
        game.currentMode ===
        "planet"
    ) {
        updatePlanetMode(
            deltaTime
        );
    }

    if (
        game.currentMode ===
        "solar"
    ) {
        updateSolarSystem(
            deltaTime
        );
    }
}


// ============================================
// DRAW GAME
// ============================================

function drawGame() {
    if (
        game.currentMode ===
        "planet"
    ) {
        drawPlanetMode();

        return;
    }

    if (
        game.currentMode ===
        "solar"
    ) {
        drawSolarSystem();

        return;
    }

    // Menu background
    if (game.ctx) {
        game.ctx.clearRect(
            0,
            0,
            game.width,
            game.height
        );
    }
}


// ============================================
// STARTUP
// ============================================

async function bootGame() {
    const initialized =
        initializeGame();

    if (!initialized) {
        return;
    }

    try {
        await runStartup();
    } catch (error) {
        console.warn(
            "Startup sequence failed:",
            error
        );
    }

    returnToMainMenu();

    requestAnimationFrame(
        (timestamp) => {
            game.lastTime =
                timestamp;

            requestAnimationFrame(
                gameLoop
            );
        }
    );
}


// ============================================
// PUBLIC GAME STATE
// ============================================

export function getGameState() {
    return {
        mode:
            game.currentMode,

        paused:
            game.paused,

        running:
            game.running,

        width:
            game.width,

        height:
            game.height,

        audioEnabled:
            isAudioEnabled(),

        volume:
            getMasterVolume()
    };
}


// ============================================
// AUDIO SETTINGS
// ============================================

export function setAudioEnabled(
    enabled
) {
    if (enabled) {
        enableAudio();
    } else {
        disableAudio();
    }
}


export function setAudioVolume(
    volume
) {
    setMasterVolume(
        volume
    );
}


// ============================================
// GLOBAL ACCESS
// ============================================

window.UniverseSmash = {
    startGameMode,
    returnToMainMenu,
    togglePause,
    resetCurrentMode,
    getGameState,
    setAudioEnabled,
    setAudioVolume
};


// ============================================
// BOOT
// ============================================

bootGame();
