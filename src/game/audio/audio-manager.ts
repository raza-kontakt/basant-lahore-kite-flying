import { Howl } from 'howler';

export class AudioManager {
  private static instance: AudioManager;
  private backgroundMusic: Howl | null = null;
  private sfxVolume: number = 0.8;
  private musicEnabled: boolean = true;
  private hasBoundBackgroundUnlockListeners: boolean = false;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public async initBackgroundMusic(musicEnabled: boolean, musicVolume: number): Promise<void> {
    this.musicEnabled = musicEnabled;
    console.log('[Basant] AudioManager initBackgroundMusic', { musicEnabled, musicVolume });

    if (!musicEnabled) {
      return;
    }

    const musicUrl = new URL('./basant.mp3', import.meta.url).href;

    this.backgroundMusic = new Howl({
      src: [musicUrl],
      loop: true,
      volume: musicVolume,
      html5: true, // Use HTML5 Audio for streaming
      onloaderror: (_id, error) => {
        console.warn('Failed to load background music', { musicUrl, error });
        this.backgroundMusic = null;
      },
      onplayerror: (_id, error) => {
        // Autoplay policies can block background audio until the user interacts again.
        console.warn('Failed to play background music (will retry on interaction)', { error });
        this.bindBackgroundMusicUnlockListeners();
      },
    });
  }

  public playBackgroundMusic(): void {
    if (this.backgroundMusic && this.musicEnabled) {
      try {
        this.backgroundMusic.play();
        console.log('[Basant] AudioManager playBackgroundMusic');
      } catch (error) {
        console.warn('Background music play threw (will retry on interaction)', { error });
        this.bindBackgroundMusicUnlockListeners();
      }
    }
  }

  public pauseBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
      console.log('[Basant] AudioManager stopBackgroundMusic');
    }
  }

  public setMusicVolume(volume: number): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.volume(volume);
    }
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = volume;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
  }

  // SFX methods (using simple beep sounds for now, can be replaced with actual audio files)
  public playCutSfx(): void {
    if (this.sfxVolume === 0) return;

    const sfx = new Howl({
      src: ['data:audio/wav;base64,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'],
      volume: this.sfxVolume,
    });
    sfx.play();
  }

  public playBoostSfx(): void {
    if (this.sfxVolume === 0) return;

    const sfx = new Howl({
      src: ['data:audio/wav;base64,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'],
      volume: this.sfxVolume,
      rate: 1.5,
    });
    sfx.play();
  }

  public playSparkSfx(): void {
    if (this.sfxVolume === 0) return;

    const sfx = new Howl({
      src: ['data:audio/wav;base64,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'],
      volume: this.sfxVolume,
      rate: 2.0,
    });
    sfx.play();
  }

  public cleanup(): void {
    this.stopBackgroundMusic();
    if (this.backgroundMusic) {
      this.backgroundMusic.unload();
      this.backgroundMusic = null;
    }
  }

  private bindBackgroundMusicUnlockListeners(): void {
    if (this.hasBoundBackgroundUnlockListeners) return;
    this.hasBoundBackgroundUnlockListeners = true;

    const tryPlay = () => {
      if (!this.backgroundMusic || !this.musicEnabled) return;

      try {
        this.backgroundMusic.play();
      } finally {
        window.removeEventListener('pointerdown', tryPlay);
        window.removeEventListener('keydown', tryPlay);
        this.hasBoundBackgroundUnlockListeners = false;
      }
    };

    window.addEventListener('pointerdown', tryPlay, { once: true });
    window.addEventListener('keydown', tryPlay, { once: true });
  }
}
