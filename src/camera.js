// =========================================
// UNIVERSE SMASH
// CAMERA SYSTEM
// =========================================

export const Camera = {

  x: 0,
  y: 0,

  zoom: 1,

  minZoom: 0.1,
  maxZoom: 5,


  // -----------------------------------------
  // RESET CAMERA
  // -----------------------------------------

  reset() {

    this.x = 0;
    this.y = 0;
    this.zoom = 1;

  },


  // -----------------------------------------
  // SET ZOOM
  // -----------------------------------------

  setZoom(value) {

    this.zoom = Math.max(
      this.minZoom,
      Math.min(
        this.maxZoom,
        value
      )
    );

  },


  // -----------------------------------------
  // ZOOM IN
  // -----------------------------------------

  zoomIn(amount = 0.1) {

    this.setZoom(
      this.zoom + amount
    );

  },


  // -----------------------------------------
  // ZOOM OUT
  // -----------------------------------------

  zoomOut(amount = 0.1) {

    this.setZoom(
      this.zoom - amount
    );

  },


  // -----------------------------------------
  // MOVE CAMERA
  // -----------------------------------------

  move(dx, dy) {

    this.x += dx;
    this.y += dy;

  },


  // -----------------------------------------
  // CONVERT WORLD → SCREEN
  // -----------------------------------------

  worldToScreen(
    worldX,
    worldY,
    canvas
  ) {

    return {

      x:
        (worldX - this.x) *
        this.zoom +
        canvas.width / 2,

      y:
        (worldY - this.y) *
        this.zoom +
        canvas.height / 2

    };

  },


  // -----------------------------------------
  // CONVERT SCREEN → WORLD
  // -----------------------------------------

  screenToWorld(
    screenX,
    screenY,
    canvas
  ) {

    return {

      x:
        (
          screenX -
          canvas.width / 2
        ) /
        this.zoom +
        this.x,

      y:
        (
          screenY -
          canvas.height / 2
        ) /
        this.zoom +
        this.y

    };

  },


  // -----------------------------------------
  // FOLLOW OBJECT
  // -----------------------------------------

  follow(object, amount = 0.08) {

    if (!object) return;


    this.x +=
      (
        object.position.x -
        this.x
      ) *
      amount;


    this.y +=
      (
        object.position.y -
        this.y
      ) *
      amount;

  }

};


// =========================================
// MOUSE WHEEL ZOOM
// =========================================

export function enableCameraZoom(
  canvas
) {

  canvas.addEventListener(
    "wheel",
    event => {

      event.preventDefault();


      const zoomAmount =
        event.deltaY > 0
          ? -0.1
          : 0.1;


      Camera.setZoom(
        Camera.zoom +
        zoomAmount
      );

    },
    {
      passive: false
    }
  );

}


// =========================================
// EXPORT
// =========================================

export default Camera;
