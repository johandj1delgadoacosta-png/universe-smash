export function createGreyHole(
    x,
    y,
    options = {}
) {

    return {

        type: "grey-hole",

        x,
        y,

        radius:
            options.radius ??
            30,

        mass:
            options.mass ??
            30000,

        vx:
            options.vx ??
            0,

        vy:
            options.vy ??
            0,

        rotation: 0,

        glow: 0,

        destroyed: false
    };
}


export function updateGreyHole(
    greyHole,
    deltaTime = 1
) {

    greyHole.rotation +=
        0.02 *
        deltaTime;

    greyHole.glow +=
        0.04 *
        deltaTime;

    if (
        greyHole.glow >
        Math.PI * 2
    ) {

        greyHole.glow = 0;
    }
}
