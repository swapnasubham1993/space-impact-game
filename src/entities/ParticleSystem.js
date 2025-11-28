/**
 * ParticleSystem - Explosion and visual effects
 * Creates particle explosions for destroyed enemies and impacts
 */
export class ParticleSystem {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.particles = [];
    }

    createExplosion(x, y, color = '#FFFFFF', count = 15, speed = 150) {
        // More particles for better visual
        const particleCount = Math.max(count, 30);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.5 - 0.25);
            const velocity = speed * (0.5 + Math.random() * 0.5);
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            this.particles.push(new Particle(x, y, vx, vy, color));
        }
        
        // Add some bright white core particles
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = speed * (0.3 + Math.random() * 0.4);
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            this.particles.push(new Particle(x, y, vx, vy, '#FFFFFF', 0.4));
        }
    }

    createTrail(x, y, color = '#FFFFFF', count = 3) {
        for (let i = 0; i < count; i++) {
            const vx = (Math.random() - 0.5) * 50;
            const vy = (Math.random() - 0.5) * 50;
            this.particles.push(new Particle(x, y, vx, vy, color, 0.3));
        }
    }

    update(dt) {
        this.particles = this.particles.filter(particle => {
            particle.update(dt);
            return particle.active;
        });
    }

    render(ctx) {
        this.particles.forEach(particle => particle.render(ctx));
    }

    clear() {
        this.particles = [];
    }
}

/**
 * Particle - Individual particle in an explosion
 */
class Particle {
    constructor(x, y, vx, vy, color, lifetime = 0.6) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.lifetime = lifetime;
        this.maxLifetime = lifetime;
        this.size = 2 + Math.random() * 2;
        this.active = true;
        this.gravity = 100; // Slight downward acceleration
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Apply gravity
        this.vy += this.gravity * dt;
        
        // Friction
        this.vx *= 0.98;
        this.vy *= 0.98;
        
        // Decrease lifetime
        this.lifetime -= dt;
        if (this.lifetime <= 0) {
            this.active = false;
        }
    }

    render(ctx) {
        const alpha = this.lifetime / this.maxLifetime;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}
