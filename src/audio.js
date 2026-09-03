// =========================================
// UNIVERSE SMASH
// AUDIO SYSTEM
// =========================================

const AudioSystem = {

  musicVolume: 0.35,
  soundVolume: 0.7,

  muted: false,

  currentMusic: null,

  sounds: {},


  // -----------------------------------------
  // INITIALIZE
  // -----------------------------------------

  init() {

    console.log("🔊 Universe Smash Audio System Ready");

  },


  // -----------------------------------------
  // LOAD A SOUND
  // -----------------------------------------

  loadSound(name, path, volume = 1) {

    const audio = new Audio(path);

    audio.preload = "auto";

    audio.volume =
      volume * this.soundVolume;


    this.sounds[name] = audio;

  },


  // -----------------------------------------
  // PLAY SOUND EFFECT
  // -----------------------------------------

  play(name) {

    if (this.muted) return;

    const sound =
      this.sounds[name];

    if (!sound) {

      console.warn(
        `Sound not loaded: ${name}`
      );

      return;

    }


    // Clone allows the same sound
    // to play multiple times at once

    const soundClone =
      sound.cloneNode();


    soundClone.volume =
      sound.volume;


    soundClone.play()
      .catch(() => {

        // Browsers may block audio
        // before the player interacts.

      });

  },


  // -----------------------------------------
  // PLAY MUSIC
  // -----------------------------------------

  playMusic(path) {

    if (this.muted) return;


    this.stopMusic();


    const music =
      new Audio(path);


    music.loop = true;

    music.volume =
      this.musicVolume;


    music.play()
      .catch(() => {

        console.log(
          "Music will begin after player interaction."
        );

      });


    this.currentMusic =
      music;

  },


  // -----------------------------------------
  // STOP MUSIC
  // -----------------------------------------

  stopMusic() {

    if (!this.currentMusic) return;


    this.currentMusic.pause();

    this.currentMusic.currentTime = 0;

    this.currentMusic = null;

  },


  // -----------------------------------------
  // SET MUSIC VOLUME
  // -----------------------------------------

  setMusicVolume(volume) {

    this.musicVolume =
      Math.max(
        0,
        Math.min(1, volume)
      );


    if (this.currentMusic) {

      this.currentMusic.volume =
        this.musicVolume;

    }

  },


  // -----------------------------------------
  // SET SOUND VOLUME
  // -----------------------------------------

  setSoundVolume(volume) {

    this.soundVolume =
      Math.max(
        0,
        Math.min(1, volume)
      );


    Object.values(this.sounds)
      .forEach(sound => {

        sound.volume =
          this.soundVolume;

      });

  },


  // -----------------------------------------
  // TOGGLE MUTE
  // -----------------------------------------

  toggleMute() {

    this.muted =
      !this.muted;


    if (
      this.currentMusic
    ) {

      this.currentMusic.muted =
        this.muted;

    }


    Object.values(this.sounds)
      .forEach(sound => {

        sound.muted =
          this.muted;

      });


    return this.muted;

  },


  // -----------------------------------------
  // DESTROY
  // -----------------------------------------

  destroy() {

    this.stopMusic();

    this.sounds = {};

  }

};


// =========================================
// DEFAULT SOUND FILES
// =========================================

export function loadDefaultSounds() {

  AudioSystem.loadSound(
    "click",
    "assets/audio/click.mp3",
    0.5
  );


  AudioSystem.loadSound(
    "explosion",
    "assets/audio/explosion.mp3",
    0.8
  );


  AudioSystem.loadSound(
    "laser",
    "assets/audio/laser.mp3",
    0.6
  );


  AudioSystem.loadSound(
    "ice-laser",
    "assets/audio/ice-laser.mp3",
    0.6
  );


  AudioSystem.loadSound(
    "black-hole",
    "assets/audio/black-hole.mp3",
    0.7
  );


  AudioSystem.loadSound(
    "wormhole",
    "assets/audio/wormhole.mp3",
    0.7
  );


  AudioSystem.loadSound(
    "antimatter",
    "assets/audio/antimatter.mp3",
    0.9
  );

}


// =========================================
// EXPORT
// =========================================

export default AudioSystem;
