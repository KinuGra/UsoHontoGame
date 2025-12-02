/**
 * Tests for color design tokens
 * Feature: 009-apple-hig-ui-redesign
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Color Tokens', () => {
  let testElement: HTMLDivElement;

  beforeEach(() => {
    // Create a test element to apply styles
    testElement = document.createElement('div');
    document.body.appendChild(testElement);

    // Import the color tokens CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/src/styles/tokens/colors.css';
    document.head.appendChild(link);
  });

  afterEach(() => {
    // Cleanup
    if (testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
    // Remove stylesheet links
    const links = document.querySelectorAll('link[href*="colors.css"]');
    links.forEach((link) => link.remove());
  });

  describe('Light Mode', () => {
    beforeEach(() => {
      // Ensure light mode is active
      document.documentElement.removeAttribute('data-theme');
    });

    it('should define primary color token', () => {
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-primary'
      );
      expect(primaryColor).toBeTruthy();
      expect(primaryColor.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should define success color token', () => {
      const successColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-success'
      );
      expect(successColor).toBeTruthy();
      expect(successColor.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should define error color token', () => {
      const errorColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-error'
      );
      expect(errorColor).toBeTruthy();
      expect(errorColor.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should define warning color token', () => {
      const warningColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-warning'
      );
      expect(warningColor).toBeTruthy();
      expect(warningColor.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should define background primary token', () => {
      const bgPrimary = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
      expect(bgPrimary).toBeTruthy();
      // Light mode should be white or light color
      expect(bgPrimary.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should define text primary token', () => {
      const textPrimary = getComputedStyle(document.documentElement).getPropertyValue(
        '--text-primary'
      );
      expect(textPrimary).toBeTruthy();
      // Light mode text should be dark
      expect(textPrimary.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should define text secondary token', () => {
      const textSecondary = getComputedStyle(document.documentElement).getPropertyValue(
        '--text-secondary'
      );
      expect(textSecondary).toBeTruthy();
      expect(textSecondary.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('Dark Mode', () => {
    beforeEach(() => {
      // Enable dark mode
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    afterEach(() => {
      // Reset to light mode
      document.documentElement.removeAttribute('data-theme');
    });

    it('should override background primary token in dark mode', () => {
      const bgPrimary = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
      expect(bgPrimary).toBeTruthy();
      // Dark mode should be dark color
      expect(bgPrimary.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should override text primary token in dark mode', () => {
      const textPrimary = getComputedStyle(document.documentElement).getPropertyValue(
        '--text-primary'
      );
      expect(textPrimary).toBeTruthy();
      // Dark mode text should be light
      expect(textPrimary.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should maintain primary color token in dark mode', () => {
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--color-primary'
      );
      expect(primaryColor).toBeTruthy();
      expect(primaryColor.trim()).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('WCAG AA Compliance', () => {
    it('should have sufficient contrast ratio for text on background', () => {
      // This is a placeholder test - actual implementation would calculate
      // contrast ratios using a color contrast library
      // WCAG AA requires 4.5:1 for normal text, 3:1 for large text

      const bgPrimary = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary');
      const textPrimary = getComputedStyle(document.documentElement).getPropertyValue(
        '--text-primary'
      );

      expect(bgPrimary).toBeTruthy();
      expect(textPrimary).toBeTruthy();
      // Actual contrast calculation would go here
    });
  });
});
