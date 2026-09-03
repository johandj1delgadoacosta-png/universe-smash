// Universe Smash
// Planet Mode
// One-planet destruction sandbox with fictional weapons.

import {
    createPlanet,
    updatePlanet,
    drawPlanet,
    damagePlanet,
    healPlanet
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
    updateParticles,
    drawParticles,
    clearParticles
} from "../particles.js";

import {
    playLaser,
    playExplosion,
    playAntimatter,
    playSpawn,
    playClick
} from "../audio.js";

let canvas = null;
let ctx = null;

let running = false;
let planet = null;

let effects = [];
let weapon = "laser";

let lastShotTime = 0;
let shotCooldown = 180;

let alienShips = [];
let mysteryEffects = [];

const WEAPONS = {
    laser: {
        name: "Laser",
        damage: 12,
        cooldown: 180
    },

    "ice-laser": {
        name: "Ice Laser",
        damage: 8,
        cooldown: 220
    },

    asteroid: {
        name: "Asteroid",
        damage: 30,
        cooldown: 700
    },

    mystery: {
        name: "Mystery Matter Gun",
        damage: 20,
        cooldown: 500
    },

    alien: {
        name: "Alien Ship",
        damage: 18,
        cooldown: 600
    },

    antimatter: {
        name: "Antimatter",
        damage: 80,
        cooldown: 1200
    }
};

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function getCenter() {
    return {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
}

function createPlanetModeWorld() {
    const center = getCenter();

    planet = createPlanet({
        x: center.x,
        y: center.y,
        radius: Math.min(canvas.width, canvas.height) * 0.22,
        mass: 5.972e24,
        health: 1000,
        maxHealth: 1000,
        temperature: 288,
        atmosphere: true,
        rings: false,
        rotationSpeed: 0.002
    });

    alienShips = [];
    mysteryEffects = [];

    clearParticles();

    effects = [];
}

export function startPlanetMode(targetCanvas) {
    canvas = targetCanvas;
    ctx = canvas.getContext("2d");

    running = true;

    weapon = "laser";
    lastShotTime = 0;

    createPlanetModeWorld();

    setupPlanetModeControls();
}

export function stopPlanetMode() {
    running = false;

    alienShips = [];
    mysteryEffects = [];

    clearParticles();

    effects = [];
}

export function getPlanetMode() {
    return {
        running,
        planet,
        weapon,
        alienShips,
        mysteryEffects
    };
}

export function setPlanetWeapon(newWeapon) {
    if (!WEAPONS[newWeapon]) {
        return false;
    }

    weapon = newWeapon;

    try {
        playClick();
    } catch (error) {
        // Audio is optional.
    }

    updateWeaponUI();

    return true;
}

export function getPlanetWeapon() {
    return weapon;
}

function canFire() {
    const now = performance.now();

    if (now - lastShotTime < shotCooldown) {
        return false;
    }

    lastShotTime = now;

    return true;
}

function updateCooldown() {
    shotCooldown = WEAPONS[weapon]?.cooldown ?? 300;
}

function randomPlanetImpact() {
    if (!planet) {
        return {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
    }

    const angle = random(0, Math.PI * 2);

    const distance = planet.radius * random(0.75, 1);

    return {
        x: planet.x + Math.cos(angle) * distance,
        y: planet.y + Math.sin(angle) * distance
    };
}

function fireLaser() {
    const impact = randomPlanetImpact();

    damagePlanet(planet, WEAPONS.laser.damage);

    effects.push({
        type: "laser",
        x: impact.x,
        y: impact.y,
        life: 220,
        maxLife: 220
    });

    try {
        playLaser();
    } catch (error) {
        // Audio is optional.
    }

    try {
        createImpact(impact.x, impact.y, {
            color: "#ffffff",
            count: 18,
            speed: 3
        });
    } catch (error) {
        // Particle effects are optional.
    }
}

function fireIceLaser() {
    const impact = randomPlanetImpact();

    damagePlanet(planet, WEAPONS["ice-laser"].damage);

    effects.push({
        type: "ice",
        x: impact.x,
        y: impact.y,
        life: 500,
        maxLife: 500
    });

    try {
        playLaser();
    } catch (error) {
        // Audio is optional.
    }

    try {
        createImpact(impact.x, impact.y, {
            color: "#9eeaff",
            count: 25,
            speed: 2.5
        });
    } catch (error) {
        // Particle effects are optional.
    }
}

function fireAsteroid() {
    const center = getCenter();

    const angle = random(0, Math.PI * 2);

    const distance = Math.max(canvas.width, canvas.height) * 0.65;

    const asteroid = createAsteroid({
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance,
        radius: random(12, 28),
        mass: random(100, 500),
        vx: -Math.cos(angle) * random(2, 5),
        vy: -Math.sin(angle) * random(2, 5)
    });

    asteroid.targetPlanet = true;

    alienShips.push({
        type: "incoming-asteroid",
        object: asteroid,
        life: 4000
    });

    try {
        playSpawn();
    } catch (error) {
        // Audio is optional.
    }
}

function fireMysteryMatter() {
    const impact = randomPlanetImpact();

    const possibleEffects = [
        "pulse",
        "freeze",
        "gravity",
        "heal",
        "shockwave",
        "mini-explosion"
    ];

    const selected =
        possibleEffects[
            Math.floor(Math.random() * possibleEffects.length)
        ];

    mysteryEffects.push({
        type: selected,
        x: impact.x,
        y: impact.y,
        life: 1200,
        maxLife: 1200
    });

    switch (selected) {
        case "pulse":
            damagePlanet(planet, 35);
            break;

        case "freeze":
            damagePlanet(planet, 20);
            planet.temperature = Math.max(
                20,
                (planet.temperature || 288) - 100
            );
            break;

        case "gravity":
            damagePlanet(planet, 50);
            break;

        case "heal":
            healPlanet(planet, 80);
            break;

        case "shockwave":
            damagePlanet(planet, 45);
            break;

        case "mini-explosion":
            damagePlanet(planet, 60);

            try {
                createExplosion(
                    impact.x,
                    impact.y,
                    35
                );
            } catch (error) {
                // Particle effects are optional.
            }

            break;
    }

    try {
        createImpact(impact.x, impact.y, {
            color: "#d8a8ff",
            count: 30,
            speed: 4
        });
    } catch (error) {
        // Particle effects are optional.
    }
}

function fireAlienShip() {
    const center = getCenter();

    const angle = random(0, Math.PI * 2);

    const distance =
        Math.max(canvas.width, canvas.height) * 0.55;

    const ship = {
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance,

        vx: 0,
        vy: 0,

        life: 3500,
        damage: WEAPONS.alien.damage,

        angle: angle + Math.PI
    };

    alienShips.push({
        type: "alien-ship",
        object: ship,
        life: 3500
    });

    try {
        playSpawn();
    } catch (error) {
        // Audio is optional.
    }
}

function fireAntimatter() {
    const impact = randomPlanetImpact();

    damagePlanet(
        planet,
        WEAPONS.antimatter.damage
    );

    try {
        triggerAntimatterReaction(
            createAntimatterPlanet({
                x: impact.x,
                y: impact.y,
                radius: 5,
                health: 1,
                maxHealth: 1
            })
        );
    } catch (error) {
        // The visual effect below still works.
    }

    try {
        createAntimatterEffect(
            impact.x,
            impact.y
        );
    } catch (error) {
        try {
            createExplosion(
                impact.x,
                impact.y,
                90
            );
        } catch (particleError) {
            // Particle effects are optional.
        }
    }

    effects.push({
        type: "antimatter",
        x: impact.x,
        y: impact.y,
        life: 1000,
        maxLife: 1000
    });

    try {
        playAntimatter();
    } catch (error) {
        // Audio is optional.
    }
}

export function usePlanetWeapon(selectedWeapon = weapon) {
    if (!running || !planet) {
        return false;
    }

    if (!WEAPONS[selectedWeapon]) {
        return false;
    }

    weapon = selectedWeapon;

    updateCooldown();

    if (!canFire()) {
        return false;
    }

    switch (weapon) {
        case "laser":
            fireLaser();
            break;

        case "ice-laser":
            fireIceLaser();
            break;

        case "asteroid":
            fireAsteroid();
            break;

        case "mystery":
            fireMysteryMatter();
            break;

        case "alien":
            fireAlienShip();
            break;

        case "antimatter":
            fireAntimatter();
            break;

        default:
            return false;
    }

    updateWeaponUI();

    return true;
}

function updateAlienShips(deltaTime) {
    const center = getCenter();

    for (const entry of alienShips) {
        const ship = entry.object;

        if (!ship) {
            entry.life = 0;
            continue;
        }

        const dx = center.x - ship.x;
        const dy = center.y - ship.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance > 1) {
            const speed = 0.0008 * deltaTime;

            ship.x += (dx / distance) * speed;
            ship.y += (dy / distance) * speed;
        }

        entry.life -= deltaTime;

        if (
            distance <
            (planet?.radius || 100) + 20
        ) {
            damagePlanet(
                planet,
                ship.damage
            );

            try {
                createExplosion(
                    ship.x,
                    ship.y,
                    35
                );
            } catch (error) {
                // Particle effects are optional.
            }

            entry.life = 0;
        }
    }

    alienShips = alienShips.filter(
        entry => entry.life > 0
    );
}

function updateMysteryEffects(deltaTime) {
    for (const effect of mysteryEffects) {
        effect.life -= deltaTime;
    }

    mysteryEffects = mysteryEffects.filter(
        effect => effect.life > 0
    );
}

function updateEffects(deltaTime) {
    for (const effect of effects) {
        effect.life -= deltaTime;
    }

    effects = effects.filter(
        effect => effect.life > 0
    );
}

export function updatePlanetMode(deltaTime) {
    if (!running || !planet) {
        return;
    }

    updatePlanet(
        planet,
        deltaTime
    );

    updateAlienShips(deltaTime);
    updateMysteryEffects(deltaTime);
    updateEffects(deltaTime);

    try {
        updateParticles(deltaTime);
    } catch (error) {
        // Particle effects are optional.
    }
}

function drawLaserEffect(effect) {
    const progress =
        1 - effect.life / effect.maxLife;

    const radius =
        8 + progress * 28;

    ctx.save();

    ctx.globalAlpha =
        Math.max(0, effect.life / effect.maxLife);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.arc(
        effect.x,
        effect.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawIceEffect(effect) {
    const progress =
        1 - effect.life / effect.maxLife;

    const radius =
        10 + progress * 35;

    ctx.save();

    ctx.globalAlpha =
        Math.max(0, effect.life / effect.maxLife);

    ctx.strokeStyle = "#9eeaff";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(
        effect.x,
        effect.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawAntimatterEffectVisual(effect) {
    const progress =
        1 - effect.life / effect.maxLife;

    const radius =
        15 + progress * 80;

    ctx.save();

    ctx.globalAlpha =
        Math.max(0, effect.life / effect.maxLife);

    ctx.strokeStyle = "#d9a3ff";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.arc(
        effect.x,
        effect.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawMysteryEffect(effect) {
    const progress =
        1 - effect.life / effect.maxLife;

    const radius =
        10 + progress * 35;

    ctx.save();

    ctx.globalAlpha =
        Math.max(0, effect.life / effect.maxLife);

    ctx.strokeStyle = "#c58cff";
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
        effect.x,
        effect.y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.stroke();

    ctx.restore();
}

function drawAlienShip(ship) {
    const object = ship.object;

    if (!object) {
        return;
    }

    ctx.save();

    ctx.translate(
        object.x,
        object.y
    );

    ctx.rotate(object.angle || 0);

    ctx.beginPath();

    ctx.moveTo(22, 0);
    ctx.lineTo(-14, -10);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 10);
    ctx.closePath();

    ctx.fillStyle = "#8fb7c8";
    ctx.fill();

    ctx.strokeStyle = "#d7f4ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
        2,
        0,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#7fe7ff";
    ctx.fill();

    ctx.restore();
}

function drawIncomingAsteroid(entry) {
    if (!entry.object) {
        return;
    }

    try {
        drawAsteroid(
            ctx,
            entry.object
        );
    } catch (error) {
        // Asteroid rendering is optional.
    }
}

export function drawPlanetMode() {
    if (!ctx || !canvas) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawBackground();

    if (planet) {
        try {
            drawPlanet(
                ctx,
                planet
            );
        } catch (error) {
            // Planet rendering is handled by the object module.
        }
    }

    for (const entry of alienShips) {
        if (
            entry.type ===
            "incoming-asteroid"
        ) {
            drawIncomingAsteroid(entry);
        } else {
            drawAlienShip(entry);
        }
    }

    for (const effect of effects) {
        if (effect.type === "laser") {
            drawLaserEffect(effect);
        } else if (effect.type === "ice") {
            drawIceEffect(effect);
        } else if (effect.type === "antimatter") {
            drawAntimatterEffectVisual(effect);
        }
    }

    for (const effect of mysteryEffects) {
        drawMysteryEffect(effect);
    }

    try {
        drawParticles(
            ctx
        );
    } catch (error) {
        // Particle rendering is optional.
    }

    drawPlanetHUD();
}

function drawBackground() {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height)
    );

    gradient.addColorStop(
        0,
        "#111a2b"
    );

    gradient.addColorStop(
        1,
        "#02030a"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawStars();
}

function drawStars() {
    ctx.save();

    ctx.fillStyle = "rgba(255,255,255,0.7)";

    const count = 140;

    for (let i = 0; i < count; i++) {
        const x =
            (i * 997) %
            canvas.width;

        const y =
            (i * 577) %
            canvas.height;

        const size =
            ((i * 17) % 3) + 1;

        ctx.fillRect(
            x,
            y,
            size,
            size
        );
    }

    ctx.restore();
}

function drawPlanetHUD() {
    if (!planet) {
        return;
    }

    const health =
        Math.max(
            0,
            Math.min(
                1,
                planet.health /
                planet.maxHealth
            )
        );

    ctx.save();

    ctx.fillStyle =
        "rgba(0,0,0,0.55)";

    ctx.fillRect(
        20,
        20,
        250,
        72
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 18px Arial";

    ctx.fillText(
        "PLANET MODE",
        35,
        46
    );

    ctx.font =
        "14px Arial";

    ctx.fillText(
        `Weapon: ${WEAPONS[weapon].name}`,
        35,
        68
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.2)";

    ctx.fillRect(
        35,
        78,
        210,
        7
    );

    ctx.fillStyle =
        "#55e68a";

    ctx.fillRect(
        35,
        78,
        210 * health,
        7
    );

    ctx.restore();
}

function setupPlanetModeControls() {
    const weaponButtons =
        document.querySelectorAll(
            "[data-planet-weapon]"
        );

    weaponButtons.forEach(button => {
        if (button.dataset.planetModeBound) {
            return;
        }

        button.dataset.planetModeBound =
            "true";

        button.addEventListener(
            "click",
            () => {
                const selected =
                    button.dataset.planetWeapon;

                setPlanetWeapon(selected);
            }
        );
    });

    if (canvas.dataset.planetModeBound) {
        return;
    }

    canvas.dataset.planetModeBound =
        "true";

    canvas.addEventListener(
        "click",
        () => {
            usePlanetWeapon();
        }
    );
}

function updateWeaponUI() {
    const buttons =
        document.querySelectorAll(
            "[data-planet-weapon]"
        );

    buttons.forEach(button => {
        const active =
            button.dataset.planetWeapon ===
            weapon;

        button.classList.toggle(
            "active",
            active
        );

        button.setAttribute(
            "aria-pressed",
            active ? "true" : "false"
        );
    });
}

export function resetPlanetMode() {
    if (!canvas) {
        return;
    }

    createPlanetModeWorld();

    weapon = "laser";
    lastShotTime = 0;

    updateCooldown();
    updateWeaponUI();
}

export function getPlanetHealth() {
    if (!planet) {
        return 0;
    }

    return planet.health;
}

export function isPlanetDestroyed() {
    return (
        planet !== null &&
        planet.health <= 0
    );
}

export function healCurrentPlanet(amount = 100) {
    if (!planet) {
        return false;
    }

    healPlanet(
        planet,
        amount
    );

    return true;
}

export function damageCurrentPlanet(amount = 10) {
    if (!planet) {
        return false;
    }

    damagePlanet(
        planet,
        amount
    );

    return true;
}
