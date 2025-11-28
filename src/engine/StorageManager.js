/**
 * StorageManager - LocalStorage management for game data
 * Handles high scores, settings, and game progress persistence
 */
export class StorageManager {
    constructor() {
        this.storageKey = 'spaceImpact_data';
        this.maxHighScores = 10;
        this.data = this.loadData();
    }

    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load data from localStorage', e);
        }

        // Default data structure
        return {
            highScores: [],
            settings: {
                volume: 0.3,
                muted: false
            },
            progress: {
                maxLevel: 1,
                maxWeapon: 1
            }
        };
    }

    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save data to localStorage', e);
        }
    }

    /**
     * Add a new high score
     * @param {number} score - The score to add
     * @param {number} level - The level reached
     * @returns {boolean} - True if it's a new high score
     */
    addHighScore(score, level) {
        const entry = {
            score: score,
            level: level,
            date: new Date().toISOString()
        };

        this.data.highScores.push(entry);
        this.data.highScores.sort((a, b) => b.score - a.score);
        this.data.highScores = this.data.highScores.slice(0, this.maxHighScores);

        this.saveData();

        // Check if it's a new high score (top score)
        return this.data.highScores[0].score === score;
    }

    /**
     * Get all high scores
     * @returns {Array} - Array of high score entries
     */
    getHighScores() {
        return this.data.highScores;
    }

    /**
     * Get the top score
     * @returns {number} - The highest score
     */
    getTopScore() {
        if (this.data.highScores.length > 0) {
            return this.data.highScores[0].score;
        }
        return 0;
    }

    /**
     * Check if a score is a high score
     * @param {number} score - Score to check
     * @returns {boolean} - True if it's in top 10
     */
    isHighScore(score) {
        if (this.data.highScores.length < this.maxHighScores) {
            return true;
        }
        return score > this.data.highScores[this.data.highScores.length - 1].score;
    }

    /**
     * Update game progress
     * @param {number} level - Level reached
     * @param {number} weapon - Weapon level
     */
    updateProgress(level, weapon) {
        if (level > this.data.progress.maxLevel) {
            this.data.progress.maxLevel = level;
        }
        if (weapon > this.data.progress.maxWeapon) {
            this.data.progress.maxWeapon = weapon;
        }
        this.saveData();
    }

    /**
     * Get progress data
     * @returns {Object} - Progress object
     */
    getProgress() {
        return this.data.progress;
    }

    /**
     * Save settings
     * @param {Object} settings - Settings object
     */
    saveSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.saveData();
    }

    /**
     * Get settings
     * @returns {Object} - Settings object
     */
    getSettings() {
        return this.data.settings;
    }

    /**
     * Clear all data
     */
    clearData() {
        this.data = {
            highScores: [],
            settings: {
                volume: 0.3,
                muted: false
            },
            progress: {
                maxLevel: 1,
                maxWeapon: 1
            }
        };
        this.saveData();
    }

    /**
     * Format date for display
     * @param {string} isoDate - ISO date string
     * @returns {string} - Formatted date
     */
    formatDate(isoDate) {
        const date = new Date(isoDate);
        return date.toLocaleDateString();
    }
}
