/**
 * EnemyManager - Spawns enemies in patterns
 * Manages enemy waves and spawn timing for each level
 */
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';

export class EnemyManager {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.spawnTimer = 0;
        this.waveTimer = 0;
        this.currentWave = 0;
        this.wavesPerLevel = 5;
        this.bossSpawned = false;
        
        // Spawn patterns for each level
        this.patterns = {
            1: ['A', 'A', 'B', 'A', 'A'],
            2: ['B', 'A', 'C', 'B', 'A'],
            3: ['C', 'B', 'D', 'C', 'B'],
            4: ['D', 'C', 'E', 'D', 'C'],
            5: ['E', 'D', 'F', 'E', 'D']
        };
    }

    startLevel(level) {
        this.currentWave = 0;
        this.waveTimer = 0;
        this.spawnTimer = 0;
        this.bossSpawned = false;
    }

    update(dt) {
        this.spawnTimer -= dt;
        this.waveTimer += dt;
        
        // Spawn enemies based on wave timer
        const waveInterval = 15; // seconds per wave
        const targetWave = Math.floor(this.waveTimer / waveInterval);
        
        if (targetWave > this.currentWave && this.currentWave < this.wavesPerLevel) {
            this.currentWave = targetWave;
            this.spawnWave();
        }
        
        // Spawn boss after all waves
        if (this.currentWave >= this.wavesPerLevel && 
            !this.bossSpawned && 
            this.engine.enemies.length === 0) {
            this.spawnBoss();
        }
        
        // Continuous spawning
        if (this.currentWave < this.wavesPerLevel && this.spawnTimer <= 0) {
            this.spawnEnemy();
            this.spawnTimer = this.getSpawnInterval();
        }
    }

    getSpawnInterval() {
        // Faster spawning at higher levels
        const baseInterval = 2.5;
        const levelModifier = Math.max(0.5, 1 - (this.engine.level - 1) * 0.1);
        return baseInterval * levelModifier;
    }

    spawnWave() {
        const pattern = this.getPatternForLevel(this.engine.level);
        const waveSize = 3 + Math.floor(this.engine.level / 2);
        
        for (let i = 0; i < waveSize; i++) {
            setTimeout(() => {
                const type = pattern[Math.floor(Math.random() * pattern.length)];
                this.spawnEnemy(type, i * 50);
            }, i * 400);
        }
    }

    getPatternForLevel(level) {
        // Get pattern or use level 5 pattern for higher levels
        if (level <= 5) {
            return this.patterns[level];
        } else {
            return this.patterns[5];
        }
    }

    spawnEnemy(type = null, xOffset = 0) {
        // Random type if not specified
        if (!type) {
            const pattern = this.getPatternForLevel(this.engine.level);
            type = pattern[Math.floor(Math.random() * pattern.length)];
        }
        
        // Random Y position
        const minY = 20;
        const maxY = this.engine.height - 60;
        const y = minY + Math.random() * (maxY - minY);
        
        // Spawn off-screen to the right
        const x = this.engine.width + xOffset;
        
        const enemy = new Enemy(this.engine, x, y, type);
        this.engine.enemies.push(enemy);
    }

    spawnBoss() {
        this.bossSpawned = true;
        const boss = new Boss(this.engine, this.engine.level);
        this.engine.enemies.push(boss);
    }

    reset() {
        this.currentWave = 0;
        this.waveTimer = 0;
        this.spawnTimer = 0;
        this.bossSpawned = false;
    }
}
