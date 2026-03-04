"use client"

import React, { useState, useCallback } from 'react';
import ParticleCanvas from './components/particle-canvas';
import ControlPanel from './components/control-panel';
import type { EngineConfig } from './types';

const initialConfig: EngineConfig = {
  speed: 1.0,
  trailLength: 60,
  particleDensity: 1.0,
  flowField: 'spiral-galaxy',
  colorPalette: 'aurora',
};

const App: React.FC = () => {
  const [config, setConfig] = useState<EngineConfig>(initialConfig);
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  const handleConfigChange = useCallback((newConfig: Partial<EngineConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const handleExport = useCallback(() => {
    if (exportFn) {
      exportFn();
    }
  }, [exportFn]);

  const registerExportFn = useCallback((fn: () => void) => {
    setExportFn(() => fn);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <ParticleCanvas 
        className="flex-1" 
        config={config}
        onConfigChange={handleConfigChange}
        onExport={registerExportFn}
      />
      <div className="p-4">
        <ControlPanel 
          config={config}
          onConfigChange={handleConfigChange}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

export default App;