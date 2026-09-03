// Universe Smash - Startup System

let startupFinished = false;
let startupSkipped = false;

function get(id) {
    return document.getElementById(id);
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function show(id, display = "block") {
    const el = get(id);
    if (el) el.style.display = display;
}

function hide(id) {
    const el = get(id);
    if (el) el.style.display = "none";
}

function setText(id, text) {
    const el = get(id);
    if (el) el.textContent = text;
}

function setProgress(percent) {
    const bar = get("loading-progress");
    const text = get("loading-percent");

    if (bar) bar.style.width = `${percent}%`;
    if (text) text.textContent = `${Math.round(percent)}%`;
}

function createStartButton() {
    let button = get("start-button");

    if (!button) {
        button = document.createElement("button");
        button.id = "start-button";
        button.textContent = "PRESS START";

        button.style.position = "absolute";
        button.style.left = "50%";
        button.style.top = "65%";
        button.style.transform = "translate(-50%, -50%)";
        button.style.zIndex = "10000";
        button.style.padding = "18px 45px";
        button.style.fontSize = "24px";
        button.style.fontWeight = "bold";
        button.style.letterSpacing = "4px";
        button.style.cursor = "pointer";
        button.style.background = "#111";
        button.style.color = "#fff";
        button.style.border = "2px solid #fff";
        button.style.borderRadius = "6px";

        const screen = get("startup-screen");

        if (screen) {
            screen.appendChild(button);
        } else {
            document.body.appendChild(button);
        }
    }

    button.style.display = "block";

    return button;
}

function finishStartup() {
    if (startupFinished) return;

    startupFinished = true;

    const screen = get("startup-screen");

    if (screen) {
        screen.style.opacity = "0";
        screen.style.pointerEvents = "none";

        setTimeout(() => {
            screen.style.display = "none";
        }, 500);
    }

    const button = get("start-button");
    if (button) {
        button.style.display = "none";
    }

    window.dispatchEvent(
        new CustomEvent("universe-smash-startup-finished")
    );
}

function skipStartup() {
    startupSkipped = true;
    finishStartup();
}

async function runStartup() {
    startupFinished = false;
    startupSkipped = false;

    const screen = get("startup-screen");

    if (screen) {
        screen.style.display = "flex";
        screen.style.opacity = "1";
        screen.style.pointerEvents = "auto";
    }

    // Hide everything initially
    hide("startup-warning");
    hide("startup-loading");
    hide("startup-title");

    // Developer / engine logo
    const logo = get("startup-logo");

    if (logo) {
        logo.style.display = "block";
        setText("startup-status", "INITIALIZING COSMIC ENGINE...");
    }

    await wait(1200);

    if (startupSkipped) return true;

    // Warning
    hide("startup-logo");
    show("startup-warning");

    setText(
        "startup-status",
        "UNIVERSE SMASH CONTAINS FLASHING VISUAL EFFECTS."
    );

    await wait(1800);

    if (startupSkipped) return true;

    // Loading
    hide("startup-warning");
    show("startup-loading");

    setText("loading-status", "LOADING UNIVERSE...");
    setProgress(0);

    for (let i = 0; i <= 100; i += 5) {
        if (startupSkipped) return true;

        setProgress(i);

        if (i < 30) {
            setText("loading-status", "INITIALIZING PHYSICS...");
        } else if (i < 60) {
            setText("loading-status", "LOADING CELESTIAL OBJECTS...");
        } else if (i < 85) {
            setText("loading-status", "INITIALIZING COSMIC ENGINE...");
        } else {
            setText("loading-status", "FINALIZING...");
        }

        await wait(40);
    }

    await wait(500);

    if (startupSkipped) return true;

    // Title screen
    hide("startup-loading");
    show("startup-title");

    setText("startup-status", "COSMIC SIMULATION ENGINE");

    await wait(1200);

    if (startupSkipped) return true;

    // Create guaranteed Press Start button
    const startButton = createStartButton();

    setText("startup-status", "READY");

    // Wait for the player to press Start
    return new Promise(resolve => {
        let finished = false;

        const complete = () => {
            if (finished) return;

            finished = true;

            startButton.removeEventListener("click", complete);

            finishStartup();

            resolve(true);
        };

        startButton.addEventListener("click", complete);

        // Also allow Enter or Space
        const keyboardStart = event => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                document.removeEventListener(
                    "keydown",
                    keyboardStart
                );

                complete();
            }
        };

        document.addEventListener(
            "keydown",
            keyboardStart
        );
    });
}

function isStartupFinished() {
    return startupFinished;
}

function isStartupSkipped() {
    return startupSkipped;
}

function resetStartup() {
    startupFinished = false;
    startupSkipped = false;

    const screen = get("startup-screen");

    if (screen) {
        screen.style.display = "flex";
        screen.style.opacity = "1";
        screen.style.pointerEvents = "auto";
    }
}

export {
    runStartup,
    skipStartup,
    finishStartup,
    isStartupFinished,
    isStartupSkipped,
    resetStartup
};

window.UniverseSmashStartup = {
    runStartup,
    skipStartup,
    finishStartup,
    isStartupFinished,
    isStartupSkipped,
    resetStartup
};
