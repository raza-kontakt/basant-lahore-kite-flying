import Phaser from 'phaser';

export class WindSystem {
  private windForceX: number = 0;
  private windForceY: number = 0;
  private windChangeInterval: number = 2000; // More frequent changes
  private lastWindChange: number = 0;
  private windStrength: number = 1;
  private gustTimer: number = 0;
  private isGusting: boolean = false;

  constructor(windStrength: number = 1) {
    this.windStrength = windStrength;
    this.windForceX = Phaser.Math.Between(-40, 40) * windStrength;
    this.windForceY = Phaser.Math.Between(-15, 15) * windStrength;
    console.log('[Basant] WindSystem created', {
      windStrength,
      initialForceX: Math.round(this.windForceX),
      initialForceY: Math.round(this.windForceY),
      changeIntervalMs: 2000,
    });
  }

  public update(time: number) {
    if (time - this.lastWindChange > this.windChangeInterval) {
      this.lastWindChange = time;
      const isGust = Phaser.Math.Between(0, 100) < 20;

      if (isGust) {
        this.isGusting = true;
        this.gustTimer = time;
        this.windForceX = Phaser.Math.Between(-80, 80) * this.windStrength;
        this.windForceY = Phaser.Math.Between(-30, 30) * this.windStrength;
        console.log('[Basant] Wind gust started', {
          forceX: Math.round(this.windForceX),
          forceY: Math.round(this.windForceY),
        });
      } else {
        this.isGusting = false;
        const prevX = this.windForceX;
        const prevY = this.windForceY;
        this.windForceX = Phaser.Math.Between(-40, 40) * this.windStrength;
        this.windForceY = Phaser.Math.Between(-15, 15) * this.windStrength;
        console.log('[Basant] Wind direction changed', {
          prevForceX: Math.round(prevX),
          prevForceY: Math.round(prevY),
          forceX: Math.round(this.windForceX),
          forceY: Math.round(this.windForceY),
        });
      }
    }

    if (this.isGusting && time - this.gustTimer > 500) {
      this.isGusting = false;
      this.windForceX *= 0.5;
      this.windForceY *= 0.5;
      console.log('[Basant] Wind gust faded', {
        forceX: Math.round(this.windForceX),
        forceY: Math.round(this.windForceY),
      });
    }
  }

  public applyToKite(body: Phaser.Physics.Arcade.Body, addRandomFloat: boolean = true) {
    // Apply main wind force
    body.setAccelerationX(this.windForceX);
    body.setAccelerationY(this.windForceY * 0.5); // Less vertical wind
    
    // Add natural floating/bobbing motion (small random forces)
    if (addRandomFloat) {
      const floatX = Phaser.Math.Between(-10, 10);
      const floatY = Phaser.Math.Between(-8, 8);
      body.setAccelerationX(body.acceleration.x + floatX);
      body.setAccelerationY(body.acceleration.y + floatY);
    }
  }

  public getWindForce(): number {
    return this.windForceX;
  }
  
  public isGustActive(): boolean {
    return this.isGusting;
  }
}
