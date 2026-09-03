const G = 0.08;


export function updatePhysics(
    objects,
    deltaTime = 1
) {

    for (
        let i = 0;
        i < objects.length;
        i++
    ) {

        const a =
            objects[i];


        if (
            a.destroyed ||
            !Number.isFinite(a.mass)
        ) {
            continue;
        }


        for (
            let j = i + 1;
            j < objects.length;
            j++
        ) {

            const b =
                objects[j];


            if (
                b.destroyed ||
                !Number.isFinite(b.mass)
            ) {
                continue;
            }


            const dx =
                b.x - a.x;

            const dy =
                b.y - a.y;


            const distanceSquared =
                dx * dx +
                dy * dy;


            if (
                distanceSquared <
                25
            ) {
                continue;
            }


            const distance =
                Math.sqrt(
                    distanceSquared
                );


            let force =
                G *
                a.mass *
                b.mass /
                distanceSquared;


            /*
             * Prevent extreme
             * numerical acceleration.
             */

            force =
                Math.min(
                    force,
                    100000
                );


            const nx =
                dx / distance;

            const ny =
                dy / distance;


            const accelerationA =
                force /
                a.mass;

            const accelerationB =
                force /
                b.mass;


            a.vx +=
                nx *
                accelerationA *
                deltaTime;

            a.vy +=
                ny *
                accelerationA *
                deltaTime;


            b.vx -=
                nx *
                accelerationB *
                deltaTime;

            b.vy -=
                ny *
                accelerationB *
                deltaTime;
        }
    }


    for (const object of objects) {

        if (object.destroyed) {
            continue;
        }


        object.vx =
            Math.max(
                -100,
                Math.min(
                    100,
                    object.vx
                )
            );


        object.vy =
            Math.max(
                -100,
                Math.min(
                    100,
                    object.vy
                )
            );


        object.x +=
            object.vx *
            deltaTime;

        object.y +=
            object.vy *
            deltaTime;
    }
}
