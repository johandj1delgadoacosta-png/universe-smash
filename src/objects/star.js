export function createStar(
    x,
    y,
    options = {}
) {

    return {

        type: "star",

        x,
        y,

        radius:
            options.radius ??
            55,

        mass:
            options.mass ??
            100000,

        starType:
            options.starType ??
            "yellow",

        temperature:
            options.temperature ??
            5778,

        color:
            options.color ??
            "#fff0a0",

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
