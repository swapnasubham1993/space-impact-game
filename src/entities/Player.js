/**
 * Player - Player spaceship entity
 * Handles movement, shooting, power-ups, and invulnerability
 */
export class Player {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.x = 100;
        this.y = this.engine.height / 2;
        this.width = 60;
        this.height = 40;
        this.speed = 250;
        this.active = true;
        
        // Weapon properties
        this.weaponLevel = 1; // 1-4
        this.fireRate = 0.25; // seconds between shots
        this.lastShotTime = 0;
        
        // Power-up timers
        this.shieldActive = false;
        this.shieldTimer = 0;
        this.speedBoost = false;
        this.speedBoostTimer = 0;
        this.laserActive = false;
        this.laserTimer = 0;
        this.homingActive = false;
        this.homingTimer = 0;
        this.timeSlowActive = false;
        this.timeSlowTimer = 0;
        this.magnetActive = false;
        this.magnetTimer = 0;
        this.multishotActive = false;
        this.multishotTimer = 0;
        this.barrierActive = false;
        this.barrierTimer = 0;
        this.barrierAngle = 0;
        this.rageActive = false;
        this.rageTimer = 0;
        
        // Invulnerability after hit
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        
        // Animation
        this.frame = 0;
        this.animationTimer = 0;
    }

    update(dt) {
        // Update timers
        if (this.shieldActive) {
            this.shieldTimer -= dt;
            if (this.shieldTimer <= 0) this.shieldActive = false;
        }

        if (this.speedBoost) {
            this.speedBoostTimer -= dt;
            if (this.speedBoostTimer <= 0) this.speedBoost = false;
        }
        
        if (this.laserActive) {
            this.laserTimer -= dt;
            if (this.laserTimer <= 0) this.laserActive = false;
        }
        
        if (this.homingActive) {
            this.homingTimer -= dt;
            if (this.homingTimer <= 0) this.homingActive = false;
        }
        
        if (this.timeSlowActive) {
            this.timeSlowTimer -= dt;
            if (this.timeSlowTimer <= 0) this.timeSlowActive = false;
        }
        
        if (this.magnetActive) {
            this.magnetTimer -= dt;
            if (this.magnetTimer <= 0) this.magnetActive = false;
            
            // Attract nearby power-ups
            this.engine.powerUps.forEach(powerUp => {
                const dx = this.x - powerUp.x;
                const dy = this.y - powerUp.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    powerUp.x += (dx / dist) * 150 * dt;
                    powerUp.y += (dy / dist) * 150 * dt;
                }
            });
        }
        
        if (this.multishotActive) {
            this.multishotTimer -= dt;
            if (this.multishotTimer <= 0) this.multishotActive = false;
        }
        
        if (this.barrierActive) {
            this.barrierTimer -= dt;
            if (this.barrierTimer <= 0) this.barrierActive = false;
            this.barrierAngle += dt * 3;
        }
        
        if (this.rageActive) {
            this.rageTimer -= dt;
            if (this.rageTimer <= 0) this.rageActive = false;
        }

        if (this.invulnerable) {
            this.invulnerabilityTimer -= dt;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }

        // Apply time slow effect to game
        const effectiveDt = this.timeSlowActive ? dt * 0.3 : dt;

        // Movement
        if (this.engine.inputManager) {
            const movement = this.engine.inputManager.getMovementVector();
            const currentSpeed = this.speedBoost ? this.speed * 1.8 : this.speed;
            const rageSpeed = this.rageActive ? currentSpeed * 1.3 : currentSpeed;
            
            this.x += movement.x * rageSpeed * dt;
            this.y += movement.y * rageSpeed * dt;

            // Clamp to screen bounds
            this.x = Math.max(0, Math.min(this.x, this.engine.width - this.width));
            this.y = Math.max(0, Math.min(this.y, this.engine.height - this.height));

            // Shooting
            if (this.engine.inputManager.isShooting()) {
                this.shoot(dt);
            }
        }

        // Animation
        this.animationTimer += dt;
        if (this.animationTimer > 0.1) {
            this.frame = (this.frame + 1) % 4;
            this.animationTimer = 0;
        }

        this.lastShotTime += dt;
    }

    shoot(dt) {
        const baseFireRate = this.rageActive ? this.fireRate * 0.5 : this.fireRate;
        if (this.lastShotTime < baseFireRate) return;

        this.lastShotTime = 0;

        if (this.engine.soundManager) {
            this.engine.soundManager.play('shoot');
        }

        const bulletSpeed = this.rageActive ? 600 : 450;
        const bulletX = this.x + this.width;
        const bulletY = this.y + this.height / 2;

        // Laser beam mode
        if (this.laserActive) {
            this.engine.bullets.push(new LaserBullet(bulletX, bulletY, bulletSpeed));
            return;
        }

        // Multishot mode (8-way)
        if (this.multishotActive) {
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i / 8) - Math.PI / 2;
                const vx = Math.cos(angle) * bulletSpeed;
                const vy = Math.sin(angle) * bulletSpeed;
                this.engine.bullets.push(new Bullet(bulletX, bulletY, vx, vy, true));
            }
            return;
        }

        // Homing missiles
        if (this.homingActive) {
            this.engine.bullets.push(new HomingBullet(this.engine, bulletX, bulletY, bulletSpeed));
            this.engine.bullets.push(new HomingBullet(this.engine, bulletX, bulletY - 10, bulletSpeed));
            return;
        }

        // Regular weapon tiers
        switch (this.weaponLevel) {
            case 1:
                // Single bullet
                this.engine.bullets.push(new Bullet(bulletX, bulletY, bulletSpeed, 0));
                break;
            case 2:
                // Double bullets
                this.engine.bullets.push(new Bullet(bulletX, bulletY - 8, bulletSpeed, 0));
                this.engine.bullets.push(new Bullet(bulletX, bulletY + 8, bulletSpeed, 0));
                break;
            case 3:
                // Triple spread
                this.engine.bullets.push(new Bullet(bulletX, bulletY, bulletSpeed, 0));
                this.engine.bullets.push(new Bullet(bulletX, bulletY - 12, bulletSpeed, -0.3));
                this.engine.bullets.push(new Bullet(bulletX, bulletY + 12, bulletSpeed, 0.3));
                break;
            case 4:
                // Quad rapid fire
                this.engine.bullets.push(new Bullet(bulletX, bulletY - 10, bulletSpeed, 0));
                this.engine.bullets.push(new Bullet(bulletX, bulletY - 3, bulletSpeed, 0));
                this.engine.bullets.push(new Bullet(bulletX, bulletY + 3, bulletSpeed, 0));
                this.engine.bullets.push(new Bullet(bulletX, bulletY + 10, bulletSpeed, 0));
                break;
        }
    }

    render(ctx) {
        ctx.save();

        // Flashing effect when invulnerable
        if (this.invulnerable) {
            if (Math.floor(this.invulnerabilityTimer * 10) % 2 === 0) {
                ctx.globalAlpha = 0.5;
            }
        }

        // Draw shield if active
        if (this.shieldActive) {
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00FFFF';
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                    Math.max(this.width, this.height) / 2 + 8, 0, Math.PI * 2);
            ctx.stroke();
            
            // Inner glow
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.restore();
        }

        // Draw barrier orbs if active
        if (this.barrierActive) {
            ctx.save();
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = 50;
            const orbCount = 6;
            const rotationSpeed = 2;
            const rotation = Date.now() * 0.001 * rotationSpeed;

            for (let i = 0; i < orbCount; i++) {
                const angle = (Math.PI * 2 * i / orbCount) + rotation;
                const orbX = centerX + Math.cos(angle) * radius;
                const orbY = centerY + Math.sin(angle) * radius;

                // Orb glow
                const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 8);
                orbGradient.addColorStop(0, '#00FFFF');
                orbGradient.addColorStop(0.5, '#0088FF');
                orbGradient.addColorStop(1, 'rgba(0, 136, 255, 0)');

                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00FFFF';
                ctx.fillStyle = orbGradient;
                ctx.beginPath();
                ctx.arc(orbX, orbY, 8, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(orbX, orbY, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Rage mode aura
        if (this.rageActive) {
            ctx.save();
            const pulseSize = Math.sin(Date.now() * 0.01) * 10 + 60;
            const auraGradient = ctx.createRadialGradient(
                this.x + this.width / 2, this.y + this.height / 2, 0,
                this.x + this.width / 2, this.y + this.height / 2, pulseSize
            );
            auraGradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
            auraGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.2)');
            auraGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

            ctx.shadowBlur = 30;
            ctx.shadowColor = '#FF0000';
            ctx.fillStyle = auraGradient;
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Ship trail effect
        if (!this.invulnerable || Math.floor(this.invulnerabilityTimer * 10) % 2 === 1) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            for (let i = 1; i <= 3; i++) {
                const trailGradient = ctx.createLinearGradient(
                    this.x - i * 15, this.y,
                    this.x, this.y
                );
                trailGradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
                trailGradient.addColorStop(1, 'rgba(100, 150, 255, 0.5)');
                ctx.fillStyle = trailGradient;
                ctx.fillRect(this.x - i * 15, this.y + this.height * 0.3, 15, this.height * 0.4);
            }
            ctx.restore();
        }

        // Main ship body with gradient
        const bodyGradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        bodyGradient.addColorStop(0, '#4488ff');
        bodyGradient.addColorStop(0.5, '#2266dd');
        bodyGradient.addColorStop(1, '#1144aa');
        
        ctx.fillStyle = bodyGradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#4488ff';
        
        // Ship body shape
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width * 0.7, this.y);
        ctx.lineTo(this.x, this.y + this.height * 0.25);
        ctx.lineTo(this.x, this.y + this.height * 0.75);
        ctx.lineTo(this.x + this.width * 0.7, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Cockpit glow
        const cockpitGradient = ctx.createRadialGradient(
            this.x + this.width * 0.5, this.y + this.height / 2, 0,
            this.x + this.width * 0.5, this.y + this.height / 2, this.width * 0.2
        );
        cockpitGradient.addColorStop(0, '#ffffff');
        cockpitGradient.addColorStop(0.5, '#88ccff');
        cockpitGradient.addColorStop(1, '#2266dd');
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.fillStyle = cockpitGradient;
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.5, this.y + this.height / 2, this.width * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Wing details
        ctx.fillStyle = '#6699ff';
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x + this.width * 0.3, this.y + 2, this.width * 0.3, 4);
        ctx.fillRect(this.x + this.width * 0.3, this.y + this.height - 6, this.width * 0.3, 4);

        // Engine exhaust animation
        ctx.shadowBlur = 20;
        const exhaustColor = this.speedBoost ? '#00FFFF' : '#FF6600';
        ctx.shadowColor = exhaustColor;
        
        if (this.frame < 2) {
            const exhaustGradient = ctx.createLinearGradient(
                this.x - 12, this.y,
                this.x, this.y
            );
            exhaustGradient.addColorStop(0, 'rgba(255, 100, 0, 0)');
            exhaustGradient.addColorStop(1, exhaustColor);
            ctx.fillStyle = exhaustGradient;
            ctx.fillRect(this.x - 12, this.y + this.height * 0.3, 12, this.height * 0.4);
        }

        // Weapon level indicator
        if (this.weaponLevel > 1) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00FF00';
            ctx.fillStyle = '#00FF00';
            for (let i = 0; i < this.weaponLevel - 1; i++) {
                ctx.fillRect(this.x + 8 + i * 8, this.y - 8, 5, 5);
            }
        }

        ctx.restore();
    }

    powerUp(type) {
        switch (type) {
            case 'weapon':
                if (this.weaponLevel < 4) {
                    this.weaponLevel++;
                    if (this.weaponLevel === 4) {
                        this.fireRate = 0.15; // Rapid fire
                    }
                }
                break;
            case 'shield':
                this.shieldActive = true;
                this.shieldTimer = 8;
                break;
            case 'speed':
                this.speedBoost = true;
                this.speedBoostTimer = 7;
                break;
            case 'laser':
                this.laserActive = true;
                this.laserTimer = 6;
                break;
            case 'homing':
                this.homingActive = true;
                this.homingTimer = 8;
                break;
            case 'timeslow':
                this.timeSlowActive = true;
                this.timeSlowTimer = 10;
                break;
            case 'magnet':
                this.magnetActive = true;
                this.magnetTimer = 12;
                break;
            case 'multishot':
                this.multishotActive = true;
                this.multishotTimer = 6;
                break;
            case 'barrier':
                this.barrierActive = true;
                this.barrierTimer = 15;
                break;
            case 'rage':
                this.rageActive = true;
                this.rageTimer = 8;
                break;
        }
    }

    makeInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerabilityTimer = duration / 1000;
    }

    reset() {
        this.x = 50;
        this.y = this.engine.height / 2;
        this.weaponLevel = 1;
        this.fireRate = 0.25;
        this.lastShotTime = 0;
        this.shieldActive = false;
        this.speedBoost = false;
        this.invulnerable = false;
        this.active = true;
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
 * Bullet - Player projectile
 */
export class Bullet {
    constructor(x, y, speedX, speedY = 0, isMultishot = false) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 8;
        this.speedX = typeof speedX === 'number' && speedY === 0 ? speedX : speedX;
        this.speedY = speedY;
        this.active = true;
        this.damage = 15;
        this.isMultishot = isMultishot;
    }

    update(dt) {
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
    }

    render(ctx) {
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFFF00';
        
        // Bullet gradient
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.5, '#FFFFFF');
        gradient.addColorStop(1, '#FFFF00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);
        
        // Glow tip
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x + this.width - 6, this.y - this.height / 2, 6, this.height);
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}

/**
 * LaserBullet - Continuous laser beam
 */
export class LaserBullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = 1280;
        this.height = 16;
        this.speedX = 0;
        this.speedY = 0;
        this.active = true;
        this.damage = 25;
        this.lifetime = 0.15;
    }

    update(dt) {
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            this.active = false;
        }
    }

    render(ctx) {
        ctx.save();
        
        // Laser beam with glow
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
        gradient.addColorStop(0, '#FF00FF');
        gradient.addColorStop(0.5, '#FFFFFF');
        gradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF00FF';
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);
        
        // Core beam
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(this.x, this.y - 4, this.width, 8);
        
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}

/**
 * HomingBullet - Seeks nearest enemy
 */
export class HomingBullet {
    constructor(engine, x, y, speed) {
        this.engine = engine;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = speed;
        this.speedX = speed;
        this.speedY = 0;
        this.active = true;
        this.damage = 20;
        this.turnRate = 5;
    }

    update(dt) {
        // Find nearest enemy
        let nearestEnemy = null;
        let nearestDist = Infinity;
        
        this.engine.enemies.forEach(enemy => {
            if (!enemy.active) return;
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestEnemy = enemy;
            }
        });
        
        // Home towards enemy
        if (nearestEnemy) {
            const dx = nearestEnemy.x - this.x;
            const dy = nearestEnemy.y - this.y;
            const angle = Math.atan2(dy, dx);
            const currentAngle = Math.atan2(this.speedY, this.speedX);
            
            let angleDiff = angle - currentAngle;
            // Normalize angle
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            const turnAmount = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnRate * dt);
            const newAngle = currentAngle + turnAmount;
            
            this.speedX = Math.cos(newAngle) * this.speed;
            this.speedY = Math.sin(newAngle) * this.speed;
        }
        
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
    }

    render(ctx) {
        ctx.save();
        
        // Trail effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF6600';
        
        const angle = Math.atan2(this.speedY, this.speedX);
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        
        // Missile body
        const gradient = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
        gradient.addColorStop(0, '#CC3300');
        gradient.addColorStop(0.5, '#FF6600');
        gradient.addColorStop(1, '#FFAA00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Tip
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(this.width / 2 - 5, -this.height / 2);
        ctx.lineTo(this.width / 2 - 5, this.height / 2);
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
