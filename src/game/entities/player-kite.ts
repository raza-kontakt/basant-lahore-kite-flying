import Phaser from 'phaser';

import { AudioManager } from '../audio/audio-manager';

export class PlayerKite extends Phaser.GameObjects.Sprite {
  public vx: number = 0;
  public vy: number = 0;
  public tension: number = 0;
  public alive: boolean = true;
  public boostCooldownMs: number = 1000;
  public lastBoostAt: number = 0;

  private readonly moveSpeed: number = 200;
  private readonly boostSpeed: number = 400;
  private readonly tensionIncreaseRate: number = 0.5;
  private readonly tensionDecreaseRate: number = 0.3;
  
  private string!: Phaser.GameObjects.Graphics;
  private stringAnchorX: number;
  private floatOffset: number = 0;
  private floatSpeed: number = 0.002;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'kite_player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.25);
    this.setOrigin(0.5);
    this.setDepth(100);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setMaxVelocity(this.moveSpeed, 100);

    this.string = scene.add.graphics();
    this.string.setDepth(5);
    this.stringAnchorX = x;

    console.log('[Basant] PlayerKite created', {
      position: { x, y },
      scale: 0.25,
      moveSpeed: this.moveSpeed,
      boostSpeed: this.boostSpeed,
      boostCooldownMs: this.boostCooldownMs,
    });
  }

  public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, time: number) {
    if (!this.alive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Horizontal movement
    if (cursors.left.isDown) {
      body.setVelocityX(-this.moveSpeed);
      this.vx = -this.moveSpeed;
    } else if (cursors.right.isDown) {
      body.setVelocityX(this.moveSpeed);
      this.vx = this.moveSpeed;
    } else {
      body.setVelocityX(0);
      this.vx = 0;
    }

    // Vertical movement
    if (cursors.up.isDown) {
      body.setVelocityY(-this.moveSpeed);
      this.vy = -this.moveSpeed;
      // Increase tension when moving up
      this.tension = Math.min(100, this.tension + this.tensionIncreaseRate * 0.5);
    } else if (cursors.down.isDown) {
      body.setVelocityY(this.moveSpeed);
      this.vy = this.moveSpeed;
      // Decrease tension when moving down
      this.tension = Math.max(0, this.tension - this.tensionDecreaseRate * 0.5);
    } else {
      body.setVelocityY(0);
      this.vy = 0;
    }

    // Boost (space key)
    if (cursors.space?.isDown && time - this.lastBoostAt > this.boostCooldownMs) {
      this.lastBoostAt = time;
      const direction = body.velocity.x > 0 ? this.boostSpeed : -this.boostSpeed;
      body.setVelocityX(direction);
      console.log('[Basant] Boost used', {
        velocityX: direction,
        nextBoostAt: time + this.boostCooldownMs,
      });
      const audioManager = AudioManager.getInstance();
      audioManager.playBoostSfx();
    }

    // Remove tint to keep original kite colors
    this.clearTint();

    // Add natural floating/bobbing motion even when idle
    this.floatOffset += this.floatSpeed;
    const floatX = Math.sin(this.floatOffset) * 3; // Subtle horizontal drift
    const floatY = Math.cos(this.floatOffset * 1.3) * 2; // Subtle vertical bob
    
    // Apply floating motion when not actively moving
    if (Math.abs(body.velocity.x) < 10 && Math.abs(body.velocity.y) < 10) {
      body.setVelocityX(floatX * 10);
      body.setVelocityY(floatY * 10);
    }
    
    // Slight rotation based on velocity + natural sway
    const sway = Math.sin(this.floatOffset * 0.8) * 0.05;
    this.rotation = body.velocity.x * 0.001 + sway;
    
    // Update string with curve based on movement
    this.updateString();
  }

  private updateString() {
    const screenHeight = this.scene.cameras.main.height;
    
    // String anchor moves MUCH slower than kite (creates strong drag/lag effect)
    const targetAnchorX = this.x;
    this.stringAnchorX += (targetAnchorX - this.stringAnchorX) * 0.03; // Very slow follow
    
    // Calculate curve control points based on velocity and boost
    const body = this.body as Phaser.Physics.Arcade.Body;
    const isBoosting = Math.abs(body.velocity.x) > this.moveSpeed * 1.5;
    
    // String bends MORE when moving fast/boosting
    const bendMultiplier = isBoosting ? 1.5 : 1.0;
    const horizontalOffset = this.vx * 0.5 * bendMultiplier; // Stronger lag
    
    // Control point creates the curve
    const midX = this.stringAnchorX + (this.x - this.stringAnchorX) * 0.5 + horizontalOffset;
    const midY = (screenHeight + this.y) / 2;
    
    // Draw curved string using multiple line segments for smooth curve
    this.string.clear();
    
    // String thickness based on tension (thinner, sharper)
    const thickness = 0.8 + (this.tension / 100) * 0.7;
    
    // String color based on tension (gray to red)
    const tensionRatio = this.tension / 100;
    const red = Math.floor(128 + tensionRatio * 127);
    const green = Math.floor(128 * (1 - tensionRatio * 0.5));
    const blue = Math.floor(128 * (1 - tensionRatio * 0.5));
    const color = (red << 16) | (green << 8) | blue;
    
    this.string.lineStyle(thickness, color, 0.9);
    
    // Draw curve using multiple segments
    const segments = 10;
    this.string.beginPath();
    this.string.moveTo(this.stringAnchorX, screenHeight);
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      // Quadratic bezier formula
      const x = (1 - t) * (1 - t) * this.stringAnchorX + 2 * (1 - t) * t * midX + t * t * this.x;
      const y = (1 - t) * (1 - t) * screenHeight + 2 * (1 - t) * t * midY + t * t * this.y;
      this.string.lineTo(x, y);
    }
    
    this.string.strokePath();
  }

  public cut() {
    this.alive = false;
    console.log('[Basant] PlayerKite cut', {
      position: { x: Math.round(this.x), y: Math.round(this.y) },
      tension: Math.round(this.tension * 10) / 10,
    });
    this.setTint(0x888888);

    this.string.clear();
    this.string.setVisible(false);

    this.scene.tweens.add({
      targets: this,
      y: this.y + 200,
      rotation: this.rotation + Math.PI * 2,
      alpha: 0,
      duration: 1500,
      ease: 'Cubic.easeIn',
    });
  }

  public getAttackPower(): number {
    // Higher tension = higher attack but also higher risk
    return this.tension;
  }

  public canBoost(time: number): boolean {
    return time - this.lastBoostAt > this.boostCooldownMs;
  }
}
