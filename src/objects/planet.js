export function createPlanet(
    x,
    y,
    options = {}
) {

    return {

        type: "planet",

        x,
        y,

        radius:
            options.radius ??
            25,

        mass:
            options.mass ??
            1000,

        color:
            options.color ??
            "#3478ff",

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
