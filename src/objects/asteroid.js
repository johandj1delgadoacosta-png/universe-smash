export function createAsteroid(
    x,
    y,
    options = {}
) {

    return {

        type: "asteroid",

        x,
        y,

        radius:
            options.radius ??
            8,

        mass:
            options.mass ??
            20,

        color:
            options.color ??
            "#777777",

        vx:
            options.vx ??
            0,

        vy:
            options.vy ??
            0,

        rotation: 0,

        rotationSpeed:
            (Math.random() - 0.5) *
            0.1,

        destroyed: false
    };
}
