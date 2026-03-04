import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { colorPalettes } from '@/utils/color-palettes';

interface PaletteSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const PaletteSelector: React.FC<PaletteSelectorProps> = ({ value, onValueChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white">Color Palette</label>
      <Select.Root value={value} onValueChange={onValueChange}>
        <Select.Trigger className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-primary focus:border-primary px-3 py-2 flex items-center justify-between">
          <Select.Value />
          <Select.Icon>
            <ChevronDown className="h-4 w-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-50">
            <Select.Viewport>
              {colorPalettes.map((palette) => (
                <Select.Item
                  key={palette.name}
                  value={palette.name}
                  className="px-3 py-2 text-gray-900 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                >
                  <div className="flex space-x-1">
                    {palette.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Select.ItemText className="capitalize">
                    {palette.name}
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default PaletteSelector;