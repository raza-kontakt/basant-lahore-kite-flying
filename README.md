# Basant: Rooftops of Lahore 🪁

A 2D kite-flying game celebrating the vibrant Basant festival of Lahore, Pakistan. Built with React, TypeScript, and Phaser 3.

## 🎮 Game Features

- **Two Levels**: Progress from "First Basant" to "Rooftop Rivalry"
- **Kite Combat**: Strategic tension management and timing-based "pench" (string cutting)
- **Dynamic Wind System**: Adapt to changing wind conditions
- **Score Tracking**: High scores saved locally
- **Lahore Theme**: Placeholder assets ready for authentic Lahore visuals

## 🎯 Controls

- **← →** Move kite horizontally
- **↑** Pull string (increase tension)
- **↓** Release string (decrease tension)
- **SPACE** Boost (cooldown-based)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## 🎵 Adding Background Music

1. Place your music file at `public/audio/basant.mp3`
2. The game will auto-detect and play it (no code changes needed)
3. If the file is missing, the game runs normally without music

Supported format: MP3

## 🎨 Customizing Assets

Replace placeholder assets in `src/game/assets/lahore/`:

- `backgrounds/` - Rooftop skylines, Badshahi Mosque silhouettes
- `kites/` - Player and enemy kite sprites (PNG, 60×60px recommended)
- `fx/` - Spark effects for collisions

The game currently uses procedurally generated placeholders. Drop in your own PNG/JPG files and update the asset loading in `src/game/scenes/preload-scene.ts`.

## 📁 Project Structure

```
src/
├── app/                    # React shell
│   ├── components/         # Game container
│   └── screens/            # Menu, level select, settings, results
├── game/                   # Phaser game engine
│   ├── scenes/             # Boot, Preload, Level1, Level2
│   ├── entities/           # Player kite, enemy kite
│   ├── systems/            # Wind, collision, scoring
│   ├── audio/              # Audio manager (Howler.js)
│   └── assets/             # Placeholder generator + asset folders
└── shared/                 # Types, storage utilities
```

## 🎮 Gameplay Mechanics

### Tension System
- Higher tension = stronger attack
- Too much tension (>80) = risk of self-cut
- Balance offense and defense

### Pench (Collision)
- Kites must overlap for 3 frames to trigger
- Winner determined by tension + timing + small randomness
- Loser's kite falls with "Wo Kata!" animation

### Wind
- Periodic horizontal force affecting all kites
- Stronger in Level 2
- Adds unpredictability without being unfair

### Levels

**Level 1 - First Basant**
- 2 enemy kites
- Gentle wind
- Tutorial hints
- Win: Cut both enemies

**Level 2 - Rooftop Rivalry**
- 5 enemy kites
- Faster movement
- Stronger wind
- 1.5× score multiplier
- Win: Cut 3 enemies

## 🛠️ Tech Stack

- **React 19** - UI shell
- **TypeScript** - Type safety
- **Phaser 3** - Game engine
- **Howler.js** - Audio (optional)
- **Vite** - Build tool
- **LocalStorage** - High score persistence

## 📝 Development Notes

### Architecture
- React handles menus, settings, and game mounting
- Phaser handles all in-game logic and rendering
- Clean separation prevents memory leaks

### Performance
- Canvas scales responsively (FIT mode)
- Placeholder assets are lightweight base64
- No bundled music keeps initial load small

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES2022 support
- Audio autoplay requires user interaction (browser policy)

## 🐛 Known Limitations

- Desktop only (no mobile touch controls)
- Single-player only
- No kite customization (by design)
- Placeholder assets (replace with Lahore-specific art)

## 🎯 Future Enhancements (Out of Scope)

- ❌ Multiplayer
- ❌ Mobile support
- ❌ Kite types/upgrades
- ❌ Backend/accounts
- ❌ Realistic physics

This is intentionally a focused, completable project.

## 📄 License

MIT

## 🙏 Credits

Built as a tribute to the Basant festival and the rooftop kite battles of Lahore.

---

**For overseas Pakistanis missing home** 💛

Made with ❤️ for those who remember the yellow skies of Basant.
