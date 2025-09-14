class AudioManager {
  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.buffers = new Map();
    this.musicSource = null;
    this.volumes = { music: 0.5, sfx: 1 };
  }

  loadAudio(key, arrayBuffer) {
    return this.ctx.decodeAudioData(arrayBuffer).then(buf => {
      this.buffers.set(key, buf);
      return buf;
    });
  }

  playMusic(key) {
    this.stopMusic();
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.get(key);
    src.loop = true;
    const gain = this.ctx.createGain();
    gain.gain.value = this.volumes.music;
    src.connect(gain).connect(this.ctx.destination);
    src.start(0);
    this.musicSource = src;
  }

  stopMusic() {
    this.musicSource?.stop();
    this.musicSource = null;
  }

  playSFX(key) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.get(key);
    const gain = this.ctx.createGain();
    gain.gain.value = this.volumes.sfx;
    src.connect(gain).connect(this.ctx.destination);
    src.start(0);
  }

  playEuskeraWord(key) {
    this.playSFX(key);
  }
}

const audio = new AudioManager();
export default audio;
