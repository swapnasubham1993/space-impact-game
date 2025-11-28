/**
 * UIManager - Manages all UI updates and overlays
 * Handles score, lives, level display, and game state overlays
 */
export class UIManager {
    constructor(gameEngine, storageManager) {
        this.engine = gameEngine;
        this.storage = storageManager;
        
        // UI elements
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.livesDisplay = document.getElementById('livesDisplay');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.bossHealthBar = document.getElementById('bossHealthBar');
        this.bossHealthFill = document.getElementById('bossHealthFill');
        
        // Overlays
        this.pauseOverlay = document.getElementById('pauseOverlay');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.levelCompleteOverlay = document.getElementById('levelCompleteOverlay');
        
        this.initializeButtons();
    }

    initializeButtons() {
        // Resume button
        document.getElementById('resumeBtn')?.addEventListener('click', () => {
            this.engine.resume();
            this.pauseOverlay.style.display = 'none';
        });
        
        // Quit button
        document.getElementById('quitBtn')?.addEventListener('click', () => {
            this.pauseOverlay.style.display = 'none';
            this.showMainMenu();
        });
        
        // Restart button
        document.getElementById('restartBtn')?.addEventListener('click', () => {
            this.gameOverOverlay.style.display = 'none';
            this.restartGame();
        });
        
        // Main menu button
        document.getElementById('mainMenuBtn')?.addEventListener('click', () => {
            this.gameOverOverlay.style.display = 'none';
            this.showMainMenu();
        });
        
        // Next level button
        document.getElementById('nextLevelBtn')?.addEventListener('click', () => {
            this.levelCompleteOverlay.style.display = 'none';
            this.engine.nextLevel();
        });
    }

    updateScore(score) {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = score.toString().padStart(6, '0');
        }
    }

    updateLives(lives) {
        if (this.livesDisplay) {
            this.livesDisplay.textContent = '♥'.repeat(Math.max(0, lives));
        }
    }

    updateLevel(level) {
        if (this.levelDisplay) {
            this.levelDisplay.textContent = level;
        }
    }

    showBossHealth(hp, maxHp) {
        if (this.bossHealthBar) {
            this.bossHealthBar.style.display = 'block';
            this.updateBossHealth(hp, maxHp);
        }
    }

    updateBossHealth(hp, maxHp) {
        if (this.bossHealthFill) {
            const percent = (hp / maxHp) * 100;
            this.bossHealthFill.style.width = percent + '%';
        }
    }

    hideBossHealth() {
        if (this.bossHealthBar) {
            this.bossHealthBar.style.display = 'none';
        }
    }

    showGameOver(score, level) {
        if (this.gameOverOverlay) {
            document.getElementById('finalScore').textContent = score;
            document.getElementById('finalLevel').textContent = level;
            
            // Check if it's a high score
            const isHighScore = this.storage.addHighScore(score, level);
            const newHighScoreText = document.getElementById('newHighScore');
            if (newHighScoreText) {
                newHighScoreText.style.display = isHighScore ? 'block' : 'none';
            }
            
            this.gameOverOverlay.style.display = 'flex';
        }
    }

    showLevelComplete(level, bonus) {
        if (this.levelCompleteOverlay) {
            document.getElementById('completedLevel').textContent = level;
            document.getElementById('bonusScore').textContent = bonus;
            this.levelCompleteOverlay.style.display = 'flex';
        }
    }

    showMainMenu() {
        // Hide game screen
        document.getElementById('gameScreen')?.classList.remove('active');
        // Show title screen
        document.getElementById('titleScreen')?.classList.add('active');
        // Stop engine
        this.engine.stop();
    }

    restartGame() {
        this.engine.reset();
        this.engine.start();
    }

    hideAllOverlays() {
        if (this.pauseOverlay) this.pauseOverlay.style.display = 'none';
        if (this.gameOverOverlay) this.gameOverOverlay.style.display = 'none';
        if (this.levelCompleteOverlay) this.levelCompleteOverlay.style.display = 'none';
    }
}
