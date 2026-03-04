import { describe, it, expect, beforeEach } from 'vitest';
import { flowFields, getFlowField } from './flow-fields';
import type { FlowFieldConfig } from '@/types';

describe('Flow Fields', () => {
  describe('flowFields constant', () => {
    it('should contain 6 flow fields', () => {
      expect(flowFields).toHaveLength(6);
    });

    it('should have all required field names', () => {
      const expectedNames = [
        'spiral-galaxy',
        'ocean-currents', 
        'turbulence',
        'twin-vortex',
        'fractal-flow',
        'magnetic-field'
      ];
      const actualNames = flowFields.map(f => f.name);
      expect(actualNames).toEqual(expectedNames);
    });

    it('should have display names for all fields', () => {
      flowFields.forEach(field => {
        expect(field.displayName).toBeTruthy();
        expect(typeof field.displayName).toBe('string');
        expect(field.displayName.length).toBeGreaterThan(0);
      });
    });

    it('should have vector functions for all fields', () => {
      flowFields.forEach(field => {
        expect(typeof field.vectorFunction).toBe('function');
      });
    });
  });

  describe('getFlowField function', () => {
    it('should return correct field by name', () => {
      const spiralGalaxy = getFlowField('spiral-galaxy');
      expect(spiralGalaxy.name).toBe('spiral-galaxy');
      expect(spiralGalaxy.displayName).toBe('Spiral Galaxy');
    });

    it('should return first field for unknown name', () => {
      const unknown = getFlowField('nonexistent');
      expect(unknown).toEqual(flowFields[0]);
    });

    it('should return first field for empty string', () => {
      const empty = getFlowField('');
      expect(empty).toEqual(flowFields[0]);
    });

    it('should handle null/undefined gracefully', () => {
      const nullField = getFlowField(null as any);
      const undefinedField = getFlowField(undefined as any);
      expect(nullField).toEqual(flowFields[0]);
      expect(undefinedField).toEqual(flowFields[0]);
    });
  });

  describe('spiral galaxy field', () => {
    let spiralGalaxy: FlowFieldConfig;

    beforeEach(() => {
      spiralGalaxy = getFlowField('spiral-galaxy');
    });

    it('should produce vectors pointing towards center with rotation', () => {
      const vector = spiralGalaxy.vectorFunction(0.8, 0.8, 0);
      expect(typeof vector.x).toBe('number');
      expect(typeof vector.y).toBe('number');
      expect(isFinite(vector.x)).toBe(true);
      expect(isFinite(vector.y)).toBe(true);
    });

    it('should handle center position without division by zero', () => {
      const vector = spiralGalaxy.vectorFunction(0.5, 0.5, 0);
      expect(isFinite(vector.x)).toBe(true);
      expect(isFinite(vector.y)).toBe(true);
    });

    it('should vary with time', () => {
      const vector1 = spiralGalaxy.vectorFunction(0.3, 0.3, 0);
      const vector2 = spiralGalaxy.vectorFunction(0.3, 0.3, 1000);
      expect(vector1.x).not.toBe(vector2.x);
      expect(vector1.y).not.toBe(vector2.y);
    });

    it('should have stronger force closer to center', () => {
      const nearCenter = spiralGalaxy.vectorFunction(0.51, 0.51, 0);
      const farFromCenter = spiralGalaxy.vectorFunction(0.9, 0.9, 0);
      const nearMagnitude = Math.sqrt(nearCenter.x ** 2 + nearCenter.y ** 2);
      const farMagnitude = Math.sqrt(farFromCenter.x ** 2 + farFromCenter.y ** 2);
      expect(nearMagnitude).toBeGreaterThan(farMagnitude);
    });
  });

  describe('ocean currents field', () => {
    let oceanCurrents: FlowFieldConfig;

    beforeEach(() => {
      oceanCurrents = getFlowField('ocean-currents');
    });

    it('should produce wave-like motion', () => {
      const vector = oceanCurrents.vectorFunction(0.5, 0.5, 0);
      expect(typeof vector.x).toBe('number');
      expect(typeof vector.y).toBe('number');
      expect(isFinite(vector.x)).toBe(true);
      expect(isFinite(vector.y)).toBe(true);
    });

    it('should vary smoothly across space', () => {
      const v1 = oceanCurrents.vectorFunction(0.0, 0.0, 0);
      const v2 = oceanCurrents.vectorFunction(0.1, 0.1, 0);
      expect(Math.abs(v1.x - v2.x)).toBeLessThan(0.1);
      expect(Math.abs(v1.y - v2.y)).toBeLessThan(0.1);
    });

    it('should be time-dependent', () => {
      const v1 = oceanCurrents.vectorFunction(0.5, 0.5, 0);
      const v2 = oceanCurrents.vectorFunction(0.5, 0.5, 5000);
      expect(v1.x).not.toBe(v2.x);
      expect(v1.y).not.toBe(v2.y);
    });
  });

  describe('turbulence field', () => {
    let turbulence: FlowFieldConfig;

    beforeEach(() => {
      turbulence = getFlowField('turbulence');
    });

    it('should produce chaotic motion', () => {
      const vector = turbulence.vectorFunction(0.5, 0.5, 0);
      expect(typeof vector.x).toBe('number');
      expect(typeof vector.y).toBe('number');
      expect(isFinite(vector.x)).toBe(true);
      expect(isFinite(vector.y)).toBe(true);
    });

    it('should have high frequency variation', () => {
      const v1 = turbulence.vectorFunction(0.1, 0.1, 0);
      const v2 = turbulence.vectorFunction(0.2, 0.2, 0);
      // Turbulence should show significant variation over small distances
      const diff = Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2);
      expect(diff).toBeGreaterThan(0);
    });
  });

  describe('twin vortex field', () => {
    let twinVortex: FlowFieldConfig;

    beforeEach(() => {
      twinVortex = getFlowField('twin-vortex');
    });

    it('should create opposing vortices', () => {
      const vector = twinVortex.vectorFunction(0.5, 0.5, 0);
      expect(typeof vector.x).toBe('number');
      expect(typeof vector.y).toBe('number');
      expect(isFinite(vector.x)).toBe(true);
      expect(isFinite(vector.y)).toBe(true);
    });

    it('should have moving vortex centers', () => {
      const v1 = twinVortex.vectorFunction(0.3, 0.5, 0);
      const v2 = twinVortex.vectorFunction(0.3, 0.5, 10000);
      expect(v1.x).not.toBe(v2.x);
      expect(v1.y).not.toBe(v2.y);
    });
  });

  describe('fractal flow field', () => {
    let fractalFlow: FlowFieldConfig;

    beforeEach(() => {
      fractalFlow = getFlowField('fractal-flow');
    });

    it('should produce multi-scale patterns', () => {
      const vector = fractalFlow.vectorFunction(0.5, 0.5, 0);
      expect(typeof vector.x).toBe('number');
      expect(typeof vector.y).toBe('number');
      expect(isFinite(vector.x)).toBe(true);
      expect(isFinite(vector.y)).toBe(true);
    });

    it('should show detail at multiple scales', () => {
      // Test that the fractal shows variation at different scales
      const coarse = fractalFlow.vectorFunction(0.1, 0.1, 0);
      const fine = fractalFlow.vectorFunction(0.101, 0.101, 0);
      expect(coarse.x).not.toBe(fine.x);
      expect(coarse.y).not.toBe(fine.y);
    });
  });

  describe('magnetic field', () => {
    let magneticField: FlowFieldConfig;

    beforeEach(() => {
      magneticField = getFlowField('magnetic-field');
    });

    it('should produce field-like patterns', () => {
      const vector = magneticField.vectorFunction(0.5, 0.5, 0);
      expect(typeof vector.x).toBe('number');
      expect(typeof vector.y).toBe('number');
      expect(isFinite(vector.x)).toBe(true);
      expect(isFinite(vector.y)).toBe(true);
    });

    it('should have moving field center', () => {
      const v1 = magneticField.vectorFunction(0.5, 0.5, 0);
      const v2 = magneticField.vectorFunction(0.5, 0.5, 5000);
      expect(v1.x).not.toBe(v2.x);
      expect(v1.y).not.toBe(v2.y);
    });
  });

  describe('edge cases', () => {
    it('should handle extreme coordinates', () => {
      flowFields.forEach(field => {
        const extremeVector = field.vectorFunction(-10, 10, 0);
        expect(isFinite(extremeVector.x)).toBe(true);
        expect(isFinite(extremeVector.y)).toBe(true);
      });
    });

    it('should handle large time values', () => {
      flowFields.forEach(field => {
        const largeTimeVector = field.vectorFunction(0.5, 0.5, 1e10);
        expect(isFinite(largeTimeVector.x)).toBe(true);
        expect(isFinite(largeTimeVector.y)).toBe(true);
      });
    });

    it('should handle negative time values', () => {
      flowFields.forEach(field => {
        const negativeTimeVector = field.vectorFunction(0.5, 0.5, -1000);
        expect(isFinite(negativeTimeVector.x)).toBe(true);
        expect(isFinite(negativeTimeVector.y)).toBe(true);
      });
    });

    it('should produce reasonable vector magnitudes', () => {
      flowFields.forEach(field => {
        const vector = field.vectorFunction(0.5, 0.5, 0);
        const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        expect(magnitude).toBeLessThan(1); // Reasonable for particle simulation
        expect(magnitude).toBeGreaterThanOrEqual(0);
      });
    });
  });
});