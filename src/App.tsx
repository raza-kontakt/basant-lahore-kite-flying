import GameContainer from './app/components/game-container';
import { saveHighScore } from './shared/storage';

import type { IGameConfig, IGameResult } from './shared/types';

const App = () => {
  const handleGameResult = (result: IGameResult) => {
    console.log('[Basant] App handleGameResult', {
      level: result.level,
      score: result.score,
      enemiesCut: result.enemiesCut,
      survived: result.survived,
      timeElapsed: result.timeElapsed,
    });
    saveHighScore(result.level, result.score);
    console.log('[Basant] High score persisted; reloading in a moment');
    window.location.reload();
  };

  const gameConfig: IGameConfig = {
    level: 'level2',
    musicEnabled: true,
    musicVolume: 0.7,
    sfxVolume: 0.8,
  };

  return (
    <GameContainer
      config={gameConfig}
      onExit={() => {}} // No exit needed
      onResult={handleGameResult}
    />
  );
};

export default App;
