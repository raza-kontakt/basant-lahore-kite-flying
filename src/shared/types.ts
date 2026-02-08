export type TLevel = 'level1' | 'level2';

export type TGameState = 'menu' | 'playing' | 'paused' | 'result';

export interface IGameConfig {
  level: TLevel;
  musicEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export interface IGameResult {
  level: TLevel;
  score: number;
  enemiesCut: number;
  survived: boolean;
  timeElapsed: number;
}

export interface IKiteState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tension: number;
  alive: boolean;
  boostCooldownMs: number;
  lastBoostAt: number;
}
