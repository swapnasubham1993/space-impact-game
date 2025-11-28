/**
 * InputManager - Handles keyboard and touch input
 * Manages key states, touch events, and input normalization
 */
export class InputManager {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.keys = {};
        this.touch = {
            active: false,
            x: 0,
            y: 0,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0
        };
        this.shooting = false;
        this.shootingTouch = false;

        this.initKeyboard();
        this.initTouch();
    }

    initKeyboard() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;

            // Prevent default for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            // Handle special keys
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
            if (e.key === 'm' || e.key === 'M') {
                this.toggleMute();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });
    }

    initTouch() {
        // Joystick controls
        const joystickArea = document.getElementById('joystickArea');
        const joystickStick = document.getElementById('joystickStick');
        
        if (joystickArea) {
            joystickArea.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = joystickArea.getBoundingClientRect();
                this.touch.active = true;
                this.touch.startX = touch.clientX - rect.left;
                this.touch.startY = touch.clientY - rect.top;
            });

            joystickArea.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (!this.touch.active) return;

                const touch = e.touches[0];
                const rect = joystickArea.getBoundingClientRect();
                const currentX = touch.clientX - rect.left;
                const currentY = touch.clientY - rect.top;

                // Calculate delta from start position
                const deltaX = currentX - this.touch.startX;
                const deltaY = currentY - this.touch.startY;

                // Limit joystick range
                const maxDistance = 40;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance > maxDistance) {
                    const angle = Math.atan2(deltaY, deltaX);
                    this.touch.moveX = Math.cos(angle) * maxDistance;
                    this.touch.moveY = Math.sin(angle) * maxDistance;
                } else {
                    this.touch.moveX = deltaX;
                    this.touch.moveY = deltaY;
                }

                // Update visual joystick
                if (joystickStick) {
                    joystickStick.style.transform = `translate(${this.touch.moveX}px, ${this.touch.moveY}px)`;
                }
            });

            const touchEnd = () => {
                this.touch.active = false;
                this.touch.moveX = 0;
                this.touch.moveY = 0;
                if (joystickStick) {
                    joystickStick.style.transform = 'translate(0, 0)';
                }
            };

            joystickArea.addEventListener('touchend', touchEnd);
            joystickArea.addEventListener('touchcancel', touchEnd);
        }

        // Shoot button
        const shootBtn = document.getElementById('shootBtn');
        if (shootBtn) {
            shootBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.shootingTouch = true;
            });

            shootBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.shootingTouch = false;
            });

            shootBtn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.shootingTouch = false;
            });
        }

        // Pause button
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }

        // Mute button
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => this.toggleMute());
        }
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    getMovementVector() {
        let x = 0;
        let y = 0;

        // Keyboard input
        if (this.isKeyPressed('arrowleft') || this.isKeyPressed('a')) x -= 1;
        if (this.isKeyPressed('arrowright') || this.isKeyPressed('d')) x += 1;
        if (this.isKeyPressed('arrowup') || this.isKeyPressed('w')) y -= 1;
        if (this.isKeyPressed('arrowdown') || this.isKeyPressed('s')) y += 1;

        // Touch input
        if (this.touch.active) {
            const threshold = 15;
            if (Math.abs(this.touch.moveX) > threshold) {
                x = this.touch.moveX / 40;
            }
            if (Math.abs(this.touch.moveY) > threshold) {
                y = this.touch.moveY / 40;
            }
        }

        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }

        return { x, y };
    }

    isShooting() {
        return this.isKeyPressed(' ') || 
               this.isKeyPressed('space') || 
               this.shootingTouch;
    }

    togglePause() {
        if (this.engine.state === 'playing') {
            this.engine.pause();
            document.getElementById('pauseOverlay').style.display = 'flex';
        } else if (this.engine.state === 'paused') {
            this.engine.resume();
            document.getElementById('pauseOverlay').style.display = 'none';
        }
    }

    toggleMute() {
        if (this.engine.soundManager) {
            this.engine.soundManager.toggleMute();
            const muteBtn = document.getElementById('muteBtn');
            if (muteBtn) {
                muteBtn.textContent = this.engine.soundManager.muted ? '🔇' : '🔊';
            }
        }
    }

    reset() {
        this.keys = {};
        this.touch = {
            active: false,
            x: 0,
            y: 0,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0
        };
        this.shooting = false;
        this.shootingTouch = false;
    }
}
