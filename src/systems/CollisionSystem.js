/**
 * CollisionSystem - AABB collision detection
 * Handles all collision checks between game entities
 */
export class CollisionSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
    }

    /**
     * Check AABB collision between two rectangles
     */
    checkAABB(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    /**
     * Main collision detection method
     */
    checkCollisions() {
        // Player bullets vs enemies
        this.checkPlayerBulletsVsEnemies();
        
        // Player vs enemies
        this.checkPlayerVsEnemies();
        
        // Player vs enemy bullets
        this.checkPlayerVsEnemyBullets();
        
        // Player vs power-ups
        this.checkPlayerVsPowerUps();
    }

    checkPlayerBulletsVsEnemies() {
        this.engine.bullets.forEach(bullet => {
            if (!bullet.active) return;
            
            const bulletBounds = bullet.getBounds();
            
            // Check against regular enemies
            this.engine.enemies.forEach(enemy => {
                if (!enemy.active) return;
                
                const enemyBounds = enemy.getBounds();
                
                if (this.checkAABB(bulletBounds, enemyBounds)) {
                    bullet.active = false;
                    enemy.hit(bullet.damage);
                }
            });
        });
    }

    checkPlayerVsEnemies() {
        if (!this.engine.player || !this.engine.player.active) return;
        if (this.engine.player.invulnerable) return;
        
        const playerBounds = this.engine.player.getBounds();
        
        this.engine.enemies.forEach(enemy => {
            if (!enemy.active) return;
            
            const enemyBounds = enemy.getBounds();
            
            if (this.checkAABB(playerBounds, enemyBounds)) {
                // Check shield
                if (this.engine.player.shieldActive) {
                    // Shield absorbs collision
                    enemy.destroy();
                    this.engine.player.shieldActive = false;
                } else {
                    // Player takes damage
                    this.engine.loseLife();
                    enemy.destroy();
                }
            }
        });
    }

    checkPlayerVsEnemyBullets() {
        if (!this.engine.player || !this.engine.player.active) return;
        if (this.engine.player.invulnerable) return;
        
        const playerBounds = this.engine.player.getBounds();
        
        this.engine.enemyBullets.forEach(bullet => {
            if (!bullet.active) return;
            
            const bulletBounds = bullet.getBounds();
            
            if (this.checkAABB(playerBounds, bulletBounds)) {
                bullet.active = false;
                
                // Check shield
                if (this.engine.player.shieldActive) {
                    // Shield absorbs bullet
                    this.engine.createExplosion(
                        bullet.x,
                        bullet.y,
                        '#00FFFF',
                        5
                    );
                } else {
                    // Player takes damage
                    this.engine.loseLife();
                }
            }
        });
    }

    checkPlayerVsPowerUps() {
        if (!this.engine.player || !this.engine.player.active) return;
        
        const playerBounds = this.engine.player.getBounds();
        
        this.engine.powerUps.forEach(powerUp => {
            if (!powerUp.active) return;
            
            const powerUpBounds = powerUp.getBounds();
            
            if (this.checkAABB(playerBounds, powerUpBounds)) {
                powerUp.collect();
            }
        });
    }
}
