import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PaletteSelector from './palette-selector';
import { colorPalettes } from '@/utils/color-palettes';

// Mock Radix UI Select components
vi.mock('@radix-ui/react-select', () => ({
  Root: ({ children, value, onValueChange }: any) => (
    <div data-testid="select-root" data-value={value}>
      <button onClick={() => onValueChange('ocean')} data-testid="select-trigger">
        Select Palette
      </button>
      {children}
    </div>
  ),
  Trigger: ({ children, className }: any) => (
    <button className={className} data-testid="select-trigger">
      {children}
    </button>
  ),
  Value: () => <span data-testid="select-value">Current Value</span>,
  Icon: ({ children }: any) => <span data-testid="select-icon">{children}</span>,
  Portal: ({ children }: any) => <div data-testid="select-portal">{children}</div>,
  Content: ({ children, className }: any) => (
    <div className={className} data-testid="select-content">
      {children}
    </div>
  ),
  Viewport: ({ children }: any) => <div data-testid="select-viewport">{children}</div>,
  Item: ({ children, value, className, onSelect }: any) => (
    <div 
      className={className} 
      data-testid={`select-item-${value}`}
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  ),
  ItemText: ({ children, className }: any) => (
    <span className={className} data-testid="select-item-text">{children}</span>
  )
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  ChevronDown: ({ className }: any) => (
    <div className={className} data-testid="chevron-down-icon">▼</div>
  )
}));

describe('PaletteSelector Component', () => {
  const mockOnValueChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with label', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      expect(screen.getByText('Color Palette')).toBeInTheDocument();
    });

    it('should render select root with current value', () => {
      render(
        <PaletteSelector 
          value="fire" 
          onValueChange={mockOnValueChange} 
        />
      );

      const selectRoot = screen.getByTestId('select-root');
      expect(selectRoot).toHaveAttribute('data-value', 'fire');
    });

    it('should render ChevronDown icon', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });
  });

  describe('palette options', () => {
    it('should render all available palettes', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      colorPalettes.forEach(palette => {
        expect(screen.getByTestId(`select-item-${palette.name}`)).toBeInTheDocument();
      });
    });

    it('should display palette names correctly', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      colorPalettes.forEach(palette => {
        const item = screen.getByTestId(`select-item-${palette.name}`);
        expect(item).toHaveTextContent(palette.name);
      });
    });

    it('should render color preview dots for each palette', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      // Each palette should show first 3 colors as preview dots
      colorPalettes.forEach(palette => {
        const item = screen.getByTestId(`select-item-${palette.name}`);
        const colorDots = item.querySelectorAll('[style*="background-color"]');
        expect(colorDots).toHaveLength(3); // First 3 colors
      });
    });
  });

  describe('value changes', () => {
    it('should call onValueChange when selection changes', async () => {
      const user = userEvent.setup();
      
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);

      expect(mockOnValueChange).toHaveBeenCalledWith('ocean');
    });

    it('should handle all palette selections', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      colorPalettes.forEach(palette => {
        const item = screen.getByTestId(`select-item-${palette.name}`);
        fireEvent.click(item);
      });

      expect(mockOnValueChange).toHaveBeenCalledTimes(colorPalettes.length);
    });
  });

  describe('styling', () => {
    it('should apply correct CSS classes to label', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      const label = screen.getByText('Color Palette');
      expect(label).toHaveClass('text-sm', 'font-medium', 'text-white');
    });

    it('should apply correct CSS classes to trigger', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      const trigger = screen.getByTestId('select-trigger');
      expect(trigger).toHaveClass(
        'w-full',
        'bg-white',
        'border',
        'border-gray-300',
        'text-gray-900',
        'rounded-lg',
        'focus:ring-primary',
        'focus:border-primary',
        'px-3',
        'py-2',
        'flex',
        'items-center',
        'justify-between'
      );
    });

    it('should apply correct CSS classes to content', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      const content = screen.getByTestId('select-content');
      expect(content).toHaveClass(
        'bg-white',
        'border',
        'border-gray-300',
        'rounded-lg',
        'shadow-lg',
        'overflow-hidden',
        'z-50'
      );
    });

    it('should apply correct CSS classes to items', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      colorPalettes.forEach(palette => {
        const item = screen.getByTestId(`select-item-${palette.name}`);
        expect(item).toHaveClass(
          'px-3',
          'py-2',
          'text-gray-900',
          'hover:bg-gray-100',
          'cursor-pointer',
          'flex',
          'items-center',
          'space-x-2'
        );
      });
    });
  });

  describe('color preview', () => {
    it('should show correct background colors for preview dots', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      colorPalettes.forEach(palette => {
        const item = screen.getByTestId(`select-item-${palette.name}`);
        const colorDots = item.querySelectorAll('[style*="background-color"]');
        
        colorDots.forEach((dot, index) => {
          const expectedColor = palette.colors[index];
          expect(dot).toHaveStyle(`background-color: ${expectedColor}`);
        });
      });
    });

    it('should apply correct CSS classes to color dots', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      colorPalettes.forEach(palette => {
        const item = screen.getByTestId(`select-item-${palette.name}`);
        const colorDots = item.querySelectorAll('[style*="background-color"]');
        
        colorDots.forEach(dot => {
          expect(dot).toHaveClass('w-3', 'h-3', 'rounded-full');
        });
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper label association', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      const label = screen.getByText('Color Palette');
      expect(label.tagName).toBe('LABEL');
    });

    it('should capitalize palette names in display', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      colorPalettes.forEach(palette => {
        const itemText = screen.getByTestId(`select-item-${palette.name}`);
        expect(itemText).toHaveClass('capitalize');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty value', () => {
      render(
        <PaletteSelector 
          value="" 
          onValueChange={mockOnValueChange} 
        />
      );

      const selectRoot = screen.getByTestId('select-root');
      expect(selectRoot).toHaveAttribute('data-value', '');
    });

    it('should handle invalid value', () => {
      render(
        <PaletteSelector 
          value="nonexistent-palette" 
          onValueChange={mockOnValueChange} 
        />
      );

      const selectRoot = screen.getByTestId('select-root');
      expect(selectRoot).toHaveAttribute('data-value', 'nonexistent-palette');
    });

    it('should handle null onValueChange', () => {
      expect(() => {
        render(
          <PaletteSelector 
            value="aurora" 
            onValueChange={null as any} 
          />
        );
      }).not.toThrow();
    });

    it('should handle undefined onValueChange', () => {
      expect(() => {
        render(
          <PaletteSelector 
            value="aurora" 
            onValueChange={undefined as any} 
          />
        );
      }).not.toThrow();
    });
  });

  describe('component structure', () => {
    it('should have proper component hierarchy', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      expect(screen.getByTestId('select-root')).toBeInTheDocument();
      expect(screen.getByTestId('select-portal')).toBeInTheDocument();
      expect(screen.getByTestId('select-content')).toBeInTheDocument();
      expect(screen.getByTestId('select-viewport')).toBeInTheDocument();
    });

    it('should render correct number of palette items', () => {
      render(
        <PaletteSelector 
          value="aurora" 
          onValueChange={mockOnValueChange} 
        />
      );

      const items = screen.getAllByTestId(/^select-item-/);  
      expect(items).toHaveLength(colorPalettes.length);
    });
  });
});