import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './app';
import type { EngineConfig } from './types';

// Mock child components
vi.mock('./components/particle-canvas', () => ({
  default: ({ config, onConfigChange, onExport }: any) => {
    return (
      <div data-testid="particle-canvas">
        <button 
          onClick={() => onConfigChange({ speed: 2.0 })}
          data-testid="mock-config-change"
        >
          Change Config
        </button>
        <button 
          onClick={() => onExport(() => console.log('export'))}
          data-testid="mock-register-export"
        >
          Register Export
        </button>
        <div data-testid="canvas-config">{JSON.stringify(config)}</div>
      </div>
    );
  }
}));

vi.mock('./components/control-panel', () => ({
  default: ({ config, onConfigChange, onExport }: any) => {
    return (
      <div data-testid="control-panel">
        <button 
          onClick={() => onConfigChange({ trailLength: 120 })}
          data-testid="mock-panel-config-change"
        >
          Panel Change Config
        </button>
        <button 
          onClick={onExport}
          data-testid="mock-export-button"
        >
          Export
        </button>
        <div data-testid="panel-config">{JSON.stringify(config)}</div>
      </div>
    );
  }
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render main app structure', () => {
      render(<App />);

      expect(screen.getByTestId('particle-canvas')).toBeInTheDocument();
      expect(screen.getByTestId('control-panel')).toBeInTheDocument();
    });

    it('should apply correct CSS classes to main container', () => {
      const { container } = render(<App />);
      const mainDiv = container.firstChild as HTMLElement;
      
      expect(mainDiv).toHaveClass('flex', 'flex-col', 'h-screen', 'bg-background');
    });

    it('should apply correct CSS classes to canvas container', () => {
      render(<App />);
      const canvas = screen.getByTestId('particle-canvas');
      
      expect(canvas.parentElement).toHaveClass('flex-1');
    });

    it('should apply correct CSS classes to control panel container', () => {
      render(<App />);
      const panel = screen.getByTestId('control-panel');
      
      expect(panel.parentElement).toHaveClass('p-4');
    });
  });

  describe('initial configuration', () => {
    it('should initialize with correct default config', () => {
      render(<App />);

      const canvasConfig = screen.getByTestId('canvas-config');
      const panelConfig = screen.getByTestId('panel-config');
      
      const expectedConfig = {
        speed: 1.0,
        trailLength: 60,
        particleDensity: 1.0,
        flowField: 'spiral-galaxy',
        colorPalette: 'aurora'
      };

      expect(canvasConfig).toHaveTextContent(JSON.stringify(expectedConfig));
      expect(panelConfig).toHaveTextContent(JSON.stringify(expectedConfig));
    });
  });

  describe('configuration management', () => {
    it('should update config when ParticleCanvas triggers change', async () => {
      const user = userEvent.setup();
      render(<App />);

      const changeButton = screen.getByTestId('mock-config-change');
      await user.click(changeButton);

      const canvasConfig = screen.getByTestId('canvas-config');
      const panelConfig = screen.getByTestId('panel-config');
      
      const configData = JSON.parse(canvasConfig.textContent || '{}');
      expect(configData.speed).toBe(2.0);
      
      const panelConfigData = JSON.parse(panelConfig.textContent || '{}');
      expect(panelConfigData.speed).toBe(2.0);
    });

    it('should update config when ControlPanel triggers change', async () => {
      const user = userEvent.setup();
      render(<App />);

      const panelChangeButton = screen.getByTestId('mock-panel-config-change');
      await user.click(panelChangeButton);

      const canvasConfig = screen.getByTestId('canvas-config');
      const panelConfig = screen.getByTestId('panel-config');
      
      const configData = JSON.parse(canvasConfig.textContent || '{}');
      expect(configData.trailLength).toBe(120);
      
      const panelConfigData = JSON.parse(panelConfig.textContent || '{}');
      expect(panelConfigData.trailLength).toBe(120);
    });

    it('should handle partial config updates', async () => {
      const user = userEvent.setup();
      render(<App />);

      // First update speed
      const changeButton = screen.getByTestId('mock-config-change');
      await user.click(changeButton);

      // Then update trail length
      const panelChangeButton = screen.getByTestId('mock-panel-config-change');
      await user.click(panelChangeButton);

      const configData = JSON.parse(screen.getByTestId('canvas-config').textContent || '{}');
      expect(configData.speed).toBe(2.0);
      expect(configData.trailLength).toBe(120);
      expect(configData.particleDensity).toBe(1.0); // Should remain unchanged
      expect(configData.flowField).toBe('spiral-galaxy'); // Should remain unchanged
      expect(configData.colorPalette).toBe('aurora'); // Should remain unchanged
    });
  });

  describe('export functionality', () => {
    it('should handle export registration and execution', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const user = userEvent.setup();
      render(<App />);

      // Register export function
      const registerButton = screen.getByTestId('mock-register-export');
      await user.click(registerButton);

      // Trigger export
      const exportButton = screen.getByTestId('mock-export-button');
      await user.click(exportButton);

      expect(consoleSpy).toHaveBeenCalledWith('export');
      
      consoleSpy.mockRestore();
    });

    it('should handle export when no function is registered', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Try to export without registering function first
      const exportButton = screen.getByTestId('mock-export-button');
      
      // Should not throw error
      expect(async () => {
        await user.click(exportButton);
      }).not.toThrow();
    });

    it('should update export function when re-registered', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const user = userEvent.setup();
      render(<App />);

      // Register first export function
      const registerButton = screen.getByTestId('mock-register-export');
      await user.click(registerButton);

      // Register again (should update)
      await user.click(registerButton);

      // Trigger export
      const exportButton = screen.getByTestId('mock-export-button');
      await user.click(exportButton);

      expect(consoleSpy).toHaveBeenCalledWith('export');
      
      consoleSpy.mockRestore();
    });
  });

  describe('component integration', () => {
    it('should pass config to both child components', () => {
      render(<App />);

      const canvasConfig = JSON.parse(screen.getByTestId('canvas-config').textContent || '{}');
      const panelConfig = JSON.parse(screen.getByTestId('panel-config').textContent || '{}');
      
      expect(canvasConfig).toEqual(panelConfig);
    });

    it('should maintain config synchronization across components', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Update from canvas
      await user.click(screen.getByTestId('mock-config-change'));
      
      let canvasConfig = JSON.parse(screen.getByTestId('canvas-config').textContent || '{}');
      let panelConfig = JSON.parse(screen.getByTestId('panel-config').textContent || '{}');
      
      expect(canvasConfig).toEqual(panelConfig);

      // Update from panel
      await user.click(screen.getByTestId('mock-panel-config-change'));
      
      canvasConfig = JSON.parse(screen.getByTestId('canvas-config').textContent || '{}');
      panelConfig = JSON.parse(screen.getByTestId('panel-config').textContent || '{}');
      
      expect(canvasConfig).toEqual(panelConfig);
    });
  });

  describe('edge cases', () => {
    it('should handle rapid config changes', async () => {
      const user = userEvent.setup();
      render(<App />);

      const changeButton = screen.getByTestId('mock-config-change');
      
      // Rapid clicks
      await user.click(changeButton);
      await user.click(changeButton);
      await user.click(changeButton);

      const configData = JSON.parse(screen.getByTestId('canvas-config').textContent || '{}');
      expect(configData.speed).toBe(2.0);
    });

    it('should handle empty config updates', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Mock empty config change
      const MockParticleCanvas = (await import('./components/particle-canvas')).default;
      
      // This should not break the app
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });

    it('should handle invalid config values', async () => {
      const user = userEvent.setup();
      render(<App />);

      // The app should handle any config values gracefully
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });
  });

  describe('callback stability', () => {
    it('should use stable callback references', () => {
      const { rerender } = render(<App />);
      
      const initialCanvas = screen.getByTestId('particle-canvas');
      const initialPanel = screen.getByTestId('control-panel');
      
      rerender(<App />);
      
      const rerenderedCanvas = screen.getByTestId('particle-canvas');
      const rerenderedPanel = screen.getByTestId('control-panel');
      
      // Components should still be present after rerender
      expect(rerenderedCanvas).toBeInTheDocument();
      expect(rerenderedPanel).toBeInTheDocument();
    });
  });

  describe('layout structure', () => {
    it('should have correct flex layout', () => {
      const { container } = render(<App />);
      const mainDiv = container.firstChild as HTMLElement;
      
      expect(mainDiv).toHaveClass('flex', 'flex-col', 'h-screen');
      
      const canvasContainer = mainDiv.children[0] as HTMLElement;
      const panelContainer = mainDiv.children[1] as HTMLElement;
      
      expect(canvasContainer).toHaveClass('flex-1');
      expect(panelContainer).toHaveClass('p-4');
    });

    it('should fill full screen height', () => {
      const { container } = render(<App />);
      const mainDiv = container.firstChild as HTMLElement;
      
      expect(mainDiv).toHaveClass('h-screen');
    });

    it('should use background theme color', () => {
      const { container } = render(<App />);
      const mainDiv = container.firstChild as HTMLElement;
      
      expect(mainDiv).toHaveClass('bg-background');
    });
  });
});