// Universe Smash
// Startup / Loading Sequence

let startupFinished = false;
let startupSkipped = false;

const STARTUP_TIMINGS = {
    splash: 1400,
    warning: 2200,
    loading: 2600,
    title: 1600
};

function getElement(id) {
    return document.getElementById(id);
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function showElement(element) {
    if (!element) {
        return;
    }

    element.hidden = false;
    element.style.display = "";
    element.classList.remove("hidden");
}

function hideElement(element) {
    if (!element) {
        return;
    }

    element.hidden = true;
    element.style.display = "none";
}

function setText(id, text) {
    const element = getElement(id);

    if (element) {
        element.textContent = text;
    }
}

function setProgress(percent) {
    const value =
        Math.max(
            0,
            Math.min(
                100,
                percent
            )
        );

    const bar =
        getElement("loading-bar");

    const progress =
        getElement("loading-progress");

    const text =
        getElement("loading-percent");

    if (bar) {
        bar.style.width = `${value}%`;
    }

    if (progress) {
        progress.value = value;
    }

    if (text) {
        text.textContent =
            `${Math.round(value)}%`;
    }
}

function setStartupStatus(text) {
    setText(
        "startup-status",
        text
    );

    setText(
        "loading-status",
        text
    );
}

function getStartupScreen() {
    return getElement("startup-screen");
}

function showStartupScreen() {
    const screen =
        getStartupScreen();

    if (!screen) {
        return;
    }

    showElement(screen);

    screen.classList.remove(
        "startup-hidden",
        "fade-out"
    );

    screen.classList.add(
        "startup-visible"
    );
}

function hideStartupScreen() {
    const screen =
        getStartupScreen();

    if (!screen) {
        return;
    }

    screen.classList.remove(
        "startup-visible"
    );

    screen.classList.add(
        "fade-out"
    );

    setTimeout(() => {
        hideElement(screen);

        screen.classList.remove(
            "fade-out"
        );
    }, 500);
}

function showStartupSection(
    sectionId
) {
    const sections = [
        "startup-logo",
        "startup-warning",
        "startup-loading",
        "startup-title"
    ];

    for (const id of sections) {
        const section =
            getElement(id);

        if (!section) {
            continue;
        }

        if (id === sectionId) {
            showElement(section);

            section.classList.remove(
                "startup-section-hidden"
            );

            section.classList.add(
                "startup-section-visible"
            );
        } else {
            hideElement(section);

            section.classList.remove(
                "startup-section-visible"
            );

            section.classList.add(
                "startup-section-hidden"
            );
        }
    }
}

function prepareStartupScreen() {
    showStartupScreen();

    const screen =
        getStartupScreen();

    if (!screen) {
        return;
    }

    showStartupSection(
        "startup-logo"
    );

    setProgress(0);

    setStartupStatus(
        "INITIALIZING..."
    );
}

async function runSplash() {
    if (startupSkipped) {
        return;
    }

    showStartupSection(
        "startup-logo"
    );

    setStartupStatus(
        "UNIVERSE SMASH ENGINE"
    );

    await sleep(
        STARTUP_TIMINGS.splash
    );
}

async function runWarning() {
    if (startupSkipped) {
        return;
    }

    showStartupSection(
        "startup-warning"
    );

    setStartupStatus(
        "PLEASE READ"
    );

    await sleep(
        STARTUP_TIMINGS.warning
    );
}

async function runLoading() {
    if (startupSkipped) {
        return;
    }

    showStartupSection(
        "startup-loading"
    );

    const steps = [
        {
            percent: 10,
            text: "Starting engine..."
        },
        {
            percent: 25,
            text: "Loading physics..."
        },
        {
            percent: 40,
            text: "Loading celestial bodies..."
        },
        {
            percent: 55,
            text: "Loading particle system..."
        },
        {
            percent: 70,
            text: "Loading audio..."
        },
        {
            percent: 82,
            text: "Loading game modes..."
        },
        {
            percent: 94,
            text: "Preparing Universe Smash..."
        },
        {
            percent: 100,
            text: "READY"
        }
    ];

    const delay =
        STARTUP_TIMINGS.loading /
        steps.length;

    for (const step of steps) {
        if (startupSkipped) {
            return;
        }

        setProgress(
            step.percent
        );

        setStartupStatus(
            step.text
        );

        await sleep(delay);
    }
}

async function runTitle() {
    if (startupSkipped) {
        return;
    }

    showStartupSection(
        "startup-title"
    );

    setStartupStatus(
        "PRESS START"
    );

    await sleep(
        STARTUP_TIMINGS.title
    );
}

function enableStartButton() {
    const button =
        getElement("start-button");

    if (!button) {
        return;
    }

    button.disabled = false;

    button.classList.add(
        "ready"
    );
}

function createFallbackStartButton() {
    const screen =
        getStartupScreen();

    if (!screen) {
        return null;
    }

    let button =
        getElement("start-button");

    if (button) {
        return button;
    }

    button =
        document.createElement(
            "button"
        );

    button.id =
        "start-button";

    button.type =
        "button";

    button.textContent =
        "PRESS START";

    button.className =
        "startup-start-button";

    const title =
        getElement("startup-title");

    if (title) {
        title.appendChild(button);
    } else {
        screen.appendChild(button);
    }

    return button;
}

function attachStartButton() {
    let button =
        getElement("start-button");

    if (!button) {
        button =
            createFallbackStartButton();
    }

    if (!button) {
        return;
    }

    if (
        button.dataset.startupBound ===
        "true"
    ) {
        return;
    }

    button.dataset.startupBound =
        "true";

    button.disabled = true;

    button.addEventListener(
        "click",
        () => {
            finishStartup();
        }
    );

    button.addEventListener(
        "keydown",
        event => {
            if (
                event.key ===
                "Enter" ||
                event.key ===
                " "
            ) {
                event.preventDefault();

                finishStartup();
            }
        }
    );
}

function attachSkipControls() {
    if (
        document.body.dataset
            .startupSkipBound ===
        "true"
    ) {
        return;
    }

    document.body.dataset
        .startupSkipBound =
        "true";

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key ===
                "Escape"
            ) {
                skipStartup();
            }
        }
    );

    const skipButton =
        getElement(
            "skip-startup"
        );

    if (skipButton) {
        skipButton.addEventListener(
            "click",
            () => {
                skipStartup();
            }
        );
    }
}

export function finishStartup() {
    if (startupFinished) {
        return;
    }

    startupFinished = true;
    startupSkipped = true;

    setProgress(100);

    hideStartupScreen();

    document.body.classList.remove(
        "startup-active"
    );

    document.body.classList.add(
        "game-ready"
    );

    const startEvent =
        new CustomEvent(
            "universe-smash-start"
        );

    window.dispatchEvent(
        startEvent
    );
}

export function skipStartup() {
    if (startupFinished) {
        return;
    }

    startupSkipped = true;

    finishStartup();
}

export function isStartupFinished() {
    return startupFinished;
}

export function isStartupSkipped() {
    return startupSkipped;
}

export async function runStartup() {
    if (startupFinished) {
        return true;
    }

    startupSkipped = false;

    prepareStartupScreen();

    attachStartButton();
    attachSkipControls();

    document.body.classList.add(
        "startup-active"
    );

    await runSplash();

    if (startupSkipped) {
        finishStartup();

        return true;
    }

    await runWarning();

    if (startupSkipped) {
        finishStartup();

        return true;
    }

    await runLoading();

    if (startupSkipped) {
        finishStartup();

        return true;
    }

    await runTitle();

    if (startupSkipped) {
        finishStartup();

        return true;
    }

    enableStartButton();

    // Automatically finish if there
    // is no start button in the HTML.
    const startButton =
        getElement("start-button");

    if (!startButton) {
        await sleep(500);

        finishStartup();
    }

    return true;
}

export function resetStartup() {
    startupFinished = false;
    startupSkipped = false;

    const screen =
        getStartupScreen();

    if (screen) {
        showStartupScreen();
    }

    setProgress(0);

    setStartupStatus(
        "INITIALIZING..."
    );

    document.body.classList.add(
        "startup-active"
    );

    document.body.classList.remove(
        "game-ready"
    );

    const button =
        getElement("start-button");

    if (button) {
        button.disabled = true;

        button.classList.remove(
            "ready"
        );
    }
}

// Make startup controls available
// globally for buttons or debugging.
window.UniverseSmashStartup = {
    runStartup,
    finishStartup,
    skipStartup,
    resetStartup,
    isStartupFinished,
    isStartupSkipped
};
