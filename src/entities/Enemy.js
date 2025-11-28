/**
 * Enemy - Base enemy class and enemy types
 * Defines different enemy behaviors and attack patterns
 */
export class Enemy {
    constructor(gameEngine, x, y, type = 'A') {
        this.engine = gameEngine;
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.hp = 10;
        this.maxHp = 10;
        this.damage = 10;
        this.scoreValue = 100;
        this.scale = gameEngine.scale || 1;
        
        // Movement
        this.speedX = -80 * this.scale;
        this.speedY = 0;
        this.amplitude = 0;
        this.frequency = 0;
        this.timer = 0;
        
        // Shooting
        this.canShoot = false;
        this.shootCooldown = 0;
        this.shootInterval = 2;
        
        // Animation
        this.frame = 0;
        this.animationTimer = 0;
        
        // Set properties based on type
        this.initializeType();
    }

    initializeType() {
        switch (this.type) {
            case 'A': // Straight Flyer
                this.width = 40 * this.scale;
                this.height = 30 * this.scale;
                this.hp = this.maxHp = 10;
                this.speedX = -100 * this.scale;
                this.scoreValue = 100;
                this.color = '#FF0000';
                break;
                
            case 'B': // Zig-Zag
                this.width = 45 * this.scale;
                this.height = 35 * this.scale;
                this.hp = this.maxHp = 20;
                this.speedX = -80 * this.scale;
                this.amplitude = 80 * this.scale;
                this.frequency = 2;
                this.scoreValue = 150;
                this.color = '#FF6600';
                break;
                
            case 'C': // Shooter
                this.width = 50 * this.scale;
                this.height = 40 * this.scale;
                this.hp = this.maxHp = 30;
                this.speedX = -60 * this.scale;
                this.canShoot = true;
                this.shootInterval = 2.5;
                this.scoreValue = 200;
                this.color = '#FFAA00';
                break;
                
            case 'D': // Kamikaze
                this.width = 35 * this.scale;
                this.height = 35 * this.scale;
                this.hp = this.maxHp = 15;
                this.speedX = -120 * this.scale;
                this.scoreValue = 120;
                this.color = '#FF00FF';
                break;
                
            case 'E': // Circular
                this.width = 45 * this.scale;
                this.height = 45 * this.scale;
                this.hp = this.maxHp = 25;
                this.speedX = -70 * this.scale;
                this.amplitude = 60 * this.scale;
                this.frequency = 3;
                this.scoreValue = 180;
                this.color = '#00FFFF';
                break;
                
            case 'F': // Heavy Tank
                this.width = 75 * this.scale;
                this.height = 60 * this.scale;
                this.hp = this.maxHp = 80;
                this.speedX = -40 * this.scale;
                this.canShoot = true;
                this.shootInterval = 3;
                this.scoreValue = 500;
                this.color = '#CCCCCC';
                break;
        }
    }

    update(dt) {
        this.timer += dt;
        this.shootCooldown -= dt;
        
        // Update position based on type
        switch (this.type) {
            case 'A':
                this.x += this.speedX * dt;
                break;
                
            case 'B':
                this.x += this.speedX * dt;
                this.y += Math.sin(this.timer * this.frequency) * this.amplitude * dt;
                break;
                
            case 'C':
                this.x += this.speedX * dt;
                if (this.canShoot && this.shootCooldown <= 0) {
                    this.shoot();
                }
                break;
                
            case 'D':
                // Accelerate towards player
                if (this.engine.player) {
                    const dx = this.engine.player.x - this.x;
                    const dy = this.engine.player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance > 0) {
                        this.speedX = dx / distance * -120;
                        this.speedY = dy / distance * 120;
                    }
                }
                this.x += this.speedX * dt;
                this.y += this.speedY * dt;
                break;
                
            case 'E':
                // Circular/looping movement
                this.x += this.speedX * dt;
                this.y += Math.cos(this.timer * this.frequency) * this.amplitude * dt;
                break;
                
            case 'F':
                this.x += this.speedX * dt;
                if (this.canShoot && this.shootCooldown <= 0) {
                    this.shoot();
                }
                break;
        }

        // Animation
        this.animationTimer += dt;
        if (this.animationTimer > 0.15) {
            this.frame = (this.frame + 1) % 4;
            this.animationTimer = 0;
        }

        // Clamp to vertical bounds
        this.y = Math.max(0, Math.min(this.y, this.engine.height - this.height));
    }

    shoot() {
        if (!this.engine.player) return;
        
        this.shootCooldown = this.shootInterval;
        
        if (this.engine.soundManager) {
            this.engine.soundManager.play('enemyShoot');
        }

        // Shoot towards player
        const dx = this.engine.player.x - this.x;
        const dy = this.engine.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const bulletSpeed = 150 * this.scale;
            const vx = (dx / distance) * bulletSpeed;
            const vy = (dy / distance) * bulletSpeed;
            
            this.engine.enemyBullets.push(
                new EnemyBullet(
                    this.x,
                    this.y + this.height / 2,
                    vx,
                    vy,
                    this.scale
                )
            );
        }
    }

    hit(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.active = false;
        this.engine.addScore(this.scoreValue);
        this.engine.createExplosion(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.color,
            10
        );
        
        if (this.engine.soundManager) {
            this.engine.soundManager.play('explosion');
        }

        // All 12 power-up types
        const allTypes = [
            'health', 'weapon', 'shield', 'speed',
            'laser', 'homing', 'timeslow', 'bomb',
            'magnet', 'multishot', 'barrier', 'rage'
        ];

        // Chance to drop power-up (heavy enemies)
        if (this.type === 'F' && Math.random() < 0.7) {
            import('./PowerUp.js').then(module => {
                const type = allTypes[Math.floor(Math.random() * allTypes.length)];
                this.engine.powerUps.push(
                    new module.PowerUp(this.engine, this.x, this.y, type)
                );
            });
        } else if (Math.random() < 0.15) {
            import('./PowerUp.js').then(module => {
                const type = allTypes[Math.floor(Math.random() * allTypes.length)];
                this.engine.powerUps.push(
                    new module.PowerUp(this.engine, this.x, this.y, type)
                );
            });
        }
    }

    render(ctx) {
        ctx.save();

        // Draw enemy based on type
        ctx.fillStyle = this.color;
        
        switch (this.type) {
            case 'A':
                this.renderTypeA(ctx);
                break;
            case 'B':
                this.renderTypeB(ctx);
                break;
            case 'C':
                this.renderTypeC(ctx);
                break;
            case 'D':
                this.renderTypeD(ctx);
                break;
            case 'E':
                this.renderTypeE(ctx);
                break;
            case 'F':
                this.renderTypeF(ctx);
                break;
        }

        // Health bar for tougher enemies
        if (this.maxHp > 20) {
            this.renderHealthBar(ctx);
        }

        ctx.restore();
    }

    renderTypeA(ctx) {
        // Simple triangle ship with gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, '#AA0000');
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // Engine glow
        ctx.fillStyle = '#FFAA00';
        ctx.fillRect(this.x, this.y + this.height / 2 - 2, 6, 4);
    }

    renderTypeB(ctx) {
        // Diamond shape with gradient
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, this.width / 2
        );
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.4, this.color);
        gradient.addColorStop(1, '#AA4400');
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }

    renderTypeC(ctx) {
        // Square with gun and gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, '#AA6600');
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Gun barrel with glow
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x - 8, this.y + this.height / 2 - 3, 8, 6);
        ctx.fillStyle = '#FFAA00';
        ctx.fillRect(this.x, this.y + this.height / 2 - 2, this.width * 0.3, 4);
    }

    renderTypeD(ctx) {
        // Circle (kamikaze) with pulsing effect
        const pulseScale = 1 + Math.sin(this.timer * 8) * 0.2;
        const radius = (this.width / 2) * pulseScale;
        
        const gradient = ctx.createRadialGradient(
            this.x + this.width / 2, this.y + this.height / 2, 0,
            this.x + this.width / 2, this.y + this.height / 2, radius
        );
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#AA00AA');
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulsing center
        if (this.frame < 2) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                    this.width / 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderTypeE(ctx) {
        // Star shape with gradient and rotation
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const spikes = 5;
        const outerRadius = this.width / 2;
        const innerRadius = outerRadius / 2;
        const rotation = this.timer;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#008888');
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes + rotation;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }

    renderTypeF(ctx) {
        // Heavy tank - rectangular with details and gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#EEEEEE');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, '#888888');
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Armor plating with glow
        ctx.fillStyle = '#999999';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        // Turret with glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFAA00';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x - 10, this.y + this.height / 2 - 4, this.width * 0.5, 8);
        
        // Engine vents
        ctx.fillStyle = '#FF6600';
        ctx.fillRect(this.x + this.width - 5, this.y + 8, 5, 3);
        ctx.fillRect(this.x + this.width - 5, this.y + this.height - 11, 5, 3);
    }

    renderHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 3;
        const healthPercent = this.hp / this.maxHp;
        
        ctx.fillStyle = '#333333';
        ctx.fillRect(this.x, this.y - 6, barWidth, barHeight);
        
        ctx.fillStyle = healthPercent > 0.5 ? '#00FF00' : '#FF0000';
        ctx.fillRect(this.x, this.y - 6, barWidth * healthPercent, barHeight);
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

/**
 * EnemyBullet - Enemy projectile
 */
export class EnemyBullet {
    constructor(x, y, speedX, speedY, scale = 1) {
        this.x = x;
        this.y = y;
        this.width = 10 * scale;
        this.height = 10 * scale;
        this.speedX = speedX;
        this.speedY = speedY;
        this.active = true;
        this.damage = 10;
        this.scale = scale;
    }

    update(dt) {
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
    }

    render(ctx) {
        ctx.save();
        ctx.shadowBlur = 15 * this.scale;
        ctx.shadowColor = '#FF0000';
        
        // Outer glow
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
        
        // Main bullet
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright core
        ctx.fillStyle = '#FFAA00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}
