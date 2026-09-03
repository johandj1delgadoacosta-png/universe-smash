// Universe Smash - Planet Mode
// Single-planet mode with fictional weapons

import {
    createPlanet,
    updatePlanet,
    drawPlanet,
    damagePlanet,
    healPlanet,
    getPlanetHealth
} from "../objects/planet.js";

import {
    createAsteroid,
    updateAsteroid,
    drawAsteroid
} from "../objects/asteroid.js";

import {
    createAntimatterPlanet,
    updateAntimatterPlanet,
    drawAntimatterPlanet,
    triggerAntimatterReaction
} from "../objects/antimatter-planet.js";

import {
    createExplosion,
    createImpact,
    createAntimatterEffect,
    createShockwave,
    updateParticles,
    drawParticles,
    clearParticles
} from "../particles.js";

import {
    playLaserSound,
    playIceLaserSound,
    playAsteroidImpact,
    playExplosionSound,
    playAntimatterSound,
    playAlienSound,
    playMysterySound,
    playSpawnSound,
    playClickSound
} from "../audio.js";

let canvas = null;
let ctx = null;

let running = false;
let paused = false;

let planet = null;
let effects = [];

let selectedWeapon = "laser";

let alienShips = [];
let projectiles = [];

let lastTime = 0;

const WEAPONS = {
    laser: {
        name: "LASER",
        damage: 12
    },

    ice: {
        name: "ICE LASER",
        damage: 8
    },

    asteroid: {
        name: "ASTEROID",
        damage: 35
    },

    alien: {
        name: "ALIEN SHIP",
        damage: 20
    },

    antimatter: {
        name: "ANTIMATTER",
        damage: 100
    },

    mystery: {
        name: "MYSTERY MATTER",
        damage: 25
    }
};


// --------------------------------------------------
// START
// --------------------------------------------------

function startPlanetMode(targetCanvas) {
    canvas = targetCanvas;

    if (!canvas) {
        console.error("Universe Smash: Planet Mode could not find canvas.");
        return false;
    }

    ctx = canvas.getContext("2d");

    running = true;
    paused = false;

    lastTime = performance.now();

    clearParticles();

    effects = [];
    alienShips = [];
    projectiles = [];

    createNewPlanet();

    window.dispatchEvent(
        new CustomEvent("universe-smash-planet-mode-started")
    );

    return true;
}


// --------------------------------------------------
// CREATE PLANET
// --------------------------------------------------

function createNewPlanet() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radius = Math.min(
        canvas.width,
        canvas.height
    ) * 0.18;

    planet = createPlanet({
        x: centerX,
        y: centerY,
        radius: radius,
        mass: 5.972e24,

        colors: {
            ocean: "#2367a8",
            land: "#4f8a45",
            atmosphere: "#66b3ff"
        },

        atmosphere: true,
        rings: false,

        health: 100,
        maxHealth: 100,

        temperature: 288
    });

    if (!planet) {
        console.error("Universe Smash: Failed to create planet.");
    }
}


// --------------------------------------------------
// STOP
// --------------------------------------------------

function stopPlanetMode() {
    running = false;
    paused = false;

    effects = [];
    alienShips = [];
    projectiles = [];

    clearParticles();

    planet = null;

    window.dispatchEvent(
        new CustomEvent("universe-smash-planet-mode-stopped")
    );
}


// --------------------------------------------------
// WEAPON SELECTION
// --------------------------------------------------

function selectWeapon(weapon) {
    if (!WEAPONS[weapon]) {
        return false;
    }

    selectedWeapon = weapon;

    playClickSound();

    window.dispatchEvent(
        new CustomEvent("universe-smash-weapon-selected", {
            detail: {
                weapon
            }
        })
    );

    return true;
}


// --------------------------------------------------
// USE WEAPON
// --------------------------------------------------

function usePlanetWeapon(weapon = selectedWeapon, x = null, y = null) {
    if (!running || paused || !planet) {
        return false;
    }

    if (!WEAPONS[weapon]) {
        weapon = selectedWeapon;
    }

    selectedWeapon = weapon;

    const targetX =
        x === null ? planet.x : x;

    const targetY =
        y === null ? planet.y : y;

    switch (weapon) {

        case "laser":
            fireLaser(targetX, targetY);
            break;

        case "ice":
            fireIceLaser(targetX, targetY);
            break;

        case "asteroid":
            launchAsteroid(targetX, targetY);
            break;

        case "alien":
            launchAlienShip(targetX, targetY);
            break;

        case "antimatter":
            fireAntimatter(targetX, targetY);
            break;

        case "mystery":
            fireMysteryMatter(targetX, targetY);
            break;

        default:
            fireLaser(targetX, targetY);
            break;
    }

    return true;
}


// --------------------------------------------------
// LASER
// --------------------------------------------------

function fireLaser(x, y) {

    playLaserSound();

    damagePlanet(planet, WEAPONS.laser.damage);

    createImpact(
        planet.x,
        planet.y,
        20
    );

    createShockwave(
        planet.x,
        planet.y,
        20,
        90
    );

    effects.push({
        type: "laser",
        x1: canvas.width / 2,
        y1: 0,
        x2: x,
        y2: y,
        life: 0.15,
        maxLife: 0.15
    });

    checkPlanetDestroyed();
}


// --------------------------------------------------
// ICE LASER
// --------------------------------------------------

function fireIceLaser(x, y) {

    playIceLaserSound();

    damagePlanet(
        planet,
        WEAPONS.ice.damage
    );

    planet.temperature =
        Math.max(
            -200,
            (planet.temperature || 288) - 40
        );

    effects.push({
        type: "ice",
        x1: canvas.width / 2,
        y1: canvas.height,
        x2: x,
        y2: y,
        life: 0.3,
        maxLife: 0.3
    });

    createImpact(
        x,
        y,
        15
    );

    checkPlanetDestroyed();
}


// --------------------------------------------------
// ASTEROID
// --------------------------------------------------

function launchAsteroid(x, y) {

    playAsteroidImpact();

    const startX =
        canvas.width / 2;

    const startY =
        canvas.height / 2;

    const asteroid = createAsteroid({
        x: startX,
        y: startY,
        radius: Math.max(
            10,
            planet.radius * 0.12
        ),
        mass: 1e15
    });

    if (!asteroid) return;

    const dx = x - startX;
    const dy = y - startY;

    const distance =
        Math.sqrt(dx * dx + dy * dy) || 1;

    asteroid.vx =
        (dx / distance) * 350;

    asteroid.vy =
        (dy / distance) * 350;

    asteroid.life = 2;

    effects.push({
        type: "asteroid",
        object: asteroid
    });

    damagePlanet(
        planet,
        WEAPONS.asteroid.damage
    );

    createExplosion(
        x,
        y,
        30
    );

    checkPlanetDestroyed();
}


// --------------------------------------------------
// ALIEN SHIP
// --------------------------------------------------

function launchAlienShip(x, y) {

    playAlienSound();

    const startX = 0;
    const startY = canvas.height / 2;

    const ship = {
        type: "alien-ship",

        x: startX,
        y: startY,

        vx: 0,
        vy: 0,

        targetX: x,
        targetY: y,

        radius: 12,

        life: 4
    };

    const dx = x - startX;
    const dy = y - startY;

    const distance =
        Math.sqrt(dx * dx + dy * dy) || 1;

    ship.vx =
        (dx / distance) * 300;

    ship.vy =
        (dy / distance) * 300;

    alienShips.push(ship);
}


// --------------------------------------------------
// ANTIMATTER
// --------------------------------------------------

function fireAntimatter(x, y) {

    playAntimatterSound();

    createAntimatterEffect(
        x,
        y,
        70
    );

    createShockwave(
        x,
        y,
        30,
        180
    );

    damagePlanet(
        planet,
        WEAPONS.antimatter.damage
    );

    planet.temperature =
        Math.min(
            10000,
            (planet.temperature || 288) + 1000
        );

    if (typeof triggerAntimatterReaction === "function") {
        try {
            triggerAntimatterReaction(
                planet,
                x,
                y
            );
        } catch (error) {
            console.warn(
                "Antimatter reaction warning:",
                error
            );
        }
    }

    checkPlanetDestroyed();
}


// --------------------------------------------------
// MYSTERY MATTER
// --------------------------------------------------

function fireMysteryMatter(x, y) {

    playMysterySound();

    const effect =
        Math.floor(Math.random() * 5);

    switch (effect) {

        case 0:
            // Huge impact
            damagePlanet(
                planet,
                50
            );

            createExplosion(
                x,
                y,
                80
            );

            createShockwave(
                x,
                y,
                50,
                220
            );

            break;

        case 1:
            // Small impact
            damagePlanet(
                planet,
                15
            );

            createImpact(
                x,
                y,
                25
            );

            break;

        case 2:
            // Temperature spike
            planet.temperature =
                Math.min(
                    5000,
                    (planet.temperature || 288) + 800
                );

            createExplosion(
                x,
                y,
                40
            );

            break;

        case 3:
            // Healing effect
            healPlanet(
                planet,
                15
            );

            createImpact(
                x,
                y,
                20
            );

            break;

        case 4:
            // Gravity-like shock
            damagePlanet(
                planet,
                30
            );

            createShockwave(
                x,
                y,
                20,
                300
            );

            break;
    }

    checkPlanetDestroyed();
}


// --------------------------------------------------
// PLANET DESTRUCTION
// --------------------------------------------------

function checkPlanetDestroyed() {

    const health =
        getPlanetHealth(planet);

    if (health <= 0) {

        playExplosionSound();

        createExplosion(
            planet.x,
            planet.y,
            planet.radius * 2
        );

        createShockwave(
            planet.x,
            planet.y,
            planet.radius,
            planet.radius * 4
        );

        effects.push({
            type: "planet-destroyed",
            x: planet.x,
            y: planet.y,
            life: 2,
            maxLife: 2
        });

        setTimeout(() => {

            if (!running) return;

            createNewPlanet();

        }, 1800);
    }
}


// --------------------------------------------------
// UPDATE
// --------------------------------------------------

function updatePlanetMode(deltaTime = 1 / 60) {

    if (!running || paused) {
        return;
    }

    if (!planet) {
        return;
    }

    updatePlanet(
        planet,
        deltaTime
    );

    // Update asteroids
    for (let i = effects.length - 1; i >= 0; i--) {

        const effect = effects[i];

        if (effect.type === "asteroid") {

            const asteroid =
                effect.object;

            updateAsteroid(
                asteroid,
                deltaTime
            );

            asteroid.life -= deltaTime;

            const dx =
                asteroid.x - planet.x;

            const dy =
                asteroid.y - planet.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (
                distance <
                planet.radius + asteroid.radius
            ) {

                damagePlanet(
                    planet,
                    WEAPONS.asteroid.damage
                );

                createExplosion(
                    planet.x,
                    planet.y,
                    40
                );

                effect.life = 0;

                checkPlanetDestroyed();
            }

            if (asteroid.life <= 0) {
                effect.life = 0;
            }
        }

        if (
            effect.type === "laser" ||
            effect.type === "ice"
        ) {
            effect.life -= deltaTime;

            if (effect.life <= 0) {
                effects.splice(i, 1);
            }
        }

        if (effect.type === "planet-destroyed") {
            effect.life -= deltaTime;

            if (effect.life <= 0) {
                effects.splice(i, 1);
            }
        }
    }

    // Remove dead asteroid effects
    effects = effects.filter(effect => {
        if (effect.type !== "asteroid") {
            return true;
        }

        return (
            effect.object &&
            effect.object.life > 0
        );
    });

    // Alien ships
    for (
        let i = alienShips.length - 1;
        i >= 0;
        i--
    ) {

        const ship =
            alienShips[i];

        ship.x += ship.vx * deltaTime;
        ship.y += ship.vy * deltaTime;

        ship.life -= deltaTime;

        const dx =
            ship.x - planet.x;

        const dy =
            ship.y - planet.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (
            distance <
            planet.radius + ship.radius
        ) {

            damagePlanet(
                planet,
                WEAPONS.alien.damage
            );

            createExplosion(
                planet.x,
                planet.y,
                35
            );

            alienShips.splice(i, 1);

            checkPlanetDestroyed();

            continue;
        }

        if (
            ship.life <= 0 ||
            ship.x > canvas.width + 100 ||
            ship.y < -100 ||
            ship.y > canvas.height + 100
        ) {
            alienShips.splice(i, 1);
        }
    }

    updateParticles(
        deltaTime
    );
}


// --------------------------------------------------
// DRAW
// --------------------------------------------------

function drawPlanetMode() {

    if (!ctx || !canvas) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Space background
    drawSpaceBackground();

    // Planet
    if (planet) {
        drawPlanet(
            ctx,
            planet
        );
    }

    // Asteroids
    for (const effect of effects) {

        if (
            effect.type === "asteroid" &&
            effect.object
        ) {
            drawAsteroid(
                ctx,
                effect.object
            );
        }
    }

    // Alien ships
    drawAlienShips();

    // Laser effects
    drawWeaponEffects();

    // Particles
    drawParticles(ctx);

    // HUD
    drawHUD();
}


// --------------------------------------------------
// BACKGROUND
// --------------------------------------------------

function drawSpaceBackground() {

    ctx.fillStyle = "#02040a";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Stars
    ctx.save();

    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < 100; i++) {

        const x =
            (i * 83) % canvas.width;

        const y =
            (i * 47) % canvas.height;

        const size =
            i % 7 === 0 ? 2 : 1;

        ctx.globalAlpha =
            0.3 + ((i % 5) / 10);

        ctx.fillRect(
            x,
            y,
            size,
            size
        );
    }

    ctx.restore();
}


// --------------------------------------------------
// WEAPON EFFECTS
// --------------------------------------------------

function drawWeaponEffects() {

    for (const effect of effects) {

        if (
            effect.type !== "laser" &&
            effect.type !== "ice"
        ) {
            continue;
        }

        const alpha =
            Math.max(
                0,
                effect.life / effect.maxLife
            );

        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.lineWidth =
            effect.type === "laser"
                ? 5
                : 8;

        ctx.strokeStyle =
            effect.type === "laser"
                ? "#ff3030"
                : "#80dfff";

        ctx.beginPath();

        ctx.moveTo(
            effect.x1,
            effect.y1
        );

        ctx.lineTo(
            effect.x2,
            effect.y2
        );

        ctx.stroke();

        ctx.restore();
    }
}


// --------------------------------------------------
// ALIEN SHIPS
// --------------------------------------------------

function drawAlienShips() {

    for (const ship of alienShips) {

        ctx.save();

        ctx.translate(
            ship.x,
            ship.y
        );

        ctx.fillStyle =
            "#8f8f9f";

        ctx.beginPath();

        ctx.moveTo(
            -18,
            5
        );

        ctx.lineTo(
            0,
            -8
        );

        ctx.lineTo(
            18,
            5
        );

        ctx.lineTo(
            0,
            3
        );

        ctx.closePath();

        ctx.fill();

        ctx.fillStyle =
            "#36ffcc";

        ctx.beginPath();

        ctx.arc(
            0,
            1,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}


// --------------------------------------------------
// HUD
// --------------------------------------------------

function drawHUD() {

    if (!planet) return;

    const health =
        Math.max(
            0,
            getPlanetHealth(planet)
        );

    ctx.save();

    ctx.fillStyle =
        "rgba(0,0,0,0.65)";

    ctx.fillRect(
        20,
        20,
        260,
        75
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 18px Arial";

    ctx.fillText(
        "PLANET MODE",
        35,
        47
    );

    ctx.font =
        "14px Arial";

    ctx.fillText(
        `WEAPON: ${WEAPONS[selectedWeapon].name}`,
        35,
        70
    );

    ctx.fillText(
        `HEALTH: ${Math.round(health)}%`,
        35,
        88
    );

    ctx.restore();
}


// --------------------------------------------------
// PAUSE
// --------------------------------------------------

function setPlanetModePaused(value) {
    paused = Boolean(value);
}

function togglePlanetModePause() {
    paused = !paused;
    return paused;
}


// --------------------------------------------------
// RESET
// --------------------------------------------------

function resetPlanetMode() {

    clearParticles();

    effects = [];
    alienShips = [];
    projectiles = [];

    createNewPlanet();
}


// --------------------------------------------------
// GET STATE
// --------------------------------------------------

function getPlanetMode() {

    return {
        running,
        paused,
        selectedWeapon,
        planet,
        effects,
        alienShips
    };
}


// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function getCurrentPlanet() {
    return planet;
}

function getSelectedWeapon() {
    return selectedWeapon;
}

function isPlanetModeRunning() {
    return running;
}

function isPlanetModePaused() {
    return paused;
}


// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

export {
    startPlanetMode,
    stopPlanetMode,

    usePlanetWeapon,
    selectWeapon,

    updatePlanetMode,
    drawPlanetMode,

    setPlanetModePaused,
    togglePlanetModePause,

    resetPlanetMode,

    getPlanetMode,
    getCurrentPlanet,
    getSelectedWeapon,

    isPlanetModeRunning,
    isPlanetModePaused
};
