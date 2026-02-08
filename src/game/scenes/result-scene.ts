import Phaser from 'phaser';

// Result scene is handled by React ResultScreen component
// This scene is a placeholder in case we need Phaser-based results in the future

export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }

  create() {
    // This scene is not used in the current implementation
    // Results are shown via React ResultScreen component
  }
}
