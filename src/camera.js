// =========================================
// UNIVERSE SMASH
// CAMERA CONTROLLER
// =========================================

let camera = null;
let controls = null;


// =========================================
// SET CAMERA
// =========================================

export function setupCamera(
  threeCamera,
  orbitControls = null
) {

  camera = threeCamera;
  controls = orbitControls;

  console.log("📷 Camera system ready.");

}


// =========================================
// ZOOM IN
// =========================================

export function zoomIn(amount = 0.85) {

  if (!camera) return;

  camera.position.multiplyScalar(amount);

  if (controls) {
    controls.update();
  }

}


// =========================================
// ZOOM OUT
// =========================================

export function zoomOut(amount = 1.18) {

  if (!camera) return;

  camera.position.multiplyScalar(amount);

  if (controls) {
    controls.update();
  }

}


// =========================================
// FOCUS ON AN OBJECT
// =========================================

export function focusObject(object) {

  if (!camera || !object) return;

  const target =
    object.mesh || object;

  if (!target.position) return;

  const radius =
    object.radius || 1;

  // Position the camera near the object

  camera.position.set(
    target.position.x + radius * 5,
    target.position.y + radius * 3,
    target.position.z + radius * 5
  );


  // Point camera toward object

  camera.lookAt(
    target.position.x,
    target.position.y,
    target.position.z
  );


  // Update OrbitControls target if available

  if (controls) {

    controls.target.copy(
      target.position
    );

    controls.update();

  }

}


// =========================================
// SYSTEM VIEW
// =========================================

export function systemView() {

  if (!camera) return;

  // Large overview position

  camera.position.set(
    0,
    45,
    70
  );

  camera.lookAt(
    0,
    0,
    0
  );


  if (controls) {

    controls.target.set(
      0,
      0,
      0
    );

    controls.update();

  }

}


// =========================================
// CAMERA BUTTONS
// =========================================

export function setupCameraButtons() {

  const zoomInButton =
    document.getElementById("zoomInButton");

  const zoomOutButton =
    document.getElementById("zoomOutButton");

  const systemViewButton =
    document.getElementById("systemViewButton");


  if (zoomInButton) {

    zoomInButton.addEventListener(
      "click",
      () => {

        zoomIn();

      }
    );

  }


  if (zoomOutButton) {

    zoomOutButton.addEventListener(
      "click",
      () => {

        zoomOut();

      }
    );

  }


  if (systemViewButton) {

    systemViewButton.addEventListener(
      "click",
      () => {

        systemView();

      }
    );

  }

}


// =========================================
// RESIZE CAMERA
// =========================================

export function resizeCamera(
  width,
  height
) {

  if (!camera) return;

  camera.aspect =
    width / height;

  camera.updateProjectionMatrix();

}


// =========================================
// UPDATE CAMERA
// =========================================

export function updateCamera() {

  if (controls) {
    controls.update();
  }

}
