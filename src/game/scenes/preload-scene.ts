import Phaser from 'phaser';

import {
  generatePlaceholderBackgroundFar,
  generatePlaceholderKite,
  generatePlaceholderSpark,
} from '../assets/placeholder-generator';

// Import actual assets using proper relative paths
import rooftopsImg from '../../assets/lahore/backgrounds/rooftops.png';
import playerKiteImg from '../../assets/lahore/kites/player-kite.png';
import enemy1KiteImg from '../../assets/lahore/kites/kite-enemy-1.png';
import enemy2KiteImg from '../../assets/lahore/kites/kite-enemy-2.png';

import type { IGameConfig } from '../../shared/types';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    const { width, height } = this.cameras.main;
    console.log('[Basant] PreloadScene preload started', { width, height });
    const loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    this.load.image('bg_lahore', rooftopsImg);
    this.load.image('kite_player', playerKiteImg);
    this.load.image('kite_enemy_1', enemy1KiteImg);
    this.load.image('kite_enemy_2', enemy2KiteImg);

    this.textures.addBase64('bg_lahore_far', generatePlaceholderBackgroundFar());
    this.textures.addBase64('kite_enemy_3', generatePlaceholderKite('#FFFF00'));
    this.textures.addBase64('kite_enemy_4', generatePlaceholderKite('#FF00FF'));
    this.textures.addBase64('spark', generatePlaceholderSpark());
    console.log('[Basant] PreloadScene assets queued', {
      images: ['bg_lahore', 'kite_player', 'kite_enemy_1', 'kite_enemy_2'],
      placeholders: ['bg_lahore_far', 'kite_enemy_3', 'kite_enemy_4', 'spark'],
    });
  }

  create() {
    const config = this.registry.get('gameConfig') as IGameConfig;
    console.log('[Basant] PreloadScene create – assets ready', {
      level: config.level,
      nextScene: config.level === 'level1' ? 'Level1Scene' : 'Level2Scene',
    });
    if (config.level === 'level1') {
      this.scene.start('Level1Scene');
    } else {
      this.scene.start('Level2Scene');
    }
  }
}
