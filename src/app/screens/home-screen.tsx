interface IHomeScreenProps {
  onPlay: () => void;
  onSettings: () => void;
}

const HomeScreen = ({ onPlay, onSettings }: IHomeScreenProps) => {
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
          fontSize: '4rem',
          color: '#8B4513',
          marginBottom: '1rem',
          textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        }}
      >
        Basant
      </h1>
      <h2
        style={{
          fontSize: '1.5rem',
          color: '#654321',
          marginBottom: '3rem',
          fontStyle: 'italic',
        }}
      >
        Rooftops of Lahore
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={onPlay}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.5rem',
            backgroundColor: '#8B4513',
            color: '#FFD700',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          Play
        </button>
        <button
          onClick={onSettings}
          style={{
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            backgroundColor: '#654321',
            color: '#FFD700',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          Settings
        </button>
      </div>

      <div
        style={{
          marginTop: '4rem',
          maxWidth: '600px',
          textAlign: 'center',
          color: '#654321',
          fontSize: '1rem',
          lineHeight: '1.6',
        }}
      >
        <h3 style={{ marginBottom: '0.5rem' }}>About Basant</h3>
        <p>
          Basant is the vibrant kite-flying festival celebrated in Lahore, Pakistan. Experience the
          thrill of rooftop kite battles, where skill and timing determine who cuts whose string.
          This game is a tribute to those golden memories.
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;
