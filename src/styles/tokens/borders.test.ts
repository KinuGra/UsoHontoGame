/**
 * Tests for border design tokens
 * Feature: 009-apple-hig-ui-redesign
 * Border system based on Apple HIG
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Border Tokens', () => {
  beforeEach(() => {
    // Import the border tokens CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/styles/tokens/borders.css';
    link.id = 'border-tokens';
    document.head.appendChild(link);
  });

  afterEach(() => {
    // Cleanup
    const link = document.getElementById('border-tokens');
    if (link) {
      link.remove();
    }
  });

  describe('Border Radius', () => {
    it('should define border-radius-none as 0px', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-none'
      );
      expect(radius.trim()).toBe('0px');
    });

    it('should define border-radius-sm as 4px', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-sm'
      );
      expect(radius.trim()).toBe('4px');
    });

    it('should define border-radius-md as 8px', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-md'
      );
      expect(radius.trim()).toBe('8px');
    });

    it('should define border-radius-lg as 12px', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-lg'
      );
      expect(radius.trim()).toBe('12px');
    });

    it('should define border-radius-xl as 16px', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-xl'
      );
      expect(radius.trim()).toBe('16px');
    });

    it('should define border-radius-full for circular elements', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-full'
      );
      expect(radius.trim()).toBe('9999px');
    });
  });

  describe('Border Widths', () => {
    it('should define border-width-none as 0px', () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-width-none'
      );
      expect(width.trim()).toBe('0px');
    });

    it('should define border-width-thin as 1px', () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-width-thin'
      );
      expect(width.trim()).toBe('1px');
    });

    it('should define border-width-medium as 2px', () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-width-medium'
      );
      expect(width.trim()).toBe('2px');
    });

    it('should define border-width-thick as 4px', () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-width-thick'
      );
      expect(width.trim()).toBe('4px');
    });
  });

  describe('Component-specific Border Radius', () => {
    it('should define button border radius', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-button'
      );
      expect(radius).toBeTruthy();
      expect(radius.trim()).toMatch(/^\d+px$/);
    });

    it('should define card border radius', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-card'
      );
      expect(radius).toBeTruthy();
      expect(radius.trim()).toMatch(/^\d+px$/);
    });

    it('should define input border radius', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-input'
      );
      expect(radius).toBeTruthy();
      expect(radius.trim()).toMatch(/^\d+px$/);
    });

    it('should define modal border radius', () => {
      const radius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-modal'
      );
      expect(radius).toBeTruthy();
      expect(radius.trim()).toMatch(/^\d+px$/);
    });
  });

  describe('Apple HIG Compliance', () => {
    it('should use subtle border radius values', () => {
      // Apple HIG prefers gentle curves, not too rounded
      const buttonRadius = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-radius-button'
      );
      const numericValue = Number.parseInt(buttonRadius.trim(), 10);
      // Reasonable range: 4px to 12px
      expect(numericValue).toBeGreaterThanOrEqual(4);
      expect(numericValue).toBeLessThanOrEqual(12);
    });

    it('should have consistent border width scale', () => {
      const widths = [
        '--border-width-none',
        '--border-width-thin',
        '--border-width-medium',
        '--border-width-thick',
      ].map((varName) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
        return Number.parseInt(value.trim(), 10);
      });

      // Verify ascending order
      for (let i = 1; i < widths.length; i++) {
        expect(widths[i]).toBeGreaterThan(widths[i - 1]);
      }
    });
  });

  describe('Focus Ring', () => {
    it('should define focus ring width', () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-width-focus'
      );
      expect(width).toBeTruthy();
      expect(width.trim()).toMatch(/^\d+px$/);
    });

    it('should define focus ring offset', () => {
      const offset = getComputedStyle(document.documentElement).getPropertyValue(
        '--border-focus-offset'
      );
      expect(offset).toBeTruthy();
      expect(offset.trim()).toMatch(/^\d+px$/);
    });
  });
});
