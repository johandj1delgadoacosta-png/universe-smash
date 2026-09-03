export function createBlackHole(
    x,
    y,
    options = {}
) {

    return {

        type: "black-hole",

        x,
        y,

        radius:
            options.radius ??
            35,

        mass:
            options.mass ??
            50000,

        vx:
            options.vx ??
            0,

        vy:
            options.vy ??
            0,

        rotation: 0,

        destroyed: false
    };
}


export function updateBlackHole(
    blackHole,
    deltaTime = 1
) {

    blackHole.rotation +=
        0.03 *
        deltaTime;
}
