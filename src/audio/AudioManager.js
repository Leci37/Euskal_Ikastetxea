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
  }

  /**
   * Decode and cache audio files using the AssetLoader.
   * @param {Array<{name:string,src:string}>} manifest
   */
  async load(manifest = []) {
    const paths = manifest.map((a) => a.src);
    await AssetLoader.loadAudio(paths);
    for (const asset of manifest) {
      const audio = AssetLoader.getAudio(asset.src);
      const response = await fetch(audio.src);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.buffers.set(asset.name, buffer);
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
    source.start();
    this.musicSource = source;
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
    src.start();
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
