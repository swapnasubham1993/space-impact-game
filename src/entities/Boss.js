/**
 * Boss - Boss enemy with multiple phases and attack patterns
 */
export class Boss {
    constructor(gameEngine, level) {
        this.engine = gameEngine;
        this.level = level;
        this.scale = gameEngine.scale || 1;
        this.x = this.engine.width - 100 * this.scale;
        this.y = this.engine.height / 2 - 40 * this.scale;
        this.width = 80 * this.scale;
        this.height = 80 * this.scale;
        this.active = true;
        
        // Health scales with level
        this.maxHp = 200 + (level - 1) * 100;
        this.hp = this.maxHp;
        this.damage = 20;
        this.scoreValue = 5000 * level;
        
        // Movement
        this.speedY = 80 * this.scale;
        this.targetY = this.y;
        this.phase = 1;
        this.phaseTimer = 0;
        
        // Attack patterns
        this.attackTimer = 0;
        this.attackCooldown = 2;
        this.burstCount = 0;
        
        // Animation
        this.frame = 0;
        this.animationTimer = 0;
        
        // Color based on level
        this.colors = ['#FF0000', '#FF6600', '#FFAA00', '#00FF00', '#00FFFF'];
        this.color = this.colors[(level - 1) % this.colors.length];
        
        // Show boss health bar
        if (this.engine.uiManager) {
            this.engine.uiManager.showBossHealth(this.hp, this.maxHp);
        }
        
        if (this.engine.soundManager) {
            this.engine.soundManager.play('bossAppear');
        }
    }

    update(dt) {
        this.phaseTimer += dt;
        this.attackTimer -= dt;
        this.animationTimer += dt;
        
        // Update phase based on health
        const healthPercent = this.hp / this.maxHp;
        if (healthPercent < 0.66 && this.phase === 1) {
            this.phase = 2;
            this.attackCooldown = 1.5;
        } else if (healthPercent < 0.33 && this.phase === 2) {
            this.phase = 3;
            this.attackCooldown = 1;
        }
        
        // Movement pattern
        this.updateMovement(dt);
        
        // Attack pattern
        if (this.attackTimer <= 0) {
            this.attack();
            this.attackTimer = this.attackCooldown;
        }
        
        // Animation
        if (this.animationTimer > 0.1) {
            this.frame = (this.frame + 1) % 8;
            this.animationTimer = 0;
        }
        
        // Update boss health bar
        if (this.engine.uiManager) {
            this.engine.uiManager.updateBossHealth(this.hp, this.maxHp);
        }
    }

    updateMovement(dt) {
        switch (this.phase) {
            case 1:
                // Vertical oscillation
                this.targetY = this.engine.height / 2 + 
                              Math.sin(this.phaseTimer) * 100;
                break;
                
            case 2:
                // Faster vertical movement
                this.targetY = this.engine.height / 2 + 
                              Math.sin(this.phaseTimer * 2) * 120;
                break;
                
            case 3:
                // Erratic movement
                if (Math.random() < 0.02) {
                    this.targetY = Math.random() * (this.engine.height - this.height);
                }
                break;
        }
        
        // Smooth movement towards target
        const dy = this.targetY - this.y;
        if (Math.abs(dy) > 1) {
            this.y += Math.sign(dy) * this.speedY * dt;
        }
        
        // Clamp to bounds
        this.y = Math.max(0, Math.min(this.y, this.engine.height - this.height));
    }

    attack() {
        if (!this.engine.player) return;
        
        if (this.engine.soundManager) {
            this.engine.soundManager.play('enemyShoot');
        }
        
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        switch (this.phase) {
            case 1:
                // Single aimed shot
                this.shootAtPlayer(centerX, centerY);
                break;
                
            case 2:
                // Triple spread
                this.shootAtPlayer(centerX, centerY - 20);
                this.shootAtPlayer(centerX, centerY);
                this.shootAtPlayer(centerX, centerY + 20);
                break;
                
            case 3:
                // Radial burst
                import('./Enemy.js').then(module => {
                    const bulletCount = 8;
                    for (let i = 0; i < bulletCount; i++) {
                        const angle = (Math.PI * 2 * i) / bulletCount;
                        const speed = 120;
                        const vx = Math.cos(angle) * speed;
                        const vy = Math.sin(angle) * speed;
                        
                        this.engine.enemyBullets.push(
                            new module.EnemyBullet(centerX, centerY, vx, vy)
                        );
                    }
                });
                break;
        }
    }

    shootAtPlayer(x, y) {
        const dx = this.engine.player.x - x;
        const dy = this.engine.player.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const bulletSpeed = 150;
            const vx = (dx / distance) * bulletSpeed;
            const vy = (dy / distance) * bulletSpeed;
            
            import('./Enemy.js').then(module => {
                this.engine.enemyBullets.push(
                    new module.EnemyBullet(x, y, vx, vy)
                );
            });
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
        
        // Massive explosion
        this.engine.createExplosion(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.color,
            40
        );
        
        if (this.engine.soundManager) {
            this.engine.soundManager.play('explosion');
        }
        
        // Hide boss health bar
        if (this.engine.uiManager) {
            this.engine.uiManager.hideBossHealth();
        }
        
        // Level complete
        setTimeout(() => {
            this.engine.levelComplete();
        }, 1000);
    }

    render(ctx) {
        ctx.save();
        
        // Boss body - intimidating design
        ctx.fillStyle = this.color;
        
        // Main body
        ctx.fillRect(this.x + 20, this.y + 20, this.width - 40, this.height - 40);
        
        // Wings/armor
        ctx.fillRect(this.x, this.y + 30, 20, 20);
        ctx.fillRect(this.x + this.width - 20, this.y + 30, 20, 20);
        
        // Core (pulsing)
        const pulseSize = 20 + Math.sin(this.phaseTimer * 10) * 5;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
            this.x + this.width / 2 - pulseSize / 2,
            this.y + this.height / 2 - pulseSize / 2,
            pulseSize,
            pulseSize
        );
        
        // Cannons
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 10, this.y, 15, 20);
        ctx.fillRect(this.x + 10, this.y + this.height - 20, 15, 20);
        
        // Details based on phase
        if (this.phase >= 2) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        
        if (this.phase >= 3) {
            // Energy crackling effect
            ctx.strokeStyle = '#FFFF00';
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y);
            ctx.lineTo(this.x + this.width / 2 + Math.random() * 20 - 10, 
                       this.y + this.height / 2);
            ctx.lineTo(this.x + this.width / 2, this.y + this.height);
            ctx.stroke();
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
