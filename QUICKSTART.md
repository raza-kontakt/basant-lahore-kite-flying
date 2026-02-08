# Quick Start Guide

## 🚀 Run the Game (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# Visit http://localhost:5173
```

## 🎮 Play Now

1. Click **Play** on home screen
2. Select **Level 1** to start
3. Use arrow keys + space to fly your kite
4. Cut enemy kites to win!

## 🎵 Add Music (Optional)

```bash
# Place your MP3 file here:
public/audio/basant.mp3
```

The game will auto-detect and play it. If missing, game runs normally.

## 🎨 Replace Placeholder Assets (Optional)

Drop your own images into:
- `src/game/assets/lahore/backgrounds/` - Rooftop scenes
- `src/game/assets/lahore/kites/` - Kite sprites (60×60px PNG)
- `src/game/assets/lahore/fx/` - Spark effects

Then update `src/game/scenes/preload-scene.ts` to load them.

## 📦 Build for Production

```bash
npm run build
npm run preview
```

Output: `dist/` folder ready to deploy anywhere (Netlify, Vercel, GitHub Pages, etc.)

## 🐛 Troubleshooting

**Game won't start?**
- Check browser console (F12)
- Ensure Node.js 20.19+ or 22.12+
- Try `rm -rf node_modules && npm install`

**No sound?**
- Check Settings → Music/SFX volume
- Ensure `public/audio/basant.mp3` exists
- Browser may block autoplay until user interaction

**Performance issues?**
- Close other browser tabs
- Disable browser extensions
- Check if hardware acceleration is enabled

## 📖 Full Documentation

See [README.md](./README.md) for complete details.

---

**Enjoy the game!** 🪁💛
