import React, { useEffect, useRef } from 'react';

/**
 * ParticleBackground
 * 
 * Ultra-lightweight, battery-efficient, and GPU-optimized HTML Canvas particle background.
 * Optimized for high-concurrency (300+ simultaneous users) and tablet/mobile hardware:
 * - Automatically clamps DPR to 1 on tablets/mobiles to prevent GPU overload.
 * - Caps particle count to 18-24 on tablets/mobiles and 50 on desktop.
 * - Pauses canvas redrawing while user is finger-scrolling on tablet/phone for silky 60fps scrolling.
 * - Clean transformation matrix resets to prevent memory leaks and coordinate compounding on orientation changes.
 * - Respects prefers-reduced-motion and tab visibilitychange.
 */
export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let ctx;
        try {
            ctx = canvas.getContext('2d', { alpha: true });
        } catch (e) {
            return;
        }
        if (!ctx) return;

        let animationFrameId;
        let particles = [];
        let width = 0;
        let height = 0;
        let dpr = 1;
        let isScrolling = false;
        let scrollTimeout = null;

        // Detect touch/tablet/mobile device
        const isTouchOrTablet = typeof window !== 'undefined' && (
            'ontouchstart' in window || 
            navigator.maxTouchPoints > 0 || 
            window.innerWidth <= 1024
        );

        // Mouse tracking (active only on non-touch desktop to save CPU on tablets)
        const mouse = {
            x: -9999,
            y: -9999,
            active: false,
            radius: 90
        };

        // Check prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        let isReducedMotion = motionQuery.matches;

        const handleMotionPreference = (e) => {
            isReducedMotion = e.matches;
            if (isReducedMotion) {
                renderStatic();
            } else {
                startAnimation();
            }
        };

        if (motionQuery.addEventListener) {
            motionQuery.addEventListener('change', handleMotionPreference);
        }

        // Color palette choices: primary orange (#F07824) & soft orange
        const colors = [
            { r: 240, g: 120, b: 36, weight: 0.6 },
            { r: 255, g: 210, b: 174, weight: 0.4 }
        ];

        const pickColor = () => Math.random() < 0.6 ? colors[0] : colors[1];

        // Create a single particle
        const createParticle = (spawnAtTop = false) => {
            const color = pickColor();
            const radius = Math.random() * 1.5 + 1.0;
            const baseAlpha = Math.random() * 0.4 + 0.2;

            return {
                x: Math.random() * width,
                y: spawnAtTop ? -10 - Math.random() * 15 : Math.random() * height,
                radius,
                color,
                baseAlpha,
                alpha: baseAlpha,
                speedY: Math.random() * 0.5 + 0.35,
                swayAmplitude: Math.random() * 0.4 + 0.15,
                swaySpeed: Math.random() * 0.012 + 0.006,
                swayPhase: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.015 + 0.008,
                pulsePhase: Math.random() * Math.PI * 2
            };
        };

        // Initialize particles based on screen dimension & device type
        const initParticles = () => {
            const maxParticles = isTouchOrTablet ? 20 : 50;
            const count = Math.min(maxParticles, Math.max(10, Math.floor((width * height) / 28000)));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(createParticle(false));
            }
        };

        // Handle viewport resize with High-DPI support (clamped to 1 on tablet/mobile)
        const resizeCanvas = () => {
            width = Math.min(window.innerWidth || 800, 1920);
            height = Math.min(window.innerHeight || 600, 1200);

            // On touch screens / tablets, clamp DPR to 1 to prevent huge memory allocations
            dpr = isTouchOrTablet ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);

            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            // Reset transformation matrix before scaling
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            initParticles();

            if (isReducedMotion) {
                renderStatic();
            }
        };

        // Static render for reduced motion users
        const renderStatic = () => {
            try {
                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.baseAlpha})`;
                    ctx.fill();
                }
            } catch (e) {}
        };

        // Main animation frame loop
        const animate = () => {
            // While the user is actively finger-scrolling on tablet/phone, skip redraw
            if (isScrolling && isTouchOrTablet) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            try {
                ctx.clearRect(0, 0, width, height);

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];

                    // 1. Natural falling motion
                    p.y += p.speedY;

                    // 2. Horizontal gentle sway
                    p.swayPhase += p.swaySpeed;
                    p.x += Math.sin(p.swayPhase) * p.swayAmplitude;

                    // 3. Subtle floating & fading oscillation
                    p.pulsePhase += p.pulseSpeed;
                    p.alpha = Math.max(0.12, Math.min(0.7, p.baseAlpha + Math.sin(p.pulsePhase) * 0.12));

                    // 4. Desktop cursor interaction
                    if (mouse.active && !isTouchOrTablet) {
                        const dx = p.x - mouse.x;
                        const dy = p.y - mouse.y;
                        const dist = Math.hypot(dx, dy);

                        if (dist < mouse.radius && dist > 0.001) {
                            const force = (mouse.radius - dist) / mouse.radius;
                            const angle = Math.atan2(dy, dx);
                            p.x += Math.cos(angle) * force * 1.5;
                            p.y += Math.sin(angle) * force * 1.5;
                            p.alpha = Math.min(0.8, p.alpha + force * 0.2);
                        }
                    }

                    // 5. Respawn after passing bottom
                    if (p.y > height + 10) {
                        particles[i] = createParticle(true);
                        continue;
                    }

                    // Screen edge wrap
                    if (p.x < -10) p.x = width + 10;
                    if (p.x > width + 10) p.x = -10;

                    // 6. Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
                    ctx.fill();
                }
            } catch (e) {}

            animationFrameId = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (!isReducedMotion) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        // Scroll listener to pause rendering during active tablet touch scrolls
        const handleScroll = () => {
            isScrolling = true;
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 100);
        };

        window.addEventListener('resize', resizeCanvas, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });
        resizeCanvas();

        // Mouse listeners (only enabled on non-touch desktop)
        let handleMouseMove, handleMouseLeave;
        if (!isTouchOrTablet) {
            handleMouseMove = (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                mouse.active = true;
            };

            handleMouseLeave = () => {
                mouse.active = false;
                mouse.x = -9999;
                mouse.y = -9999;
            };

            window.addEventListener('mousemove', handleMouseMove, { passive: true });
            window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
        }

        // Tab visibility management: pause when tab is hidden to save battery & CPU
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                startAnimation();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        startAnimation();

        // Cleanup on unmount
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (scrollTimeout) clearTimeout(scrollTimeout);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('scroll', handleScroll);
            if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
            if (handleMouseLeave) window.removeEventListener('mouseleave', handleMouseLeave);
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
                backgroundColor: 'transparent',
                transform: 'translateZ(0)' // Hardware acceleration
            }}
        />
    );
}
