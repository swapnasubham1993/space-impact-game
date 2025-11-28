/**
 * GameEngine - Core game loop and state management
 * Handles update/render cycles, state transitions, and frame timing
 */
export class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 1280;
        this.height = 720;
        this.running = false;
        this.paused = false;
        this.lastTime = 0;
        this.fps = 60;
        this.frameTime = 1000 / this.fps;
        this.accumulator = 0;
        
        // Game state
        this.state = 'menu'; // menu, playing, paused, gameover, levelcomplete
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        
        // Scroll speed
        this.scrollSpeed = 2;
        this.scrollOffset = 0;
        
        // Managers and systems (to be set externally)
        this.inputManager = null;
        this.soundManager = null;
        this.collisionSystem = null;
        this.levelManager = null;
        this.uiManager = null;
        this.enemyManager = null;
        this.particleSystem = null;
        
        // Entity collections
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const scale = Math.min(
            containerWidth / this.width,
            containerHeight / this.height
        );
        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width * scale}px`;
        this.canvas.style.height = `${this.height * scale}px`;
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    stop() {
        this.running = false;
    }

    pause() {
        this.paused = true;
        this.state = 'paused';
    }

    resume() {
        this.paused = false;
        this.state = 'playing';
    }

    gameLoop(timestamp) {
        if (!this.running) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.accumulator += deltaTime;

        // Fixed timestep update
        while (this.accumulator >= this.frameTime) {
            if (!this.paused) {
                this.update(this.frameTime / 1000);
            }
            this.accumulator -= this.frameTime;
        }

        this.render();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(dt) {
        if (this.state !== 'playing') return;

        // Update scroll offset
        this.scrollOffset += this.scrollSpeed * dt;

        // Update player
        if (this.player) {
            this.player.update(dt);
        }

        // Update bullets
        this.bullets = this.bullets.filter(bullet => {
            bullet.update(dt);
            return bullet.active && bullet.x < this.width + 20;
        });

        // Update enemies
        this.enemies = this.enemies.filter(enemy => {
            enemy.update(dt);
            return enemy.active && enemy.x > -50;
        });

        // Update enemy bullets
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.update(dt);
            return bullet.active && bullet.x > -20 && bullet.y > -20 && bullet.y < this.height + 20;
        });

        // Update power-ups
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.update(dt);
            return powerUp.active && powerUp.x > -50;
        });

        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.update(dt);
        }

        // Update enemy manager (spawning logic)
        if (this.enemyManager) {
            this.enemyManager.update(dt);
        }

        // Update level manager
        if (this.levelManager) {
            this.levelManager.update(dt);
        }

        // Collision detection
        if (this.collisionSystem) {
            this.collisionSystem.checkCollisions();
        }

        // Check game over
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    render() {
        // Clear screen
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.state !== 'playing') return;

        // Draw scrolling background stars
        this.drawStarfield();

        // Draw entities
        this.powerUps.forEach(p => p.render(this.ctx));
        this.enemies.forEach(e => e.render(this.ctx));
        this.enemyBullets.forEach(b => b.render(this.ctx));
        this.bullets.forEach(b => b.render(this.ctx));
        
        if (this.player) {
            this.player.render(this.ctx);
        }

        // Draw particles
        if (this.particleSystem) {
            this.particleSystem.render(this.ctx);
        }

        // Draw level indicator (temporary notification)
        if (this.levelManager && this.levelManager.showLevelText) {
            this.drawLevelText();
        }
    }

    drawStarfield() {
        // Multi-layered parallax starfield with glow
        const layers = [
            { count: 100, speed: 0.3, size: 1, color: 'rgba(100, 150, 255, 0.6)' },
            { count: 60, speed: 0.5, size: 2, color: 'rgba(150, 200, 255, 0.8)' },
            { count: 30, speed: 0.8, size: 3, color: 'rgba(255, 255, 255, 1)' }
        ];
        
        layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                const x = (i * 123 + this.scrollOffset * layer.speed) % this.width;
                const y = (i * 456) % this.height;
                
                // Add glow effect
                this.ctx.save();
                this.ctx.shadowBlur = layer.size * 3;
                this.ctx.shadowColor = layer.color;
                this.ctx.fillStyle = layer.color;
                this.ctx.beginPath();
                this.ctx.arc(x, y, layer.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        });
        
        // Add distant nebula clouds
        this.ctx.save();
        const gradient = this.ctx.createRadialGradient(
            this.width * 0.7, this.height * 0.3, 0,
            this.width * 0.7, this.height * 0.3, 300
        );
        gradient.addColorStop(0, 'rgba(100, 50, 150, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
    }

    drawLevelText() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = 'bold 32px "Courier New"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`LEVEL ${this.level}`, this.width / 2, this.height / 2);
        this.ctx.restore();
    }

    addScore(points) {
        this.score += points;
        if (this.uiManager) {
            this.uiManager.updateScore(this.score);
        }
    }

    loseLife() {
        if (this.player && this.player.invulnerable) return;
        
        this.lives--;
        if (this.uiManager) {
            this.uiManager.updateLives(this.lives);
        }

        if (this.soundManager) {
            this.soundManager.play('playerHit');
        }

        if (this.player) {
            this.player.makeInvulnerable(2000);
        }

        if (this.lives > 0) {
            // Reset player position
            if (this.player) {
                this.player.x = 50;
                this.player.y = this.height / 2;
            }
        }
    }

    gameOver() {
        this.state = 'gameover';
        this.running = false;
        if (this.uiManager) {
            this.uiManager.showGameOver(this.score, this.level);
        }
        if (this.soundManager) {
            this.soundManager.play('gameOver');
        }
    }

    levelComplete() {
        this.state = 'levelcomplete';
        this.paused = true;
        
        const bonus = this.lives * 500;
        this.addScore(bonus);
        
        if (this.uiManager) {
            this.uiManager.showLevelComplete(this.level, bonus);
        }
        if (this.soundManager) {
            this.soundManager.play('levelComplete');
        }
    }

    nextLevel() {
        this.level++;
        this.paused = false;
        this.state = 'playing';
        
        // Clear entities
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        
        // Reset player
        if (this.player) {
            this.player.x = 50;
            this.player.y = this.height / 2;
        }

        // Update UI
        if (this.uiManager) {
            this.uiManager.updateLevel(this.level);
        }

        // Start new level
        if (this.levelManager) {
            this.levelManager.startLevel(this.level);
        }

        // Increase difficulty
        this.scrollSpeed = 2 + (this.level - 1) * 0.3;
    }

    reset() {
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.scrollSpeed = 2;
        this.scrollOffset = 0;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.paused = false;
        this.state = 'playing';

        if (this.player) {
            this.player.reset();
        }

        if (this.levelManager) {
            this.levelManager.reset();
            this.levelManager.startLevel(1);
        }

        if (this.particleSystem) {
            this.particleSystem.particles = [];
        }

        if (this.uiManager) {
            this.uiManager.updateScore(0);
            this.uiManager.updateLives(3);
            this.uiManager.updateLevel(1);
        }
    }

    createExplosion(x, y, color = '#FFFFFF', count = 15) {
        if (this.particleSystem) {
            this.particleSystem.createExplosion(x, y, color, count);
        }
    }
}
