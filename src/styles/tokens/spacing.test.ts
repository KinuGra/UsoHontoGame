/**
 * Tests for spacing design tokens
 * Feature: 009-apple-hig-ui-redesign
 * 8px grid system based on Apple HIG
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Spacing Tokens', () => {
  beforeEach(() => {
    // Import the spacing tokens CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/styles/tokens/spacing.css';
    link.id = 'spacing-tokens';
    document.head.appendChild(link);
  });

  afterEach(() => {
    // Cleanup
    const link = document.getElementById('spacing-tokens');
    if (link) {
      link.remove();
    }
  });

  describe('Base Spacing Scale (8px grid)', () => {
    it('should define --spacing-0 as 0px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-0');
      expect(spacing.trim()).toBe('0px');
    });

    it('should define --spacing-xs as 4px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-xs');
      expect(spacing.trim()).toBe('4px');
    });

    it('should define --spacing-sm as 8px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-sm');
      expect(spacing.trim()).toBe('8px');
    });

    it('should define --spacing-md as 16px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-md');
      expect(spacing.trim()).toBe('16px');
    });

    it('should define --spacing-lg as 24px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-lg');
      expect(spacing.trim()).toBe('24px');
    });

    it('should define --spacing-xl as 32px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-xl');
      expect(spacing.trim()).toBe('32px');
    });

    it('should define --spacing-2xl as 48px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-2xl');
      expect(spacing.trim()).toBe('48px');
    });

    it('should define --spacing-3xl as 64px', () => {
      const spacing = getComputedStyle(document.documentElement).getPropertyValue('--spacing-3xl');
      expect(spacing.trim()).toBe('64px');
    });
  });

  describe('8px Grid Compliance', () => {
    it('all spacing values should be multiples of 4px', () => {
      const spacingVars = [
        '--spacing-0',
        '--spacing-xs',
        '--spacing-sm',
        '--spacing-md',
        '--spacing-lg',
        '--spacing-xl',
        '--spacing-2xl',
        '--spacing-3xl',
      ];

      spacingVars.forEach((varName) => {
        const value = getComputedStyle(document.documentElement).getPropertyValue(varName);
        const numericValue = Number.parseInt(value.trim(), 10);

        // Should be a multiple of 4 (half of 8px grid)
        expect(numericValue % 4).toBe(0);
      });
    });
  });

  describe('Component-specific Spacing', () => {
    it('should define button padding tokens', () => {
      const paddingSmall = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-button-sm'
      );
      const paddingMedium = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-button-md'
      );
      const paddingLarge = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-button-lg'
      );

      expect(paddingSmall).toBeTruthy();
      expect(paddingMedium).toBeTruthy();
      expect(paddingLarge).toBeTruthy();
    });

    it('should define card padding tokens', () => {
      const paddingSmall = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-card-sm'
      );
      const paddingMedium = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-card-md'
      );
      const paddingLarge = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-card-lg'
      );

      expect(paddingSmall).toBeTruthy();
      expect(paddingMedium).toBeTruthy();
      expect(paddingLarge).toBeTruthy();
    });

    it('should define container max-widths', () => {
      const containerSm = getComputedStyle(document.documentElement).getPropertyValue(
        '--container-sm'
      );
      const containerMd = getComputedStyle(document.documentElement).getPropertyValue(
        '--container-md'
      );
      const containerLg = getComputedStyle(document.documentElement).getPropertyValue(
        '--container-lg'
      );

      expect(containerSm).toBeTruthy();
      expect(containerMd).toBeTruthy();
      expect(containerLg).toBeTruthy();
    });
  });

  describe('Layout Spacing', () => {
    it('should define section spacing tokens', () => {
      const sectionSpacing = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-section'
      );
      expect(sectionSpacing).toBeTruthy();
    });

    it('should define page padding tokens', () => {
      const pagePadding = getComputedStyle(document.documentElement).getPropertyValue(
        '--spacing-page'
      );
      expect(pagePadding).toBeTruthy();
    });
  });
});
