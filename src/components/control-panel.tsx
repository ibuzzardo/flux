"use client"

import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';
import { Download, ChevronDown } from 'lucide-react';
import { flowFields } from '@/fields/flow-fields';
import PaletteSelector from './palette-selector';
import type { EngineConfig } from '@/types';

interface ControlPanelProps {
  className?: string;
  config: EngineConfig;
  onConfigChange: (config: Partial<EngineConfig>) => void;
  onExport: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  className = '', 
  config, 
  onConfigChange, 
  onExport 
}) => {
  return (
    <div className={`bg-white/30 backdrop-blur-md p-6 rounded-lg shadow-lg ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Speed</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[config.speed * 100]}
            onValueChange={([value]) => onConfigChange({ speed: value / 100 })}
            max={200}
            min={10}
            step={5}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </Slider.Root>
          <div className="text-xs text-gray-200">{Math.round(config.speed * 100)}%</div>
        </div>

        {/* Trail Length Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Trail Length</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[config.trailLength]}
            onValueChange={([value]) => onConfigChange({ trailLength: value })}
            max={200}
            min={20}
            step={10}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </Slider.Root>
          <div className="text-xs text-gray-200">{config.trailLength}</div>
        </div>

        {/* Particle Density Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Density</label>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[config.particleDensity * 100]}
            onValueChange={([value]) => onConfigChange({ particleDensity: value / 100 })}
            max={200}
            min={25}
            step={5}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-primary rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </Slider.Root>
          <div className="text-xs text-gray-200">{Math.round(config.particleDensity * 100)}%</div>
        </div>

        {/* Export Button */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Export</label>
          <button
            onClick={onExport}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>PNG</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Flow Field Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Flow Field</label>
          <Select.Root value={config.flowField} onValueChange={(value) => onConfigChange({ flowField: value })}>
            <Select.Trigger className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary px-3 py-2 flex items-center justify-between">
              <Select.Value />
              <Select.Icon>
                <ChevronDown className="h-4 w-4" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-50">
                <Select.Viewport>
                  {flowFields.map((field) => (
                    <Select.Item
                      key={field.name}
                      value={field.name}
                      className="px-3 py-2 text-gray-900 hover:bg-gray-100 cursor-pointer"
                    >
                      <Select.ItemText>{field.displayName}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Color Palette Selector */}
        <PaletteSelector
          value={config.colorPalette}
          onValueChange={(value) => onConfigChange({ colorPalette: value })}
        />
      </div>
    </div>
  );
};

export default ControlPanel;