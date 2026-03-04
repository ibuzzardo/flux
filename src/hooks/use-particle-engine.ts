import { useRef, useEffect, useCallback, useState } from 'react';
import type { Particle, EngineConfig, MouseState } from '@/types';
import { getFlowField } from '@/fields/flow-fields';
import { getColorPalette } from '@/utils/color-palettes';

interface UseParticleEngineReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  updateConfig: (config: Partial<EngineConfig>) => void;
  exportPNG: () => void;
}

export const useParticleEngine = (initialConfig: EngineConfig): UseParticleEngineReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, isPressed: false, isHovering: false });
  const [config, setConfig] = useState<EngineConfig>(initialConfig);
  const startTimeRef = useRef<number>(Date.now());

  const createParticle = useCallback((x?: number, y?: number): Particle => {
    const palette = getColorPalette(config.colorPalette);
    const color = palette.colors[Math.floor(Math.random() * palette.colors.length)];
    
    return {
      x: x ?? Math.random(),
      y: y ?? Math.random(),
      vx: 0,
      vy: 0,
      life: config.trailLength,
      maxLife: config.trailLength,
      color,
    };
  }, [config.colorPalette, config.trailLength]);

  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const time = Date.now() - startTimeRef.current;
    const flowField = getFlowField(config.flowField);
    const mouse = mouseRef.current;

    particlesRef.current = particlesRef.current.filter(particle => {
      // Apply flow field
      const vector = flowField.vectorFunction(particle.x, particle.y, time);
      particle.vx += vector.x * config.speed;
      particle.vy += vector.y * config.speed;

      // Mouse interaction
      if (mouse.isHovering) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (mouse.isPressed) {
          // Attract to mouse
          const force = 0.0001 / (distance + 0.01);
          particle.vx += dx * force;
          particle.vy += dy * force;
        } else {
          // Orbit around mouse
          const orbitForce = 0.00005 / (distance + 0.01);
          particle.vx += -dy * orbitForce;
          particle.vy += dx * orbitForce;
        }
      }

      // Apply velocity with damping
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Wrap around edges
      if (particle.x < 0) particle.x = 1;
      if (particle.x > 1) particle.x = 0;
      if (particle.y < 0) particle.y = 1;
      if (particle.y > 1) particle.y = 0;

      // Update life
      particle.life -= 1;
      return particle.life > 0;
    });

    // Add new particles to maintain density
    const targetCount = Math.floor(config.particleDensity * 1000);
    while (particlesRef.current.length < targetCount) {
      particlesRef.current.push(createParticle());
    }
  }, [config, createParticle]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = getColorPalette(config.colorPalette);
    
    // Clear with background color and slight fade
    ctx.fillStyle = palette.background + '20';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particlesRef.current.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      const x = particle.x * canvas.width;
      const y = particle.y * canvas.height;
      
      ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.fillRect(x - 1, y - 1, 2, 2);
    });
  }, [config.colorPalette]);

  const animate = useCallback(() => {
    try {
      updateParticles();
      render();
      animationRef.current = requestAnimationFrame(animate);
    } catch (error) {
      console.error('Animation error:', error);
    }
  }, [updateParticles, render]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = (event.clientX - rect.left) / canvas.width;
    mouseRef.current.y = (event.clientY - rect.top) / canvas.height;
    mouseRef.current.isHovering = true;
  }, []);

  const handleMouseDown = useCallback(() => {
    mouseRef.current.isPressed = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isPressed = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.isHovering = false;
    mouseRef.current.isPressed = false;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    
    // Initialize particles
    particlesRef.current = [];
    const targetCount = Math.floor(config.particleDensity * 1000);
    for (let i = 0; i < targetCount; i++) {
      particlesRef.current.push(createParticle());
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [animate, createParticle, handleMouseMove, handleMouseDown, handleMouseUp, handleMouseLeave, resizeCanvas, config.particleDensity]);

  const updateConfig = useCallback((newConfig: Partial<EngineConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const exportPNG = useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const link = document.createElement('a');
      link.download = `flux-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  }, []);

  return {
    canvasRef,
    updateConfig,
    exportPNG,
  };
};