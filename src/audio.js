// Universe Smash - Audio System
// Audio starts only after a real user interaction.

let audioContext = null;
let masterGain = null;

let audioEnabled = true;
let masterVolume = 0.45;
let initialized = false;
let userGestureReceived = false;

// --------------------------------------------------
// CREATE AUDIO CONTEXT
// --------------------------------------------------

function createAudioContext() {
    if (audioContext) {
        return audioContext;
    }

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        console.warn("Web Audio API is not supported.");
        audioEnabled = false;
        return null;
    }

    try {
        audioContext = new AudioContextClass();

        masterGain = audioContext.createGain();
        masterGain.gain.value = masterVolume;
        masterGain.connect(audioContext.destination);

        initialized = true;

        return audioContext;
    } catch (error) {
        console.warn("Could not create AudioContext:", error);
        return null;
    }
}

// --------------------------------------------------
// INITIALIZE
// --------------------------------------------------

function initAudio() {
    // IMPORTANT:
    // Do not resume audio here.
    // Chrome requires a user gesture first.

    if (!audioContext) {
        createAudioContext();
    }

    return audioContext;
}

// --------------------------------------------------
// USER GESTURE
// --------------------------------------------------

async function activateAudio() {
    userGestureReceived = true;

    if (!audioEnabled) {
        return false;
    }

    if (!audioContext) {
        createAudioContext();
    }

    if (!audioContext) {
        return false;
    }

    try {
        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        return audioContext.state === "running";
    } catch (error) {
        console.warn("Audio activation failed:", error);
        return false;
    }
}

// --------------------------------------------------
// RESUME AUDIO
// --------------------------------------------------

async function resumeAudio() {
    // NEVER attempt to resume before a user gesture.
    if (!userGestureReceived) {
        return false;
    }

    return activateAudio();
}

// --------------------------------------------------
// USER INTERACTION LISTENERS
// --------------------------------------------------

function setupUserGestureAudio() {
    const handlePointer = () => {
        activateAudio();
    };

    const handleKeyboard = () => {
        activateAudio();
    };

    window.addEventListener(
        "pointerdown",
        handlePointer,
        { passive: true }
    );

    window.addEventListener(
        "keydown",
        handleKeyboard,
        { passive: true }
    );

    // Custom event used by Universe Smash startup.
    window.addEventListener(
        "universe-smash-user-gesture",
        handlePointer,
        { passive: true }
    );
}

// --------------------------------------------------
// ENABLE / DISABLE
// --------------------------------------------------

function enableAudio() {
    audioEnabled = true;

    if (userGestureReceived) {
        activateAudio();
    }
}

function disableAudio() {
    audioEnabled = false;
}

function isAudioEnabled() {
    return audioEnabled;
}

// --------------------------------------------------
// VOLUME
// --------------------------------------------------

function setMasterVolume(value) {
    masterVolume = Math.max(
        0,
        Math.min(1, Number(value) || 0)
    );

    if (masterGain && audioContext) {
        masterGain.gain.setTargetAtTime(
            masterVolume,
            audioContext.currentTime,
            0.01
        );
    }
}

function getMasterVolume() {
    return masterVolume;
}

// --------------------------------------------------
// CHECK IF SOUND CAN PLAY
// --------------------------------------------------

function canPlaySound() {
    if (!audioEnabled) {
        return false;
    }

    if (!userGestureReceived) {
        return false;
    }

    if (!audioContext || !masterGain) {
        return false;
    }

    if (audioContext.state !== "running") {
        return false;
    }

    return true;
}

// --------------------------------------------------
// TONE
// --------------------------------------------------

function playTone(
    frequency,
    duration = 0.15,
    type = "sine",
    volume = 0.15,
    endFrequency = null
) {
    if (!canPlaySound()) {
        return;
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );

    if (endFrequency !== null) {
        oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(20, endFrequency),
            audioContext.currentTime + duration
        );
    }

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, volume),
        audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration + 0.03
    );
}

// --------------------------------------------------
// NOISE
// --------------------------------------------------

function playNoise(
    duration = 0.2,
    volume = 0.12,
    filterFrequency = 1200
) {
    if (!canPlaySound()) {
        return;
    }

    const bufferSize = Math.floor(
        audioContext.sampleRate * duration
    );

    const buffer = audioContext.createBuffer(
        1,
        bufferSize,
        audioContext.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();

    source.buffer = buffer;

    filter.type = "lowpass";
    filter.frequency.value = filterFrequency;

    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    source.start();

    source.stop(
        audioContext.currentTime + duration + 0.03
    );
}

// --------------------------------------------------
// MENU
// --------------------------------------------------

function playClickSound() {
    playTone(520, 0.07, "square", 0.08, 620);
}

function playMenuSelect() {
    playTone(700, 0.09, "sine", 0.1, 900);
}

function playSelectSound() {
    playTone(780, 0.1, "triangle", 0.1, 980);
}

// --------------------------------------------------
// PLANET MODE WEAPONS
// --------------------------------------------------

function playLaserSound() {
    playTone(900, 0.18, "sawtooth", 0.11, 180);
}

function playIceLaserSound() {
    playTone(1300, 0.25, "sine", 0.1, 500);
    playTone(1750, 0.12, "triangle", 0.05, 800);
}

function playAsteroidImpact() {
    playNoise(0.22, 0.14, 900);
    playTone(90, 0.22, "square", 0.12, 45);
}

function playExplosionSound() {
    playNoise(0.45, 0.18, 700);
    playTone(75, 0.35, "sawtooth", 0.12, 30);
}

function playAntimatterSound() {
    playTone(1100, 0.35, "sine", 0.12, 70);
    playTone(180, 0.5, "triangle", 0.1, 35);
}

// Compatibility with older planet-mode.js
function playAntimatter(...args) {
    return playAntimatterSound(...args);
}

function playAlienSound() {
    playTone(420, 0.12, "square", 0.08, 820);
    playTone(820, 0.16, "square", 0.08, 300);
}

function playMysterySound() {
    const frequencies = [
        260,
        330,
        410,
        520,
        660,
        830
    ];

    const frequency =
        frequencies[
            Math.floor(Math.random() * frequencies.length)
        ];

    playTone(
        frequency,
        0.3,
        "triangle",
        0.12,
        frequency * 1.8
    );
}

// --------------------------------------------------
// COSMIC OBJECTS
// --------------------------------------------------

function playBlackHoleSound() {
    playTone(55, 0.6, "sine", 0.16, 25);
    playNoise(0.4, 0.07, 250);
}

function playWormholeSound() {
    playTone(300, 0.35, "sine", 0.1, 1000);
    playTone(1000, 0.3, "triangle", 0.08, 300);
}

function playGreyHoleSound() {
    playTone(90, 0.5, "sine", 0.08, 45);
    playTone(180, 0.25, "triangle", 0.05, 100);
}

function playSpawnSound() {
    playTone(350, 0.08, "sine", 0.07, 550);
}

function playPauseSound() {
    playTone(440, 0.1, "square", 0.07, 300);
}

// --------------------------------------------------
// CLEANUP
// --------------------------------------------------

function stopAllSounds() {
    // Synthesized sounds automatically stop.
}

function loadDefaultSounds() {
    return true;
}

// --------------------------------------------------
// STATE
// --------------------------------------------------

function getAudioState() {
    return {
        enabled: audioEnabled,
        initialized,
        userGestureReceived,
        volume: masterVolume,
        contextState: audioContext
            ? audioContext.state
            : "not-created"
    };
}

// --------------------------------------------------
// DESTROY
// --------------------------------------------------

async function destroyAudio() {
    if (audioContext) {
        try {
            await audioContext.close();
        } catch (error) {
            console.warn(
                "Error closing AudioContext:",
                error
            );
        }
    }

    audioContext = null;
    masterGain = null;
    initialized = false;
    userGestureReceived = false;
}

// --------------------------------------------------
// GLOBAL API
// --------------------------------------------------

window.UniverseSmashAudio = {
    initAudio,
    enableAudio,
    disableAudio,
    isAudioEnabled,
    setMasterVolume,
    getMasterVolume,
    resumeAudio,
    activateAudio,

    playClickSound,
    playMenuSelect,
    playLaserSound,
    playIceLaserSound,
    playAsteroidImpact,
    playExplosionSound,
    playAntimatterSound,
    playAntimatter,
    playAlienSound,
    playMysterySound,

    playBlackHoleSound,
    playWormholeSound,
    playGreyHoleSound,
    playSpawnSound,
    playSelectSound,
    playPauseSound,

    stopAllSounds,
    loadDefaultSounds,
    destroyAudio,
    getAudioState
};

// --------------------------------------------------
// SETUP
// --------------------------------------------------

setupUserGestureAudio();

// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

export {
    initAudio,
    enableAudio,
    disableAudio,
    isAudioEnabled,
    setMasterVolume,
    getMasterVolume,
    resumeAudio,
    activateAudio,

    playClickSound,
    playMenuSelect,
    playLaserSound,
    playIceLaserSound,
    playAsteroidImpact,
    playExplosionSound,
    playAntimatterSound,
    playAntimatter,
    playAlienSound,
    playMysterySound,

    playBlackHoleSound,
    playWormholeSound,
    playGreyHoleSound,
    playSpawnSound,
    playSelectSound,
    playPauseSound,

    stopAllSounds,
    loadDefaultSounds,
    destroyAudio,
    getAudioState
};
