// =========================================
// UNIVERSE SMASH
// STARTUP SYSTEM
// =========================================

let started = false;


// -----------------------------------------
// STARTUP CONFIGURATION
// -----------------------------------------

const STARTUP = {

  splashDuration: 1800,

  warningDuration: 2500,

  loadingDuration: 2000

};


// -----------------------------------------
// WAIT
// -----------------------------------------

function wait(milliseconds) {

  return new Promise(
    resolve => {

      setTimeout(
        resolve,
        milliseconds
      );

    }
  );

}


// -----------------------------------------
// GET STARTUP ELEMENT
// -----------------------------------------

function getStartupScreen() {

  return document.getElementById(
    "startup-screen"
  );

}


// -----------------------------------------
// SHOW MESSAGE
// -----------------------------------------

function showMessage(
  title,
  subtitle = ""
) {

  const screen =
    getStartupScreen();

  if (!screen) {

    console.warn(
      "Startup screen not found."
    );

    return;

  }


  screen.innerHTML = `

    <div class="startup-content">

      <h1>
        ${title}
      </h1>

      <p>
        ${subtitle}
      </p>

    </div>

  `;

}


// -----------------------------------------
// UNIVERSE SMASH SPLASH
// -----------------------------------------

async function showSplash() {

  showMessage(

    "🌌 UNIVERSE SMASH",

    "A Cosmic Sandbox Experience"

  );


  await wait(
    STARTUP.splashDuration
  );

}


// -----------------------------------------
// WARNING SCREEN
// -----------------------------------------

async function showWarning() {

  showMessage(

    "⚠️ WARNING",

    "This game contains flashing visual effects and intense cosmic destruction."

  );


  await wait(
    STARTUP.warningDuration
  );

}


// -----------------------------------------
// LOADING SCREEN
// -----------------------------------------

async function showLoading() {

  const screen =
    getStartupScreen();

  if (!screen) return;


  screen.innerHTML = `

    <div class="startup-content">

      <h1>
        🌌 Loading Universe
      </h1>

      <div class="loading-bar">

        <div
          id="loading-progress"
        ></div>

      </div>

      <p id="loading-text">
        Preparing celestial objects...
      </p>

    </div>

  `;


  const progress =
    document.getElementById(
      "loading-progress"
    );


  const loadingText =
    document.getElementById(
      "loading-text"
    );


  const messages = [

    "Preparing celestial objects...",

    "Generating planets...",

    "Initializing physics...",

    "Loading cosmic effects...",

    "Preparing weapons...",

    "Almost ready..."

  ];


  for (
    let i = 0;
    i <= 100;
    i += 5
  ) {

    if (progress) {

      progress.style.width =
        `${i}%`;

    }


    const messageIndex =
      Math.min(
        Math.floor(
          i / 20
        ),
        messages.length - 1
      );


    if (loadingText) {

      loadingText.textContent =
        messages[messageIndex];

    }


    await wait(100);

  }

}


// -----------------------------------------
// PRESS START SCREEN
// -----------------------------------------

function showPressStart(
  onStart
) {

  const screen =
    getStartupScreen();

  if (!screen) {

    if (onStart) onStart();

    return;

  }


  screen.innerHTML = `

    <div class="startup-content">

      <h1 class="game-title">

        🌌 UNIVERSE SMASH

      </h1>


      <p>
        Create. Experiment. Destroy.
      </p>


      <button
        id="start-button"
      >

        PRESS START

      </button>


      <p class="startup-small">

        Click to begin

      </p>

    </div>

  `;


  const startButton =
    document.getElementById(
      "start-button"
    );


  startButton.addEventListener(
    "click",

    () => {

      if (started) return;

      started = true;


      screen.style.opacity = "0";


      setTimeout(
        () => {

          screen.style.display =
            "none";


          if (onStart) {

            onStart();

          }

        },
        700
      );

    }

  );

}


// -----------------------------------------
// RUN STARTUP SEQUENCE
// -----------------------------------------

export async function runStartup(
  onStart
) {

  const screen =
    getStartupScreen();

  if (!screen) {

    console.warn(
      "No startup screen found."
    );

    if (onStart) onStart();

    return;

  }


  screen.style.display =
    "flex";

  screen.style.opacity =
    "1";


  await showSplash();

  await showWarning();

  await showLoading();


  showPressStart(
    onStart
  );

}


// -----------------------------------------
// SKIP STARTUP
// -----------------------------------------

export function skipStartup(
  onStart
) {

  const screen =
    getStartupScreen();


  if (screen) {

    screen.style.display =
      "none";

  }


  started = true;


  if (onStart) {

    onStart();

  }

}
