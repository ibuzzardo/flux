"use client"

import React from 'react';
import { useParticleEngine } from '@/hooks/use-particle-engine';
import type { EngineConfig } from '@/types';

interface ParticleCanvasProps {
  className?: string;
  config: EngineConfig;
  onConfigChange: (config: Partial<EngineConfig>) => void;
  onExport: () => void;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ 
  className = '', 
  config, 
  onConfigChange, 
  onExport 
}) => {
  const { canvasRef, updateConfig, exportPNG } = useParticleEngine(config);

  React.useEffect(() => {
    updateConfig(config);
  }, [config, updateConfig]);

  React.useEffect(() => {
    onConfigChange(config);
    const exportHandler = () => exportPNG();
    onExport = exportHandler;
  }, [config, onConfigChange, exportPNG, onExport]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full cursor-crosshair ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};

export default ParticleCanvas;