import { useState } from 'react';

import { getSettings, saveSettings } from '../../shared/storage';

interface ISettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen = ({ onBack }: ISettingsScreenProps) => {
  const settings = getSettings();
  const [musicEnabled, setMusicEnabled] = useState(settings.musicEnabled);
  const [musicVolume, setMusicVolume] = useState(settings.musicVolume);
  const [sfxVolume, setSfxVolume] = useState(settings.sfxVolume);

  const handleSave = () => {
    saveSettings({
      musicEnabled,
      musicVolume,
      sfxVolume,
    });
    onBack();
  };

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
        Settings
      </h1>

      <div
        style={{
          padding: '2rem',
          backgroundColor: '#FFF8DC',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          minWidth: '400px',
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: '#654321',
              fontSize: '1.2rem',
            }}
          >
            <input
              type="checkbox"
              checked={musicEnabled}
              onChange={(e) => setMusicEnabled(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            Background Music
          </label>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.5rem', marginLeft: '2rem' }}>
            Background music is bundled from src/game/audio/basant.mp3
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              display: 'block',
              color: '#654321',
              fontSize: '1.2rem',
              marginBottom: '0.5rem',
            }}
          >
            Music Volume: {Math.round(musicVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            disabled={!musicEnabled}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label
            style={{
              display: 'block',
              color: '#654321',
              fontSize: '1.2rem',
              marginBottom: '0.5rem',
            }}
          >
            Sound Effects: {Math.round(sfxVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={sfxVolume}
            onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={handleSave}
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
            Save
          </button>
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
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
