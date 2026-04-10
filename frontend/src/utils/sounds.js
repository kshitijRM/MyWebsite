import { Howl } from 'howler';

// Minimal sound effects using synthesized tones
class SoundManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.3;
    this.sounds = {};
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Create simple click sound using Web Audio API as fallback
    this.audioContext = null;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Web Audio API not supported');
    }
    
    this.initialized = true;
  }

  playTone(frequency = 440, duration = 0.1, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // Silently fail
    }
  }

  playHover() {
    this.playTone(880, 0.05, 'sine');
  }

  playClick() {
    this.playTone(660, 0.1, 'triangle');
  }

  playTransition() {
    this.playTone(440, 0.2, 'sine');
  }

  playSuccess() {
    this.playTone(523, 0.1, 'sine');
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(784, 0.15, 'sine'), 200);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
export default soundManager;
