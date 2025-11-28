/**
 * PowerUp - Collectible power-up entity
 * Types: health, weapon, shield, speed, laser, homing, timeslow, bomb, magnet, multishot, barrier, rage
 */
export class PowerUp {
    constructor(gameEngine, x, y, type) {
        this.engine = gameEngine;
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.active = true;
        
        // Movement
        this.speedX = -60;
        this.speedY = 0;
        this.amplitude = 20;
        this.frequency = 4;
        this.timer = 0;
        
        // Animation
        this.frame = 0;
        this.animationTimer = 0;
        this.rotation = 0;
        
        // Lifetime
        this.lifetime = 10; // seconds before disappearing
        this.blinkTimer = 0;
        this.blinking = false;
        
        // Visual properties based on type
        this.initializeType();
    }

    initializeType() {
        switch (this.type) {
            case 'health':
                this.color = '#FF0066';
                this.glowColor = '#FF0066';
                this.symbol = '♥';
                this.description = '+1 Life';
                break;
            case 'weapon':
                this.color = '#00FF00';
                this.glowColor = '#00FF00';
                this.symbol = '⚡';
                this.description = 'Weapon Upgrade';
                break;
            case 'shield':
                this.color = '#00FFFF';
                this.glowColor = '#00FFFF';
                this.symbol = '⛨';
                this.description = '5s Shield';
                break;
            case 'speed':
                this.color = '#FFFF00';
                this.glowColor = '#FFFF00';
                this.symbol = '➤';
                this.description = '5s Speed Boost';
                break;
            case 'laser':
                this.color = '#FF00FF';
                this.glowColor = '#FF00FF';
                this.symbol = '━';
                this.description = 'Laser Beam';
                break;
            case 'homing':
                this.color = '#FF6600';
                this.glowColor = '#FF6600';
                this.symbol = '◈';
                this.description = 'Homing Missiles';
                break;
            case 'timeslow':
                this.color = '#9966FF';
                this.glowColor = '#9966FF';
                this.symbol = '◷';
                this.description = 'Slow Time';
                break;
            case 'bomb':
                this.color = '#FF3333';
                this.glowColor = '#FF3333';
                this.symbol = '💣';
                this.description = 'Screen Clear';
                break;
            case 'magnet':
                this.color = '#00AAFF';
                this.glowColor = '#00AAFF';
                this.symbol = '⬡';
                this.description = 'Item Magnet';
                break;
            case 'multishot':
                this.color = '#FFAA00';
                this.glowColor = '#FFAA00';
                this.symbol = '※';
                this.description = '8-Way Shot';
                break;
            case 'barrier':
                this.color = '#00FFAA';
                this.glowColor = '#00FFAA';
                this.symbol = '◯';
                this.description = 'Rotating Barrier';
                break;
            case 'rage':
                this.color = '#FF0000';
                this.glowColor = '#FF0000';
                this.symbol = '☢';
                this.description = 'Rage Mode';
                break;
        }
    }

    update(dt) {
        this.timer += dt;
        this.lifetime -= dt;
        this.animationTimer += dt;
        this.rotation += dt * 3;
        
        // Floating movement
        this.x += this.speedX * dt;
        this.y += Math.sin(this.timer * this.frequency) * this.amplitude * dt;
        
        // Start blinking when almost expired
        if (this.lifetime < 3) {
            this.blinking = true;
            this.blinkTimer += dt;
        }
        
        // Remove when lifetime expires
        if (this.lifetime <= 0) {
            this.active = false;
        }
        
        // Clamp to vertical bounds
        this.y = Math.max(0, Math.min(this.y, this.engine.height - this.height));
    }

    collect() {
        this.active = false;
        
        if (this.engine.soundManager) {
            this.engine.soundManager.play('powerUp');
        }
        
        // Create sparkle effect
        this.engine.createExplosion(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.color,
            20
        );
        
        // Apply power-up to player
        if (this.engine.player) {
            switch (this.type) {
                case 'health':
                    if (this.engine.lives < 10) {
                        this.engine.lives++;
                        if (this.engine.uiManager) {
                            this.engine.uiManager.updateLives(this.engine.lives);
                        }
                    }
                    break;
                    
                case 'weapon':
                    this.engine.player.powerUp('weapon');
                    break;
                    
                case 'shield':
                    this.engine.player.powerUp('shield');
                    break;
                    
                case 'speed':
                    this.engine.player.powerUp('speed');
                    break;
                    
                case 'laser':
                    this.engine.player.powerUp('laser');
                    break;
                    
                case 'homing':
                    this.engine.player.powerUp('homing');
                    break;
                    
                case 'timeslow':
                    this.engine.player.powerUp('timeslow');
                    break;
                    
                case 'bomb':
                    // Clear all enemies on screen
                    this.engine.enemies.forEach(enemy => {
                        enemy.destroy();
                    });
                    this.engine.enemyBullets = [];
                    this.engine.createExplosion(this.engine.width / 2, this.engine.height / 2, '#FF3333', 100);
                    break;
                    
                case 'magnet':
                    this.engine.player.powerUp('magnet');
                    break;
                    
                case 'multishot':
                    this.engine.player.powerUp('multishot');
                    break;
                    
                case 'barrier':
                    this.engine.player.powerUp('barrier');
                    break;
                    
                case 'rage':
                    this.engine.player.powerUp('rage');
                    break;
            }
        }
        
        // Score bonus
        this.engine.addScore(100);
        
        // Show power-up name
        this.showPowerUpText();
    }
    
    showPowerUpText() {
        // Create floating text notification
        const notification = {
            text: this.description,
            x: this.x,
            y: this.y,
            lifetime: 2,
            color: this.color
        };
        
        if (!this.engine.notifications) {
            this.engine.notifications = [];
        }
        this.engine.notifications.push(notification);
    }

    render(ctx) {
        // Don't render if blinking and in "off" phase
        if (this.blinking && Math.floor(this.blinkTimer * 6) % 2 === 0) {
            return;
        }
        
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Outer glow layers
        ctx.shadowBlur = 30;
        ctx.shadowColor = this.glowColor;
        
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width);
        glowGradient.addColorStop(0, this.color + '88');
        glowGradient.addColorStop(0.5, this.color + '44');
        glowGradient.addColorStop(1, this.color + '00');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(-this.width, -this.height, this.width * 2, this.height * 2);
        
        // Animated ring
        const pulseSize = 1 + Math.sin(this.timer * 5) * 0.1;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, (this.width / 2) * pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ring
        ctx.strokeStyle = this.color + 'AA';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, (this.width / 3) * pulseSize, 0, Math.PI * 2);
        ctx.stroke();
        
        // Background
        const bgGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2);
        bgGradient.addColorStop(0, this.color + 'AA');
        bgGradient.addColorStop(1, '#000000');
        ctx.fillStyle = bgGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Symbol with enhanced glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        
        // Sparkle particles around power-up
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 * i / 4) + this.timer * 2;
            const dist = this.width / 2 + 5;
            const px = Math.cos(angle) * dist;
            const py = Math.sin(angle) * dist;
            
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}
