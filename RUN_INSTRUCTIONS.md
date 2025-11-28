# Space Impact - Run Instructions

## Quick Start (Windows)

### Option 1: Using Python (Recommended)
```powershell
# Navigate to project folder
cd c:\Code\space_impact

# Start server with Python 3
python -m http.server 8000

# Open in browser: http://localhost:8000
```

### Option 2: Using Node.js
```powershell
# Install http-server globally (one-time)
npm install -g http-server

# Run server
http-server -p 8000

# Open in browser: http://localhost:8000
```

### Option 3: Using PHP
```powershell
php -S localhost:8000

# Open in browser: http://localhost:8000
```

## Testing Checklist

- [ ] Game loads without errors
- [ ] Title screen displays with Nokia styling
- [ ] Start button launches game
- [ ] Player ship moves with arrow keys
- [ ] Spacebar shoots bullets
- [ ] Enemies spawn and move
- [ ] Collisions work (bullets hit enemies)
- [ ] Score increases when enemies destroyed
- [ ] Power-ups spawn and can be collected
- [ ] Boss appears after waves complete
- [ ] Level complete screen shows after boss
- [ ] Game over screen shows when lives = 0
- [ ] High scores save to localStorage
- [ ] Sound effects play (after first interaction)
- [ ] Mobile touch controls work on phone/tablet
- [ ] Pause button works (P key or button)
- [ ] Mute button toggles sound

## Browser Console Check

Open browser DevTools (F12) and check for:
- No red error messages
- "Initializing Space Impact..." message
- "Space Impact initialized successfully!" message

## Common Issues

**Issue**: "Failed to load module" error
**Fix**: Make sure you're using a web server, not opening index.html directly

**Issue**: Touch controls don't show on desktop
**Fix**: This is normal - they only show on mobile devices or when browser width is small

**Issue**: Sound doesn't play
**Fix**: Click anywhere on the page first (browser security requires user interaction)

**Issue**: Enemies don't spawn
**Fix**: Check browser console for JavaScript errors. Make sure all .js files loaded correctly.

## Performance Testing

Good performance indicators:
- Smooth 60 FPS gameplay
- No stuttering during explosions
- Touch controls responsive (<50ms latency)
- Canvas scales properly on window resize

## File Verification

Ensure these files exist:
```
c:\Code\space_impact\
├── index.html
├── style.css
├── README.md
└── src\
    ├── main.js
    ├── engine\
    │   ├── GameEngine.js
    │   ├── InputManager.js
    │   ├── SoundManager.js
    │   └── StorageManager.js
    ├── entities\
    │   ├── Player.js
    │   ├── Enemy.js
    │   ├── Boss.js
    │   ├── PowerUp.js
    │   └── ParticleSystem.js
    └── systems\
        ├── CollisionSystem.js
        ├── EnemyManager.js
        ├── LevelManager.js
        └── UIManager.js
```

## Ready to Play!

Once the server is running and no errors appear, you're ready to play Space Impact! 🚀
