import { describe, it, expect } from 'vitest';
import { colorPalettes, getColorPalette } from './color-palettes';
import type { ColorPalette } from '@/types';

describe('Color Palettes', () => {
  describe('colorPalettes constant', () => {
    it('should contain 6 palettes', () => {
      expect(colorPalettes).toHaveLength(6);
    });

    it('should have all required palette names', () => {
      const expectedNames = ['aurora', 'ocean', 'fire', 'forest', 'cosmic', 'sunset'];
      const actualNames = colorPalettes.map(p => p.name);
      expect(actualNames).toEqual(expectedNames);
    });

    it('should have valid color arrays for each palette', () => {
      colorPalettes.forEach(palette => {
        expect(palette.colors).toBeInstanceOf(Array);
        expect(palette.colors.length).toBeGreaterThan(0);
        palette.colors.forEach(color => {
          expect(color).toMatch(/^#[0-9a-f]{6}$/i);
        });
      });
    });

    it('should have valid background colors', () => {
      colorPalettes.forEach(palette => {
        expect(palette.background).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    it('should have dark backgrounds for all palettes', () => {
      colorPalettes.forEach(palette => {
        // Convert hex to RGB and check if it's dark
        const hex = palette.background.slice(1);
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        expect(brightness).toBeLessThan(128); // Dark background
      });
    });

    it('should have exactly 5 colors in each palette', () => {
      colorPalettes.forEach(palette => {
        expect(palette.colors).toHaveLength(5);
      });
    });
  });

  describe('getColorPalette function', () => {
    it('should return correct palette by name', () => {
      const aurora = getColorPalette('aurora');
      expect(aurora.name).toBe('aurora');
      expect(aurora.colors).toEqual(['#00ff88', '#00ccff', '#ff0088', '#ffaa00', '#aa00ff']);
      expect(aurora.background).toBe('#0a0a0a');
    });

    it('should return ocean palette', () => {
      const ocean = getColorPalette('ocean');
      expect(ocean.name).toBe('ocean');
      expect(ocean.colors).toEqual(['#0066cc', '#0099ff', '#00ccff', '#66ddff', '#99eeff']);
      expect(ocean.background).toBe('#001122');
    });

    it('should return fire palette', () => {
      const fire = getColorPalette('fire');
      expect(fire.name).toBe('fire');
      expect(fire.colors).toEqual(['#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#ffff00']);
      expect(fire.background).toBe('#220000');
    });

    it('should return forest palette', () => {
      const forest = getColorPalette('forest');
      expect(forest.name).toBe('forest');
      expect(forest.colors).toEqual(['#00aa00', '#44cc44', '#88dd88', '#aaffaa', '#ccffcc']);
      expect(forest.background).toBe('#001100');
    });

    it('should return cosmic palette', () => {
      const cosmic = getColorPalette('cosmic');
      expect(cosmic.name).toBe('cosmic');
      expect(cosmic.colors).toEqual(['#6600cc', '#9933ff', '#cc66ff', '#ff99ff', '#ffccff']);
      expect(cosmic.background).toBe('#110022');
    });

    it('should return sunset palette', () => {
      const sunset = getColorPalette('sunset');
      expect(sunset.name).toBe('sunset');
      expect(sunset.colors).toEqual(['#ff4400', '#ff7700', '#ffaa00', '#ffdd44', '#ffff88']);
      expect(sunset.background).toBe('#221100');
    });

    it('should return first palette for unknown name', () => {
      const unknown = getColorPalette('nonexistent');
      expect(unknown).toEqual(colorPalettes[0]);
      expect(unknown.name).toBe('aurora');
    });

    it('should return first palette for empty string', () => {
      const empty = getColorPalette('');
      expect(empty).toEqual(colorPalettes[0]);
    });

    it('should return first palette for null/undefined', () => {
      const nullPalette = getColorPalette(null as any);
      const undefinedPalette = getColorPalette(undefined as any);
      expect(nullPalette).toEqual(colorPalettes[0]);
      expect(undefinedPalette).toEqual(colorPalettes[0]);
    });

    it('should be case sensitive', () => {
      const upperCase = getColorPalette('AURORA');
      expect(upperCase).toEqual(colorPalettes[0]); // Falls back to first
    });
  });

  describe('palette immutability', () => {
    it('should not allow modification of colors array', () => {
      const palette = getColorPalette('aurora');
      expect(() => {
        (palette.colors as any).push('#ffffff');
      }).toThrow();
    });

    it('should maintain readonly nature of colorPalettes', () => {
      expect(() => {
        (colorPalettes as any).push({ name: 'test', colors: [], background: '#000' });
      }).toThrow();
    });
  });
});