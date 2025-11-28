/**
 * LevelManager - Level progression and difficulty scaling
 * Manages level transitions, difficulty increases, and level state
 */
export class LevelManager {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.currentLevel = 1;
        this.levelDuration = 0;
        this.showLevelText = false;
        this.levelTextTimer = 0;
        this.levelTextDuration = 2; // seconds to show level text
    }

    startLevel(level) {
        this.currentLevel = level;
        this.levelDuration = 0;
        this.showLevelText = true;
        this.levelTextTimer = this.levelTextDuration;
        
        // Start enemy manager for this level
        if (this.engine.enemyManager) {
            this.engine.enemyManager.startLevel(level);
        }
        
        // Adjust game difficulty
        this.adjustDifficulty(level);
    }

    adjustDifficulty(level) {
        // Increase scroll speed
        this.engine.scrollSpeed = 2 + (level - 1) * 0.3;
        
        // Could adjust other parameters here:
        // - Enemy health multiplier
        // - Enemy speed multiplier
        // - Spawn rate
        // - etc.
    }

    update(dt) {
        this.levelDuration += dt;
        
        // Update level text timer
        if (this.showLevelText) {
            this.levelTextTimer -= dt;
            if (this.levelTextTimer <= 0) {
                this.showLevelText = false;
            }
        }
    }

    reset() {
        this.currentLevel = 1;
        this.levelDuration = 0;
        this.showLevelText = false;
        this.levelTextTimer = 0;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getLevelDuration() {
        return this.levelDuration;
    }
}
