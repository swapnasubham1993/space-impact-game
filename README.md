# 🚀 Space Impact - HD Edition

A modern, browser-based space shooter inspired by Nokia's legendary **Space Impact**. Built with pure HTML5 Canvas, featuring HD graphics (1280×720), 12 diverse power-ups, mobile touch controls, and smooth 60 FPS gameplay.

[![Play Now](https://img.shields.io/badge/Play-Now-brightgreen?style=for-the-badge)](https://swapnasubham1993.github.io/space-impact-game/)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Dependencies](https://img.shields.io/badge/Dependencies-None-blue)](package.json)

---

## ✨ Features

### 🎮 Gameplay
- **5 Challenging Levels** with progressive difficulty
- **6 Enemy Types** + Epic boss battles
- **12 Power-Ups**: Health, Weapons, Shield, Speed, Laser, Homing Missiles, Time Slow, Bomb, Magnet, Multishot, Barrier, Rage Mode
- **Advanced Weapon System** with multiple firing modes
- **Particle Effects** - Explosions, trails, and visual polish
- **High Score System** with local persistence

### 🖥️ Desktop & 📱 Mobile Support
- **Desktop**: Full HD 1280×720 resolution with keyboard controls
- **Mobile**: Touch controls with joystick + fire button
- **Responsive**: Auto-detects touch devices and adapts UI
- **Cross-Platform**: Works on all modern browsers

### 🎨 Enhanced Graphics
- **HD Resolution** optimized for modern displays
- **Gradient Effects** with smooth color transitions
- **Glow & Shadows** for depth and atmosphere
- **Animated UI** with smooth transitions
- **Particle Systems** for explosions and effects

### 🔧 Technical
- **Pure Vanilla JavaScript** - Zero dependencies
- **ES6 Modules** - Clean, modular architecture
- **Canvas Rendering** - Optimized 60 FPS performance
- **Web Audio API** - Retro sound effects
- **LocalStorage** - Save high scores locally

---

## 🚀 Quick Start

### Play Online
Visit the deployed game: [Play Space Impact](https://swapnasubham1993.github.io/space-impact-game/)

### Run Locally

1. **Clone the repository**
```bash
git clone https://github.com/swapnasubham1993/space-impact-game.git
cd space-impact-game
```

2. **Start a local server**
```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

3. **Open in browser**
```
http://localhost:8080
```

---

## 🎮 Controls

### Desktop
| Key | Action |
|-----|--------|
| **Arrow Keys** or **WASD** | Move spaceship |
| **SPACE** | Fire bullets |
| **P** or **ESC** | Pause/Resume |
| **M** | Mute/Unmute |

### Mobile
- **Left Joystick** - Move ship (drag to control)
- **Right Fire Button** - Shoot continuously
- **Top Buttons** - Pause ⏸, Restart 🔄, Mute 🔊

### In-Game HUD
- **⏸ Pause** - Pause game
- **🔄 Restart** - Restart current game
- **🔊 Mute** - Toggle sound

---

## 📂 Project Structure

```
space-impact-game/
├── index.html              # Main HTML file
├── style.css              # All styles (desktop + mobile)
├── src/
│   ├── main.js           # Entry point & initialization
│   ├── engine/
│   │   ├── GameEngine.js       # Core game loop
│   │   ├── InputManager.js     # Keyboard & touch input
│   │   ├── SoundManager.js     # Audio system
│   │   └── StorageManager.js   # High scores
│   ├── entities/
│   │   ├── Player.js           # Player ship
│   │   ├── Enemy.js            # Enemy ships
│   │   ├── Boss.js             # Boss enemies
│   │   └── ParticleSystem.js   # Visual effects
│   └── systems/
│       ├── CollisionSystem.js  # Collision detection
│       ├── LevelManager.js     # Level progression
│       ├── UIManager.js        # HUD & overlays
│       └── EnemyManager.js     # Enemy spawning
├── GAME_GUIDE.md         # Complete gameplay guide
├── DEPLOYMENT.md         # Deployment instructions
└── README.md            # This file
```

---

## 🎯 Game Mechanics

### Power-Ups
The game features 12 unique power-ups:

| Power-Up | Effect | Duration |
|----------|--------|----------|
| ♥ Health | +1 Life | Instant |
| ⚡ Weapon | Upgrade weapon tier | Permanent |
| ⛨ Shield | Invincibility | 5s |
| ➤ Speed | 1.8x movement speed | 8s |
| ━ Laser | Beam weapon | 8s |
| ◈ Homing | Auto-tracking missiles | 10s |
| ◷ Time Slow | Slow enemies 30% | 8s |
| 💣 Bomb | Clear all enemies | Instant |
| ⬡ Magnet | Attract power-ups | 10s |
| ※ Multishot | Fire 8 directions | 8s |
| ◯ Barrier | Rotating shield orbs | 12s |
| ☢ Rage | Speed + rapid fire | 10s |

### Enemy Types
- **Type A-F**: Six unique enemy patterns (straight, zig-zag, shooters, kamikaze, circular, tank)
- **Bosses**: End-of-level challenges with multiple attack patterns
- **Difficulty Scaling**: Speed, spawn rate, and HP increase with each level

---

## 🏗️ Architecture

### Design Patterns
- **Entity-Component System** for game objects
- **Manager Pattern** for systems (Input, Sound, UI, Level, Enemy)
- **Module Pattern** with ES6 imports/exports
- **Observer Pattern** for event handling

### Key Systems
1. **GameEngine** - Core loop with fixed timestep updates
2. **InputManager** - Handles keyboard and touch with unified API
3. **CollisionSystem** - Efficient AABB collision detection
4. **ParticleSystem** - Visual effects with object pooling
5. **LevelManager** - Progression and difficulty scaling
6. **UIManager** - HUD updates and menu overlays

---

## 🚢 Deployment

### GitHub Pages
```bash
# Commit and push your code
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch → Save
```

### Netlify
1. Connect your GitHub repository to Netlify
2. Build settings: None required (static site)
3. Publish directory: `/` (root)
4. Deploy!

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🌐 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Mobile Safari | iOS 14+ | ✅ Touch Controls |
| Chrome Mobile | Android 8+ | ✅ Touch Controls |

**Requirements**:
- HTML5 Canvas support
- ES6 module support
- Web Audio API (for sound)
- Touch Events API (for mobile)

---

## ⚡ Performance

- **60 FPS** on most devices
- **Optimized rendering** with canvas double buffering
- **Object pooling** for particles and bullets
- **Efficient collision detection** with spatial partitioning
- **Mobile optimized** with touch-friendly controls

### Tips
- Close other browser tabs for best performance
- Use modern browsers (Chrome, Firefox, Safari, Edge)
- Enable hardware acceleration in browser settings

---

## 🎮 Complete Game Guide

For detailed gameplay instructions, strategies, and tips, see [GAME_GUIDE.md](GAME_GUIDE.md):
- All power-up descriptions and strategies
- Enemy type behaviors and point values
- Boss battle tactics
- Mobile-specific tips
- Troubleshooting guide

---

## 🛠️ Development

### Prerequisites
- Any modern web browser
- Local web server (Python, Node.js, or PHP)
- Text editor or IDE

### Code Style
- **ES6+** JavaScript with modules
- **Semantic HTML5**
- **CSS3** with custom properties
- **JSDoc** comments for documentation
- **Clean code** with descriptive names

### Making Changes
1. Edit files in `src/` directory
2. Test in browser with local server
3. Commit changes to git
4. Push to GitHub

---

## 📜 License

MIT License - Feel free to use this code for learning or commercial projects.

---

## 🙏 Credits

**Inspired by**: Nokia's original Space Impact (1999)  
**Developer**: Swapna Subham  
**Repository**: [github.com/swapnasubham1993/space-impact-game](https://github.com/swapnasubham1993/space-impact-game)

Built with ❤️ using pure HTML5, CSS3, and JavaScript

---

## 🔗 Links

- 🎮 [Play Game](https://swapnasubham1993.github.io/space-impact-game/)
- 📖 [Game Guide](GAME_GUIDE.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 🐛 [Report Issues](https://github.com/swapnasubham1993/space-impact-game/issues)

---

**Ready to play?** [Launch Game →](https://swapnasubham1993.github.io/space-impact-game/)
