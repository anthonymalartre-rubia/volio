"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 60;
const MOUSE_RADIUS = 200;
const EASING = 0.04;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function MouseParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let mouse = { x: -9999, y: -9999 };

    // Particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.7,
      baseX: 0,
      baseY: 0,
      size: randomBetween(1.5, 4),
      alpha: randomBetween(0.15, 0.5),
      hue: randomBetween(250, 280), // violet-indigo range
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.2, 0.2),
    }));

    // Set base positions
    particles.forEach((p) => {
      p.baseX = p.x;
      p.baseY = p.y;
    });

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Gentle drift
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Wrap around edges
        if (p.baseX < -20) p.baseX = canvas.width + 20;
        if (p.baseX > canvas.width + 20) p.baseX = -20;
        if (p.baseY < -20) p.baseY = canvas.height + 20;
        if (p.baseY > canvas.height + 20) p.baseY = -20;

        // Mouse repulsion
        let targetX = p.baseX;
        let targetY = p.baseY;
        const dx = mouse.x - p.baseX;
        const dy = mouse.y - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * 80;
          targetX = p.baseX - (dx / dist) * force;
          targetY = p.baseY - (dy / dist) * force;
        }

        // Smooth easing
        p.x += (targetX - p.x) * EASING;
        p.y += (targetY - p.y) * EASING;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.alpha})`;
        ctx.fill();
      }

      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(265, 60%, 60%, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      style={{ opacity: 0.7 }}
    />
  );
}
