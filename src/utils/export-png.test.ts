import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportCanvasToPNG } from './export-png';

// Mock DOM elements
const mockCanvas = {
  toDataURL: vi.fn()
} as unknown as HTMLCanvasElement;

const mockLink = {
  download: '',
  href: '',
  click: vi.fn()
};

const mockDocument = {
  createElement: vi.fn(),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  }
};

describe('Export PNG Utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup DOM mocks
    Object.defineProperty(global, 'document', {
      value: mockDocument,
      writable: true
    });
    
    mockDocument.createElement.mockReturnValue(mockLink);
    (mockCanvas.toDataURL as any).mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exportCanvasToPNG function', () => {
    it('should create download link and trigger download', () => {
      exportCanvasToPNG(mockCanvas);

      expect(mockDocument.createElement).toHaveBeenCalledWith('a');
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
      expect(mockLink.href).toBe('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockLink);
    });

    it('should use default filename when none provided', () => {
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(1234567890);
      
      exportCanvasToPNG(mockCanvas);

      expect(mockLink.download).toBe('flux-1234567890.png');
      
      dateSpy.mockRestore();
    });

    it('should use custom filename when provided', () => {
      const customFilename = 'my-custom-export.png';
      
      exportCanvasToPNG(mockCanvas, customFilename);

      expect(mockLink.download).toBe(customFilename);
    });

    it('should handle empty filename', () => {
      const dateSpy = vi.spyOn(Date, 'now').mockReturnValue(9876543210);
      
      exportCanvasToPNG(mockCanvas, '');

      expect(mockLink.download).toBe('flux-9876543210.png');
      
      dateSpy.mockRestore();
    });

    it('should handle canvas toDataURL failure', () => {
      (mockCanvas.toDataURL as any).mockImplementation(() => {
        throw new Error('Canvas tainted');
      });

      expect(() => exportCanvasToPNG(mockCanvas)).toThrow('PNG export failed');
    });

    it('should handle DOM manipulation errors', () => {
      mockDocument.createElement.mockImplementation(() => {
        throw new Error('DOM error');
      });

      expect(() => exportCanvasToPNG(mockCanvas)).toThrow('PNG export failed');
    });

    it('should clean up DOM elements even if click fails', () => {
      mockLink.click.mockImplementation(() => {
        throw new Error('Click failed');
      });

      expect(() => exportCanvasToPNG(mockCanvas)).toThrow('PNG export failed');
      expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockLink);
    });

    it('should handle null canvas', () => {
      expect(() => exportCanvasToPNG(null as any)).toThrow('PNG export failed');
    });

    it('should handle undefined canvas', () => {
      expect(() => exportCanvasToPNG(undefined as any)).toThrow('PNG export failed');
    });

    it('should use PNG format specifically', () => {
      exportCanvasToPNG(mockCanvas);
      
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/png');
    });

    it('should generate unique filenames for concurrent exports', () => {
      let callCount = 0;
      const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => {
        return 1000000000 + callCount++;
      });

      exportCanvasToPNG(mockCanvas);
      const firstFilename = mockLink.download;
      
      exportCanvasToPNG(mockCanvas);
      const secondFilename = mockLink.download;

      expect(firstFilename).not.toBe(secondFilename);
      expect(firstFilename).toBe('flux-1000000000.png');
      expect(secondFilename).toBe('flux-1000000001.png');
      
      dateSpy.mockRestore();
    });

    it('should preserve file extension in custom filename', () => {
      exportCanvasToPNG(mockCanvas, 'test.jpg');
      expect(mockLink.download).toBe('test.jpg');
    });

    it('should handle special characters in filename', () => {
      const specialFilename = 'test-file_with@special#chars.png';
      exportCanvasToPNG(mockCanvas, specialFilename);
      expect(mockLink.download).toBe(specialFilename);
    });
  });

  describe('error handling', () => {
    it('should log error to console before throwing', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (mockCanvas.toDataURL as any).mockImplementation(() => {
        throw new Error('Test error');
      });

      expect(() => exportCanvasToPNG(mockCanvas)).toThrow('PNG export failed');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to export PNG:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle SecurityError from tainted canvas', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (mockCanvas.toDataURL as any).mockImplementation(() => {
        const error = new Error('Canvas has been tainted');
        error.name = 'SecurityError';
        throw error;
      });

      expect(() => exportCanvasToPNG(mockCanvas)).toThrow('PNG export failed');
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});