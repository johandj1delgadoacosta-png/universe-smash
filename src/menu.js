// =========================================
// UNIVERSE SMASH
// MAIN MENU SYSTEM
// =========================================


// -----------------------------------------
// SHOW MAIN MENU
// -----------------------------------------

export function showMainMenu(onSelectMode) {

  const menu =
    document.getElementById("main-menu");


  if (!menu) {

    console.warn(
      "Main menu element not found."
    );

    return;

  }


  menu.style.display = "flex";


  menu.innerHTML = `

    <div class="menu-content">

      <h1 class="menu-title">
        🌌 UNIVERSE SMASH
      </h1>


      <p class="menu-subtitle">
        Choose Your Simulation
      </p>


      <div class="mode-buttons">

        <button
          id="planet-mode-button"
          class="mode-button"
        >

          <span class="mode-icon">
            🌍
          </span>

          <span class="mode-name">
            PLANET MODE
          </span>

          <span class="mode-description">
            Destroy and experiment with a single planet
          </span>

        </button>


        <button
          id="solar-system-button"
          class="mode-button"
        >

          <span class="mode-icon">
            ☀️
          </span>

          <span class="mode-name">
            SOLAR SYSTEM MODE
          </span>

          <span class="mode-description">
            Create and simulate an entire star system
          </span>

        </button>

      </div>


      <button
        id="settings-button"
        class="settings-button"
      >
        ⚙️ SETTINGS
      </button>

    </div>

  `;


  // ---------------------------------------
  // PLANET MODE
  // ---------------------------------------

  document
    .getElementById("planet-mode-button")
    .addEventListener(
      "click",

      () => {

        selectMode(
          "planet",
          menu,
          onSelectMode
        );

      }

    );


  // ---------------------------------------
  // SOLAR SYSTEM MODE
  // ---------------------------------------

  document
    .getElementById("solar-system-button")
    .addEventListener(
      "click",

      () => {

        selectMode(
          "solar-system",
          menu,
          onSelectMode
        );

      }

    );


  // ---------------------------------------
  // SETTINGS
  // ---------------------------------------

  document
    .getElementById("settings-button")
    .addEventListener(
      "click",

      () => {

        showSettings();

      }

    );

}


// -----------------------------------------
// SELECT MODE
// -----------------------------------------

function selectMode(
  mode,
  menu,
  callback
) {

  menu.style.opacity = "0";


  setTimeout(
    () => {

      menu.style.display =
        "none";


      if (callback) {

        callback(mode);

      }

    },
    300
  );

}


// -----------------------------------------
// HIDE MENU
// -----------------------------------------

export function hideMainMenu() {

  const menu =
    document.getElementById("main-menu");


  if (!menu) return;


  menu.style.display =
    "none";

}


// -----------------------------------------
// SETTINGS MENU
// -----------------------------------------

export function showSettings() {

  const menu =
    document.getElementById("main-menu");


  if (!menu) return;


  const settings =
    document.createElement("div");


  settings.className =
    "settings-panel";


  settings.innerHTML = `

    <h2>
      ⚙️ SETTINGS
    </h2>


    <label>

      Music Volume

      <input
        id="music-volume"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value="0.35"
      >

    </label>


    <label>

      Sound Volume

      <input
        id="sound-volume"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value="0.7"
      >

    </label>


    <button
      id="close-settings"
    >
      CLOSE
    </button>

  `;


  menu.appendChild(
    settings
  );


  document
    .getElementById("close-settings")
    .addEventListener(
      "click",

      () => {

        settings.remove();

      }

    );

}
