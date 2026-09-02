// =========================================
// UNIVERSE SMASH
// AUDIO SYSTEM
// =========================================

// Audio storage

const sounds = new Map();

let music = null;


// =========================================
// LOAD A SOUND
// =========================================

export function loadSound(name, src, volume = 1) {

  const audio = new Audio(src);

  audio.preload = "auto";
  audio.volume = volume;

  sounds.set(name, audio);

  return audio;

}


// =========================================
// PLAY A SOUND
// =========================================

export function playSound(name, options = {}) {

  const original = sounds.get(name);

  if (!original) {
    console.warn(`Sound "${name}" has not been loaded.`);
    return;
  }

  // Clone audio so multiple explosions or
  // impacts can play at the same time.

  const audio = original.cloneNode();

  audio.volume =
    options.volume ?? original.volume;

  audio.playbackRate =
    options.playbackRate ?? 1;

  audio.currentTime = 0;

  audio.play().catch(() => {
    // Browsers may block audio before the
    // player interacts with the page.
  });

  return audio;

}


// =========================================
// PLAY BACKGROUND MUSIC
// =========================================

export function playMusic(src, volume = 0.5) {

  stopMusic();

  music = new Audio(src);

  music.loop = true;
  music.volume = volume;

  music.play().catch(() => {
    console.log(
      "Music will begin after player interaction."
    );
  });

}


// =========================================
// STOP MUSIC
// =========================================

export function stopMusic() {

  if (!music) return;

  music.pause();
  music.currentTime = 0;

  music = null;

}


// =========================================
// SET MUSIC VOLUME
// =========================================

export function setMusicVolume(volume) {

  if (!music) return;

  music.volume = Math.max(
    0,
    Math.min(1, volume)
  );

}


// =========================================
// STOP ALL SOUNDS
// =========================================

export function stopAllSounds() {

  sounds.forEach((sound) => {

    sound.pause();
    sound.currentTime = 0;

  });

}


// =========================================
// GAME AUDIO EVENTS
// =========================================

// These functions are ready to connect to
// actual audio files later.

export function playExplosionSound() {

  playSound("explosion", {
    volume: 0.8
  });

}


export function playLaserSound() {

  playSound("laser", {
    volume: 0.5,
    playbackRate: 1
  });

}


export function playIceLaserSound() {

  playSound("ice-laser", {
    volume: 0.6,
    playbackRate: 0.9
  });

}


export function playMeteorSound() {

  playSound("meteor", {
    volume: 0.7
  });

}


export function playBlackHoleSound() {

  playSound("black-hole", {
    volume: 0.6
  });

}


export function playMysterySound() {

  playSound("mystery", {
    volume: 0.7,
    playbackRate:
      0.8 + Math.random() * 0.4
  });

}


// =========================================
// INITIALIZE AUDIO SETTINGS
// =========================================

export function setupAudioSettings() {

  const musicSlider =
    document.getElementById("musicVolume");

  const soundSlider =
    document.getElementById("soundVolume");


  if (musicSlider) {

    musicSlider.addEventListener(
      "input",
      () => {

        const volume =
          Number(musicSlider.value) / 100;

        setMusicVolume(volume);

      }
    );

  }


  if (soundSlider) {

    soundSlider.addEventListener(
      "input",
      () => {

        const volume =
          Number(soundSlider.value) / 100;

        sounds.forEach((sound) => {
          sound.volume = volume;
        });

      }
    );

  }

}


console.log("🔊 Universe Smash audio system ready.");
