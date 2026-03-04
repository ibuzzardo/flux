import { describe, it, expect } from 'vitest';
import type { Particle, FlowFieldConfig, ColorPalette, EngineConfig, MouseState } from './types';

describe('Types', () => {
  describe('Particle interface', () => {
    it('should have all required properties', () => {
      const particle: Particle = {
        x: 0.5,
        y: 0.5,
        vx: 0.01,
        vy: -0.01,
        life: 60,
        maxLife: 60,
        color: '#ff0000'
      };

      expect(particle.x).toBe(0.5);
      expect(particle.y).toBe(0.5);
      expect(particle.vx).toBe(0.01);
      expect(particle.vy).toBe(-0.01);
      expect(particle.life).toBe(60);
      expect(particle.maxLife).toBe(60);
      expect(particle.color).toBe('#ff0000');
    });

    it('should allow negative coordinates', () => {
      const particle: Particle = {
        x: -0.1,
        y: -0.2,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 100,
        color: '#000000'
      };

      expect(particle.x).toBe(-0.1);
      expect(particle.y).toBe(-0.2);
    });
  });

  describe('FlowFieldConfig interface', () => {
    it('should have all required properties', () => {
      const config: FlowFieldConfig = {
        name: 'test-field',
        displayName: 'Test Field',
        vectorFunction: (x, y, time) => ({ x: 0.01, y: 0.01 })
      };

      expect(config.name).toBe('test-field');
      expect(config.displayName).toBe('Test Field');
      expect(typeof config.vectorFunction).toBe('function');
      expect(config.vectorFunction(0, 0, 0)).toEqual({ x: 0.01, y: 0.01 });
    });
  });

  describe('ColorPalette interface', () => {
    it('should have all required properties', () => {
      const palette: ColorPalette = {
        name: 'test',
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        background: '#000000'
      };

      expect(palette.name).toBe('test');
      expect(palette.colors).toHaveLength(3);
      expect(palette.background).toBe('#000000');
    });

    it('should allow empty colors array', () => {
      const palette: ColorPalette = {
        name: 'empty',
        colors: [],
        background: '#ffffff'
      };

      expect(palette.colors).toHaveLength(0);
    });
  });

  describe('EngineConfig interface', () => {
    it('should have all required properties', () => {
      const config: EngineConfig = {
        speed: 1.0,
        trailLength: 60,
        particleDensity: 1.0,
        flowField: 'spiral-galaxy',
        colorPalette: 'aurora'
      };

      expect(config.speed).toBe(1.0);
      expect(config.trailLength).toBe(60);
      expect(config.particleDensity).toBe(1.0);
      expect(config.flowField).toBe('spiral-galaxy');
      expect(config.colorPalette).toBe('aurora');
    });

    it('should allow extreme values', () => {
      const config: EngineConfig = {
        speed: 0,
        trailLength: 1,
        particleDensity: 0.1,
        flowField: 'custom-field',
        colorPalette: 'custom-palette'
      };

      expect(config.speed).toBe(0);
      expect(config.trailLength).toBe(1);
      expect(config.particleDensity).toBe(0.1);
    });
  });

  describe('MouseState interface', () => {
    it('should have all required properties', () => {
      const mouseState: MouseState = {
        x: 0.5,
        y: 0.3,
        isPressed: true,
        isHovering: false
      };

      expect(mouseState.x).toBe(0.5);
      expect(mouseState.y).toBe(0.3);
      expect(mouseState.isPressed).toBe(true);
      expect(mouseState.isHovering).toBe(false);
    });

    it('should allow boundary coordinates', () => {
      const mouseState: MouseState = {
        x: 0,
        y: 1,
        isPressed: false,
        isHovering: true
      };

      expect(mouseState.x).toBe(0);
      expect(mouseState.y).toBe(1);
    });
  });
});