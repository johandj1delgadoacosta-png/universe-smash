// Universe Smash
// Camera system

export class Camera {
    constructor(canvas = null) {
        this.canvas = canvas;

        this.x = 0;
        this.y = 0;

        this.zoom = 1;

        this.minZoom = 0.05;
        this.maxZoom = 20;

        this.panSpeed = 1;

        this.dragging = false;
        this.lastMouseX = 0;
        this.lastMouseY = 0;

        this.enabled = false;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    }

    setZoom(value) {
        value = Number(value);

        if (!Number.isFinite(value)) {
            return;
        }

        this.zoom = Math.max(
            this.minZoom,
            Math.min(this.maxZoom, value)
        );
    }

    zoomIn(amount = 1.15) {
        this.setZoom(this.zoom * amount);
    }

    zoomOut(amount = 1.15) {
        this.setZoom(this.zoom / amount);
    }

    move(dx, dy) {
        dx = Number(dx);
        dy = Number(dy);

        if (!Number.isFinite(dx)) dx = 0;
        if (!Number.isFinite(dy)) dy = 0;

        this.x += dx;
        this.y += dy;
    }

    focus(x, y) {
        if (!Number.isFinite(x)) x = 0;
        if (!Number.isFinite(y)) y = 0;

        this.x = x;
        this.y = y;
    }

    worldToScreen(x, y) {
        const canvas = this.canvas;

        if (!canvas) {
            return {
                x: Number.isFinite(x) ? x : 0,
                y: Number.isFinite(y) ? y : 0
            };
        }

        const safeX = Number.isFinite(x) ? x : 0;
        const safeY = Number.isFinite(y) ? y : 0;

        return {
            x: (safeX - this.x) * this.zoom + canvas.width / 2,
            y: (safeY - this.y) * this.zoom + canvas.height / 2
        };
    }

    screenToWorld(x, y) {
        const canvas = this.canvas;

        if (!canvas) {
            return {
                x: Number.isFinite(x) ? x : 0,
                y: Number.isFinite(y) ? y : 0
            };
        }

        const safeX = Number.isFinite(x) ? x : 0;
        const safeY = Number.isFinite(y) ? y : 0;

        return {
            x: (safeX - canvas.width / 2) / this.zoom + this.x,
            y: (safeY - canvas.height / 2) / this.zoom + this.y
        };
    }

    apply(ctx) {
        if (!ctx || !this.canvas) return;

        ctx.translate(
            this.canvas.width / 2,
            this.canvas.height / 2
        );

        ctx.scale(this.zoom, this.zoom);

        ctx.translate(
            -this.x,
            -this.y
        );
    }

    follow(object) {
        if (!object) return;

        if (
            Number.isFinite(object.x) &&
            Number.isFinite(object.y)
        ) {
            this.x = object.x;
            this.y = object.y;
        }
    }
}

export function enableCameraZoom(canvas, camera) {
    if (!canvas || !camera) return;

    canvas.addEventListener(
        "wheel",
        (event) => {
            event.preventDefault();

            const mouseX = event.offsetX;
            const mouseY = event.offsetY;

            const before = camera.screenToWorld(
                mouseX,
                mouseY
            );

            if (event.deltaY < 0) {
                camera.zoomIn(1.12);
            } else {
                camera.zoomOut(1.12);
            }

            const after = camera.screenToWorld(
                mouseX,
                mouseY
            );

            camera.x += before.x - after.x;
            camera.y += before.y - after.y;
        },
        { passive: false }
    );
}

export function enableCameraPan(canvas, camera) {
    if (!canvas || !camera) return;

    canvas.addEventListener("mousedown", (event) => {
        if (
            event.button !== 1 &&
            event.button !== 2
        ) {
            return;
        }

        event.preventDefault();

        camera.dragging = true;

        camera.lastMouseX = event.clientX;
        camera.lastMouseY = event.clientY;
    });

    window.addEventListener("mousemove", (event) => {
        if (!camera.dragging) return;

        const dx =
            event.clientX -
            camera.lastMouseX;

        const dy =
            event.clientY -
            camera.lastMouseY;

        camera.x -= dx / camera.zoom;
        camera.y -= dy / camera.zoom;

        camera.lastMouseX = event.clientX;
        camera.lastMouseY = event.clientY;
    });

    window.addEventListener("mouseup", () => {
        camera.dragging = false;
    });

    canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
}

export function createCamera(canvas) {
    const camera = new Camera(canvas);

    enableCameraZoom(canvas, camera);
    enableCameraPan(canvas, camera);

    return camera;
}

export default Camera;
