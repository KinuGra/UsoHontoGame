/**
 * Tests for useTheme hook
 * Feature: 009-apple-hig-ui-redesign
 * Dark mode theme management based on Apple HIG
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';
import type { ReactNode } from 'react';

// Mock ThemeProvider for testing
const mockThemeProvider = ({ children }: { children: ReactNode }) => children;

describe('useTheme Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document theme attribute
    document.documentElement.removeAttribute('data-theme');
    // Reset system preference mock
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should default to system theme mode', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('system');
    });

    it('should detect light system preference', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());
      expect(result.current.effectiveTheme).toBe('light');
    });

    it('should detect dark system preference', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());
      expect(result.current.effectiveTheme).toBe('dark');
    });
  });

  describe('Theme Persistence', () => {
    it('should load theme from localStorage', () => {
      localStorage.setItem('theme-preference', 'dark');

      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('dark');
    });

    it('should save theme to localStorage when changed', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(localStorage.getItem('theme-preference')).toBe('dark');
    });

    it('should handle invalid localStorage values gracefully', () => {
      localStorage.setItem('theme-preference', 'invalid-theme');

      const { result } = renderHook(() => useTheme());
      // Should fallback to system
      expect(result.current.theme).toBe('system');
    });
  });

  describe('Theme Switching', () => {
    it('should switch to light theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.effectiveTheme).toBe('light');
    });

    it('should switch to dark theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.effectiveTheme).toBe('dark');
    });

    it('should switch to system theme', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });
      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
      // Effective theme should match system preference
    });

    it('should toggle between light and dark', () => {
      const { result } = renderHook(() => useTheme());

      // Start with light
      act(() => {
        result.current.setTheme('light');
      });
      expect(result.current.effectiveTheme).toBe('light');

      // Toggle to dark
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.effectiveTheme).toBe('dark');

      // Toggle back to light
      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.effectiveTheme).toBe('light');
    });
  });

  describe('DOM Updates', () => {
    it('should update data-theme attribute when theme changes', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should remove data-theme attribute for system light', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      // System light mode should not set data-theme (default is light)
      expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('should set data-theme="dark" for system dark', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? true : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('system');
      });

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('System Preference Changes', () => {
    it('should listen to system preference changes', () => {
      const listeners: Array<(e: MediaQueryListEvent) => void> = [];

      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event, handler) => {
          if (event === 'change') {
            listeners.push(handler as (e: MediaQueryListEvent) => void);
          }
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useTheme());

      // Verify system mode
      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
      // Should have registered a listener
      expect(listeners.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing localStorage gracefully', () => {
      // Mock localStorage to throw error
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => {
        throw new Error('localStorage not available');
      });

      const { result } = renderHook(() => useTheme());
      expect(result.current.theme).toBe('system'); // Should fallback to system

      // Restore
      Storage.prototype.getItem = originalGetItem;
    });

    it('should handle missing matchMedia gracefully', () => {
      // Remove matchMedia
      const originalMatchMedia = window.matchMedia;
      // @ts-expect-error - Testing missing matchMedia
      delete window.matchMedia;

      const { result } = renderHook(() => useTheme());
      // Should default to light when matchMedia is unavailable
      expect(result.current.effectiveTheme).toBe('light');

      // Restore
      window.matchMedia = originalMatchMedia;
    });
  });
});
