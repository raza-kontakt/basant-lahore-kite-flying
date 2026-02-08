export class ScoringSystem {
  private score: number = 0;
  private multiplier: number = 1;
  private enemiesCut: number = 0;

  constructor(multiplier: number = 1) {
    this.multiplier = multiplier;
    console.log('[Basant] ScoringSystem created', { multiplier, pointsPerCut: 100 * multiplier });
  }

  public addEnemyCut() {
    this.enemiesCut++;
    const points = 100 * this.multiplier;
    this.score += points;
    console.log('[Basant] Score updated (enemy cut)', {
      enemiesCut: this.enemiesCut,
      points,
      totalScore: this.score,
      multiplier: this.multiplier,
    });
  }

  public addSurvivalBonus(seconds: number) {
    const bonus = Math.floor(seconds * 10 * this.multiplier);
    this.score += bonus;
    console.log('[Basant] Survival bonus applied', {
      seconds,
      bonus,
      totalScore: this.score,
      formula: `floor(${seconds} * 10 * ${this.multiplier})`,
    });
  }

  public getScore(): number {
    return this.score;
  }

  public getEnemiesCut(): number {
    return this.enemiesCut;
  }

  public getMultiplier(): number {
    return this.multiplier;
  }
}

