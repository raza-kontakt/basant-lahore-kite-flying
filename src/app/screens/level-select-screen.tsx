import { getHighScore } from '../../shared/storage';

import type { TLevel } from '../../shared/types';

interface ILevelSelectScreenProps {
  onSelectLevel: (level: TLevel) => void;
  onBack: () => void;
}

const LevelSelectScreen = ({ onSelectLevel, onBack }: ILevelSelectScreenProps) => {
  const level1HighScore = getHighScore('level1');
  const level2HighScore = getHighScore('level2');

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          color: '#8B4513',
          marginBottom: '3rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        Select Level
      </h1>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div
          style={{
            padding: '2rem',
            backgroundColor: '#FFF8DC',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textAlign: 'center',
            minWidth: '250px',
          }}
        >
          <h2 style={{ color: '#8B4513', marginBottom: '1rem' }}>Level 1</h2>
          <p style={{ color: '#654321', marginBottom: '0.5rem' }}>First Basant</p>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
            2 enemies • Tutorial
          </p>
          <p style={{ fontSize: '0.9rem', color: '#654321', marginBottom: '1rem' }}>
            High Score: {level1HighScore}
          </p>
          <button
            onClick={() => onSelectLevel('level1')}
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
            Play
          </button>
        </div>

        <div
          style={{
            padding: '2rem',
            backgroundColor: '#FFF8DC',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            textAlign: 'center',
            minWidth: '250px',
          }}
        >
          <h2 style={{ color: '#8B4513', marginBottom: '1rem' }}>Level 2</h2>
          <p style={{ color: '#654321', marginBottom: '0.5rem' }}>Rooftop Rivalry</p>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>
            4-5 enemies • Harder
          </p>
          <p style={{ fontSize: '0.9rem', color: '#654321', marginBottom: '1rem' }}>
            High Score: {level2HighScore}
          </p>
          <button
            onClick={() => onSelectLevel('level2')}
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
            Play
          </button>
        </div>
      </div>

      <button
        onClick={onBack}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#654321',
          color: '#FFD700',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '2rem',
        }}
      >
        Back to Menu
      </button>
    </div>
  );
};

export default LevelSelectScreen;
