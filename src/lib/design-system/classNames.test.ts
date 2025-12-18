/**
 * Tests for classNames utility
 * Feature: 009-apple-hig-ui-redesign
 * Utility for combining CSS class names
 */

import { describe, it, expect } from 'vitest';
import { classNames } from './classNames';

describe('classNames Utility', () => {
  describe('Basic Functionality', () => {
    it('should return empty string for no arguments', () => {
      expect(classNames()).toBe('');
    });

    it('should return single class name', () => {
      expect(classNames('foo')).toBe('foo');
    });

    it('should combine multiple class names', () => {
      expect(classNames('foo', 'bar')).toBe('foo bar');
    });

    it('should handle three or more class names', () => {
      expect(classNames('foo', 'bar', 'baz')).toBe('foo bar baz');
    });
  });

  describe('Falsy Values', () => {
    it('should ignore undefined', () => {
      expect(classNames('foo', undefined, 'bar')).toBe('foo bar');
    });

    it('should ignore null', () => {
      expect(classNames('foo', null, 'bar')).toBe('foo bar');
    });

    it('should ignore false', () => {
      expect(classNames('foo', false, 'bar')).toBe('foo bar');
    });

    it('should ignore empty string', () => {
      expect(classNames('foo', '', 'bar')).toBe('foo bar');
    });

    it('should handle all falsy values', () => {
      expect(classNames(undefined, null, false, '', 'foo')).toBe('foo');
    });
  });

  describe('Conditional Classes', () => {
    it('should handle boolean conditions', () => {
      const isActive = true;
      const isDisabled = false;

      expect(classNames('button', isActive && 'active', isDisabled && 'disabled')).toBe(
        'button active'
      );
    });

    it('should handle ternary operators', () => {
      const variant = 'primary';
      expect(classNames('button', variant === 'primary' ? 'btn-primary' : 'btn-secondary')).toBe(
        'button btn-primary'
      );
    });

    it('should handle complex conditions', () => {
      const size = 'large';
      const isDisabled = false;
      const isLoading = true;

      expect(
        classNames(
          'button',
          size === 'small' && 'btn-sm',
          size === 'large' && 'btn-lg',
          isDisabled && 'disabled',
          isLoading && 'loading'
        )
      ).toBe('button btn-lg loading');
    });
  });

  describe('Edge Cases', () => {
    it('should handle numbers', () => {
      expect(classNames('foo', 0, 'bar')).toBe('foo bar');
      expect(classNames('foo', 1, 'bar')).toBe('foo 1 bar');
    });

    it('should trim extra whitespace', () => {
      expect(classNames('  foo  ', '  bar  ')).toBe('foo bar');
    });

    it('should handle duplicate class names', () => {
      // Does not deduplicate - that's the caller's responsibility
      expect(classNames('foo', 'bar', 'foo')).toBe('foo bar foo');
    });

    it('should handle very long class strings', () => {
      const longString = 'a'.repeat(100);
      expect(classNames(longString, 'bar')).toBe(`${longString} bar`);
    });
  });

  describe('Real-world Use Cases', () => {
    it('should work with button variants', () => {
      function getButtonClasses(variant: string, size: string, disabled: boolean) {
        return classNames(
          'button',
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          size === 'small' && 'btn-sm',
          size === 'large' && 'btn-lg',
          disabled && 'btn-disabled'
        );
      }

      expect(getButtonClasses('primary', 'large', false)).toBe('button btn-primary btn-lg');
      expect(getButtonClasses('secondary', 'small', true)).toBe(
        'button btn-secondary btn-sm btn-disabled'
      );
    });

    it('should work with card styles', () => {
      function getCardClasses(elevated: boolean, interactive: boolean, selected: boolean) {
        return classNames(
          'card',
          elevated && 'card-elevated',
          interactive && 'card-interactive',
          selected && 'card-selected'
        );
      }

      expect(getCardClasses(true, true, false)).toBe('card card-elevated card-interactive');
      expect(getCardClasses(false, false, true)).toBe('card card-selected');
    });

    it('should work with responsive classes', () => {
      function getResponsiveClasses(mobile: string, tablet: string, desktop: string) {
        return classNames(mobile, tablet, desktop);
      }

      expect(getResponsiveClasses('w-full', 'md:w-1/2', 'lg:w-1/3')).toBe(
        'w-full md:w-1/2 lg:w-1/3'
      );
    });
  });

  describe('Type Safety', () => {
    it('should accept various types', () => {
      // These should all compile and work
      expect(classNames('string')).toBe('string');
      expect(classNames(true && 'conditional')).toBe('conditional');
      expect(classNames(false && 'conditional')).toBe('');
      expect(classNames(undefined)).toBe('');
      expect(classNames(null)).toBe('');
    });
  });
});
