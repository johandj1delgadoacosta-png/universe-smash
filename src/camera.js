export class Camera {

    constructor() {

        this.x = 0;
        this.y = 0;

        this.zoom = 1;

        this.minZoom = 0.08;
        this.maxZoom = 8;
    }


    reset() {

        this.x = 0;
        this.y = 0;

        this.zoom = 1;
    }


    setZoom(value) {

        this.zoom =
            Math.max(
                this.minZoom,
                Math.min(
                    this.maxZoom,
                    value
                )
            );
    }


    zoomIn(amount = 0.15) {

        this.setZoom(
            this.zoom + amount
        );
    }


    zoomOut(amount = 0.15) {

        this.setZoom(
            this.zoom - amount
        );
    }


    move(dx, dy) {

        this.x += dx / this.zoom;

        this.y += dy / this.zoom;
    }


    worldToScreen(
        x,
        y,
        canvas
    ) {

        return {

            x:
                (x - this.x) *
                this.zoom +
                canvas.width / 2,

            y:
                (y - this.y) *
                this.zoom +
                canvas.height / 2
        };
    }


    screenToWorld(
        x,
        y,
        canvas
    ) {

        return {

            x:
                (x - canvas.width / 2) /
                this.zoom +
                this.x,

            y:
                (y - canvas.height / 2) /
                this.zoom +
                this.y
        };
    }
}


export function enableCameraZoom(
    canvas,
    camera,
    onZoom
) {

    canvas.addEventListener(
        "wheel",
        event => {

            event.preventDefault();


            const mouseX =
                event.offsetX;

            const mouseY =
                event.offsetY;


            const before =
                camera.screenToWorld(
                    mouseX,
                    mouseY,
                    canvas
                );


            if (event.deltaY < 0) {

                camera.zoomIn();
            }

            else {

                camera.zoomOut();
            }


            const after =
                camera.screenToWorld(
                    mouseX,
                    mouseY,
                    canvas
                );


            camera.x +=
                before.x - after.x;

            camera.y +=
                before.y - after.y;


            if (onZoom) {
                onZoom(camera.zoom);
            }

        },
        {
            passive: false
        }
    );
}
