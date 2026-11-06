import React, { useEffect, useRef } from 'react';

/**
 * ParticleBackground
 * 
 * Clean, lightweight, and high-performance HTML Canvas particle effect.
 * Features:
 * - Tiny circular dots in primary orange (#F07824) and soft light orange (#FFD2AE)
 * - Continuous smooth falling motion from TOP to BOTTOM with natural horizontal sway
 * - Responsive particle density scaled by viewport area
 * - Gentle mouse repulsion interaction with distance falloff
 * - Multi-depth opacity layering (0.18 - 0.75) for soft visual depth
 * - Automatically pauses on inactive browser tab (visibilitychange)
 * - Respects prefers-reduced-motion accessibility preference
 * - Zero external dependencies, pure requestAnimationFrame 60-120 FPS
 */
export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let particles = [];
        let width = 0;
        let height = 0;
        let dpr = 1;

        // Mouse tracking for subtle repulsion
        const mouse = {
            x: -9999,
            y: -9999,
            active: false,
            radius: 110 // Repulsion radius in pixels
        };

        // Check prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let isReducedMotion = motionQuery.matches;

        const handleMotionPreference = (e) => {
            isReducedMotion = e.matches;
            if (isReducedMotion) {
                // If reduced motion is requested, render static particles once
                renderStatic();
            } else {
                startAnimation();
            }
        };

        if (motionQuery.addEventListener) {
            motionQuery.addEventListener('change', handleMotionPreference);
        }

        // Color palette choices: primary orange & light orange
        const colors = [
            { r: 240, g: 120, b: 36, hex: '#F07824', weight: 0.6 },  // Primary Orange
            { r: 255, g: 210, b: 174, hex: '#FFD2AE', weight: 0.4 }  // Light Orange
        ];

        const pickColor = () => {
            return Math.random() < 0.6 ? colors[0] : colors[1];
        };

        // Create a single particle
        const createParticle = (spawnAtTop = false) => {
            const color = pickColor();
            // Tiny sizes: 1.0px to 2.8px for minimal, refined look
            const radius = Math.random() * 1.8 + 1.0;
            // Opacity range for soft depth layering
            const baseAlpha = Math.random() * 0.45 + 0.22;

            return {
                x: Math.random() * width,
                // If initial setup, scatter across screen; if respawning, place slightly above top
                y: spawnAtTop ? -10 - Math.random() * 20 : Math.random() * height,
                radius,
                color,
                baseAlpha,
                alpha: baseAlpha,
                // Top-to-bottom falling speed: 0.45 to 1.15 px/frame
                speedY: Math.random() * 0.7 + 0.45,
                // Horizontal sway properties
                swayAmplitude: Math.random() * 0.5 + 0.2,
                swaySpeed: Math.random() * 0.015 + 0.008,
                swayPhase: Math.random() * Math.PI * 2,
                // Gentle pulsing opacity
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            };
        };

        // Initialize particles based on screen dimension
        const initParticles = () => {
            // Adaptive count: e.g. ~70 on 1080p desktop, ~30 on mobile
            const count = Math.min(85, Math.max(28, Math.floor((width * height) / 18000)));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(createParticle(false));
            }
        };

        // Handle viewport resize with High-DPI support
        const resizeCanvas = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.scale(dpr, dpr);
            initParticles();

            if (isReducedMotion) {
                renderStatic();
            }
        };

        // Static render for reduced motion users
        const renderStatic = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.baseAlpha})`;
                ctx.fill();
            }
        };

        // Main animation frame loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // 1. Natural falling motion (TOP TO BOTTOM)
                p.y += p.speedY;

                // 2. Horizontal gentle sway (sine wave)
                p.swayPhase += p.swaySpeed;
                p.x += Math.sin(p.swayPhase) * p.swayAmplitude;

                // 3. Subtle floating & fading oscillation
                p.pulsePhase += p.pulseSpeed;
                p.alpha = Math.max(0.12, Math.min(0.85, p.baseAlpha + Math.sin(p.pulsePhase) * 0.14));

                // 4. Subtle mouse repulsion
                if (mouse.active) {
                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < mouse.radius && distance > 0.001) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        // Push gently away from cursor
                        p.x += Math.cos(angle) * force * 2.2;
                        p.y += Math.sin(angle) * force * 2.2;
                        // Slightly brighten when active near mouse
                        p.alpha = Math.min(0.9, p.alpha + force * 0.25);
                    }
                }

                // 5. Continuous regeneration after reaching bottom
                if (p.y > height + 10) {
                    // Respawn smoothly from top with randomized properties
                    const fresh = createParticle(true);
                    particles[i] = fresh;
                    continue;
                }

                // Screen edge wrap for horizontal sway
                if (p.x < -15) p.x = width + 15;
                if (p.x > width + 15) p.x = -15;

                // 6. Draw clean, crisp circular dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (!isReducedMotion) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        // Window resize listener
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Mouse interaction listeners
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.active = false;
            mouse.x = -9999;
            mouse.y = -9999;
        };

        // Touch interaction for mobile devices
        const handleTouchMove = (e) => {
            if (e.touches && e.touches.length > 0) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
                mouse.active = true;
            }
        };

        const handleTouchEnd = () => {
            mouse.active = false;
            mouse.x = -9999;
            mouse.y = -9999;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Tab visibility management: pause when tab is hidden to save battery & CPU
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                startAnimation();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Start animation
        startAnimation();

        // Cleanup on unmount
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (motionQuery.removeEventListener) {
                motionQuery.removeEventListener('change', handleMotionPreference);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="particle-background-canvas"
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
                backgroundColor: 'transparent'
            }}
        />
    );
}

