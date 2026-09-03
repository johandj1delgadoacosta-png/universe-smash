export function createAntimatterPlanet(
    x,
    y,
    options = {}
) {

    return {

        type: "antimatter-planet",

        x,
        y,

        radius:
            options.radius ??
            28,

        mass:
            options.mass ??
            1200,

        color:
            options.color ??
            "#ff45ff",

        vx:
            options.vx ??
            0,

        vy:
            options.vy ??
            0,

        rotation: 0,

        energy: 1,

        destroyed: false
    };
}


export function updateAntimatterPlanet(
    planet,
    deltaTime = 1
) {

    planet.rotation +=
        0.02 *
        deltaTime;

    planet.energy +=
        0.01 *
        deltaTime;

    planet.energy =
        Math.min(
            planet.energy,
            1
        );
}
