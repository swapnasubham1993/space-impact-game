/**
 * Space Impact - Main Entry Point
 * Nokia-style browser game with retro aesthetics
 */

import { GameEngine } from './engine/GameEngine.js';
import { InputManager } from './engine/InputManager.js';
import { SoundManager } from './engine/SoundManager.js';
import { StorageManager } from './engine/StorageManager.js';
import { Player } from './entities/Player.js';
import { ParticleSystem } from './entities/ParticleSystem.js';
import { CollisionSystem } from './systems/CollisionSystem.js';
import { LevelManager } from './systems/LevelManager.js';
import { UIManager } from './systems/UIManager.js';
import { EnemyManager } from './systems/EnemyManager.js';

/**
 * Game initialization
 */
class SpaceImpactGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.engine = null;
        this.initialized = false;
        
        this.init();
    }

    async init() {
        console.log('%c╔══════════════════════════════════════════╗', 'color: #00FF00');
        console.log('%c║                                          ║', 'color: #00FF00');
        console.log('%c║         SPACE IMPACT - NOKIA             ║', 'color: #00FF00; font-weight: bold');
        console.log('%c║         Classic Browser Edition          ║', 'color: #00FF00');
        console.log('%c║                                          ║', 'color: #00FF00');
        console.log('%c╚══════════════════════════════════════════╝', 'color: #00FF00');
        console.log('');
        
        // Initialize core engine
        this.engine = new GameEngine(this.canvas);
        
        // Initialize managers
        const storageManager = new StorageManager();
        const soundManager = new SoundManager();
        const inputManager = new InputManager(this.engine);
        const particleSystem = new ParticleSystem(this.engine);
        const collisionSystem = new CollisionSystem(this.engine);
        const levelManager = new LevelManager(this.engine);
        const enemyManager = new EnemyManager(this.engine);
        const uiManager = new UIManager(this.engine, storageManager);
        
        // Initialize player
        const player = new Player(this.engine);
        
        // Connect all systems to engine
        this.engine.soundManager = soundManager;
        this.engine.inputManager = inputManager;
        this.engine.particleSystem = particleSystem;
        this.engine.collisionSystem = collisionSystem;
        this.engine.levelManager = levelManager;
        this.engine.enemyManager = enemyManager;
        this.engine.uiManager = uiManager;
        this.engine.player = player;
        
        // Set up menu system
        this.setupMenus(storageManager);
        
        // Hide loading indicator
        document.getElementById('loadingIndicator').style.display = 'none';
        
        this.initialized = true;
        console.log('%c✅ Game initialized successfully! Ready to play!', 'color: #00FF00; font-weight: bold');
        console.log('%cPress START or SPACE to begin your mission, Commander! 🚀', 'color: #FFAA00');
        console.log('');
    }

    setupMenus(storageManager) {
        // Title screen buttons
        document.getElementById('startBtn')?.addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('instructionsBtn')?.addEventListener('click', () => {
            this.showInstructions();
        });
        
        document.getElementById('highScoresBtn')?.addEventListener('click', () => {
            this.showHighScores(storageManager);
        });
        
        // Back buttons
        document.getElementById('backBtn')?.addEventListener('click', () => {
            this.showTitleScreen();
        });
        
        document.getElementById('backBtn2')?.addEventListener('click', () => {
            this.showTitleScreen();
        });
        
        // Allow space or click to start from title
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && document.getElementById('titleScreen').classList.contains('active')) {
                e.preventDefault();
                this.startGame();
            }
        });
    }

    startGame() {
        // Hide all screens except game screen
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById('gameScreen').classList.add('active');
        
        // Reset and start engine
        this.engine.reset();
        this.engine.state = 'playing';
        this.engine.start();
        
        // Initialize audio context on first interaction
        if (this.engine.soundManager) {
            this.engine.soundManager.resume();
        }
    }

    showTitleScreen() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById('titleScreen').classList.add('active');
    }

    showInstructions() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById('instructionsScreen').classList.add('active');
    }

    showHighScores(storageManager) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById('highScoresScreen').classList.add('active');
        
        // Populate high scores
        const scoresList = document.getElementById('scoresList');
        const scores = storageManager.getHighScores();
        
        if (scores.length === 0) {
            scoresList.innerHTML = '<p style="text-align: center; margin-top: 20px;">No high scores yet!</p>';
        } else {
            let html = '';
            scores.forEach((entry, index) => {
                const date = new Date(entry.date).toLocaleDateString();
                html += `
                    <div class="score-entry">
                        <span>${index + 1}. Level ${entry.level}</span>
                        <span>${entry.score}</span>
                    </div>
                `;
            });
            scoresList.innerHTML = html;
        }
    }
}

// Start the game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SpaceImpactGame();
    });
} else {
    new SpaceImpactGame();
}

// Prevent context menu on right-click
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
});

// Prevent default touch behaviors
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.mobile-controls') || e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
}, { passive: false });
