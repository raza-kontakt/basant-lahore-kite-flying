const STORAGE_KEY = 'basant_game_data';

interface IStorageData {
  highScores: {
    level1: number;
    level2: number;
  };
  settings: {
    musicEnabled: boolean;
    musicVolume: number;
    sfxVolume: number;
  };
}

const DEFAULT_DATA: IStorageData = {
  highScores: {
    level1: 0,
    level2: 0,
  },
  settings: {
    musicEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
  },
};

export const loadGameData = (): IStorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_DATA, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load game data:', error);
  }
  return DEFAULT_DATA;
};

export const saveGameData = (data: Partial<IStorageData>): void => {
  try {
    const current = loadGameData();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save game data:', error);
  }
};

export const getHighScore = (level: 'level1' | 'level2'): number => {
  return loadGameData().highScores[level];
};

export const saveHighScore = (level: 'level1' | 'level2', score: number): void => {
  const current = loadGameData();
  const previousHigh = current.highScores[level];
  if (score > previousHigh) {
    saveGameData({
      highScores: {
        ...current.highScores,
        [level]: score,
      },
    });
    console.log('[Basant] Storage: high score updated', {
      level,
      previousHigh,
      newHigh: score,
      key: STORAGE_KEY,
    });
  } else {
    console.log('[Basant] Storage: high score unchanged', {
      level,
      currentHigh: previousHigh,
      score,
    });
  }
};

export const getSettings = () => {
  return loadGameData().settings;
};

export const saveSettings = (settings: Partial<IStorageData['settings']>): void => {
  const current = loadGameData();
  saveGameData({
    settings: {
      ...current.settings,
      ...settings,
    },
  });
};
