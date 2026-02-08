// Generate simple placeholder images for development
// These will be replaced with actual Lahore-themed assets later

export const generatePlaceholderKite = (color: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 400; // Much larger to match real kites
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;

  const centerX = 200;
  const centerY = 200;
  const size = 180;

  // Draw diamond kite shape
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - size);
  ctx.lineTo(centerX + size, centerY);
  ctx.lineTo(centerX, centerY + size);
  ctx.lineTo(centerX - size, centerY);
  ctx.closePath();
  ctx.fill();

  // Add border
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Add cross pattern
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - size);
  ctx.lineTo(centerX, centerY + size);
  ctx.moveTo(centerX - size, centerY);
  ctx.lineTo(centerX + size, centerY);
  ctx.stroke();

  // Add some decorative patterns
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(centerX - 20, centerY - 20, 40, 40);
  
  return canvas.toDataURL();
};

export const generatePlaceholderSpark = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;

  // Draw spark/star shape
  const centerX = 16;
  const centerY = 16;
  const spikes = 8;
  const outerRadius = 15;
  const innerRadius = 7;

  ctx.fillStyle = '#FFD700';
  ctx.beginPath();

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();

  return canvas.toDataURL();
};

export const generatePlaceholderBackground = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  // Sky gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 720);
  gradient.addColorStop(0, '#87CEEB');
  gradient.addColorStop(0.7, '#FFD700');
  gradient.addColorStop(1, '#FFA500');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1280, 720);

  // Add some clouds
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(200, 100, 60, 0, Math.PI * 2);
  ctx.arc(240, 90, 50, 0, Math.PI * 2);
  ctx.arc(280, 100, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(800, 150, 70, 0, Math.PI * 2);
  ctx.arc(850, 140, 60, 0, Math.PI * 2);
  ctx.arc(900, 150, 65, 0, Math.PI * 2);
  ctx.fill();

  // Simple rooftop silhouettes with more detail
  ctx.fillStyle = '#8B4513';

  // Left building
  ctx.fillRect(0, 500, 300, 220);
  ctx.fillRect(50, 480, 80, 20);
  // Water tank
  ctx.fillStyle = '#A0522D';
  ctx.fillRect(180, 460, 60, 40);
  ctx.fillStyle = '#8B4513';

  // Middle building
  ctx.fillRect(350, 450, 400, 270);
  ctx.fillRect(450, 430, 100, 20);
  ctx.fillRect(600, 430, 80, 20);

  // Right building
  ctx.fillRect(800, 520, 480, 200);
  ctx.fillRect(900, 500, 100, 20);
  // Antenna
  ctx.fillStyle = '#654321';
  ctx.fillRect(1050, 480, 5, 40);
  ctx.fillRect(1035, 480, 35, 5);

  // Add windows with lights
  ctx.fillStyle = '#654321';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const x = 400 + i * 60;
      const y = 480 + j * 60;
      ctx.fillRect(x, y, 40, 40);
      // Some windows lit
      if ((i + j) % 2 === 0) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 5, y + 5, 30, 30);
        ctx.fillStyle = '#654321';
      }
    }
  }

  // Add kite strings in the sky
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(100 + i * 150, 720);
    ctx.lineTo(150 + i * 150, 200 + Math.random() * 100);
    ctx.stroke();
  }

  return canvas.toDataURL();
};

export const generatePlaceholderBackgroundFar = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  // Transparent background
  ctx.clearRect(0, 0, 1280, 720);

  // Distant buildings/mosque silhouette
  ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
  
  // Mosque dome
  ctx.beginPath();
  ctx.arc(640, 550, 80, Math.PI, 0);
  ctx.fill();
  
  // Minarets
  ctx.fillRect(520, 500, 30, 150);
  ctx.fillRect(730, 500, 30, 150);
  
  // Minaret tops
  ctx.beginPath();
  ctx.arc(535, 500, 20, Math.PI, 0);
  ctx.arc(745, 500, 20, Math.PI, 0);
  ctx.fill();

  return canvas.toDataURL();
};
