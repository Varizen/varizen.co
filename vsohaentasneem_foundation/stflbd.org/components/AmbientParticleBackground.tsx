"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  radius: number;
  color: string;
  baseAlpha: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
}

interface AmbientParticleBackgroundProps {
  className?: string;
  particleDensity?: number; // Divisor for area calculation; higher = sparser
}

export function AmbientParticleBackground({
  className = "",
  particleDensity = 5000,
}: AmbientParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Detect reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReducedMotion = mediaQuery.matches;

    const handleMotionPreference = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        drawStatic();
      } else {
        startAnimation();
      }
    };
    mediaQuery.addEventListener("change", handleMotionPreference);

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    // Mouse & Touch Tracking
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      radius: 120, // Interaction radius in CSS pixels
      active: false,
    };

    // Color definitions aligned with STFL institutional palette
    const colorGenerators = [
      // 70% STFL Charcoal / Navy-Gray
      {
        weight: 0.7,
        getColor: (alpha: number) => `rgba(8, 31, 45, ${alpha})`,
        alphaRange: [0.08, 0.22] as [number, number],
      },
      // 15% Warm Slate / Neutral Gray
      {
        weight: 0.15,
        getColor: (alpha: number) => `rgba(90, 107, 117, ${alpha})`,
        alphaRange: [0.06, 0.18] as [number, number],
      },
      // 10% Faint Institutional Deep Blue
      {
        weight: 0.1,
        getColor: (alpha: number) => `rgba(11, 43, 67, ${alpha})`,
        alphaRange: [0.07, 0.2] as [number, number],
      },
      // 5% Rare Muted Orange Accent (#FF6B35)
      {
        weight: 0.05,
        getColor: (alpha: number) => `rgba(255, 107, 53, ${alpha})`,
        alphaRange: [0.18, 0.38] as [number, number],
      },
    ];

    function pickColorConfig() {
      const r = Math.random();
      let cumulative = 0;
      for (const conf of colorGenerators) {
        cumulative += conf.weight;
        if (r <= cumulative) return conf;
      }
      return colorGenerators[0];
    }

    // Initialize particles with natural organic clustering (Perlin-like density variations)
    function initParticles() {
      if (!canvas) return;
      particles = [];

      // Determine particle count based on canvas area
      const area = width * height;
      const count = Math.min(
        Math.max(Math.floor(area / particleDensity), 90),
        260
      );

      // Define 3-4 soft organic cluster centers to produce natural density gradients
      const clusterCenters = [
        { x: width * 0.72, y: height * 0.38, spread: Math.min(width, height) * 0.35 },
        { x: width * 0.82, y: height * 0.68, spread: Math.min(width, height) * 0.4 },
        { x: width * 0.35, y: height * 0.75, spread: Math.min(width, height) * 0.45 },
      ];

      for (let i = 0; i < count; i++) {
        let x: number;
        let y: number;

        // 45% of particles gravitate softly towards organic cluster regions
        // 55% disperse widely across the entire field for generous negative space
        if (Math.random() < 0.45) {
          const cluster =
            clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.pow(Math.random(), 0.7) * cluster.spread;
          x = cluster.x + Math.cos(angle) * dist;
          y = cluster.y + Math.sin(angle) * dist;

          // Wrap inside canvas bounds with padding
          x = ((x % width) + width) % width;
          y = ((y % height) + height) % height;
        } else {
          x = Math.random() * width;
          y = Math.random() * height;
        }

        const colorConfig = pickColorConfig();
        const [minAlpha, maxAlpha] = colorConfig.alphaRange;
        const baseAlpha = minAlpha + Math.random() * (maxAlpha - minAlpha);

        // Micro particle radius: 0.65px to 1.75px (fine digital dust)
        const radius = 0.65 + Math.pow(Math.random(), 2.2) * 1.1;

        // Very slow, almost imperceptible drifting velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.03 + Math.random() * 0.07; // between 0.03 and 0.1 px/frame
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius,
          color: colorConfig.getColor(baseAlpha),
          baseAlpha,
          alpha: baseAlpha,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0006 + Math.random() * 0.0012,
        });
      }
    }

    // High-DPI canvas resizing
    function resizeCanvas() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      if (ctx) {
        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);
      }

      initParticles();

      if (prefersReducedMotion) {
        drawStatic();
      }
    }

    // Single static render for reduced-motion users
    function drawStatic() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }

    // Interactive cursor tracking on parent/window
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only activate when within or near canvas boundaries
      if (x >= -60 && x <= width + 60 && y >= -60 && y <= height + 60) {
        mouse.targetX = x;
        mouse.targetY = y;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        mouse.targetX = x;
        mouse.targetY = y;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener("resize", handleResize);

    // Initial setup
    resizeCanvas();

    // Main animation loop
    let lastTime = performance.now();

    function render(currentTime: number) {
      if (!ctx || width === 0 || height === 0) return;

      const delta = Math.min((currentTime - lastTime) / 16.667, 2.0); // normalize around 60fps
      lastTime = currentTime;

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      } else {
        mouse.x += (-9999 - mouse.x) * 0.05;
        mouse.y += (-9999 - mouse.y) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      const mouseRadiusSq = mouse.radius * mouse.radius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Subtle, gentle cursor interaction (gentle repulsion)
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            // Non-linear gentle push (stronger near center, soft at perimeter)
            const force = (1 - dist / mouse.radius) * 0.28;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // 2. Viscous damping back towards natural baseline drift
        p.vx = p.vx * 0.96 + p.baseVx * 0.04;
        p.vy = p.vy * 0.96 + p.baseVy * 0.04;

        // 3. Position update
        p.x += p.vx * delta;
        p.y += p.vy * delta;

        // 4. Subtle breathing / pulse effect
        const pulse = Math.sin(currentTime * p.pulseSpeed + p.phase);
        const currentAlpha = Math.max(0.03, p.baseAlpha * (0.82 + 0.22 * pulse));

        // 5. Seamless boundary wrapping with soft margin
        const pad = 15;
        if (p.x < -pad) p.x = width + pad;
        else if (p.x > width + pad) p.x = -pad;

        if (p.y < -pad) p.y = height + pad;
        else if (p.y > height + pad) p.y = -pad;

        // 6. Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Replace alpha in color string or draw with globalAlpha
        ctx.globalAlpha = currentAlpha / p.baseAlpha;
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    }

    function startAnimation() {
      cancelAnimationFrame(animationFrameId);
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(render);
    }

    if (!prefersReducedMotion) {
      startAnimation();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      mediaQuery.removeEventListener("change", handleMotionPreference);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
export default AmbientParticleBackground;
