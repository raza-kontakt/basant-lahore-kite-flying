import Phaser from 'phaser';

import { AudioManager } from '../audio/audio-manager';
import { EnemyKite } from '../entities/enemy-kite';
import { PlayerKite } from '../entities/player-kite';
import { CollisionSystem } from '../systems/collision-system';
import { ScoringSystem } from '../systems/scoring-system';
import { WindSystem } from '../systems/wind-system';

import type { IGameResult } from '../../shared/types';

export class Level2Scene extends Phaser.Scene {
  private player!: PlayerKite;
  private enemies: EnemyKite[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private windSystem!: WindSystem;
  private collisionSystem!: CollisionSystem;
  private scoringSystem!: ScoringSystem;

  private hudTexts: {
    score?: Phaser.GameObjects.Text;
    highScore?: Phaser.GameObjects.Text;
  } = {};

  private startTime: number = 0;
  private gameOver: boolean = false;
  private lastLogTime: number = 0;
  private readonly logIntervalMs: number = 2000;

  // Level 2 win condition: Cut 3 enemies
  private readonly winConditionCuts: number = 3;

  constructor() {
    super({ key: 'Level2Scene' });
  }

  shutdown() {
    console.log('[Basant] Level2Scene shutdown', {
      enemiesCount: this.enemies.length,
      gameOver: this.gameOver,
      finalScore: this.scoringSystem?.getScore() ?? 0,
      enemiesCut: this.scoringSystem?.getEnemiesCut() ?? 0,
    });
    this.enemies.forEach((enemy) => {
      if (enemy.active) {
        enemy.destroy();
      }
    });
    this.enemies = [];

    if (this.player && this.player.active) {
      this.player.destroy();
    }

    Object.values(this.hudTexts).forEach((text) => {
      if (text && text.active) {
        text.destroy();
      }
    });
    this.hudTexts = {};
  }

  create() {
    const { width, height } = this.cameras.main;
    console.log('[Basant] Level2Scene create started', { width, height });

    // Background - cover mode (like CSS object-fit: cover)
    const bg = this.add.image(width / 2, height / 2, 'bg_lahore');
    bg.setOrigin(0.5, 0.5);
    
    // Calculate scale to cover screen while maintaining aspect ratio
    const scaleX = width / bg.width;
    const scaleY = height / bg.height;
    const scale = Math.max(scaleX, scaleY); // Use larger scale to cover
    bg.setScale(scale);
    
    bg.setScrollFactor(0); // Fixed background, no parallax

    // Initialize systems with harder settings
    this.windSystem = new WindSystem(1.2); // Stronger wind
    this.collisionSystem = new CollisionSystem(this);
    this.scoringSystem = new ScoringSystem(1.5); // 1.5x score multiplier

    // Create player
    this.player = new PlayerKite(this, width / 2, height - 150);

    // Create 5 enemies spread across the screen width
    const spacing = width / 6;
    const enemyPositions = [
      [spacing * 1, 150, 'kite_enemy_1'],
      [spacing * 2, 200, 'kite_enemy_2'],
      [spacing * 3, 180, 'kite_enemy_3'],
      [spacing * 4, 220, 'kite_enemy_4'],
      [spacing * 5, 190, 'kite_enemy_1'],
    ];
    enemyPositions.forEach(([x, y, texture]) => {
      this.enemies.push(new EnemyKite(this, x as number, y as number, texture as string, 1.2));
    });
    console.log('[Basant] Level 2 started', {
      playerPosition: { x: width / 2, y: height - 150 },
      enemyCount: this.enemies.length,
      winConditionCuts: this.winConditionCuts,
      windStrength: 1.2,
      scoreMultiplier: 1.5,
    });

    // Set up input
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Create HUD
    this.createHUD();

    this.startTime = this.time.now;
  }

  private createHUD() {
    const { width } = this.cameras.main;

    let highScore = 0;
    try {
      const stored = localStorage.getItem('basant_game_data');
      if (stored) {
        const data = JSON.parse(stored);
        highScore = data.highScores?.level2 || 0;
      }
    } catch (error) {
      console.warn('[Basant] Failed to load high score:', error);
    }
    console.log('[Basant] HUD created', { highScore, storageKey: 'basant_game_data' });

    // Score display (top right)
    this.hudTexts.score = this.add.text(width - 20, 20, 'Score: 0', {
      fontSize: '28px',
      color: '#FFD700',
      backgroundColor: '#00000088',
      padding: { x: 15, y: 8 },
      fontStyle: 'bold',
    });
    this.hudTexts.score.setOrigin(1, 0);

    // High score display (below current score)
    this.hudTexts.highScore = this.add.text(width - 20, 60, `Best: ${highScore}`, {
      fontSize: '20px',
      color: '#FFA500',
      backgroundColor: '#00000088',
      padding: { x: 15, y: 5 },
    });
    this.hudTexts.highScore.setOrigin(1, 0);
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

    // Throttled state log
    if (time - this.lastLogTime > this.logIntervalMs) {
      this.lastLogTime = time;
      const elapsed = ((time - this.startTime) / 1000).toFixed(1);
      console.log('[Basant] Game state', {
        elapsedSec: elapsed,
        score: this.scoringSystem.getScore(),
        enemiesCut: this.scoringSystem.getEnemiesCut(),
        aliveEnemies: aliveEnemies.length,
        playerAlive: this.player.alive,
      });
    }

    // Check win/lose conditions
    this.checkGameState();
  }

  private handleCollision(collision: {
    winner: 'player' | 'enemy';
    loser: EnemyKite | PlayerKite;
  }) {
    const { winner, loser } = collision;
    const loserName = loser === this.player ? 'player' : (loser as EnemyKite).name;
    console.log('[Basant] Pench! Handling collision', {
      winner,
      loser: loserName,
      loserPosition: { x: Math.round(loser.x), y: Math.round(loser.y) },
    });

    this.collisionSystem.createSparkEffect(loser.x, loser.y);

    const audioManager = AudioManager.getInstance();
    audioManager.playSparkSfx();
    audioManager.playCutSfx();
    console.log('[Basant] Spark + cut SFX played');

    loser.cut();

    if (winner === 'player') {
      this.scoringSystem.addEnemyCut();
    } else {
      console.log('[Basant] Player cut (Wo Kata!) – triggering endGame(false)');
      this.endGame(false);
    }
  }

  private updateHUD(time: number) {
    if (this.hudTexts.score) {
      this.hudTexts.score.setText(`Score: ${this.scoringSystem.getScore()}`);
    }
  }

  private checkGameState() {
    if (this.gameOver) return;

    // Win condition: Cut 3 enemies
    if (this.scoringSystem.getEnemiesCut() >= this.winConditionCuts) {
      console.log('[Basant] Victory! All kites cut');
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
      level: 'level2',
      score: this.scoringSystem.getScore(),
      enemiesCut: this.scoringSystem.getEnemiesCut(),
      survived,
      timeElapsed,
    };

    // Show victory/defeat message briefly
    const { width, height } = this.cameras.main;
    const message = this.add.text(
      width / 2,
      height / 2,
      survived ? `Victory!\nScore: ${result.score}` : 'Wo Kata!',
      {
        fontSize: survived ? '48px' : '64px',
        color: survived ? '#FFD700' : '#FF0000',
        backgroundColor: '#00000099',
        padding: { x: 30, y: 20 },
        align: 'center',
        fontStyle: 'bold',
      }
    );
    message.setOrigin(0.5);
    message.setDepth(1000);

    console.log('[Basant] Game over', {
      survived,
      score: result.score,
      enemiesCut: result.enemiesCut,
      timeElapsed: result.timeElapsed.toFixed(2),
      message: survived ? 'Victory!' : 'Wo Kata!',
    });
    console.log('[Basant] Scheduling onResult in 2s then reload');

    this.time.delayedCall(2000, () => {
      const onResult = this.registry.get('onResult') as (result: IGameResult) => void;
      onResult(result);
    });
  }
}
