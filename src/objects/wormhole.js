export function createWormhole(
    x,
    y,
    options = {}
) {

    return {

        type: "wormhole",

        x,
        y,

        radius:
            options.radius ??
            32,

        mass:
            options.mass ??
            10000,

        vx:
            options.vx ??
            0,

        vy:
            options.vy ??
            0,

        rotation: 0,

        linked: null,

        destroyed: false
    };
}


export function updateWormhole(
    wormhole,
    deltaTime = 1
) {

    wormhole.rotation +=
        0.05 *
        deltaTime;
}


export function linkWormholes(
    wormholes
) {

    if (
        !wormholes ||
        wormholes.length < 2
    ) {

        return;
    }


    for (
        let i = 0;
        i < wormholes.length;
        i++
    ) {

        const next =
            (i + 1) %
            wormholes.length;


        wormholes[i].linked =
            wormholes[next];
    }
}
