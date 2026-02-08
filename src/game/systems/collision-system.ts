import Phaser from 'phaser';

import type { EnemyKite } from '../entities/enemy-kite';
import type { PlayerKite } from '../entities/player-kite';

export class CollisionSystem {
  private scene: Phaser.Scene;
  private collisionFrames: Map<string, number> = new Map();
  private readonly collisionThreshold: number = 1; // Instant collision (was 3)

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    console.log('[Basant] CollisionSystem created', {
      collisionThreshold: 1,
      detectionRadius: 100,
    });
  }

  public checkCollision(
    player: PlayerKite,
    enemies: EnemyKite[]
  ): { winner: 'player' | 'enemy'; loser: EnemyKite | PlayerKite } | null {
    if (!player.alive) {
      return null;
    }

    const aliveEnemies = enemies.filter((e) => e.alive);
    for (const enemy of aliveEnemies) {
      const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
      const collisionKey = `player-${enemy.name}`;

      if (distance < 100) {
        const frames = (this.collisionFrames.get(collisionKey) || 0) + 1;
        this.collisionFrames.set(collisionKey, frames);

        if (frames >= this.collisionThreshold) {
          this.collisionFrames.delete(collisionKey);
          const outcome = this.resolvePench(player, enemy);
          console.log('[Basant] Collision resolved (pench)', {
            enemy: enemy.name,
            distance: Math.round(distance * 10) / 10,
            winner: outcome.winner,
            loser: outcome.loser === player ? 'player' : enemy.name,
            playerPower: player.getAttackPower(),
            enemyPower: enemy.getAttackPower(),
          });
          return outcome;
        }
      } else {
        const hadFrames = this.collisionFrames.has(collisionKey);
        this.collisionFrames.delete(collisionKey);
        if (hadFrames) {
          console.log('[Basant] Collision cancelled (kites separated)', {
            enemy: enemy.name,
            distance: Math.round(distance * 10) / 10,
          });
        }
      }
    }

    return null;
  }

  private resolvePench(
    player: PlayerKite,
    enemy: EnemyKite
  ): { winner: 'player' | 'enemy'; loser: EnemyKite | PlayerKite } {
    const playerPower = player.getAttackPower();
    const enemyPower = enemy.getAttackPower();
    const randomFactor = Phaser.Math.Between(-5, 5);
    const playerScore = playerPower + randomFactor + 15;
    const enemyScore = enemyPower + randomFactor;
    const winner: 'player' | 'enemy' = playerScore >= enemyScore ? 'player' : 'enemy';
    const loser = winner === 'player' ? enemy : player;

    console.log('[Basant] resolvePench', {
      playerPower: Math.round(playerPower * 10) / 10,
      enemyPower: Math.round(enemyPower * 10) / 10,
      randomFactor,
      playerScore: Math.round(playerScore * 10) / 10,
      enemyScore: Math.round(enemyScore * 10) / 10,
      playerBonus: 15,
      winner,
    });

    return { winner, loser };
  }

  public createSparkEffect(x: number, y: number) {
    console.log('[Basant] Spark effect created', { x: Math.round(x), y: Math.round(y) });
    // Create multiple spark particles for better effect
    for (let i = 0; i < 5; i++) {
      const spark = this.scene.add.sprite(x, y, 'spark');
      spark.setScale(0.3);
      spark.setRotation(Phaser.Math.Between(0, 360) * (Math.PI / 180));

      const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
      const distance = Phaser.Math.Between(20, 60);

      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        scale: 1.2,
        alpha: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => {
          spark.destroy();
        },
      });
    }

    // Main spark
    const mainSpark = this.scene.add.sprite(x, y, 'spark');
    mainSpark.setScale(0.5);

    this.scene.tweens.add({
      targets: mainSpark,
      scale: 2,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        mainSpark.destroy();
      },
    });
  }
}
