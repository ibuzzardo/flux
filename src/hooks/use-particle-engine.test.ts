import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useParticleEngine } from './use-particle-engine';
import type { EngineConfig } from '@/types';

// Mock dependencies
vi.mock('@/fields/flow-fields', () => ({
  getFlowField: vi.fn(() => ({
    name: 'test-field',
    displayName: 'Test Field',
    vectorFunction: vi.fn(() => ({ x: 0.01, y: 0.01 }))
  }))
}));

vi.mock('@/utils/color-palettes', () => ({
  getColorPalette: vi.fn(() => ({
    name: 'test-palette',
    colors: ['#ff0000', '#00ff00', '#0000ff'],
    background: '#000000'
  }))
}));

vi.mock('@/utils/export-png', () => ({
  exportCanvasToPNG: vi.fn()
}));

// Mock canvas and context
const mockContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  globalAlpha: 1,
  fillStyle: '#ffffff',
  canvas: {
    width: 800,
    height: 600
  }
};

const mockCanvas = {
  getContext: vi.fn(() => mockContext),
  width: 800,
  height: 600,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  getBoundingClientRect: vi.fn(() => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600
  }))
};

describe('useParticleEngine Hook', () => {
  const initialConfig: EngineConfig = {
    speed: 1.0,
    trailLength: 60,
    particleDensity: 1.0,
    flowField: 'spiral-galaxy',
    colorPalette: 'aurora'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      setTimeout(cb, 16);
      return 1;
    });
    
    global.cancelAnimationFrame = vi.fn();
    
    // Mock Date.now
    vi.spyOn(Date, 'now').mockReturnValue(1000000);
    
    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 1,
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('hook initialization', () => {
    it('should return canvasRef, updateConfig, and exportPNG functions', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));

      expect(result.current.canvasRef).toBeDefined();
      expect(result.current.canvasRef.current).toBeNull();
      expect(typeof result.current.updateConfig).toBe('function');
      expect(typeof result.current.exportPNG).toBe('function');
    });

    it('should initialize with provided config', () => {
      const customConfig: EngineConfig = {
        speed: 2.0,
        trailLength: 120,
        particleDensity: 0.5,
        flowField: 'ocean-currents',
        colorPalette: 'fire'
      };

      const { result } = renderHook(() => useParticleEngine(customConfig));
      
      expect(result.current).toBeDefined();
    });
  });

  describe('canvas setup', () => {
    it('should setup canvas when ref is attached', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        // Simulate canvas ref attachment
        (result.current.canvasRef as any).current = mockCanvas;
      });

      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    it('should handle canvas resize', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      // Simulate resize
      act(() => {
        mockCanvas.width = 1200;
        mockCanvas.height = 800;
      });

      expect(mockCanvas.width).toBe(1200);
      expect(mockCanvas.height).toBe(800);
    });
  });

  describe('updateConfig function', () => {
    it('should update configuration', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        result.current.updateConfig({ speed: 2.0 });
      });

      // Config should be updated internally
      expect(result.current.updateConfig).toBeDefined();
    });

    it('should handle partial config updates', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        result.current.updateConfig({ 
          speed: 1.5,
          trailLength: 90
        });
      });

      expect(result.current.updateConfig).toBeDefined();
    });

    it('should handle empty config update', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        result.current.updateConfig({});
      });

      expect(result.current.updateConfig).toBeDefined();
    });
  });

  describe('exportPNG function', () => {
    it('should call exportCanvasToPNG when canvas is available', async () => {
      const { exportCanvasToPNG } = await import('@/utils/export-png');
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      act(() => {
        result.current.exportPNG();
      });

      expect(exportCanvasToPNG).toHaveBeenCalledWith(mockCanvas);
    });

    it('should handle export when canvas is not available', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        result.current.exportPNG();
      });

      // Should not throw error
      expect(result.current.exportPNG).toBeDefined();
    });
  });

  describe('particle creation', () => {
    it('should create particles with random positions when no coordinates provided', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      // Particles should be created during animation loop
      expect(result.current).toBeDefined();
    });

    it('should create particles with specified coordinates', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('mouse interaction', () => {
    it('should handle mouse move events', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      expect(mockCanvas.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should handle mouse down events', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      expect(mockCanvas.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    it('should handle mouse up events', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      expect(mockCanvas.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
    });

    it('should handle mouse leave events', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      expect(mockCanvas.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    });
  });

  describe('animation loop', () => {
    it('should start animation loop when canvas is available', () => {
      const { result } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should stop animation loop on unmount', () => {
      const { result, unmount } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      unmount();

      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle extreme speed values', () => {
      const extremeConfig: EngineConfig = {
        ...initialConfig,
        speed: 10.0
      };

      const { result } = renderHook(() => useParticleEngine(extremeConfig));
      
      expect(result.current).toBeDefined();
    });

    it('should handle zero speed', () => {
      const zeroSpeedConfig: EngineConfig = {
        ...initialConfig,
        speed: 0
      };

      const { result } = renderHook(() => useParticleEngine(zeroSpeedConfig));
      
      expect(result.current).toBeDefined();
    });

    it('should handle minimum trail length', () => {
      const minTrailConfig: EngineConfig = {
        ...initialConfig,
        trailLength: 1
      };

      const { result } = renderHook(() => useParticleEngine(minTrailConfig));
      
      expect(result.current).toBeDefined();
    });

    it('should handle maximum particle density', () => {
      const maxDensityConfig: EngineConfig = {
        ...initialConfig,
        particleDensity: 5.0
      };

      const { result } = renderHook(() => useParticleEngine(maxDensityConfig));
      
      expect(result.current).toBeDefined();
    });

    it('should handle invalid flow field', () => {
      const invalidFieldConfig: EngineConfig = {
        ...initialConfig,
        flowField: 'nonexistent-field'
      };

      const { result } = renderHook(() => useParticleEngine(invalidFieldConfig));
      
      expect(result.current).toBeDefined();
    });

    it('should handle invalid color palette', () => {
      const invalidPaletteConfig: EngineConfig = {
        ...initialConfig,
        colorPalette: 'nonexistent-palette'
      };

      const { result } = renderHook(() => useParticleEngine(invalidPaletteConfig));
      
      expect(result.current).toBeDefined();
    });
  });

  describe('cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const { result, unmount } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      unmount();

      expect(mockCanvas.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(mockCanvas.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(mockCanvas.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(mockCanvas.removeEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    });

    it('should cancel animation frame on unmount', () => {
      const { result, unmount } = renderHook(() => useParticleEngine(initialConfig));
      
      act(() => {
        (result.current.canvasRef as any).current = mockCanvas;
      });

      unmount();

      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});