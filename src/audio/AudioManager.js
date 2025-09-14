import AssetLoader from '../core/AssetLoader.js';

/**
 * Handles playback of music, sound effects and pronunciations.
 */
class AudioManager {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.buffers = new Map();
    this.musicSource = null;
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.5;
    this.sfxGain.gain.value = 1;
    this.musicGain.connect(this.ctx.destination);
    this.sfxGain.connect(this.ctx.destination);

    // resume context on first user gesture to satisfy autoplay policies
    this._unlockHandler = () => {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch((err) => console.error('Audio resume failed', err));
      }
      document.removeEventListener('click', this._unlockHandler);
      document.removeEventListener('touchstart', this._unlockHandler);
    };
    document.addEventListener('click', this._unlockHandler);
    document.addEventListener('touchstart', this._unlockHandler);

    // cleanup context when leaving page
    window.addEventListener('beforeunload', () => {
      this.ctx.close();
    });
  }

  /**
   * Decode and cache audio files using the AssetLoader.
   * @param {Array<{name:string,src:string}>} manifest
   */
  async load(manifest = []) {
    const paths = manifest.map((a) => a.src);
    await AssetLoader.loadAudio(paths);
    for (const asset of manifest) {
      try {
        const audio = AssetLoader.getAudio(asset.src);
        const response = await fetch(audio.src);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.buffers.set(asset.name, buffer);
      } catch (err) {
        console.error('Audio load failed', err);
      }
    }
  }

  playMusic(name, loop = true) {
    this.stopMusic();
    const buffer = this.buffers.get(name);
    if (!buffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(this.musicGain);
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch((err) => console.error('Resume failed', err));
    }
    try {
      source.start();
      this.musicSource = source;
    } catch (err) {
      console.error('Music playback failed', err);
    }
  }

  stopMusic(fade = 0.5) {
    if (!this.musicSource) return;
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(0, now + fade);
    this.musicSource.stop(now + fade);
    this.musicSource = null;
  }

  playSound(name) {
    const buffer = this.buffers.get(name);
    if (!buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.sfxGain);
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch((err) => console.error('Resume failed', err));
    }
    try {
      src.start();
    } catch (err) {
      console.error('Sound playback failed', err);
    }
  }

  playEuskeraWord(word) {
    this.playSound(`euskera_${word}`);
  }

  setMusicVolume(v) {
    this.musicGain.gain.value = v;
  }

  setSfxVolume(v) {
    this.sfxGain.gain.value = v;
  }
}

export default new AudioManager();
