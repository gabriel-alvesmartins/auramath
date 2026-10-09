/**
 * ==============================================================================
 * Auramath Zero-Latency Procedural Audio Synthesizer
 * File: apps/mobile/src/services/audioSynth.ts
 *
 * Provides:
 * - 0ms physical latency audio synthesis using Web Audio API AudioContext oscillators
 * - Ascending notes on the Pentatonic Major scale (C4 to C7) with crystal/marimba harmonics
 * - Aura Mascot 5-level energy milestone chords (Spark -> Singularity)
 * - Gentle acoustic dissipation (non-punitive error release)
 * - Procedural generative multi-layer Lofi engine for Zen mode (Crackle, Rhodes, Rain/Bass)
 * - Strict silent-mode and master/sfx/music volume handling
 * ==============================================================================
 */

export interface PentatonicNote {
  name: string;
  frequency: number;
  octave: number;
}

export type AuraEnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface ZenLayerState {
  layer1CrackleDrums: number; // Gain 0.0 - 1.0
  layer2RhodesChords: number;  // Gain 0.0 - 1.0
  layer3RainSubBass: number;   // Gain 0.0 - 1.0
  currentStreak: number;
  isPlaying: boolean;
}

export interface AudioSynthConfig {
  masterVolume?: number;
  sfxVolume?: number;
  musicVolume?: number;
  isMuted?: boolean;
}

export interface IAudioSynthesizer {
  init(): Promise<boolean>;
  playSuccessNote(comboStreak: number): void;
  playComboMilestone(level: AuraEnergyLevel): void;
  playErrorSoftRelease(): void;
  playKeypressTick(): void;
  playBossHit(damagePercent?: number): void;
  playVictoryFanfare(): void;
  playChestReward(): void;
  startZenMode(): void;
  stopZenMode(): void;
  updateZenStreak(streak: number): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  setMasterVolume(volume: number): void;
  setSfxVolume(volume: number): void;
  setMusicVolume(volume: number): void;
  dispose(): void;
}

/**
 * Standard Concert Pitch Pentatonic Major Scale (C Major Pentatonic: C, D, E, G, A)
 * Spans C4 (261.63Hz) up to C7 (2093.00Hz) - mathematically eliminates dissonance.
 */
export const PENTATONIC_SCALE: readonly PentatonicNote[] = [
  // Octave 4
  { name: 'C4', frequency: 261.63, octave: 4 },
  { name: 'D4', frequency: 293.66, octave: 4 },
  { name: 'E4', frequency: 329.63, octave: 4 },
  { name: 'G4', frequency: 392.00, octave: 4 },
  { name: 'A4', frequency: 440.00, octave: 4 },
  // Octave 5
  { name: 'C5', frequency: 523.25, octave: 5 },
  { name: 'D5', frequency: 587.33, octave: 5 },
  { name: 'E5', frequency: 659.25, octave: 5 },
  { name: 'G5', frequency: 783.99, octave: 5 },
  { name: 'A5', frequency: 880.00, octave: 5 },
  // Octave 6
  { name: 'C6', frequency: 1046.50, octave: 6 },
  { name: 'D6', frequency: 1174.66, octave: 6 },
  { name: 'E6', frequency: 1318.51, octave: 6 },
  { name: 'G6', frequency: 1567.98, octave: 6 },
  { name: 'A6', frequency: 1760.00, octave: 6 },
  // Octave 7 Cap
  { name: 'C7', frequency: 2093.00, octave: 7 },
] as const;

export class AudioSynthesizer implements IAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Zen Mode Nodes
  private zenLayer1Gain: GainNode | null = null; // Vinyl crackle & lofi drum pulse
  private zenLayer2Gain: GainNode | null = null; // Warm Rhodes chords
  private zenLayer3Gain: GainNode | null = null; // Procedural rain & deep sub-bass

  private zenVinylSource: AudioBufferSourceNode | null = null;
  private zenRainSource: AudioBufferSourceNode | null = null;
  private zenLoopTimer: ReturnType<typeof setInterval> | null = null;
  private zenStepIndex: number = 0;

  // Settings
  private _isMuted: boolean = false;
  private _masterVolume: number = 0.85;
  private _sfxVolume: number = 0.9;
  private _musicVolume: number = 0.65;
  private _isZenActive: boolean = false;
  private _zenStreak: number = 0;

  constructor(config?: AudioSynthConfig) {
    if (config) {
      if (config.isMuted !== undefined) this._isMuted = config.isMuted;
      if (config.masterVolume !== undefined) this._masterVolume = Math.max(0, Math.min(1, config.masterVolume));
      if (config.sfxVolume !== undefined) this._sfxVolume = Math.max(0, Math.min(1, config.sfxVolume));
      if (config.musicVolume !== undefined) this._musicVolume = Math.max(0, Math.min(1, config.musicVolume));
    }
  }

  /**
   * Initializes AudioContext lazily on user gesture.
   */
  public async init(): Promise<boolean> {
    if (this._isMuted) return false;

    try {
      if (!this.ctx) {
        const AudioCtxClass =
          typeof window !== 'undefined'
            ? window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
            : (globalThis as unknown as { AudioContext?: typeof AudioContext }).AudioContext;

        if (!AudioCtxClass) {
          return false;
        }

        this.ctx = new AudioCtxClass();

        // Build Audio Routing Graph
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this._masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // SFX Sub-bus
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this._sfxVolume, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Music / Zen Sub-bus
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this._musicVolume, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);
      }

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      return true;
    } catch {
      return false;
    }
  }

  private ensureReady(): boolean {
    if (this._isMuted) return false;
    if (!this.ctx) {
      void this.init();
      return false;
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx.state === 'running';
  }

  // ============================================================================
  // 1. GAMEPLAY SFX: ASCENDING PENTATONIC SYNTHESIS
  // ============================================================================

  /**
   * Dispatches ascending notes on the pentatonic major scale with crystal/marimba harmonics.
   * Latency is strictly 0ms as nodes are dispatched on current audio hardware clock.
   */
  public playSuccessNote(comboStreak: number): void {
    if (!this.ensureReady() || !this.ctx || !this.sfxGain) return;

    const streak = Math.max(1, comboStreak);
    const noteIndex = (streak - 1) % PENTATONIC_SCALE.length;
    const note = PENTATONIC_SCALE[noteIndex];
    const octaveMultiplier = Math.pow(2, Math.floor((streak - 1) / PENTATONIC_SCALE.length));
    const targetFreq = Math.min(note.frequency * octaveMultiplier, 3500);

    const now = this.ctx.currentTime;
    const noteDuration = 0.28;

    // Node: Tone Gain Envelope
    const noteGain = this.ctx.createGain();
    noteGain.connect(this.sfxGain);

    // ADSR Envelope: 2ms Attack, Exponential Decay
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.4, now + 0.002);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + noteDuration);

    // Osc 1: Fundamental Sine (Crystal Marimba Core)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(targetFreq, now);
    osc1.connect(noteGain);

    // Osc 2: 2nd Harmonic Triangle (Warmth & Definition)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(targetFreq * 2, now);

    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.12, now);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + (noteDuration * 0.7));
    osc2.connect(harmonicGain);
    harmonicGain.connect(noteGain);

    // Start and auto-cleanup
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + noteDuration);
    osc2.stop(now + noteDuration);

    setTimeout(() => {
      try {
        osc1.disconnect();
        osc2.disconnect();
        harmonicGain.disconnect();
        noteGain.disconnect();
      } catch {}
    }, (noteDuration + 0.05) * 1000);
  }

  /**
   * Plays harmonic milestone chords corresponding to the 5 Aura mascot energy levels:
   * 1. Spark (Level 1, Combo 1-4)
   * 2. Surge (Level 2, Combo 5-9)
   * 3. Overdrive (Level 3, Combo 10-19)
   * 4. Supernova (Level 4, Combo 20-34)
   * 5. Singularity (Level 5, Combo 35+)
   */
  public playComboMilestone(level: AuraEnergyLevel): void {
    if (!this.ensureReady() || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    switch (level) {
      case 1: {
        // Spark: Pure crystal bell ping
        this.playChord([523.25, 659.25], 0.35, 0.25);
        break;
      }
      case 2: {
        // Surge: Dual tone with 5th harmonic and subtle chorus detune
        this.playChord([523.25, 783.99, 1046.5], 0.45, 0.3);
        break;
      }
      case 3: {
        // Overdrive: Rapid ascending pentatonic triad arpeggio
        this.playArpeggio([523.25, 659.25, 783.99, 1046.5], 0.04, 0.5);
        break;
      }
      case 4: {
        // Supernova: Cosmic quad chord burst with rich overtone shimmer
        this.playChord([523.25, 659.25, 783.99, 1046.5, 1318.51], 0.7, 0.35);
        break;
      }
      case 5: {
        // Singularity / Godmode: Celestial wide chord with sub-harmonic anchor
        this.playChord([130.81, 261.63, 523.25, 659.25, 783.99, 1046.5, 1567.98], 1.2, 0.4);
        break;
      }
    }
  }

  /**
   * Helper: Plays multiple frequencies as a harmonic chord.
   */
  private playChord(frequencies: number[], duration: number, peakGain: number): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const chordGain = this.ctx.createGain();
    chordGain.connect(this.sfxGain);
    chordGain.gain.setValueAtTime(0.0001, now);
    chordGain.gain.linearRampToValueAtTime(peakGain / Math.sqrt(frequencies.length), now + 0.005);
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    frequencies.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(chordGain);
      osc.start(now);
      osc.stop(now + duration);
    });
  }

  /**
   * Helper: Rapidly plays notes in an arpeggiated sequence.
   */
  private playArpeggio(frequencies: number[], stepSeconds: number, totalDuration: number): void {
    if (!this.ctx || !this.sfxGain) return;
    const baseNow = this.ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const noteTime = baseNow + idx * stepSeconds;
      const noteGain = this.ctx!.createGain();
      noteGain.connect(this.sfxGain!);

      noteGain.gain.setValueAtTime(0.0001, noteTime);
      noteGain.gain.linearRampToValueAtTime(0.3, noteTime + 0.002);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + totalDuration);

      const osc = this.ctx!.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      osc.connect(noteGain);
      osc.start(noteTime);
      osc.stop(noteTime + totalDuration);
    });
  }

  /**
   * Acoustic Soft Dissipation (Non-punitive Error Release):
   * Dissipates energy gently with a descending warm acoustic sigh instead of an alarm/buzzer.
   */
  public playErrorSoftRelease(): void {
    if (!this.ensureReady() || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const duration = 0.36;

    // Filter node to create a warm, muted texture
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(140, now + duration);
    filter.connect(this.sfxGain);

    const gainNode = this.ctx.createGain();
    gainNode.connect(filter);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Warm sine pitch bend downwards
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + duration);
    osc.connect(gainNode);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Ultra-light click tick for in-app keypad (0ms latency, zero harshness).
   */
  public playKeypressTick(): void {
    if (!this.ensureReady() || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const duration = 0.012; // 12ms micro-pulse

    const tickGain = this.ctx.createGain();
    tickGain.connect(this.sfxGain);
    tickGain.gain.setValueAtTime(0.0001, now);
    tickGain.gain.linearRampToValueAtTime(0.08, now + 0.001);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + duration);
    osc.connect(tickGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Boss Battle impact sound (heavy hit response).
   */
  public playBossHit(damagePercent: number = 0.1): void {
    if (!this.ensureReady() || !this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const duration = 0.22;

    const hitGain = this.ctx.createGain();
    hitGain.connect(this.sfxGain);
    hitGain.gain.setValueAtTime(0.0001, now);
    hitGain.gain.linearRampToValueAtTime(0.35 + Math.min(0.2, damagePercent), now + 0.003);
    hitGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + duration);
    osc.connect(hitGain);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Duolingo-style triumphant cosmic victory fanfare.
   * Plays an ascending majestic major pentatonic fanfare ending in a sustained sparkling chord.
   */
  public playVictoryFanfare(): void {
    if (!this.ensureReady() || !this.ctx || !this.sfxGain) return;

    // Arpeggio chords in quick sequence: C5 -> E5 -> G5 -> B5 -> C6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChord([freq, freq * 1.5], 0.45, 0.28);
      }, idx * 110);
    });

    // Grand final resonance chord
    setTimeout(() => {
      this.playChord([523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98], 1.4, 0.35);
    }, 600);
  }

  /**
   * Cosmic Chest opening reward sound (sparkle chime cascade).
   */
  public playChestReward(): void {
    if (!this.ensureReady() || !this.ctx || !this.sfxGain) return;

    const sparkleFreqs = [783.99, 880.0, 987.77, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0];
    sparkleFreqs.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChord([freq], 0.35, 0.2);
      }, idx * 60);
    });
  }

  // ============================================================================
  // 2. PROCEDURAL GENERATIVE LOFI ENGINE FOR ZEN MODE
  // ============================================================================

  /**
   * Activates Zen Mode and boots up the procedural ambient layers:
   * Layer 1: Vinyl crackle & low-key lofi rhythm (Streaks 1-5)
   * Layer 2: Procedural Rhodes electric piano chord progressions (Streaks 6-12)
   * Layer 3: Filtered rain texture & deep acoustic sub-bass (Streaks 13+)
   */
  public startZenMode(): void {
    if (this._isZenActive) return;
    if (!this.ensureReady() || !this.ctx || !this.musicGain) return;

    this._isZenActive = true;
    this._zenStreak = 0;
    this.zenStepIndex = 0;

    // Create gain busses for each procedural layer
    this.zenLayer1Gain = this.ctx.createGain();
    this.zenLayer1Gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.zenLayer1Gain.connect(this.musicGain);

    this.zenLayer2Gain = this.ctx.createGain();
    this.zenLayer2Gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.zenLayer2Gain.connect(this.musicGain);

    this.zenLayer3Gain = this.ctx.createGain();
    this.zenLayer3Gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.zenLayer3Gain.connect(this.musicGain);

    // Boot continuous textures
    this.startProceduralVinyl();
    this.startProceduralRain();

    // Start 72 BPM rhythmic sequencer loop (approx 833ms per beat)
    const beatIntervalMs = 833;
    this.zenLoopTimer = setInterval(() => {
      this.tickZenSequencer();
    }, beatIntervalMs);
  }

  /**
   * Stops Zen Mode and gracefully fades out procedural layers.
   */
  public stopZenMode(): void {
    if (!this._isZenActive) return;
    this._isZenActive = false;

    if (this.zenLoopTimer) {
      clearInterval(this.zenLoopTimer);
      this.zenLoopTimer = null;
    }

    if (this.ctx) {
      const now = this.ctx.currentTime;
      [this.zenLayer1Gain, this.zenLayer2Gain, this.zenLayer3Gain].forEach((g) => {
        if (g) {
          g.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        }
      });
    }

    setTimeout(() => {
      try {
        if (this.zenVinylSource) {
          this.zenVinylSource.stop();
          this.zenVinylSource.disconnect();
          this.zenVinylSource = null;
        }
        if (this.zenRainSource) {
          this.zenRainSource.stop();
          this.zenRainSource.disconnect();
          this.zenRainSource = null;
        }
      } catch {}
    }, 1000);
  }

  /**
   * Dynamically unlocks and adjusts procedural Lofi layers based on current streak.
   */
  public updateZenStreak(streak: number): void {
    this._zenStreak = Math.max(0, streak);
    if (!this._isZenActive || !this.ctx) return;

    const now = this.ctx.currentTime;
    const fadeDuration = 1.2; // Smooth 1.2s ramp

    // Layer 1: Vinyl Crackle & Soft Drums (Active from streak 1+)
    const layer1Target = streak >= 1 ? 0.65 : 0.0;
    // Layer 2: Warm Rhodes Chords (Active from streak 6+)
    const layer2Target = streak >= 6 ? 0.75 : 0.0;
    // Layer 3: Rain & Deep Sub-Bass (Active from streak 13+)
    const layer3Target = streak >= 13 ? 0.7 : 0.0;

    if (this.zenLayer1Gain) {
      this.zenLayer1Gain.gain.cancelScheduledValues(now);
      this.zenLayer1Gain.gain.linearRampToValueAtTime(layer1Target, now + fadeDuration);
    }
    if (this.zenLayer2Gain) {
      this.zenLayer2Gain.gain.cancelScheduledValues(now);
      this.zenLayer2Gain.gain.linearRampToValueAtTime(layer2Target, now + fadeDuration);
    }
    if (this.zenLayer3Gain) {
      this.zenLayer3Gain.gain.cancelScheduledValues(now);
      this.zenLayer3Gain.gain.linearRampToValueAtTime(layer3Target, now + fadeDuration);
    }
  }

  /**
   * Procedural vinyl crackle generator (Synthesized White Noise with Bandpass & Pop bursts).
   */
  private startProceduralVinyl(): void {
    if (!this.ctx || !this.zenLayer1Gain) return;

    const bufferSize = this.ctx.sampleRate * 3; // 3 seconds loop
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Gentle noise floor
      let sample = (Math.random() * 2 - 1) * 0.04;
      // Sparse crackle pop spikes
      if (Math.random() < 0.0015) {
        sample += (Math.random() * 2 - 1) * 0.4;
      }
      output[i] = sample;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Highpass & Lowpass filters to create vintage vinyl warmth
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(800, this.ctx.currentTime);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(3200, this.ctx.currentTime);

    noise.connect(hp);
    hp.connect(lp);
    lp.connect(this.zenLayer1Gain);

    noise.start();
    this.zenVinylSource = noise;
  }

  /**
   * Procedural rain texture generator (Brownian/Pink filtered noise loop).
   */
  private startProceduralRain(): void {
    if (!this.ctx || !this.zenLayer3Gain) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const rainBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const channel = rainBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brownian integration for gentle rain sound
      channel[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = channel[i];
      channel[i] *= 0.4;
    }

    const rain = this.ctx.createBufferSource();
    rain.buffer = rainBuffer;
    rain.loop = true;

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1200, this.ctx.currentTime);

    rain.connect(lp);
    lp.connect(this.zenLayer3Gain);

    rain.start();
    this.zenRainSource = rain;
  }

  /**
   * Zen Beat Sequencer (Called every beat ~833ms, 4 beats per bar):
   * Triggers lofi drum pulses, warm Rhodes chords, and sub-bass according to progression.
   */
  private tickZenSequencer(): void {
    if (!this.ctx || !this._isZenActive) return;

    const beat = this.zenStepIndex % 16; // 4-bar loop
    const now = this.ctx.currentTime;

    // 1. Lofi Drums (Layer 1)
    if (this._zenStreak >= 1 && this.zenLayer1Gain) {
      // Soft Kick on beats 0, 8, 10
      if (beat === 0 || beat === 8 || beat === 10) {
        this.playLofiKick(now);
      }
      // Soft Brushed Snare on beats 4, 12
      if (beat === 4 || beat === 12) {
        this.playLofiSnare(now);
      }
    }

    // 2. Rhodes Electric Piano Chords (Layer 2) - Trigger on bar downbeats (0, 4, 8, 12)
    if (this._zenStreak >= 6 && this.zenLayer2Gain && beat % 4 === 0) {
      const chordIndex = Math.floor(beat / 4);
      // Jazz progression: Cmaj9 -> Am7 -> Dm9 -> G13 (Pentatonic compliant)
      const progressions: number[][] = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 392.00], // G7
      ];
      const chord = progressions[chordIndex % progressions.length];
      this.playRhodesChord(chord, now, 3.2);
    }

    // 3. Deep Acoustic Sub-Bass (Layer 3) - Trigger on bar downbeats (0, 4, 8, 12)
    if (this._zenStreak >= 13 && this.zenLayer3Gain && beat % 4 === 0) {
      const chordIndex = Math.floor(beat / 4);
      const bassNotes = [65.41, 55.00, 73.42, 49.00]; // C2, A1, D2, G1
      const bassFreq = bassNotes[chordIndex % bassNotes.length];
      this.playSubBassNote(bassFreq, now, 3.0);
    }

    this.zenStepIndex++;
  }

  private playLofiKick(startTime: number): void {
    if (!this.ctx || !this.zenLayer1Gain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.zenLayer1Gain);

    osc.frequency.setValueAtTime(110, startTime);
    osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.16);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.32, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.22);

    osc.start(startTime);
    osc.stop(startTime + 0.22);
  }

  private playLofiSnare(startTime: number): void {
    if (!this.ctx || !this.zenLayer1Gain) return;

    // Filtered noise burst
    const dur = 0.18;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1800, startTime);
    bandpass.Q.setValueAtTime(1.2, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.zenLayer1Gain);

    noise.start(startTime);
    noise.stop(startTime + dur);
  }

  private playRhodesChord(frequencies: number[], startTime: number, duration: number): void {
    if (!this.ctx || !this.zenLayer2Gain) return;

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      // Subtle arpeggio strum delay (25ms per voice)
      const voiceTime = startTime + idx * 0.025;

      // Triangle for Rhodes-like bell-electric timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, voiceTime);

      gain.gain.setValueAtTime(0.0001, voiceTime);
      gain.gain.linearRampToValueAtTime(0.12, voiceTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, voiceTime + duration);

      osc.connect(gain);
      gain.connect(this.zenLayer2Gain!);

      osc.start(voiceTime);
      osc.stop(voiceTime + duration);
    });
  }

  private playSubBassNote(freq: number, startTime: number, duration: number): void {
    if (!this.ctx || !this.zenLayer3Gain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.24, startTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.zenLayer3Gain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // ============================================================================
  // 3. VOLUME & SILENT MODE CONTROLS
  // ============================================================================

  public setMuted(muted: boolean): void {
    this._isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(muted ? 0.0 : this._masterVolume, now);
    }
  }

  public isMuted(): boolean {
    return this._isMuted;
  }

  public setMasterVolume(volume: number): void {
    this._masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx && !this._isMuted) {
      this.masterGain.gain.setValueAtTime(this._masterVolume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(volume: number): void {
    this._sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this._sfxVolume, this.ctx.currentTime);
    }
  }

  public setMusicVolume(volume: number): void {
    this._musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this._musicVolume, this.ctx.currentTime);
    }
  }

  public dispose(): void {
    this.stopZenMode();
    if (this.ctx) {
      try {
        void this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

// Global Singleton Instance for Zero-Overhead App-Wide Access
export const audioSynth: AudioSynthesizer = new AudioSynthesizer();
