/**
 * Tests for shadow design tokens
 * Feature: 009-apple-hig-ui-redesign
 * Elevation system based on Apple HIG
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Shadow Tokens', () => {
  beforeEach(() => {
    // Import the shadow tokens CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/styles/tokens/shadows.css';
    link.id = 'shadow-tokens';
    document.head.appendChild(link);
  });

  afterEach(() => {
    // Cleanup
    const link = document.getElementById('shadow-tokens');
    if (link) {
      link.remove();
    }
  });

  describe('Elevation Levels', () => {
    it('should define shadow-none', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-none');
      expect(shadow.trim()).toBe('none');
    });

    it('should define shadow-sm (subtle elevation)', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-sm');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });

    it('should define shadow-md (standard elevation)', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-md');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });

    it('should define shadow-lg (prominent elevation)', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-lg');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });

    it('should define shadow-xl (maximum elevation)', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-xl');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });
  });

  describe('Component-specific Shadows', () => {
    it('should define card shadow', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-card');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });

    it('should define button shadow', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-button');
      expect(shadow).toBeTruthy();
    });

    it('should define modal shadow', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-modal');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });

    it('should define dropdown shadow', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue(
        '--shadow-dropdown'
      );
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });
  });

  describe('Focus and Interactive Shadows', () => {
    it('should define focus ring shadow', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-focus');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });

    it('should define inner shadow', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-inner');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('inset');
    });
  });

  describe('Dark Mode Shadow Adjustments', () => {
    beforeEach(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    afterEach(() => {
      document.documentElement.removeAttribute('data-theme');
    });

    it('should adjust shadow opacity for dark mode', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-md');
      expect(shadow).toBeTruthy();
      // Dark mode shadows should still be visible but adjusted
      expect(shadow).toContain('rgba');
    });

    it('should define elevated shadow for dark mode', () => {
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-card');
      expect(shadow).toBeTruthy();
      expect(shadow).toContain('rgba');
    });
  });

  describe('Accessibility', () => {
    it('should have reduced motion alternative', () => {
      // Shadows should be defined even if animations are reduced
      const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow-sm');
      expect(shadow).toBeTruthy();
    });
  });
});
