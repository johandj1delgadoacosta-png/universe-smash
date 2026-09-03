export function runStartup() {

    return new Promise(resolve => {

        const screen =
            document.getElementById(
                "startup-screen"
            );

        if (!screen) {

            resolve();

            return;
        }


        screen.innerHTML = `

            <div class="startup-container">

                <div class="startup-title">
                    UNIVERSE SMASH
                </div>

                <div class="startup-subtitle">
                    COSMIC SIMULATION ENGINE
                </div>

                <div class="loading-container">

                    <div class="loading-bar">

                        <div
                            class="loading-progress"
                            id="loading-progress"
                        ></div>

                    </div>

                </div>

                <div
                    class="press-start"
                    id="press-start"
                    style="display:none;"
                >
                    PRESS START
                </div>

            </div>
        `;


        const progress =
            document.getElementById(
                "loading-progress"
            );

        const start =
            document.getElementById(
                "press-start"
            );


        let amount = 0;


        const interval =
            setInterval(() => {

                amount += 5;

                progress.style.width =
                    `${amount}%`;


                if (amount >= 100) {

                    clearInterval(interval);

                    start.style.display =
                        "block";


                    const begin = () => {

                        screen.remove();

                        window.removeEventListener(
                            "keydown",
                            begin
                        );

                        window.removeEventListener(
                            "pointerdown",
                            begin
                        );

                        resolve();
                    };


                    window.addEventListener(
                        "keydown",
                        begin
                    );

                    window.addEventListener(
                        "pointerdown",
                        begin
                    );
                }

            }, 40);
    });
}
