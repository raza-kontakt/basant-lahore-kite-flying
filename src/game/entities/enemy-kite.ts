import Phaser from 'phaser';

export class EnemyKite extends Phaser.GameObjects.Sprite {
  public vx: number = 0;
  public vy: number = 0;
  public tension: number = 30;
  public alive: boolean = true;

  private readonly moveSpeed: number;
  private readonly aiUpdateInterval: number = 800;
  private lastAiUpdate: number = 0;
  private targetVx: number = 0;
  private targetVy: number = 0;
  private string!: Phaser.GameObjects.Graphics;
  private stringAnchorX: number;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, speedMultiplier = 1) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.moveSpeed = 100 * speedMultiplier;
    this.setScale(0.25); // Bigger (was 0.15)
    this.setOrigin(0.5);

    // Set up physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);
    body.setBounce(1, 1); // Bounce on all edges
    body.setMaxVelocity(this.moveSpeed, this.moveSpeed);

    this.targetVx = Phaser.Math.Between(0, 1) === 0 ? -this.moveSpeed : this.moveSpeed;
    this.targetVy = Phaser.Math.Between(-this.moveSpeed * 0.5, this.moveSpeed * 0.5);

    this.string = scene.add.graphics();
    this.string.setDepth(5);
    this.stringAnchorX = x;

    console.log('[Basant] EnemyKite created', {
      name: this.name,
      texture,
      position: { x, y },
      scale: 0.25,
      moveSpeed: this.moveSpeed,
      initialTension: this.tension,
    });
  }

  public update(time: number, isColliding: boolean) {
    if (!this.alive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (time - this.lastAiUpdate > this.aiUpdateInterval) {
      this.lastAiUpdate = time;
      const prevVx = this.targetVx;
      const prevVy = this.targetVy;
      const prevTension = this.tension;

      const horizontalDecision = Phaser.Math.Between(0, 100);
      if (horizontalDecision < 35) {
        this.targetVx = -this.moveSpeed;
      } else if (horizontalDecision < 70) {
        this.targetVx = this.moveSpeed;
      } else {
        this.targetVx = Phaser.Math.Between(-this.moveSpeed * 0.5, this.moveSpeed * 0.5);
      }

      const verticalDecision = Phaser.Math.Between(0, 100);
      if (verticalDecision < 30) {
        this.targetVy = -this.moveSpeed * 0.6;
      } else if (verticalDecision < 60) {
        this.targetVy = this.moveSpeed * 0.4;
      } else {
        this.targetVy = Phaser.Math.Between(-this.moveSpeed * 0.3, this.moveSpeed * 0.3);
      }

      if (isColliding) {
        this.tension = Math.min(100, this.tension + Phaser.Math.Between(5, 15));
      } else {
        this.tension = Phaser.Math.Between(20, 60);
      }

      console.log('[Basant] EnemyKite AI update', {
        name: this.name,
        targetVx: Math.round(this.targetVx),
        targetVy: Math.round(this.targetVy),
        prevVx: Math.round(prevVx),
        prevVy: Math.round(prevVy),
        tension: this.tension,
        prevTension: prevTension,
        isColliding,
      });
    }

    // Apply movement (both horizontal and vertical)
    body.setVelocityX(this.targetVx);
    body.setVelocityY(this.targetVy);
    this.vx = body.velocity.x;
    this.vy = body.velocity.y;

    // Slight rotation based on velocity
    this.rotation = body.velocity.x * 0.001;
    
    // Update string with curve
    this.updateString();
  }

  private updateString() {
    const screenHeight = this.scene.cameras.main.height;
    
    // String anchor moves slower than kite (creates drag effect)
    const targetAnchorX = this.x;
    this.stringAnchorX += (targetAnchorX - this.stringAnchorX) * 0.04; // Slow follow
    
    // Calculate curve control points based on velocity
    const horizontalOffset = this.vx * 0.4; // String bends with movement
    const midX = this.stringAnchorX + (this.x - this.stringAnchorX) * 0.5 + horizontalOffset;
    const midY = (screenHeight + this.y) / 2;
    
    // Draw curved string using multiple segments (thinner)
    this.string.clear();
    this.string.lineStyle(0.8, 0x808080, 0.7);
    
    const segments = 8;
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
    console.log('[Basant] EnemyKite cut', {
      name: this.name,
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
      onComplete: () => {
        this.destroy();
      },
    });
  }

  public getAttackPower(): number {
    return this.tension;
  }
}
