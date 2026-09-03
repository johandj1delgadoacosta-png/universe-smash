// src/audio.js

let audioContext = null;
let masterGain = null;
let enabled = true;
let initialized = false;

function createAudioContext() {
    if (audioContext) return audioContext;

    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {
        enabled = false;
        return null;
    }

    audioContext = new AudioContextClass();

    masterGain =
        audioContext.createGain();

    masterGain.gain.value = 0.25;

    masterGain.connect(
        audioContext.destination
    );

    initialized = true;

    return audioContext;
}

export function initAudio() {
    const ctx = createAudioContext();

    if (!ctx) return false;

    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }

    return true;
}

export function enableAudio() {
    enabled = true;
    initAudio();
}

export function disableAudio() {
    enabled = false;
}

export function isAudioEnabled() {
    return enabled;
}

function playTone({
    frequency = 440,
    duration = 0.15,
    type = "sine",
    volume = 0.15,
    slideTo = null
} = {}) {
    if (!enabled) return;

    const ctx = createAudioContext();

    if (!ctx || !masterGain) return;

    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        ctx.currentTime
    );

    if (slideTo !== null) {
        oscillator.frequency.exponentialRampToValueAtTime(
            Math.max(1, slideTo),
            ctx.currentTime + duration
        );
    }

    gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        Math.max(0.0001, volume),
        ctx.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(
        ctx.currentTime + duration + 0.02
    );
}

export function playClickSound() {
    playTone({
        frequency: 520,
        duration: 0.07,
        type: "square",
        volume: 0.08,
        slideTo: 700
    });
}

export function playLaserSound() {
    playTone({
        frequency: 900,
        duration: 0.18,
        type: "sawtooth",
        volume: 0.07,
        slideTo: 180
    });
}

export function playExplosionSound() {
    const ctx = createAudioContext();

    if (!enabled || !ctx || !masterGain) {
        return;
    }

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        90,
        ctx.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        25,
        ctx.currentTime + 0.5
    );

    gain.gain.setValueAtTime(
        0.0001,
        ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.18,
        ctx.currentTime + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + 0.5
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start();

    oscillator.stop(
        ctx.currentTime + 0.52
    );
}

export function playBlackHoleSound() {
    playTone({
        frequency: 65,
        duration: 0.7,
        type: "sine",
        volume: 0.1,
        slideTo: 28
    });
}

export function playWormholeSound() {
    playTone({
        frequency: 220,
        duration: 0.5,
        type: "triangle",
        volume: 0.08,
        slideTo: 880
    });
}

export function playAntimatterSound() {
    playTone({
        frequency: 700,
        duration: 0.35,
        type: "square",
        volume: 0.08,
        slideTo: 70
    });
}

export function playSpawnSound() {
    playTone({
        frequency: 330,
        duration: 0.12,
        type: "triangle",
        volume: 0.06,
        slideTo: 660
    });
}

export function playMenuSound() {
    playTone({
        frequency: 440,
        duration: 0.1,
        type: "triangle",
        volume: 0.05,
        slideTo: 660
    });
}

export function playErrorSound() {
    playTone({
        frequency: 120,
        duration: 0.2,
        type: "square",
        volume: 0.06,
        slideTo: 70
    });
}

export function setMasterVolume(volume) {
    const ctx = createAudioContext();

    if (!ctx || !masterGain) return;

    const safeVolume =
        Math.max(
            0,
            Math.min(1, Number(volume) || 0)
        );

    masterGain.gain.setValueAtTime(
        safeVolume,
        ctx.currentTime
    );
}

export function getMasterVolume() {
    if (!masterGain) return 0.25;

    return masterGain.gain.value;
}

export async function resumeAudio() {
    const ctx = createAudioContext();

    if (!ctx) return;

    if (ctx.state === "suspended") {
        await ctx.resume();
    }
}

export function loadDefaultSounds() {
    initAudio();

    return {
        click: playClickSound,
        laser: playLaserSound,
        explosion: playExplosionSound,
        blackHole: playBlackHoleSound,
        wormhole: playWormholeSound,
        antimatter: playAntimatterSound,
        spawn: playSpawnSound,
        menu: playMenuSound,
        error: playErrorSound
    };
}

export function destroyAudio() {
    if (audioContext) {
        audioContext.close().catch(() => {});
    }

    audioContext = null;
    masterGain = null;
    initialized = false;
}

export function getAudioState() {
    return {
        enabled,
        initialized,
        state: audioContext
            ? audioContext.state
            : "uninitialized",
        volume: getMasterVolume()
    };
}
