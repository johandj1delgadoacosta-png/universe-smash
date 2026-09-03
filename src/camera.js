// Universe Smash
// Camera System

export class Camera {
    constructor(
        x = 0,
        y = 0,
        zoom = 1
    ) {
        this.x = x;
        this.y = y;
        this.zoom = zoom;

        this.minZoom = 0.05;
        this.maxZoom = 20;

        this.target = null;
        this.followStrength = 0.12;
    }

    reset(
        x = 0,
        y = 0,
        zoom = 1
    ) {
        this.x = x;
        this.y = y;
        this.zoom = this.clampZoom(zoom);
        this.target = null;

        return this;
    }

    clampZoom(zoom) {
        return Math.max(
            this.minZoom,
            Math.min(
                this.maxZoom,
                Number(zoom) || 1
            )
        );
    }

    setZoom(zoom) {
        this.zoom = this.clampZoom(zoom);
        return this.zoom;
    }

    zoomIn(amount = 1.15) {
        this.zoom = this.clampZoom(
            this.zoom * amount
        );

        return this.zoom;
    }

    zoomOut(amount = 1.15) {
        this.zoom = this.clampZoom(
            this.zoom / amount
        );

        return this.zoom;
    }

    move(dx = 0, dy = 0) {
        this.x += Number(dx) || 0;
        this.y += Number(dy) || 0;

        return this;
    }

    setPosition(x = 0, y = 0) {
        this.x = Number(x) || 0;
        this.y = Number(y) || 0;

        return this;
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        };
    }

    getZoom() {
        return this.zoom;
    }

    worldToScreen(
        worldX,
        worldY,
        canvasWidth,
        canvasHeight
    ) {
        return {
            x:
                (worldX - this.x) *
                    this.zoom +
                canvasWidth / 2,

            y:
                (worldY - this.y) *
                    this.zoom +
                canvasHeight / 2
        };
    }

    screenToWorld(
        screenX,
        screenY,
        canvasWidth,
        canvasHeight
    ) {
        return {
            x:
                (screenX - canvasWidth / 2) /
                    this.zoom +
                this.x,

            y:
                (screenY - canvasHeight / 2) /
                    this.zoom +
                this.y
        };
    }

    screenRadius(worldRadius) {
        return Math.max(
            0.1,
            worldRadius * this.zoom
        );
    }

    worldDistance(screenDistance) {
        return screenDistance / this.zoom;
    }

    screenDistance(worldDistance) {
        return worldDistance * this.zoom;
    }

    follow(
        target,
        strength = this.followStrength
    ) {
        if (!target) {
            this.target = null;
            return this;
        }

        this.target = target;

        const amount =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(strength) || 0
                )
            );

        this.x +=
            (target.x - this.x) *
            amount;

        this.y +=
            (target.y - this.y) *
            amount;

        return this;
    }

    stopFollowing() {
        this.target = null;
        return this;
    }

    update() {
        if (!this.target) {
            return;
        }

        this.follow(
            this.target,
            this.followStrength
        );
    }

    begin(ctx) {
        if (!ctx) {
            return;
        }

        ctx.save();

        ctx.translate(
            ctx.canvas.width / 2,
            ctx.canvas.height / 2
        );

        ctx.scale(
            this.zoom,
            this.zoom
        );

        ctx.translate(
            -this.x,
            -this.y
        );
    }

    end(ctx) {
        if (!ctx) {
            return;
        }

        ctx.restore();
    }

    apply(ctx) {
        this.begin(ctx);
    }

    unapply(ctx) {
        this.end(ctx);
    }

    isPointVisible(
        worldX,
        worldY,
        canvasWidth,
        canvasHeight,
        padding = 0
    ) {
        const screen =
            this.worldToScreen(
                worldX,
                worldY,
                canvasWidth,
                canvasHeight
            );

        return (
            screen.x >= -padding &&
            screen.x <=
                canvasWidth + padding &&
            screen.y >= -padding &&
            screen.y <=
                canvasHeight + padding
        );
    }

    isCircleVisible(
        worldX,
        worldY,
        radius,
        canvasWidth,
        canvasHeight
    ) {
        const screen =
            this.worldToScreen(
                worldX,
                worldY,
                canvasWidth,
                canvasHeight
            );

        const screenRadius =
            this.screenRadius(radius);

        return (
            screen.x + screenRadius >= 0 &&
            screen.x - screenRadius <=
                canvasWidth &&
            screen.y + screenRadius >= 0 &&
            screen.y - screenRadius <=
                canvasHeight
        );
    }

    focusOn(
        target,
        canvasWidth,
        canvasHeight
    ) {
        if (!target) {
            return this;
        }

        this.x =
            Number(target.x) || 0;

        this.y =
            Number(target.y) || 0;

        return this;
    }

    focusOnAll(
        objects = [],
        canvasWidth = 800,
        canvasHeight = 600,
        padding = 100
    ) {
        if (!objects.length) {
            return this;
        }

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        for (const object of objects) {
            if (
                !object ||
                !Number.isFinite(object.x) ||
                !Number.isFinite(object.y)
            ) {
                continue;
            }

            const radius =
                Number(object.radius) || 0;

            minX =
                Math.min(
                    minX,
                    object.x - radius
                );

            maxX =
                Math.max(
                    maxX,
                    object.x + radius
                );

            minY =
                Math.min(
                    minY,
                    object.y - radius
                );

            maxY =
                Math.max(
                    maxY,
                    object.y + radius
                );
        }

        if (
            !Number.isFinite(minX) ||
            !Number.isFinite(maxX) ||
            !Number.isFinite(minY) ||
            !Number.isFinite(maxY)
        ) {
            return this;
        }

        this.x =
            (minX + maxX) / 2;

        this.y =
            (minY + maxY) / 2;

        const width =
            Math.max(
                1,
                maxX - minX
            );

        const height =
            Math.max(
                1,
                maxY - minY
            );

        const availableWidth =
            Math.max(
                1,
                canvasWidth - padding * 2
            );

        const availableHeight =
            Math.max(
                1,
                canvasHeight - padding * 2
            );

        const zoomX =
            availableWidth / width;

        const zoomY =
            availableHeight / height;

        this.zoom =
            this.clampZoom(
                Math.min(
                    zoomX,
                    zoomY
                )
            );

        return this;
    }

    handleWheel(
        deltaY,
        mouseX,
        mouseY,
        canvasWidth,
        canvasHeight
    ) {
        const before =
            this.screenToWorld(
                mouseX,
                mouseY,
                canvasWidth,
                canvasHeight
            );

        const zoomFactor =
            deltaY < 0
                ? 1.12
                : 1 / 1.12;

        this.zoom =
            this.clampZoom(
                this.zoom * zoomFactor
            );

        const after =
            this.screenToWorld(
                mouseX,
                mouseY,
                canvasWidth,
                canvasHeight
            );

        this.x +=
            before.x - after.x;

        this.y +=
            before.y - after.y;

        return this.zoom;
    }
}

export function enableCameraZoom(
    canvas,
    camera = null
) {
    if (!canvas) {
        return null;
    }

    const activeCamera =
        camera ||
        new Camera();

    if (
        canvas.dataset
            .cameraZoomBound ===
        "true"
    ) {
        return activeCamera;
    }

    canvas.dataset
        .cameraZoomBound =
        "true";

    canvas.addEventListener(
        "wheel",
        event => {
            event.preventDefault();

            const rect =
                canvas.getBoundingClientRect();

            const mouseX =
                event.clientX -
                rect.left;

            const mouseY =
                event.clientY -
                rect.top;

            activeCamera.handleWheel(
                event.deltaY,
                mouseX,
                mouseY,
                canvas.width,
                canvas.height
            );
        },
        {
            passive: false
        }
    );

    return activeCamera;
}

export function enableCameraPan(
    canvas,
    camera = null
) {
    if (!canvas) {
        return null;
    }

    const activeCamera =
        camera ||
        new Camera();

    if (
        canvas.dataset
            .cameraPanBound ===
        "true"
    ) {
        return activeCamera;
    }

    canvas.dataset
        .cameraPanBound =
        "true";

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener(
        "pointerdown",
        event => {
            if (
                event.button !== 1 &&
                event.button !== 2
            ) {
                return;
            }

            dragging = true;

            lastX = event.clientX;
            lastY = event.clientY;

            canvas.setPointerCapture(
                event.pointerId
            );
        }
    );

    canvas.addEventListener(
        "pointermove",
        event => {
            if (!dragging) {
                return;
            }

            const dx =
                event.clientX - lastX;

            const dy =
                event.clientY - lastY;

            activeCamera.move(
                -dx / activeCamera.zoom,
                -dy / activeCamera.zoom
            );

            lastX = event.clientX;
            lastY = event.clientY;
        }
    );

    canvas.addEventListener(
        "pointerup",
        event => {
            dragging = false;

            try {
                canvas.releasePointerCapture(
                    event.pointerId
                );
            } catch (error) {
                // Pointer capture may already be released.
            }
        }
    );

    canvas.addEventListener(
        "contextmenu",
        event => {
            event.preventDefault();
        }
    );

    return activeCamera;
}

export function createCamera(
    x = 0,
    y = 0,
    zoom = 1
) {
    return new Camera(
        x,
        y,
        zoom
    );
}

export default Camera;
