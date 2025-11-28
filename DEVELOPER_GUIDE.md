# Space Impact - Developer Quick Reference

## 📐 Game Constants

```javascript
// Canvas dimensions
WIDTH = 320
HEIGHT = 480

// Player
PLAYER_SPEED = 150
PLAYER_LIVES = 3
FIRE_RATE = 0.25s

// Enemies
SPAWN_INTERVAL = 2.5s (decreases with level)
WAVE_INTERVAL = 15s
WAVES_PER_LEVEL = 5

// Difficulty scaling
SCROLL_SPEED = 2 + (level - 1) * 0.3
```

## 🎯 Key Classes & Methods

### GameEngine
```javascript
start()              // Start game loop
stop()               // Stop game loop
pause()              // Pause game
resume()             // Resume game
addScore(points)     // Add to score
loseLife()           // Decrease lives
gameOver()           // Trigger game over
levelComplete()      // Trigger level complete
nextLevel()          // Progress to next level
reset()              // Reset game state
createExplosion(x, y, color, count) // Particle effect
```

### Player
```javascript
update(dt)           // Update position/state
shoot(dt)            // Fire weapon
powerUp(type)        // Apply power-up
makeInvulnerable(ms) // Temporary invincibility
reset()              // Reset to initial state
getBounds()          // Get collision box
```

### Enemy Types
```javascript
'A' - Straight Flyer  (HP: 10,  Score: 100)
'B' - Zig-Zag        (HP: 20,  Score: 150)
'C' - Shooter        (HP: 30,  Score: 200)
'D' - Kamikaze       (HP: 15,  Score: 120)
'E' - Circular       (HP: 25,  Score: 180)
'F' - Heavy Tank     (HP: 80,  Score: 500)
```

### Boss
```javascript
constructor(engine, level) // Level scales HP
update(dt)           // AI & movement
attack()             // Fire pattern
hit(damage)          // Take damage
destroy()            // Death + level complete
```

## 🔧 Utility Functions

### Collision Detection
```javascript
checkAABB(rectA, rectB) {
    return rectA.x < rectB.x + rectB.width &&
           rectA.x + rectA.width > rectB.x &&
           rectA.y < rectB.y + rectB.height &&
           rectA.y + rectA.height > rectB.y;
}
```

### Random Position
```javascript
const x = engine.width + Math.random() * 100;
const y = 20 + Math.random() * (engine.height - 60);
```

### Vector Normalization
```javascript
const length = Math.sqrt(x * x + y * y);
if (length > 0) {
    x /= length;
    y /= length;
}
```

## 🎨 Drawing Patterns

### Basic Shape
```javascript
ctx.fillStyle = '#FF0000';
ctx.fillRect(x, y, width, height);
```

### Triangle (Enemy)
```javascript
ctx.beginPath();
ctx.moveTo(x, y + height/2);
ctx.lineTo(x + width, y);
ctx.lineTo(x + width, y + height);
ctx.closePath();
ctx.fill();
```

### Circle
```javascript
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();
```

### Text
```javascript
ctx.font = 'bold 20px "Courier New"';
ctx.textAlign = 'center';
ctx.fillText('TEXT', x, y);
```

## 🔊 Sound API

### Play Sound
```javascript
soundManager.play('shoot');      // Player fires
soundManager.play('explosion');  // Enemy destroyed
soundManager.play('playerHit');  // Player damaged
soundManager.play('powerUp');    // Collect power-up
soundManager.play('levelComplete'); // Beat level
soundManager.play('gameOver');   // Death
soundManager.play('enemyShoot'); // Enemy fires
soundManager.play('bossAppear'); // Boss spawns
```

### Create Custom Sound
```javascript
playSoundName() {
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'square'; // 'sine', 'square', 'sawtooth', 'triangle'
    osc.frequency.setValueAtTime(440, now);
    
    gain.gain.setValueAtTime(this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
}
```

## 💾 Storage API

```javascript
// High scores
storageManager.addHighScore(score, level);
storageManager.getHighScores();
storageManager.getTopScore();
storageManager.isHighScore(score);

// Progress
storageManager.updateProgress(level, weapon);
storageManager.getProgress();

// Settings
storageManager.saveSettings({ volume: 0.5 });
storageManager.getSettings();
```

## 🎮 Input API

```javascript
// Check key
inputManager.isKeyPressed('space');
inputManager.isKeyPressed('arrowup');

// Get movement vector
const { x, y } = inputManager.getMovementVector(); // -1 to 1

// Check shooting
if (inputManager.isShooting()) { /* ... */ }

// Toggle functions
inputManager.togglePause();
inputManager.toggleMute();
```

## 🌟 Particle Effects

```javascript
// Create explosion
particleSystem.createExplosion(
    x,                  // X position
    y,                  // Y position
    '#FF0000',          // Color
    20,                 // Particle count
    200                 // Speed (optional)
);

// Create trail
particleSystem.createTrail(x, y, color, count);

// Clear all
particleSystem.clear();
```

## 📊 UI Updates

```javascript
uiManager.updateScore(1000);
uiManager.updateLives(3);
uiManager.updateLevel(2);
uiManager.showBossHealth(hp, maxHp);
uiManager.updateBossHealth(hp, maxHp);
uiManager.hideBossHealth();
uiManager.showGameOver(score, level);
uiManager.showLevelComplete(level, bonus);
```

## 🔢 Math Helpers

```javascript
// Random integer
Math.floor(Math.random() * max)

// Random float range
min + Math.random() * (max - min)

// Clamp value
Math.max(min, Math.min(value, max))

// Distance
Math.sqrt(dx * dx + dy * dy)

// Angle
Math.atan2(dy, dx)

// Lerp (linear interpolation)
start + (end - start) * t
```

## 🐛 Debug Tips

### Show Bounding Boxes
```javascript
// In render methods
ctx.strokeStyle = '#FF0000';
ctx.strokeRect(this.x, this.y, this.width, this.height);
```

### FPS Counter
```javascript
let fps = 0;
let frames = 0;
let lastFPSUpdate = 0;

update(dt) {
    frames++;
    lastFPSUpdate += dt;
    if (lastFPSUpdate >= 1) {
        fps = frames;
        frames = 0;
        lastFPSUpdate = 0;
        console.log('FPS:', fps);
    }
}
```

### Entity Count
```javascript
console.log('Bullets:', engine.bullets.length);
console.log('Enemies:', engine.enemies.length);
console.log('Particles:', engine.particleSystem.particles.length);
```

## 🎯 Common Patterns

### Spawn Enemy Wave
```javascript
for (let i = 0; i < waveSize; i++) {
    setTimeout(() => {
        const enemy = new Enemy(engine, x, y, type);
        engine.enemies.push(enemy);
    }, i * 400);
}
```

### Timed Power-Up
```javascript
this.powerUpActive = true;
this.powerUpTimer = 5; // seconds

update(dt) {
    if (this.powerUpActive) {
        this.powerUpTimer -= dt;
        if (this.powerUpTimer <= 0) {
            this.powerUpActive = false;
        }
    }
}
```

### Oscillating Movement
```javascript
this.y = baseY + Math.sin(timer * frequency) * amplitude;
```

### Shooting at Player
```javascript
const dx = player.x - this.x;
const dy = player.y - this.y;
const distance = Math.sqrt(dx * dx + dy * dy);

if (distance > 0) {
    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;
    // Create bullet with vx, vy
}
```

## 📱 Mobile Detection

```javascript
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Or check pointer type
const hasTouch = window.matchMedia('(pointer: coarse)').matches;
```

## ⚡ Performance Tips

```javascript
// Object pooling
if (recycledBullets.length > 0) {
    bullet = recycledBullets.pop();
    bullet.reset(x, y);
} else {
    bullet = new Bullet(x, y);
}

// Batch operations
const activeEnemies = enemies.filter(e => e.active);

// Use integer coords
this.x = Math.floor(this.x);
this.y = Math.floor(this.y);

// Limit calculations
if (frameCount % 3 === 0) {
    // Only run every 3 frames
}
```

## 🚀 Quick Test Scenarios

```javascript
// Test boss fight immediately
engine.level = 1;
engine.enemyManager.bossSpawned = false;
engine.enemyManager.currentWave = 5;
engine.enemyManager.spawnBoss();

// Give max weapon
player.weaponLevel = 4;
player.fireRate = 0.15;

// God mode
player.invulnerable = true;
player.invulnerabilityTimer = 999;

// Spawn power-ups
const types = ['health', 'weapon', 'shield', 'speed'];
types.forEach((type, i) => {
    const powerUp = new PowerUp(engine, 100, 100 + i * 50, type);
    engine.powerUps.push(powerUp);
});
```

---

**Quick Reference v1.0** | Space Impact Development Guide
