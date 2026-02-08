import type { IGameResult } from '../../shared/types';

interface IResultScreenProps {
  result: IGameResult;
  onRetry: () => void;
  onNextLevel: () => void;
  onMenu: () => void;
}

const ResultScreen = ({ result, onRetry, onNextLevel, onMenu }: IResultScreenProps) => {
  const isLevel1 = result.level === 'level1';
  const showNextLevel = isLevel1 && result.survived;

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: result.survived
          ? 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)'
          : 'linear-gradient(180deg, #8B4513 0%, #654321 100%)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '4rem',
          color: result.survived ? '#8B4513' : '#FFD700',
          marginBottom: '1rem',
          textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        }}
      >
        {result.survived ? 'Victory!' : 'Wo Kata!'}
      </h1>

      <div
        style={{
          padding: '2rem',
          backgroundColor: result.survived ? '#FFF8DC' : '#8B4513',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          textAlign: 'center',
          minWidth: '350px',
          marginBottom: '2rem',
        }}
      >
        <h2
          style={{
            color: result.survived ? '#8B4513' : '#FFD700',
            marginBottom: '1.5rem',
          }}
        >
          {isLevel1 ? 'Level 1' : 'Level 2'} Complete
        </h2>

        <div style={{ marginBottom: '1rem' }}>
          <p
            style={{
              fontSize: '1.5rem',
              color: result.survived ? '#654321' : '#FFA500',
              fontWeight: 'bold',
            }}
          >
            Score: {result.score}
          </p>
        </div>

        <div style={{ fontSize: '1rem', color: result.survived ? '#654321' : '#FFD700' }}>
          <p>Enemies Cut: {result.enemiesCut}</p>
          <p>Time: {Math.round(result.timeElapsed)}s</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={onRetry}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1.2rem',
            backgroundColor: '#8B4513',
            color: '#FFD700',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Retry
        </button>

        {showNextLevel && (
          <button
            onClick={onNextLevel}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1.2rem',
              backgroundColor: '#228B22',
              color: '#FFD700',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Next Level
          </button>
        )}

        <button
          onClick={onMenu}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: '#654321',
            color: '#FFD700',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
