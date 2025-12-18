/**
 * Tests for elevation utilities
 * Feature: 009-apple-hig-ui-redesign
 * Depth and visual hierarchy through proper elevation management
 */

import { describe, it, expect } from 'vitest';
import {
  getElevationClassName,
  getZIndex,
  type ElevationLevel,
  type ZIndexLevel,
} from './elevation';

describe('Elevation Utilities', () => {
  describe('getZIndex', () => {
    it('should return z-index value for base', () => {
      expect(getZIndex('base')).toBe(0);
    });

    it('should return z-index value for raised', () => {
      expect(getZIndex('raised')).toBe(10);
    });

    it('should return z-index value for dropdown', () => {
      expect(getZIndex('dropdown')).toBe(100);
    });

    it('should return z-index value for sticky', () => {
      expect(getZIndex('sticky')).toBe(200);
    });

    it('should return z-index value for overlay', () => {
      expect(getZIndex('overlay')).toBe(300);
    });

    it('should return z-index value for modal', () => {
      expect(getZIndex('modal')).toBe(400);
    });

    it('should return z-index value for popover', () => {
      expect(getZIndex('popover')).toBe(500);
    });

    it('should return z-index value for tooltip', () => {
      expect(getZIndex('tooltip')).toBe(600);
    });
  });

  describe('getElevationClassName', () => {
    describe('Basic Elevation Levels', () => {
      it('should return flat elevation classes', () => {
        const className = getElevationClassName({ level: 'flat' });
        expect(className).toContain('elevation-flat');
        expect(className).toContain('shadow-none');
      });

      it('should return raised elevation classes', () => {
        const className = getElevationClassName({ level: 'raised' });
        expect(className).toContain('elevation-raised');
        expect(className).toContain('shadow-sm');
      });

      it('should return floating elevation classes', () => {
        const className = getElevationClassName({ level: 'floating' });
        expect(className).toContain('elevation-floating');
        expect(className).toContain('shadow-md');
      });

      it('should return elevated elevation classes', () => {
        const className = getElevationClassName({ level: 'elevated' });
        expect(className).toContain('elevation-elevated');
        expect(className).toContain('shadow-lg');
      });

      it('should return lifted elevation classes', () => {
        const className = getElevationClassName({ level: 'lifted' });
        expect(className).toContain('elevation-lifted');
        expect(className).toContain('shadow-xl');
      });
    });

    describe('Z-Index Levels', () => {
      it('should apply base z-index', () => {
        const className = getElevationClassName({ level: 'flat', zIndex: 'base' });
        expect(className).toContain('z-0');
      });

      it('should apply raised z-index', () => {
        const className = getElevationClassName({ level: 'raised', zIndex: 'raised' });
        expect(className).toContain('z-10');
      });

      it('should apply dropdown z-index', () => {
        const className = getElevationClassName({ level: 'floating', zIndex: 'dropdown' });
        expect(className).toContain('z-[100]');
      });

      it('should apply sticky z-index', () => {
        const className = getElevationClassName({ level: 'floating', zIndex: 'sticky' });
        expect(className).toContain('z-[200]');
      });

      it('should apply overlay z-index', () => {
        const className = getElevationClassName({ level: 'elevated', zIndex: 'overlay' });
        expect(className).toContain('z-[300]');
      });

      it('should apply modal z-index', () => {
        const className = getElevationClassName({ level: 'elevated', zIndex: 'modal' });
        expect(className).toContain('z-[400]');
      });

      it('should apply popover z-index', () => {
        const className = getElevationClassName({ level: 'lifted', zIndex: 'popover' });
        expect(className).toContain('z-[500]');
      });

      it('should apply tooltip z-index', () => {
        const className = getElevationClassName({ level: 'lifted', zIndex: 'tooltip' });
        expect(className).toContain('z-[600]');
      });
    });

    describe('Interactive States', () => {
      it('should not apply hover elevation by default', () => {
        const className = getElevationClassName({ level: 'raised' });
        expect(className).not.toContain('hover:shadow-');
      });

      it('should apply hover elevation when interactive is true', () => {
        const className = getElevationClassName({ level: 'raised', interactive: true });
        expect(className).toContain('hover:shadow-md');
      });

      it('should apply hover elevation for flat level', () => {
        const className = getElevationClassName({ level: 'flat', interactive: true });
        expect(className).toContain('hover:shadow-sm');
      });

      it('should apply hover elevation for raised level', () => {
        const className = getElevationClassName({ level: 'raised', interactive: true });
        expect(className).toContain('hover:shadow-md');
      });

      it('should apply hover elevation for floating level', () => {
        const className = getElevationClassName({ level: 'floating', interactive: true });
        expect(className).toContain('hover:shadow-lg');
      });

      it('should apply hover elevation for elevated level', () => {
        const className = getElevationClassName({ level: 'elevated', interactive: true });
        expect(className).toContain('hover:shadow-xl');
      });

      it('should apply hover elevation for lifted level', () => {
        const className = getElevationClassName({ level: 'lifted', interactive: true });
        expect(className).toContain('hover:shadow-2xl');
      });

      it('should include transition for interactive elements', () => {
        const className = getElevationClassName({ level: 'raised', interactive: true });
        expect(className).toContain('transition-shadow');
        expect(className).toContain('duration-200');
      });
    });

    describe('Edge Cases', () => {
      it('should return empty string for no options', () => {
        const className = getElevationClassName({});
        expect(className).toBe('');
      });

      it('should work with only level', () => {
        const className = getElevationClassName({ level: 'raised' });
        expect(className).toContain('elevation-raised');
        expect(className).toContain('shadow-sm');
      });

      it('should work with only zIndex', () => {
        const className = getElevationClassName({ zIndex: 'modal' });
        expect(className).toContain('z-[400]');
      });

      it('should work with only interactive', () => {
        const className = getElevationClassName({ interactive: true });
        expect(className).toContain('transition-shadow');
      });
    });

    describe('Combined Options', () => {
      it('should combine level and zIndex', () => {
        const className = getElevationClassName({
          level: 'elevated',
          zIndex: 'modal',
        });
        expect(className).toContain('elevation-elevated');
        expect(className).toContain('shadow-lg');
        expect(className).toContain('z-[400]');
      });

      it('should combine level, zIndex, and interactive', () => {
        const className = getElevationClassName({
          level: 'raised',
          zIndex: 'dropdown',
          interactive: true,
        });
        expect(className).toContain('elevation-raised');
        expect(className).toContain('shadow-sm');
        expect(className).toContain('z-[100]');
        expect(className).toContain('hover:shadow-md');
        expect(className).toContain('transition-shadow');
      });
    });

    describe('Real-world Use Cases', () => {
      it('should work for card with hover effect', () => {
        const className = getElevationClassName({
          level: 'raised',
          interactive: true,
        });
        expect(className).toContain('shadow-sm');
        expect(className).toContain('hover:shadow-md');
        expect(className).toContain('transition-shadow');
      });

      it('should work for dropdown menu', () => {
        const className = getElevationClassName({
          level: 'floating',
          zIndex: 'dropdown',
        });
        expect(className).toContain('shadow-md');
        expect(className).toContain('z-[100]');
      });

      it('should work for modal dialog', () => {
        const className = getElevationClassName({
          level: 'elevated',
          zIndex: 'modal',
        });
        expect(className).toContain('shadow-lg');
        expect(className).toContain('z-[400]');
      });

      it('should work for tooltip', () => {
        const className = getElevationClassName({
          level: 'lifted',
          zIndex: 'tooltip',
        });
        expect(className).toContain('shadow-xl');
        expect(className).toContain('z-[600]');
      });

      it('should work for sticky header', () => {
        const className = getElevationClassName({
          level: 'raised',
          zIndex: 'sticky',
        });
        expect(className).toContain('shadow-sm');
        expect(className).toContain('z-[200]');
      });
    });

    describe('Type Safety', () => {
      it('should accept all valid elevation levels', () => {
        const levels: ElevationLevel[] = ['flat', 'raised', 'floating', 'elevated', 'lifted'];

        levels.forEach((level) => {
          expect(() => getElevationClassName({ level })).not.toThrow();
        });
      });

      it('should accept all valid z-index levels', () => {
        const zIndexLevels: ZIndexLevel[] = [
          'base',
          'raised',
          'dropdown',
          'sticky',
          'overlay',
          'modal',
          'popover',
          'tooltip',
        ];

        zIndexLevels.forEach((zIndex) => {
          expect(() => getElevationClassName({ zIndex })).not.toThrow();
        });
      });
    });
  });
});
