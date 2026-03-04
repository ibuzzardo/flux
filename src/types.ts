export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface FlowFieldConfig {
  name: string;
  displayName: string;
  vectorFunction: (x: number, y: number, time: number) => { x: number; y: number };
}

export interface ColorPalette {
  name: string;
  colors: readonly string[];
  background: string;
}

export interface EngineConfig {
  speed: number;
  trailLength: number;
  particleDensity: number;
  flowField: string;
  colorPalette: string;
}

export interface MouseState {
  x: number;
  y: number;
  isPressed: boolean;
  isHovering: boolean;
}