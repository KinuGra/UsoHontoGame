/**
 * Tests for typography design tokens
 * Feature: 009-apple-hig-ui-redesign
 * San Francisco font system based on Apple HIG
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Typography Tokens', () => {
  beforeEach(() => {
    // Import the typography tokens CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/styles/tokens/typography.css';
    link.id = 'typography-tokens';
    document.head.appendChild(link);
  });

  afterEach(() => {
    // Cleanup
    const link = document.getElementById('typography-tokens');
    if (link) {
      link.remove();
    }
  });

  describe('Font Families', () => {
    it('should define base font family with San Francisco priority', () => {
      const fontFamily = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-family-base'
      );
      expect(fontFamily).toBeTruthy();
      expect(fontFamily).toContain('-apple-system');
    });

    it('should define monospace font family', () => {
      const fontFamily = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-family-mono'
      );
      expect(fontFamily).toBeTruthy();
      expect(fontFamily).toContain('monospace');
    });
  });

  describe('Font Sizes - Display Scale', () => {
    it('should define display font size (28px)', () => {
      const fontSize = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-display'
      );
      expect(fontSize.trim()).toBe('28px');
    });

    it('should define title font sizes', () => {
      const title1 = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-title-1'
      );
      const title2 = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-title-2'
      );
      const title3 = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-title-3'
      );

      expect(title1.trim()).toBe('22px');
      expect(title2.trim()).toBe('20px');
      expect(title3.trim()).toBe('18px');
    });

    it('should define body font size (16px)', () => {
      const fontSize = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-body'
      );
      expect(fontSize.trim()).toBe('16px');
    });

    it('should define caption font sizes', () => {
      const caption1 = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-caption-1'
      );
      const caption2 = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-caption-2'
      );

      expect(caption1.trim()).toBe('14px');
      expect(caption2.trim()).toBe('12px');
    });
  });

  describe('Font Weights', () => {
    it('should define regular font weight (400)', () => {
      const weight = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-weight-regular'
      );
      expect(weight.trim()).toBe('400');
    });

    it('should define medium font weight (500)', () => {
      const weight = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-weight-medium'
      );
      expect(weight.trim()).toBe('500');
    });

    it('should define semibold font weight (600)', () => {
      const weight = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-weight-semibold'
      );
      expect(weight.trim()).toBe('600');
    });

    it('should define bold font weight (700)', () => {
      const weight = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-weight-bold'
      );
      expect(weight.trim()).toBe('700');
    });
  });

  describe('Line Heights', () => {
    it('should define tight line height (1.2)', () => {
      const lineHeight = getComputedStyle(document.documentElement).getPropertyValue(
        '--line-height-tight'
      );
      expect(lineHeight.trim()).toBe('1.2');
    });

    it('should define normal line height (1.5)', () => {
      const lineHeight = getComputedStyle(document.documentElement).getPropertyValue(
        '--line-height-normal'
      );
      expect(lineHeight.trim()).toBe('1.5');
    });

    it('should define relaxed line height (1.75)', () => {
      const lineHeight = getComputedStyle(document.documentElement).getPropertyValue(
        '--line-height-relaxed'
      );
      expect(lineHeight.trim()).toBe('1.75');
    });
  });

  describe('Letter Spacing', () => {
    it('should define tight letter spacing', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue(
        '--letter-spacing-tight'
      );
      expect(spacing.trim()).toBe('-0.01em');
    });

    it('should define normal letter spacing', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue(
        '--letter-spacing-normal'
      );
      expect(spacing.trim()).toBe('0em');
    });

    it('should define wide letter spacing', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue(
        '--letter-spacing-wide'
      );
      expect(spacing.trim()).toBe('0.02em');
    });
  });

  describe('Apple HIG Compliance', () => {
    it('should use San Francisco font as primary choice', () => {
      const fontFamily = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-family-base'
      );
      // -apple-system should be first in the stack
      expect(fontFamily.trim().startsWith('-apple-system')).toBe(true);
    });

    it('should have readable body text size (16px minimum)', () => {
      const bodySize = getComputedStyle(document.documentElement).getPropertyValue(
        '--font-size-body'
      );
      const numericSize = Number.parseInt(bodySize.trim(), 10);
      expect(numericSize).toBeGreaterThanOrEqual(16);
    });

    it('should maintain type scale consistency', () => {
      // Extract all font sizes
      const sizes = [
        '--font-size-caption-2',
        '--font-size-caption-1',
        '--font-size-body',
        '--font-size-title-3',
        '--font-size-title-2',
        '--font-size-title-1',
        '--font-size-display',
      ].map((varName) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
        return Number.parseInt(value.trim(), 10);
      });

      // Verify ascending order (type scale progression)
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i]).toBeGreaterThan(sizes[i - 1]);
      }
    });
  });
});
