import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

import { AudioManager } from '../../game/audio/audio-manager';

import type { IGameConfig, IGameResult } from '../../shared/types';

interface IGameContainerProps {
  config: IGameConfig;
  onExit: () => void;
  onResult: (result: IGameResult) => void;
}

const GameContainer = ({ config, onExit, onResult }: IGameContainerProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!containerRef.current || gameRef.current || isInitializing.current) return;

    isInitializing.current = true;
    console.log('[Basant] GameContainer effect: initializing', {
      config: { level: config.level, musicEnabled: config.musicEnabled, musicVolume: config.musicVolume, sfxVolume: config.sfxVolume },
      viewport: { width: window.innerWidth, height: window.innerHeight },
    });

    const audioManager = AudioManager.getInstance();
    audioManager.initBackgroundMusic(config.musicEnabled, config.musicVolume).then(() => {
      audioManager.playBackgroundMusic();
      console.log('[Basant] Background music started', { enabled: config.musicEnabled });
    });
    audioManager.setSfxVolume(config.sfxVolume);

    import('../../game/scenes/boot-scene').then(({ BootScene }) => {
      import('../../game/scenes/preload-scene').then(({ PreloadScene }) => {
        import('../../game/scenes/level1-scene').then(({ Level1Scene }) => {
          import('../../game/scenes/level2-scene').then(({ Level2Scene }) => {
            import('../../game/scenes/result-scene').then(({ ResultScene }) => {
              // Double-check we haven't already created a game
              if (gameRef.current) return;

              const phaserConfig: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                parent: containerRef.current!,
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: '#87CEEB',
                physics: {
                  default: 'arcade',
                  arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false,
                  },
                },
                scene: [BootScene, PreloadScene, Level1Scene, Level2Scene, ResultScene],
                scale: {
                  mode: Phaser.Scale.RESIZE,
                  autoCenter: Phaser.Scale.CENTER_BOTH,
                },
              };

              gameRef.current = new Phaser.Game(phaserConfig);

              // Pass config and callbacks to game registry
              gameRef.current.registry.set('gameConfig', config);
              gameRef.current.registry.set('onExit', onExit);
              gameRef.current.registry.set('onResult', onResult);

              console.log('[Basant] Phaser game mounted', {
                scenes: ['BootScene', 'PreloadScene', 'Level1Scene', 'Level2Scene', 'ResultScene'],
                startScene: 'BootScene',
                registryKeys: ['gameConfig', 'onExit', 'onResult'],
              });
            });
          });
        });
      });
    });

    return () => {
      console.log('[Basant] GameContainer cleanup: unmounting', {
        hadGame: !!gameRef.current,
      });
      const audioManager = AudioManager.getInstance();
      audioManager.stopBackgroundMusic();

      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }

      isInitializing.current = false;
    };
  }, [config, onExit, onResult]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default GameContainer;
