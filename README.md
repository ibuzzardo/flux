# Flux - Interactive Particle Flow Field Visualizer

A generative art web application that renders interactive particle flow fields on an HTML5 canvas with real-time controls.

## Features

- **6 Mathematical Flow Fields**: Spiral Galaxy, Ocean Currents, Turbulence, Twin Vortex, Fractal Flow, Magnetic Field
- **6 Color Palettes**: Aurora, Ocean, Fire, Forest, Cosmic, Sunset (all with dark backgrounds)
- **Mouse Interaction**: Hover to create orbital motion, click to attract particles
- **Real-time Controls**: Speed, trail length, particle density sliders
- **Glassmorphism UI**: Backdrop-blur control panel with responsive design
- **PNG Export**: Download current canvas frame as high-quality image
- **Responsive Design**: Works on mobile (320px), tablet (768px), and desktop (1280px+)

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **HTML5 Canvas** for high-performance particle rendering
- **Zod** for runtime type validation

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_FLUX_APP_NAME="Flux"
```

## Usage

1. **Select Flow Field**: Choose from 6 mathematical flow patterns
2. **Pick Color Palette**: Switch between 6 curated color schemes
3. **Adjust Parameters**: Use sliders to control speed, trails, and density
4. **Interact**: Hover mouse to create orbital motion, click to attract particles
5. **Export**: Click PNG button to download current visualization

## Architecture

- `src/hooks/use-particle-engine.ts` - Core particle simulation and canvas rendering
- `src/fields/flow-fields.ts` - Mathematical vector field functions
- `src/utils/color-palettes.ts` - Color scheme definitions
- `src/components/` - React UI components with glassmorphism styling
- `src/types.ts` - TypeScript interfaces and type definitions

## Performance

- Optimized for 60fps with requestAnimationFrame
- Efficient particle lifecycle management
- Canvas rendering with alpha blending for trail effects
- Responsive canvas sizing with devicePixelRatio support

## Browser Support

- Modern browsers with HTML5 Canvas support
- Mobile Safari, Chrome, Firefox, Edge
- Requires JavaScript enabled

## License

MIT License - see LICENSE file for details