import type { FlowFieldConfig } from '@/types';

const spiralGalaxy = (x: number, y: number, time: number): { x: number; y: number } => {
  const centerX = 0.5;
  const centerY = 0.5;
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) + time * 0.001 + distance * 8;
  const strength = 0.02 / (distance + 0.1);
  return {
    x: -Math.sin(angle) * strength,
    y: Math.cos(angle) * strength,
  };
};

const oceanCurrents = (x: number, y: number, time: number): { x: number; y: number } => {
  const wave1 = Math.sin(x * 4 + time * 0.002) * 0.01;
  const wave2 = Math.cos(y * 6 + time * 0.003) * 0.008;
  return {
    x: wave1 + Math.sin(y * 3 + time * 0.001) * 0.005,
    y: wave2 + Math.cos(x * 2 + time * 0.0015) * 0.006,
  };
};

const turbulence = (x: number, y: number, time: number): { x: number; y: number } => {
  const noise1 = Math.sin(x * 10 + time * 0.005) * Math.cos(y * 8 + time * 0.003);
  const noise2 = Math.cos(x * 6 + time * 0.004) * Math.sin(y * 12 + time * 0.006);
  return {
    x: noise1 * 0.015,
    y: noise2 * 0.012,
  };
};

const twinVortex = (x: number, y: number, time: number): { x: number; y: number } => {
  const center1X = 0.3 + Math.sin(time * 0.001) * 0.1;
  const center1Y = 0.5;
  const center2X = 0.7 - Math.sin(time * 0.001) * 0.1;
  const center2Y = 0.5;
  
  const dx1 = x - center1X;
  const dy1 = y - center1Y;
  const dx2 = x - center2X;
  const dy2 = y - center2Y;
  
  const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  
  const strength1 = 0.02 / (dist1 + 0.1);
  const strength2 = 0.02 / (dist2 + 0.1);
  
  return {
    x: -dy1 * strength1 + dy2 * strength2,
    y: dx1 * strength1 - dx2 * strength2,
  };
};

const fractalFlow = (x: number, y: number, time: number): { x: number; y: number } => {
  let vx = 0;
  let vy = 0;
  let scale = 1;
  
  for (let i = 0; i < 4; i++) {
    const freq = scale * 4;
    const amp = 0.01 / scale;
    vx += Math.sin(x * freq + time * 0.002 * scale) * amp;
    vy += Math.cos(y * freq + time * 0.003 * scale) * amp;
    scale *= 2;
  }
  
  return { x: vx, y: vy };
};

const magneticField = (x: number, y: number, time: number): { x: number; y: number } => {
  const centerX = 0.5 + Math.sin(time * 0.001) * 0.2;
  const centerY = 0.5 + Math.cos(time * 0.0015) * 0.2;
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  
  const radialForce = 0.005 / (distance + 0.1);
  const tangentialForce = 0.01 / (distance + 0.1);
  
  return {
    x: Math.cos(angle) * radialForce - Math.sin(angle) * tangentialForce,
    y: Math.sin(angle) * radialForce + Math.cos(angle) * tangentialForce,
  };
};

export const flowFields: readonly FlowFieldConfig[] = [
  {
    name: 'spiral-galaxy',
    displayName: 'Spiral Galaxy',
    vectorFunction: spiralGalaxy,
  },
  {
    name: 'ocean-currents',
    displayName: 'Ocean Currents',
    vectorFunction: oceanCurrents,
  },
  {
    name: 'turbulence',
    displayName: 'Turbulence',
    vectorFunction: turbulence,
  },
  {
    name: 'twin-vortex',
    displayName: 'Twin Vortex',
    vectorFunction: twinVortex,
  },
  {
    name: 'fractal-flow',
    displayName: 'Fractal Flow',
    vectorFunction: fractalFlow,
  },
  {
    name: 'magnetic-field',
    displayName: 'Magnetic Field',
    vectorFunction: magneticField,
  },
] as const;

export const getFlowField = (name: string): FlowFieldConfig => {
  return flowFields.find(f => f.name === name) || flowFields[0];
};