import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    console.log('[Basant] BootScene preload (no assets)');
  }

  create() {
    const aspectRatio = 1280 / 720;
    console.log('[Basant] BootScene create', {
      aspectRatio,
      nextScene: 'PreloadScene',
    });
    this.scale.displaySize.setAspectRatio(aspectRatio);
    this.scale.refresh();
    this.scene.start('PreloadScene');
  }
}
