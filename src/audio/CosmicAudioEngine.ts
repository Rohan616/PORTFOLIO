/**
 * CosmicAudioEngine
 * Procedural Web Audio API sound synthesizer for deep space ambient rumble,
 * hyperspace warp drives, and futuristic UI feedback.
 */
class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  
  // Ambient continuous generator nodes
  private rumbleOsc1: OscillatorNode | null = null;
  private rumbleOsc2: OscillatorNode | null = null;
  private rumbleGain: GainNode | null = null;
  private warpDroneGain: GainNode | null = null;
  private warpDroneOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Setup ambient black hole rumble
      this.setupRumble();
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }

  private setupRumble() {
    if (!this.ctx || !this.masterGain) return;

    // Sub-bass oscillator (38Hz)
    this.rumbleOsc1 = this.ctx.createOscillator();
    this.rumbleOsc1.type = 'sine';
    this.rumbleOsc1.frequency.setValueAtTime(38, this.ctx.currentTime);

    // Harmonic low frequency (55Hz) with subtle detune for beating effect
    this.rumbleOsc2 = this.ctx.createOscillator();
    this.rumbleOsc2.type = 'triangle';
    this.rumbleOsc2.frequency.setValueAtTime(55, this.ctx.currentTime);
    this.rumbleOsc2.detune.setValueAtTime(4, this.ctx.currentTime);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(120, this.ctx.currentTime);

    this.rumbleGain = this.ctx.createGain();
    this.rumbleGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    this.rumbleOsc1.connect(this.filter);
    this.rumbleOsc2.connect(this.filter);
    this.filter.connect(this.rumbleGain);
    this.rumbleGain.connect(this.masterGain);

    this.rumbleOsc1.start();
    this.rumbleOsc2.start();

    // Hyperspace continuous drone
    this.warpDroneOsc = this.ctx.createOscillator();
    this.warpDroneOsc.type = 'sawtooth';
    this.warpDroneOsc.frequency.setValueAtTime(80, this.ctx.currentTime);

    const warpFilter = this.ctx.createBiquadFilter();
    warpFilter.type = 'bandpass';
    warpFilter.frequency.setValueAtTime(240, this.ctx.currentTime);
    warpFilter.Q.setValueAtTime(4, this.ctx.currentTime);

    this.warpDroneGain = this.ctx.createGain();
    this.warpDroneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.warpDroneOsc.connect(warpFilter);
    warpFilter.connect(this.warpDroneGain);
    this.warpDroneGain.connect(this.masterGain);

    this.warpDroneOsc.start();
  }

  public toggleMute(): boolean {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.4;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.3);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Modulate sound in real-time based on scroll/warp velocity (0 to 1)
   */
  public updateWarpVelocity(normalizedVelocity: number) {
    if (!this.ctx || !this.warpDroneGain || !this.warpDroneOsc || this.isMuted) return;

    const clamped = Math.min(Math.max(normalizedVelocity, 0), 1);
    const now = this.ctx.currentTime;
    
    // Scale drone volume and frequency
    const targetGain = clamped * 0.25;
    const targetFreq = 80 + clamped * 400;

    this.warpDroneGain.gain.cancelScheduledValues(now);
    this.warpDroneGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);

    this.warpDroneOsc.frequency.cancelScheduledValues(now);
    this.warpDroneOsc.frequency.linearRampToValueAtTime(targetFreq, now + 0.1);
  }

  /**
   * Trigger a cinematic hyperspace jump sound effect
   */
  public playWarpJump() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    // 1. Charge up sweep (rising frequency)
    const sweepOsc = this.ctx.createOscillator();
    sweepOsc.type = 'sine';
    sweepOsc.frequency.setValueAtTime(100, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.6);

    const sweepGain = this.ctx.createGain();
    sweepGain.gain.setValueAtTime(0.01, now);
    sweepGain.gain.linearRampToValueAtTime(0.35, now + 0.5);
    sweepGain.gain.linearRampToValueAtTime(0.001, now + 0.7);

    sweepOsc.connect(sweepGain);
    sweepGain.connect(this.masterGain);
    sweepOsc.start(now);
    sweepOsc.stop(now + 0.75);

    // 2. Warp sonic boom / white noise rush
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(300, now + 0.4);
    noiseFilter.frequency.exponentialRampToValueAtTime(3500, now + 0.7);
    noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 1.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.setValueAtTime(0.01, now + 0.4);
    noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.65);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now + 0.35);
    noise.stop(now + 1.5);
  }

  /**
   * Sci-fi button click / hover sound
   */
  public playUIBeep(highPitch = false) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(highPitch ? 880 : 440, now);
      osc.frequency.exponentialRampToValueAtTime(highPitch ? 1320 : 660, now + 0.06);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }
}

export const cosmicAudio = new CosmicAudioEngine();
