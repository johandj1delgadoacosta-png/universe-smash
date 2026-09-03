// ============================================================
// UNIVERSE SMASH - MAIN CONTROLLER
// ============================================================

import {
    runStartup
} from "./startup.js";

import {
    startPlanetMode,
    stopPlanetMode,
    updatePlanetMode,
    drawPlanetMode,
    setPlanetModePaused,
    resetPlanetMode
} from "./modes/planet-mode.js";

import {
    startSolarSystem,
    stopSolarSystem,
    updateSolarSystem,
    drawSolarSystem,
    createDefaultSolarSystem,
    clearSolarSystem,
    resetSolarSystem
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
// DOM HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}


function show(element) {
    if (!element) return;

    element.style.display = "";
    element.style.visibility = "visible";
    element.style.opacity = "1";
    element.style.pointerEvents = "auto";
}


function hide(element) {
    if (!element) return;

    element.style.display = "none";
}


// ============================================================
// CANVAS
// ============================================================

function setupCanvas() {
    game.canvas = $("game-canvas");

    if (!game.canvas) {
        console.error(
            "Universe Smash: #game-canvas was not found."
        );

        return false;
    }

    game.ctx =
        game.canvas.getContext("2d");

    if (!game.ctx) {
        console.error(
            "Universe Smash: Canvas 2D context unavailable."
        );

        return false;
    }

    resizeCanvas();

    window.addEventListener(
        "resize",
        resizeCanvas
    );

    return true;
}


function resizeCanvas() {
    if (!game.canvas || !game.ctx) {
        return;
    }

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;

    const dpr =
        Math.max(
            1,
            Math.min(
                2,
                window.devicePixelRatio || 1
            )
        );

    game.width = width;
    game.height = height;

    game.canvas.width =
        Math.floor(width * dpr);

    game.canvas.height =
        Math.floor(height * dpr);

    game.canvas.style.width =
        `${width}px`;

    game.canvas.style.height =
        `${height}px`;

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
// AUDIO
// ============================================================

function activateAudio() {
    try {
        resumeAudio();
    } catch (error) {
        console.warn(
            "Universe Smash audio:",
            error
        );
    }
}


// ============================================================
// MAIN MENU
// ============================================================

function showMainMenu() {
    const startup =
        $("startup-screen");

    const canvas =
        $("game-canvas");

    const info =
        $("game-info");

    const solarMenu =
        $("sandbox-menu");

    const weaponMenu =
        $("planet-weapon-menu");

    const settingsMenu =
        $("settings-menu");

    hide(startup);
    hide(canvas);
    hide(info);
    hide(solarMenu);
    hide(weaponMenu);
    hide(settingsMenu);

    const menu =
        $("main-menu");

    if (!menu) {
        console.error(
            "Universe Smash: #main-menu not found."
        );

        return;
    }

    menu.style.display = "flex";
    menu.style.visibility = "visible";
    menu.style.opacity = "1";
    menu.style.pointerEvents = "auto";

    menu.classList.add("active");

    game.currentMode = "menu";
    game.paused = false;

    console.log(
        "Universe Smash: Main menu displayed."
    );
}


// ============================================================
// GAME INTERFACE
// ============================================================

function showGameInterface() {
    const startup =
        $("startup-screen");

    const menu =
        $("main-menu");

    const canvas =
        $("game-canvas");

    const info =
        $("game-info");

    hide(startup);
    hide(menu);

    show(canvas);
    show(info);

    if (canvas) {
        canvas.style.position = "fixed";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.zIndex = "1";
    }

    if (info) {
        info.style.zIndex = "20";
    }
}


// ============================================================
// GAME INFORMATION
// ============================================================

function updateModeLabel(label) {
    const element =
        $("game-mode-label");

    if (element) {
        element.textContent = label;
    }
}


function updatePauseButton() {
    const button =
        $("game-pause-button");

    if (!button) return;

    button.textContent =
        game.paused
            ? "RESUME"
            : "PAUSE";
}


// ============================================================
// PLANET MODE
// ============================================================

function launchPlanetMode() {
    console.log(
        "Universe Smash: Planet Mode"
    );

    activateAudio();

    try {
        stopSolarSystem();
    } catch (error) {
        console.warn(
            "Solar System stop:",
            error
        );
    }

    game.currentMode = "planet";
    game.paused = false;

    showGameInterface();

    try {
        startPlanetMode(
            game.canvas
        );
    } catch (error) {
        console.error(
            "Planet Mode startup error:",
            error
        );
    }

    updateModeLabel(
        "PLANET MODE"
    );

    updatePauseButton();
}


// ============================================================
// SOLAR SYSTEM MODE
// ============================================================

function launchSolarSystemMode() {
    console.log(
        "Universe Smash: Solar System Mode"
    );

    activateAudio();

    try {
        stopPlanetMode();
    } catch (error) {
        console.warn(
            "Planet Mode stop:",
            error
        );
    }

    game.currentMode = "solar";
    game.paused = false;

    showGameInterface();

    try {
        startSolarSystem(
            game.canvas
        );
    } catch (error) {
        console.error(
            "Solar System startup error:",
            error
        );
    }

    try {
        createDefaultSolarSystem();
    } catch (error) {
        console.warn(
            "Default Solar System:",
            error
        );
    }

    updateModeLabel(
        "SOLAR SYSTEM MODE"
    );

    updatePauseButton();
}


// ============================================================
// RETURN TO MAIN MENU
// ============================================================

function returnToMainMenu() {
    console.log(
        "Universe Smash: Returning to menu."
    );

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

    showMainMenu();
}


// ============================================================
// SETTINGS
// ============================================================

function openSettings() {
    activateAudio();

    const menu =
        $("main-menu");

    if (!menu) return;

    menu.style.display = "flex";
    menu.style.visibility = "visible";
    menu.style.opacity = "1";
    menu.style.pointerEvents = "auto";

    menu.innerHTML = `
        <div class="main-menu-inner">

            <div class="main-menu-title">
                SETTINGS
            </div>

            <div class="main-menu-subtitle">
                UNIVERSE SMASH
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

    const back =
        $("settings-back-button");

    if (back) {
        back.onclick =
            showMainMenu;
    }
}


// ============================================================
// PAUSE
// ============================================================

function togglePause() {
    if (
        game.currentMode === "menu"
    ) {
        return;
    }

    game.paused =
        !game.paused;

    if (
        game.currentMode === "planet"
    ) {
        try {
            setPlanetModePaused(
                game.paused
            );
        } catch (error) {
            console.warn(
                "Planet pause:",
                error
            );
        }
    }

    /*
     * Solar System pause is handled
     * by the main controller's game loop.
     *
     * We intentionally DO NOT call
     * setSolarSystemPaused because that
     * function is not exported.
     */

    updatePauseButton();

    console.log(
        game.paused
            ? "Universe Smash: PAUSED"
            : "Universe Smash: RESUMED"
    );
}


// ============================================================
// RESET
// ============================================================

function resetCurrentMode() {
    if (
        game.currentMode === "planet"
    ) {
        try {
            resetPlanetMode();
        } catch (error) {
            console.warn(
                "Planet reset:",
                error
            );
        }

        return;
    }

    if (
        game.currentMode === "solar"
    ) {
        try {
            resetSolarSystem();
        } catch (error) {
            console.warn(
                "Solar reset:",
                error
            );
        }

        try {
            createDefaultSolarSystem();
        } catch (error) {
            console.warn(
                "Solar default system:",
                error
            );
        }
    }
}


// ============================================================
// MAIN MENU BUTTONS
// ============================================================

function setupMainMenuButtons() {
    const planet =
        $("planet-mode-button");

    const solar =
        $("solar-system-button");

    const settings =
        $("settings-button");

    if (planet) {
        planet.onclick = () => {
            activateAudio();
            launchPlanetMode();
        };
    }

    if (solar) {
        solar.onclick = () => {
            activateAudio();
            launchSolarSystemMode();
        };
    }

    if (settings) {
        settings.onclick = () => {
            activateAudio();
            openSettings();
        };
    }

    console.log(
        "Universe Smash: Main menu buttons ready."
    );
}


// ============================================================
// SOLAR SYSTEM BUTTONS
// ============================================================

function setupSolarButtons() {
    const reset =
        $("reset-solar-system");

    const clear =
        $("clear-solar-system");

    const menu =
        $("solar-main-menu");

    if (reset) {
        reset.onclick = () => {
            activateAudio();
            resetCurrentMode();
        };
    }

    if (clear) {
        clear.onclick = () => {
            activateAudio();

            try {
                clearSolarSystem();
            } catch (error) {
                console.error(
                    "Clear Solar System:",
                    error
                );
            }
        };
    }

    if (menu) {
        menu.onclick = () => {
            returnToMainMenu();
        };
    }
}


// ============================================================
// PLANET MENU BUTTON
// ============================================================

function setupPlanetButtons() {
    const menu =
        $("planet-main-menu");

    if (menu) {
        menu.onclick = () => {
            returnToMainMenu();
        };
    }
}


// ============================================================
// GAME BUTTONS
// ============================================================

function setupGameButtons() {
    const pause =
        $("game-pause-button");

    const menu =
        $("game-menu-button");

    if (pause) {
        pause.onclick = () => {
            activateAudio();
            togglePause();
        };
    }

    if (menu) {
        menu.onclick = () => {
            activateAudio();
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
        event => {

            const key =
                event.key.toLowerCase();

            if (key === "escape") {

                if (
                    game.currentMode !== "menu"
                ) {
                    returnToMainMenu();
                }

                return;
            }

            if (
                key === "p" ||
                key === " "
            ) {

                if (
                    game.currentMode !== "menu"
                ) {
                    event.preventDefault();
                    togglePause();
                }

                return;
            }

            if (key === "r") {

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
// MOUSE / TOUCH AUDIO ACTIVATION
// ============================================================

function setupCanvasInput() {
    if (!game.canvas) return;

    game.canvas.addEventListener(
        "pointerdown",
        () => {
            activateAudio();
        }
    );
}


// ============================================================
// INITIALIZE
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

    setupMainMenuButtons();
    setupSolarButtons();
    setupPlanetButtons();
    setupGameButtons();
    setupKeyboard();
    setupCanvasInput();

    try {
        initAudio();
    } catch (error) {
        console.warn(
            "Audio initialization:",
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
// UPDATE
// ============================================================

function updateGame(deltaTime) {
    if (
        game.currentMode === "planet"
    ) {
        try {
            updatePlanetMode(
                deltaTime
            );
        } catch (error) {
            console.error(
                "Planet update error:",
                error
            );
        }

        return;
    }

    if (
        game.currentMode === "solar"
    ) {
        try {
            updateSolarSystem(
                deltaTime
            );
        } catch (error) {
            console.error(
                "Solar update error:",
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

    game.ctx.fillStyle =
        "#000000";

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
                "Planet draw error:",
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
                "Solar draw error:",
                error
            );
        }
    }
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
        updateGame(
            deltaTime
        );
    }

    drawGame();

    requestAnimationFrame(
        gameLoop
    );
}


// ============================================================
// BOOT
// ============================================================

async function bootGame() {
    console.log(
        "Universe Smash: Booting..."
    );

    try {
        const initialized =
            await initializeGame();

        if (!initialized) {
            console.error(
                "Universe Smash: Initialization failed."
            );

            return;
        }

        try {
            await runStartup();
        } catch (error) {
            console.warn(
                "Startup warning:",
                error
            );
        }

        /*
         * Startup is finished.
         * Show the actual main menu.
         */

        setupMainMenuButtons();

        showMainMenu();

        game.running = true;
        game.lastTime = 0;

        requestAnimationFrame(
            gameLoop
        );

        console.log(
            "================================"
        );

        console.log(
            "UNIVERSE SMASH READY!"
        );

        console.log(
            "================================"
        );

    } catch (error) {

        console.error(
            "UNIVERSE SMASH BOOT ERROR:",
            error
        );

        /*
         * Emergency fallback:
         * even if startup has a problem,
         * try to display the menu.
         */

        try {
            showMainMenu();
        } catch (menuError) {
            console.error(
                "Emergency menu error:",
                menuError
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
