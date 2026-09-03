// Universe Smash
// Main Menu System

let menuInitialized = false;

function getElement(id) {
    return document.getElementById(id);
}

function show(id) {
    const element = getElement(id);

    if (!element) {
        return;
    }

    element.hidden = false;
    element.style.display = "";
    element.classList.remove("hidden");
}

function hide(id) {
    const element = getElement(id);

    if (!element) {
        return;
    }

    element.hidden = true;
    element.style.display = "none";
}

function hideAllMenus() {
    hide("main-menu");
    hide("sandbox-menu");
    hide("planet-weapon-menu");
    hide("settings-menu");
    hide("pause-menu");
}

function showMainMenu() {
    hideAllMenus();

    show("main-menu");

    const canvas = getElement("game-canvas");

    if (canvas) {
        canvas.style.display = "none";
    }

    const gameInfo = getElement("game-info");

    if (gameInfo) {
        gameInfo.style.display = "none";
    }

    document.body.classList.add("menu-active");
    document.body.classList.remove("game-active");

    window.dispatchEvent(
        new CustomEvent("universe-smash-menu-open", {
            detail: {
                menu: "main"
            }
        })
    );
}

function showSolarSystemMenu() {
    hideAllMenus();
    show("sandbox-menu");

    const canvas = getElement("game-canvas");

    if (canvas) {
        canvas.style.display = "block";
    }

    document.body.classList.remove("menu-active");
    document.body.classList.add("game-active");

    window.dispatchEvent(
        new CustomEvent("universe-smash-menu-open", {
            detail: {
                menu: "solar-system"
            }
        })
    );
}

function showPlanetWeaponMenu() {
    hideAllMenus();
    show("planet-weapon-menu");

    const canvas = getElement("game-canvas");

    if (canvas) {
        canvas.style.display = "block";
    }

    document.body.classList.remove("menu-active");
    document.body.classList.add("game-active");

    window.dispatchEvent(
        new CustomEvent("universe-smash-menu-open", {
            detail: {
                menu: "planet"
            }
        })
    );
}

function showSettings() {
    hideAllMenus();
    show("settings-menu");

    window.dispatchEvent(
        new CustomEvent("universe-smash-menu-open", {
            detail: {
                menu: "settings"
            }
        })
    );
}

function showPauseMenu() {
    hideAllMenus();
    show("pause-menu");

    window.dispatchEvent(
        new CustomEvent("universe-smash-menu-open", {
            detail: {
                menu: "pause"
            }
        })
    );
}

function hideMenus() {
    hideAllMenus();

    document.body.classList.remove(
        "menu-active"
    );
}

function startMode(mode) {
    window.dispatchEvent(
        new CustomEvent(
            "universe-smash-start-mode",
            {
                detail: {
                    mode
                }
            }
        )
    );
}

function returnToMainMenu() {
    window.dispatchEvent(
        new CustomEvent(
            "universe-smash-return-menu"
        )
    );

    showMainMenu();
}

function connectButton(
    id,
    callback
) {
    const button = getElement(id);

    if (!button) {
        return;
    }

    if (
        button.dataset.menuBound ===
        "true"
    ) {
        return;
    }

    button.dataset.menuBound = "true";

    button.addEventListener(
        "click",
        event => {
            event.preventDefault();
            callback();
        }
    );
}

function initializeMenu() {
    if (menuInitialized) {
        return;
    }

    menuInitialized = true;

    // Main menu
    connectButton(
        "planet-mode-button",
        () => {
            startMode("planet");
        }
    );

    connectButton(
        "solar-system-button",
        () => {
            startMode("solar");
        }
    );

    connectButton(
        "sandbox-mode-button",
        () => {
            startMode("solar");
        }
    );

    connectButton(
        "settings-button",
        () => {
            showSettings();
        }
    );

    // Main menu aliases
    connectButton(
        "planet-mode",
        () => {
            startMode("planet");
        }
    );

    connectButton(
        "solar-system-mode",
        () => {
            startMode("solar");
        }
    );

    // Solar System menu
    connectButton(
        "add-star",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "star"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-blue-hypergiant",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "blueHypergiant"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-contact-binary",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "contact-binary"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-planet",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "planet"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-moon",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "moon"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-asteroid",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "asteroid"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-antimatter-planet",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "antimatter-planet"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-black-hole",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "black-hole"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-grey-hole",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "grey-hole"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "add-wormhole",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-add-object",
                    {
                        detail: {
                            type: "wormhole"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "reset-solar-system",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-reset"
                )
            );
        }
    );

    connectButton(
        "clear-solar-system",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-clear"
                )
            );
        }
    );

    connectButton(
        "solar-main-menu",
        () => {
            returnToMainMenu();
        }
    );

    // Planet Mode weapons
    connectButton(
        "weapon-laser",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-weapon",
                    {
                        detail: {
                            weapon: "laser"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "weapon-ice-laser",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-weapon",
                    {
                        detail: {
                            weapon: "ice-laser"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "weapon-asteroid",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-weapon",
                    {
                        detail: {
                            weapon: "asteroid"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "weapon-mystery",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-weapon",
                    {
                        detail: {
                            weapon: "mystery"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "weapon-alien",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-weapon",
                    {
                        detail: {
                            weapon: "alien"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "weapon-antimatter",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-weapon",
                    {
                        detail: {
                            weapon: "antimatter"
                        }
                    }
                )
            );
        }
    );

    connectButton(
        "reset-planet",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-reset"
                )
            );
        }
    );

    connectButton(
        "planet-main-menu",
        () => {
            returnToMainMenu();
        }
    );

    // Generic main-menu buttons
    connectButton(
        "back-to-menu",
        () => {
            returnToMainMenu();
        }
    );

    connectButton(
        "main-menu-button",
        () => {
            returnToMainMenu();
        }
    );

    // Pause menu
    connectButton(
        "resume-button",
        () => {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-resume"
                )
            );
        }
    );

    connectButton(
        "pause-main-menu",
        () => {
            returnToMainMenu();
        }
    );

    // Keyboard navigation
    document.addEventListener(
        "keydown",
        handleMenuKeyboard
    );
}

function handleMenuKeyboard(event) {
    if (event.key === "Escape") {
        const pauseMenu =
            getElement("pause-menu");

        const pauseVisible =
            pauseMenu &&
            !pauseMenu.hidden &&
            pauseMenu.style.display !== "none";

        if (pauseVisible) {
            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-resume"
                )
            );

            return;
        }

        returnToMainMenu();
    }
}

function setMenuButtonEnabled(
    id,
    enabled
) {
    const button = getElement(id);

    if (!button) {
        return;
    }

    button.disabled = !enabled;
}

function setMenuVisible(
    id,
    visible
) {
    if (visible) {
        show(id);
    } else {
        hide(id);
    }
}

function getCurrentMenu() {
    const menus = [
        "main-menu",
        "sandbox-menu",
        "planet-weapon-menu",
        "settings-menu",
        "pause-menu"
    ];

    for (const id of menus) {
        const element =
            getElement(id);

        if (
            element &&
            !element.hidden &&
            element.style.display !== "none"
        ) {
            return id;
        }
    }

    return null;
}

export {
    initializeMenu,
    showMainMenu,
    showSolarSystemMenu,
    showPlanetWeaponMenu,
    showSettings,
    showPauseMenu,
    hideMenus,
    returnToMainMenu,
    startMode,
    setMenuButtonEnabled,
    setMenuVisible,
    getCurrentMenu
};

window.UniverseSmashMenu = {
    initializeMenu,
    showMainMenu,
    showSolarSystemMenu,
    showPlanetWeaponMenu,
    showSettings,
    showPauseMenu,
    hideMenus,
    returnToMainMenu,
    startMode,
    setMenuButtonEnabled,
    setMenuVisible,
    getCurrentMenu
};

if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeMenu,
        {
            once: true
        }
    );
} else {
    initializeMenu();
}
