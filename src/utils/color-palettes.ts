import type { ColorPalette } from '@/types';

export const colorPalettes: readonly ColorPalette[] = [
  {
    name: 'aurora',
    colors: ['#00ff88', '#00ccff', '#ff0088', '#ffaa00', '#aa00ff'] as const,
    background: '#0a0a0a',
  },
  {
    name: 'ocean',
    colors: ['#0066cc', '#0099ff', '#00ccff', '#66ddff', '#99eeff'] as const,
    background: '#001122',
  },
  {
    name: 'fire',
    colors: ['#ff3300', '#ff6600', '#ff9900', '#ffcc00', '#ffff00'] as const,
    background: '#220000',
  },
  {
    name: 'forest',
    colors: ['#00aa00', '#44cc44', '#88dd88', '#aaffaa', '#ccffcc'] as const,
    background: '#001100',
  },
  {
    name: 'cosmic',
    colors: ['#6600cc', '#9933ff', '#cc66ff', '#ff99ff', '#ffccff'] as const,
    background: '#110022',
  },
  {
    name: 'sunset',
    colors: ['#ff4400', '#ff7700', '#ffaa00', '#ffdd44', '#ffff88'] as const,
    background: '#221100',
  },
] as const;

export const getColorPalette = (name: string): ColorPalette => {
  return colorPalettes.find(p => p.name === name) || colorPalettes[0];
};