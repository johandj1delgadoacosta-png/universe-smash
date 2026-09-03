export function showMainMenu(options = {}) {

    const menu =
        document.getElementById(
            "main-menu"
        );

    if (!menu) {
        return;
    }


    menu.style.display = "flex";


    menu.innerHTML = `

        <div class="menu-container">

            <div class="menu-title">
                UNIVERSE SMASH
            </div>

            <div class="menu-buttons">

                <button
                    class="menu-button"
                    id="planet-mode-button"
                >
                    PLANET MODE
                </button>

                <button
                    class="menu-button"
                    id="solar-mode-button"
                >
                    SOLAR SYSTEM MODE
                </button>

                <button
                    class="menu-button"
                    id="settings-button"
                >
                    SETTINGS
                </button>

            </div>

        </div>
    `;


    document
        .getElementById("planet-mode-button")
        .onclick = () => {

            if (options.onPlanetMode) {

                options.onPlanetMode();
            }
        };


    document
        .getElementById("solar-mode-button")
        .onclick = () => {

            if (options.onSolarSystem) {

                options.onSolarSystem();
            }
        };


    document
        .getElementById("settings-button")
        .onclick = () => {

            alert(
                "SETTINGS\n\n" +
                "Graphics: High\n" +
                "Physics: Enabled\n" +
                "Particles: Enabled\n\n" +
                "More settings coming soon."
            );
        };
}
