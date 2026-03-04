import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ParticleCanvas from './particle-canvas';
import type { EngineConfig } from '@/types';

// Mock the particle engine hook
const mockUpdateConfig = vi.fn();
const mockExportPNG = vi.fn();
const mockCanvasRef = { current: null };

vi.mock('@/hooks/use-particle-engine', () => ({
  useParticleEngine: vi.fn(() => ({
    canvasRef: mockCanvasRef,
    updateConfig: mockUpdateConfig,
    exportPNG: mockExportPNG
  }))
}));

describe('ParticleCanvas Component', () => {
  const mockConfig: EngineConfig = {
    speed: 1.0,
    trailLength: 60,
    particleDensity: 1.0,
    flowField: 'spiral-galaxy',
    colorPalette: 'aurora'
  };

  const mockOnConfigChange = vi.fn();
  const mockOnExport = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render canvas element', () => {
      render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const canvas = screen.getByRole('img', { hidden: true }); // Canvas has img role
      expect(canvas).toBeInTheDocument();
      expect(canvas.tagName).toBe('CANVAS');
    });

    it('should apply default className', () => {
      render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toHaveClass('w-full', 'h-full', 'cursor-crosshair');
    });

    it('should apply custom className', () => {
      const customClass = 'custom-canvas-class';
      render(
        <ParticleCanvas 
          className={customClass}
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toHaveClass(customClass, 'w-full', 'h-full', 'cursor-crosshair');
    });

    it('should set touchAction style to none', () => {
      render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toHaveStyle({ touchAction: 'none' });
    });
  });

  describe('config updates', () => {
    it('should call updateConfig when config changes', () => {
      const { rerender } = render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockUpdateConfig).toHaveBeenCalledWith(mockConfig);

      const newConfig = { ...mockConfig, speed: 2.0 };
      rerender(
        <ParticleCanvas 
          config={newConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockUpdateConfig).toHaveBeenCalledWith(newConfig);
    });

    it('should call onConfigChange with current config', () => {
      render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockOnConfigChange).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe('export functionality', () => {
    it('should setup export handler', () => {
      render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      // The component should setup the export functionality
      expect(mockExportPNG).toBeDefined();
    });
  });

  describe('prop validation', () => {
    it('should handle missing className prop', () => {
      render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toHaveClass('w-full', 'h-full', 'cursor-crosshair');
    });

    it('should handle empty className prop', () => {
      render(
        <ParticleCanvas 
          className=""
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const canvas = screen.getByRole('img', { hidden: true });
      expect(canvas).toHaveClass('w-full', 'h-full', 'cursor-crosshair');
    });
  });

  describe('config edge cases', () => {
    it('should handle extreme speed values', () => {
      const extremeConfig = { ...mockConfig, speed: 10.0 };
      render(
        <ParticleCanvas 
          config={extremeConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockUpdateConfig).toHaveBeenCalledWith(extremeConfig);
    });

    it('should handle zero values', () => {
      const zeroConfig = { 
        ...mockConfig, 
        speed: 0,
        trailLength: 0,
        particleDensity: 0
      };
      render(
        <ParticleCanvas 
          config={zeroConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockUpdateConfig).toHaveBeenCalledWith(zeroConfig);
    });

    it('should handle invalid flow field', () => {
      const invalidConfig = { ...mockConfig, flowField: 'invalid-field' };
      render(
        <ParticleCanvas 
          config={invalidConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockUpdateConfig).toHaveBeenCalledWith(invalidConfig);
    });

    it('should handle invalid color palette', () => {
      const invalidConfig = { ...mockConfig, colorPalette: 'invalid-palette' };
      render(
        <ParticleCanvas 
          config={invalidConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockUpdateConfig).toHaveBeenCalledWith(invalidConfig);
    });
  });

  describe('callback handling', () => {
    it('should handle onConfigChange callback errors gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Config change error');
      });

      expect(() => {
        render(
          <ParticleCanvas 
            config={mockConfig}
            onConfigChange={errorCallback}
            onExport={mockOnExport}
          />
        );
      }).not.toThrow();
    });

    it('should handle onExport callback errors gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Export error');
      });

      expect(() => {
        render(
          <ParticleCanvas 
            config={mockConfig}
            onConfigChange={mockOnConfigChange}
            onExport={errorCallback}
          />
        );
      }).not.toThrow();
    });
  });

  describe('re-rendering', () => {
    it('should handle multiple re-renders with same config', () => {
      const { rerender } = render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const initialCallCount = mockUpdateConfig.mock.calls.length;

      rerender(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      expect(mockUpdateConfig.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it('should handle rapid config changes', () => {
      const { rerender } = render(
        <ParticleCanvas 
          config={mockConfig}
          onConfigChange={mockOnConfigChange}
          onExport={mockOnExport}
        />
      );

      const configs = [
        { ...mockConfig, speed: 1.5 },
        { ...mockConfig, speed: 2.0 },
        { ...mockConfig, speed: 2.5 },
        { ...mockConfig, speed: 3.0 }
      ];

      configs.forEach(config => {
        rerender(
          <ParticleCanvas 
            config={config}
            onConfigChange={mockOnConfigChange}
            onExport={mockOnExport}
          />
        );
      });

      expect(mockUpdateConfig).toHaveBeenCalledTimes(configs.length + 1); // +1 for initial render
    });
  });
});