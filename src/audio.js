// Universe Smash
// Audio System

let audioContext = null;
let masterGain = null;
let audioEnabled = true;
let masterVolume = 0.7;

const activeSources = new Set();

function createAudioContext() {
    if (audioContext) {
        return audioContext;
    }

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {
        audioEnabled = false;
        return null;
    }

    audioContext =
        new AudioContextClass();

    masterGain =
        audioContext.createGain();

    masterGain.gain.value =
        masterVolume;

    masterGain.connect(
        audioContext.destination
    );

    return audioContext;
}

export function initAudio() {
    return createAudioContext();
}

export async function resumeAudio() {
    if (!audioContext) {
        createAudioContext();
    }

    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {
        try {
            await audioContext.resume();
        } catch (error) {
            console.warn(
                "Universe Smash audio could not resume:",
                error
            );
        }
    }

    return audioContext;
}

export function enableAudio() {
    audioEnabled = true;

    createAudioContext();

    resumeAudio();

    return true;
}

export function disableAudio() {
    audioEnabled = false;

    stopAllSounds();

    return false;
}

export function isAudioEnabled() {
    return audioEnabled;
}

export function setMasterVolume(volume) {
    masterVolume =
        Math.max(
            0,
            Math.min(
                1,
                Number(volume) || 0
            )
        );

    if (masterGain) {
        masterGain.gain.setTargetAtTime(
            masterVolume,
            audioContext.currentTime,
            0.01
        );
    }

    return masterVolume;
}

export function getMasterVolume() {
    return masterVolume;
}

function canPlay() {
    return (
        audioEnabled &&
        audioContext &&
        masterGain
    );
}

function rememberSource(source) {
    activeSources.add(source);

    source.addEventListener(
        "ended",
        () => {
            activeSources.delete(source);
        },
        {
            once: true
        }
    );

    return source;
}

function playTone({
    frequency = 440,
    duration = 0.15,
    type = "sine",
    volume = 0.2,
    slideTo = null
} = {}) {
    if (!audioEnabled) {
        return null;
    }

    if (!audioContext) {
        createAudioContext();
    }

    if (!audioContext || !masterGain) {
        return null;
    }

    if (audioContext.state === "suspended") {
        resumeAudio();
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    const now =
        audioContext.currentTime;

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        now
    );

    if (slideTo !== null) {
        oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(1, slideTo),
            now + duration
        );
    }

    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, volume),
        now + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(now);
    oscillator.stop(now + duration);

    return rememberSource(
        oscillator
    );
}

function playNoise({
    duration = 0.2,
    volume = 0.12,
    filterFrequency = 1200
} = {}) {
    if (!audioEnabled) {
        return null;
    }

    if (!audioContext) {
        createAudioContext();
    }

    if (!audioContext || !masterGain) {
        return null;
    }

    const bufferSize =
        Math.floor(
            audioContext.sampleRate *
            duration
        );

    const buffer =
        audioContext.createBuffer(
            1,
            bufferSize,
            audioContext.sampleRate
        );

    const data =
        buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        data[i] =
            Math.random() * 2 - 1;
    }

    const source =
        audioContext.createBufferSource();

    const filter =
        audioContext.createBiquadFilter();

    const gain =
        audioContext.createGain();

    const now =
        audioContext.currentTime;

    source.buffer = buffer;

    filter.type =
        "lowpass";

    filter.frequency.setValueAtTime(
        filterFrequency,
        now
    );

    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, volume),
        now + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    source.start(now);
    source.stop(now + duration);

    return rememberSource(
        source
    );
}

export function playClickSound() {
    return playTone({
        frequency: 520,
        duration: 0.07,
        type: "square",
        volume: 0.08,
        slideTo: 620
    });
}

export function playMenuSelect() {
    playTone({
        frequency: 420,
        duration: 0.08,
        type: "sine",
        volume: 0.08,
        slideTo: 650
    });

    setTimeout(() => {
        playTone({
            frequency: 650,
            duration: 0.1,
            type: "sine",
            volume: 0.07
        });
    }, 60);
}

export function playLaserSound() {
    return playTone({
        frequency: 900,
        duration: 0.18,
        type: "sawtooth",
        volume: 0.12,
        slideTo: 180
    });
}

export function playIceLaserSound() {
    return playTone({
        frequency: 1400,
        duration: 0.25,
        type: "triangle",
        volume: 0.1,
        slideTo: 650
    });
}

export function playAsteroidImpact() {
    playNoise({
        duration: 0.28,
        volume: 0.16,
        filterFrequency: 850
    });

    setTimeout(() => {
        playTone({
            frequency: 90,
            duration: 0.22,
            type: "sine",
            volume: 0.13,
            slideTo: 45
        });
    }, 25);
}

export function playExplosionSound() {
    playNoise({
        duration: 0.5,
        volume: 0.2,
        filterFrequency: 700
    });

    setTimeout(() => {
        playTone({
            frequency: 75,
            duration: 0.42,
            type: "sine",
            volume: 0.18,
            slideTo: 28
        });
    }, 20);
}

export function playAntimatterSound() {
    playTone({
        frequency: 1000,
        duration: 0.3,
        type: "sine",
        volume: 0.12,
        slideTo: 1800
    });

    setTimeout(() => {
        playNoise({
            duration: 0.35,
            volume: 0.15,
            filterFrequency: 1800
        });
    }, 180);
}

export function playAlienSound() {
    playTone({
        frequency: 330,
        duration: 0.12,
        type: "square",
        volume: 0.08,
        slideTo: 880
    });

    setTimeout(() => {
        playTone({
            frequency: 880,
            duration: 0.16,
            type: "square",
            volume: 0.08,
            slideTo: 440
        });
    }, 100);
}

export function playMysterySound() {
    const notes = [
        220,
        330,
        440,
        660,
        550
    ];

    notes.forEach(
        (frequency, index) => {
            setTimeout(() => {
                playTone({
                    frequency,
                    duration: 0.12,
                    type: "triangle",
                    volume: 0.07
                });
            }, index * 90);
        }
    );
}

export function playBlackHoleSound() {
    playTone({
        frequency: 100,
        duration: 0.8,
        type: "sine",
        volume: 0.12,
        slideTo: 25
    });
}

export function playWormholeSound() {
    playTone({
        frequency: 180,
        duration: 0.5,
        type: "sawtooth",
        volume: 0.09,
        slideTo: 1100
    });
}

export function playGreyHoleSound() {
    playTone({
        frequency: 65,
        duration: 0.7,
        type: "triangle",
        volume: 0.08,
        slideTo: 42
    });
}

export function playSpawnSound() {
    playTone({
        frequency: 260,
        duration: 0.18,
        type: "sine",
        volume: 0.07,
        slideTo: 520
    });
}

export function playSelectSound() {
    return playClickSound();
}

export function playPauseSound() {
    return playTone({
        frequency: 300,
        duration: 0.12,
        type: "triangle",
        volume: 0.07
    });
}

export function stopAllSounds() {
    for (const source of activeSources) {
        try {
            source.stop();
        } catch (error) {
            // Source may already have stopped.
        }
    }

    activeSources.clear();
}

export function loadDefaultSounds() {
    if (!audioContext) {
        createAudioContext();
    }

    return true;
}

export function destroyAudio() {
    stopAllSounds();

    if (audioContext) {
        try {
            audioContext.close();
        } catch (error) {
            console.warn(
                "Universe Smash audio cleanup failed:",
                error
            );
        }
    }

    audioContext = null;
    masterGain = null;
}

export function getAudioState() {
    return {
        enabled: audioEnabled,
        volume: masterVolume,
        contextState:
            audioContext
                ? audioContext.state
                : "uninitialized",
        activeSources:
            activeSources.size
    };
}

export const AudioSystem = {
    initAudio,
    enableAudio,
    disableAudio,
    isAudioEnabled,
    setMasterVolume,
    getMasterVolume,
    resumeAudio,
    playClickSound,
    playMenuSelect,
    playLaserSound,
    playIceLaserSound,
    playAsteroidImpact,
    playExplosionSound,
    playAntimatterSound,
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

window.UniverseSmashAudio = AudioSystem;
