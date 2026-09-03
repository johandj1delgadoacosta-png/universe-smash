export function createMoon(
    x,
    y,
    options = {}
) {

    return {

        type: "moon",

        x,
        y,

        radius:
            options.radius ??
            10,

        mass:
            options.mass ??
            50,

        color:
            options.color ??
            "#aaaaaa",

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
