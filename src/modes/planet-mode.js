import {
    Camera,
    enableCameraZoom
} from "../camera.js";

import {
    createExplosion,
    createAntimatterEffect,
    updateParticles,
    drawParticles,
    clearParticles
} from "../particles.js";

import {
    createPlanet
} from "../objects/planet.js";


let canvas = null;
let ctx = null;

let camera = null;

let planet = null;

let running = false;

let selectedWeapon = "laser";

let menuBuilt = false;

let rotation = 0;


export function startPlanetMode(
    gameCanvas,
    gameCtx,
    menuCallback
) {

    canvas = gameCanvas;
    ctx = gameCtx;

    camera =
        new Camera();

    camera.zoom = 1;

    planet =
        createPlanet(
            0,
            0,
            {
                radius: 170,
                mass: 10000,
                color: "#3b82ff"
            }
        );

    running = true;

    rotation = 0;

    clearParticles();

    buildWeaponMenu();


    const menu =
        document.getElementById(
            "planet-weapon-menu"
        );

    menu.style.display =
        "block";


    enableCameraZoom(
        canvas,
        camera
    );


    if (!canvas.dataset.planetEvents) {

        canvas.dataset.planetEvents =
            "true";


        canvas.addEventListener(
            "pointerdown",
            planetPointerDown
        );
    }


    if (
        !window.__planetMenuListener
    ) {

        window.__planetMenuListener =
            true;

        window.addEventListener(
            "universe-smash-menu",
            () => {

                if (menuCallback) {
                    menuCallback();
                }
            }
        );
    }
}


export function stopPlanetMode() {

    running = false;

    const menu =
        document.getElementById(
            "planet-weapon-menu"
        );

    if (menu) {

        menu.style.display =
            "none";
    }
}


function buildWeaponMenu() {

    if (menuBuilt) {
        return;
    }

    menuBuilt = true;


    const menu =
        document.getElementById(
            "planet-weapon-menu"
        );


    menu.innerHTML = `

        <div class="menu-section-title">
            PLANET MODE
        </div>

        <button
            class="game-button"
            data-weapon="laser">
            🔴 LASER
        </button>

        <button
            class="game-button"
            data-weapon="ice">
            ❄️ ICE LASER
        </button>

        <button
            class="game-button"
            data-weapon="asteroid">
            ☄️ ASTEROID
        </button>

        <button
            class="game-button"
            data-weapon="mystery">
            ❓ MYSTERY MATTER
        </button>

        <button
            class="game-button"
            data-weapon="alien">
            👽 ALIEN SHIP
        </button>

        <button
            class="game-button"
            data-weapon="antimatter">
            💜 ANTIMATTER
        </button>

        <button
            class="game-button"
            id="planet-reset">
            🔄 RESET PLANET
        </button>

        <button
            class="game-button"
            id="planet-menu">
            ← MAIN MENU
        </button>
    `;


    menu
        .querySelectorAll(
            "[data-weapon]"
        )
        .forEach(button => {

            button.onclick = () => {

                selectedWeapon =
                    button.dataset.weapon;
            };
        });


    document
        .getElementById(
            "planet-reset"
        )
        .onclick =
        resetPlanet;


    document
        .getElementById(
            "planet-menu"
        )
        .onclick = () => {

            window.dispatchEvent(
                new CustomEvent(
                    "universe-smash-menu"
                )
            );
        };
}


function resetPlanet() {

    planet =
        createPlanet(
            0,
            0,
            {
                radius: 170,
                mass: 10000,
                color: "#3b82ff"
            }
        );

    rotation = 0;

    clearParticles();
}


function planetPointerDown(
    event
) {

    if (!running) {
        return;
    }


    if (event.button !== 0) {
        return;
    }


    const point =
        camera.screenToWorld(
            event.clientX,
            event.clientY,
            canvas
        );


    const dx =
        point.x -
        planet.x;

    const dy =
        point.y -
        planet.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distance <=
        planet.radius
    ) {

        usePlanetWeapon(
            point.x,
            point.y
        );
    }
}


function usePlanetWeapon(
    x,
    y
) {

    switch (selectedWeapon) {

        case "laser":

            createExplosion(
                x,
                y,
                15
            );

            planet.radius -= 3;

            break;


        case "ice":

            planet.color =
                "#9eeaff";

            createExplosion(
                x,
                y,
                10
            );

            break;


        case "asteroid":

            createExplosion(
                x,
                y,
                35
            );

            planet.radius -= 8;

            break;


        case "mystery":

            mysteryMatter();

            break;


        case "alien":

            createExplosion(
                x,
                y,
                25
            );

            planet.rotation +=
                0.4;

            break;


        case "antimatter":

            createAntimatterEffect(
                x,
                y
            );

            planet.radius -=
                15;

            break;
    }


    if (
        planet.radius < 20
    ) {

        planet.radius = 20;
    }
}


function mysteryMatter() {

    const effect =
        Math.floor(
            Math.random() * 5
        );


    switch (effect) {

        case 0:

            planet.radius += 25;

            planet.color =
                "#44ff99";

            break;


        case 1:

            planet.radius -= 20;

            planet.color =
                "#ff5555";

            break;


        case 2:

            planet.color =
                "#bb66ff";

            rotation += 2;

            break;


        case 3:

            createExplosion(
                planet.x,
                planet.y,
                60
            );

            break;


        case 4:

            planet.color =
                "#ffaa33";

            planet.radius += 10;

            break;
    }
}


export function updatePlanetMode(
    deltaTime = 1
) {

    if (!running) {
        return;
    }


    rotation +=
        0.003 *
        deltaTime;


    updateParticles(
        deltaTime
    );
}


export function drawPlanetMode() {

    if (
        !canvas ||
        !ctx ||
        !camera ||
        !planet
    ) {
        return;
    }


    ctx.fillStyle =
        "#000";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawPlanetBackground();


    const p =
        camera.worldToScreen(
            planet.x,
            planet.y,
            canvas
        );


    const r =
        planet.radius *
        camera.zoom;


    const atmosphere =
        ctx.createRadialGradient(
            p.x,
            p.y,
            r * 0.7,
            p.x,
            p.y,
            r * 1.4
        );


    atmosphere.addColorStop(
        0,
        "rgba(60,140,255,0)"
    );

    atmosphere.addColorStop(
        0.7,
        "rgba(60,140,255,0.15)"
    );

    atmosphere.addColorStop(
        1,
        "rgba(60,140,255,0)"
    );


    ctx.fillStyle =
        atmosphere;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r * 1.4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    const planetGradient =
        ctx.createRadialGradient(
            p.x - r * 0.35,
            p.y - r * 0.35,
            r * 0.1,
            p.x,
            p.y,
            r
        );


    planetGradient.addColorStop(
        0,
        "#ffffff"
    );

    planetGradient.addColorStop(
        0.18,
        planet.color
    );

    planetGradient.addColorStop(
        0.65,
        planet.color
    );

    planetGradient.addColorStop(
        1,
        "#030817"
    );


    ctx.fillStyle =
        planetGradient;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r,
        0,
        Math.PI * 2
    );

    ctx.fill();


    drawContinents(
        p.x,
        p.y,
        r
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.35)";

    ctx.lineWidth =
        1;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        r,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    drawParticles(
        ctx,
        camera,
        canvas
    );


    const count =
        document.getElementById(
            "object-count"
        );

    const zoom =
        document.getElementById(
            "zoom-display"
        );

    const mode =
        document.getElementById(
            "mode-display"
        );


    if (count) {

        count.textContent =
            "Objects: 1";
    }


    if (zoom) {

        zoom.textContent =
            `Zoom: ${Math.round(
                camera.zoom * 100
            )}%`;
    }


    if (mode) {

        mode.textContent =
            "PLANET MODE";
    }
}


function drawPlanetBackground() {

    for (
        let i = 0;
        i < 250;
        i++
    ) {

        const x =
            Math.random() *
            canvas.width;

        const y =
            Math.random() *
            canvas.height;


        ctx.fillStyle =
            "rgba(255,255,255,0.5)";


        ctx.fillRect(
            x,
            y,
            1,
            1
        );
    }
}


function drawContinents(
    x,
    y,
    r
) {

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        r,
        0,
        Math.PI * 2
    );

    ctx.clip();


    ctx.fillStyle =
        "rgba(30,180,100,0.55)";


    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const angle =
            rotation +
            i * 2.7;


        const cx =
            x +
            Math.cos(angle) *
            r *
            0.55;

        const cy =
            y +
            Math.sin(angle) *
            r *
            0.45;


        ctx.beginPath();

        ctx.ellipse(
            cx,
            cy,
            r * 0.18,
            r * 0.09,
            angle,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.restore();
}


export function getPlanetMode() {

    return {
        planet,
        camera,
        weapon: selectedWeapon
    };
}
