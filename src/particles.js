const particles = [];


export function createParticle(
    x,
    y,
    options = {}
) {

    particles.push({

        x,
        y,

        vx:
            options.vx ??
            (Math.random() - 0.5) * 5,

        vy:
            options.vy ??
            (Math.random() - 0.5) * 5,

        life:
            options.life ??
            60,

        maxLife:
            options.life ??
            60,

        size:
            options.size ??
            2,

        color:
            options.color ??
            "#ffffff"
    });
}


export function createExplosion(
    x,
    y,
    amount = 40
) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            Math.random() *
            5 +
            1;


        createParticle(
            x,
            y,
            {

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed,

                life:
                    30 +
                    Math.random() * 50,

                size:
                    1 +
                    Math.random() * 3
            }
        );
    }
}


export function createImpact(x, y) {

    createExplosion(
        x,
        y,
        20
    );
}


export function createAntimatterEffect(
    x,
    y
) {

    createExplosion(
        x,
        y,
        70
    );
}


export function updateParticles(
    deltaTime = 1
) {

    for (
        let i = particles.length - 1;
        i >= 0;
        i--
    ) {

        const p =
            particles[i];


        p.x +=
            p.vx *
            deltaTime;

        p.y +=
            p.vy *
            deltaTime;


        p.vx *=
            Math.pow(
                0.985,
                deltaTime
            );

        p.vy *=
            Math.pow(
                0.985,
                deltaTime
            );


        p.life -=
            deltaTime;


        if (p.life <= 0) {

            particles.splice(
                i,
                1
            );
        }
    }
}


export function drawParticles(
    ctx,
    camera,
    canvas
) {

    for (const p of particles) {

        const screen =
            camera.worldToScreen(
                p.x,
                p.y,
                canvas
            );


        const alpha =
            Math.max(
                0,
                p.life /
                p.maxLife
            );


        ctx.globalAlpha =
            alpha;

        ctx.fillStyle =
            p.color;


        ctx.beginPath();

        ctx.arc(
            screen.x,
            screen.y,
            Math.max(
                1,
                p.size *
                camera.zoom
            ),
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.globalAlpha = 1;
}


export function clearParticles() {

    particles.length = 0;
}
