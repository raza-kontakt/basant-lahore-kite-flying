import Phaser from 'phaser';

import { AudioManager } from '../audio/audio-manager';
import { EnemyKite } from '../entities/enemy-kite';
import { PlayerKite } from '../entities/player-kite';
import { CollisionSystem } from '../systems/collision-system';
import { ScoringSystem } from '../systems/scoring-system';
import { WindSystem } from '../systems/wind-system';

import type { IGameResult } from '../../shared/types';

export class Level1Scene extends Phaser.Scene {
  private player!: PlayerKite;
  private enemies: EnemyKite[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private windSystem!: WindSystem;
  private collisionSystem!: CollisionSystem;
  private scoringSystem!: ScoringSystem;

  private hudTexts: {
    tension?: Phaser.GameObjects.Text;
    boost?: Phaser.GameObjects.Text;
    enemies?: Phaser.GameObjects.Text;
    tutorial?: Phaser.GameObjects.Text;
  } = {};

  private startTime: number = 0;
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'Level1Scene' });
  }

  shutdown() {
    // Clean up to prevent memory leaks
    this.enemies.forEach((enemy) => {
      if (enemy.active) {
        enemy.destroy();
      }
    });
    this.enemies = [];

    if (this.player && this.player.active) {
      this.player.destroy();
    }

    // Clear HUD texts
    Object.values(this.hudTexts).forEach((text) => {
      if (text && text.active) {
        text.destroy();
      }
    });
    this.hudTexts = {};
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background - cover mode (like CSS object-fit: cover)
    const bg = this.add.image(width / 2, height / 2, 'bg_lahore');
    bg.setOrigin(0.5, 0.5);
    
    // Calculate scale to cover screen while maintaining aspect ratio
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY); // Use larger scale to cover
    bg.setScale(scale);
    
    bg.setScrollFactor(0); // Fixed background, no parallax

    // Initialize systems
    this.windSystem = new WindSystem(0.5); // Gentle wind for Level 1
    this.collisionSystem = new CollisionSystem(this);
    this.scoringSystem = new ScoringSystem(1);

    // Create player
    this.player = new PlayerKite(this, width / 2, height - 150);

    // Create 2 enemies
    this.enemies.push(new EnemyKite(this, 300, 200, 'kite_enemy_1', 0.8));
    this.enemies.push(new EnemyKite(this, 900, 250, 'kite_enemy_2', 0.8));

    // Set up input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Create HUD
    this.createHUD();

    // Show tutorial hints
    this.showTutorialHints();

    this.startTime = this.time.now;
  }

  private createHUD() {
    const { width } = this.cameras.main;

    this.hudTexts.tension = this.add.text(20, 20, 'Tension: 0', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
    });

    this.hudTexts.boost = this.add.text(20, 50, 'Boost: Ready', {
      fontSize: '18px',
      color: '#00ff00',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
    });

    this.hudTexts.enemies = this.add.text(width - 20, 20, 'Enemies: 2', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 },
    });
    this.hudTexts.enemies.setOrigin(1, 0);
  }

  private showTutorialHints() {
    const { width, height } = this.cameras.main;

    this.hudTexts.tutorial = this.add.text(
      width / 2,
      height - 80,
      '← → Move | ↑ Pull String | ↓ Release | SPACE Boost\nCut both enemy kites to win!',
      {
        fontSize: '18px',
        color: '#FFD700',
        backgroundColor: '#00000088',
        padding: { x: 15, y: 10 },
        align: 'center',
      }
    );
    this.hudTexts.tutorial.setOrigin(0.5);

    // Hide tutorial after 8 seconds
    this.time.delayedCall(8000, () => {
      this.hudTexts.tutorial?.destroy();
    });
  }

  update(time: number) {
    if (this.gameOver) return;

    // Update player
    this.player.update(this.cursors, time);

    // Update enemies
    const aliveEnemies = this.enemies.filter((e) => e.alive);
    aliveEnemies.forEach((enemy) => {
      const isColliding = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      ) < 50;
      enemy.update(time, isColliding);
    });

    // Update wind system
    this.windSystem.update(time);

    // Apply wind to all kites
    if (this.player.alive) {
      this.windSystem.applyToKite(this.player.body as Phaser.Physics.Arcade.Body);
    }
    aliveEnemies.forEach((enemy) => {
      this.windSystem.applyToKite(enemy.body as Phaser.Physics.Arcade.Body);
    });

    // Check collisions
    const collision = this.collisionSystem.checkCollision(this.player, this.enemies);
    if (collision) {
      this.handleCollision(collision);
    }

    // Update HUD
    this.updateHUD(time);

    // Check win/lose conditions
    this.checkGameState();
  }

  private handleCollision(collision: {
    winner: 'player' | 'enemy';
    loser: EnemyKite | PlayerKite;
  }) {
    const { winner, loser } = collision;

    // Create spark effect
    this.collisionSystem.createSparkEffect(loser.x, loser.y);

    // Play sound effects
    const audioManager = AudioManager.getInstance();
    audioManager.playSparkSfx();
    audioManager.playCutSfx();

    // Cut the loser
    loser.cut();

    if (winner === 'player') {
      this.scoringSystem.addEnemyCut();
    } else {
      // Player lost
      this.endGame(false);
    }
  }

  private updateHUD(time: number) {
    if (this.hudTexts.tension) {
      this.hudTexts.tension.setText(`Tension: ${Math.round(this.player.tension)}`);
    }

    if (this.hudTexts.boost) {
      const canBoost = this.player.canBoost(time);
      this.hudTexts.boost.setText(`Boost: ${canBoost ? 'Ready' : 'Cooldown'}`);
      this.hudTexts.boost.setColor(canBoost ? '#00ff00' : '#ff0000');
    }

    if (this.hudTexts.enemies) {
      const aliveCount = this.enemies.filter((e) => e.alive).length;
      this.hudTexts.enemies.setText(`Enemies: ${aliveCount}`);
    }
  }

  private checkGameState() {
    if (this.gameOver) return;

    const aliveEnemies = this.enemies.filter((e) => e.alive).length;

    if (aliveEnemies === 0) {
      // Player won
      this.endGame(true);
    }
  }

  private endGame(survived: boolean) {
    this.gameOver = true;

    const timeElapsed = (this.time.now - this.startTime) / 1000;

    if (survived) {
      this.scoringSystem.addSurvivalBonus(timeElapsed);
    }

    const result: IGameResult = {
      level: 'level1',
      score: this.scoringSystem.getScore(),
      enemiesCut: this.scoringSystem.getEnemiesCut(),
      survived,
      timeElapsed,
    };

    // Delay before showing result
    this.time.delayedCall(1500, () => {
      const onResult = this.registry.get('onResult') as (result: IGameResult) => void;
      onResult(result);
    });
  }
}
