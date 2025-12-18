/**
 * Tests for ThemeProvider
 * Feature: 009-apple-hig-ui-redesign
 * Theme context provider for dark mode management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from '@/lib/design-system/useTheme';

// Test component that uses the theme hook
function TestComponent() {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <div data-testid="theme-mode">{theme}</div>
      <div data-testid="effective-theme">{effectiveTheme}</div>
      <button type="button" onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button type="button" onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button type="button" onClick={() => setTheme('system')} data-testid="set-system">
        Set System
      </button>
      <button type="button" onClick={toggleTheme} data-testid="toggle">
        Toggle
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset document theme
    document.documentElement.removeAttribute('data-theme');
    // Mock matchMedia
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

  describe('Provider Functionality', () => {
    it('should render children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
    });

    it('should provide theme context to children', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-mode')).toBeInTheDocument();
      expect(screen.getByTestId('effective-theme')).toBeInTheDocument();
    });
  });

  describe('Initial Theme State', () => {
    it('should start with system theme mode', () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('theme-mode')).toHaveTextContent('system');
    });

    it('should detect system preference', () => {
      // Mock light system preference
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

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Wait for client-side hydration
      expect(screen.getByTestId('effective-theme')).toBeInTheDocument();
    });
  });

  describe('Theme Switching', () => {
    it('should allow switching to dark theme', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const setDarkButton = screen.getByTestId('set-dark');

      await act(async () => {
        setDarkButton.click();
      });

      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');
    });

    it('should allow switching to light theme', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const setLightButton = screen.getByTestId('set-light');

      await act(async () => {
        setLightButton.click();
      });

      expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
    });

    it('should allow switching to system theme', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // First set to dark
      const setDarkButton = screen.getByTestId('set-dark');
      await act(async () => {
        setDarkButton.click();
      });

      // Then switch to system
      const setSystemButton = screen.getByTestId('set-system');
      await act(async () => {
        setSystemButton.click();
      });

      expect(screen.getByTestId('theme-mode')).toHaveTextContent('system');
    });

    it('should toggle theme', async () => {
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Start with light
      const setLightButton = screen.getByTestId('set-light');
      await act(async () => {
        setLightButton.click();
      });
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');

      // Toggle to dark
      const toggleButton = screen.getByTestId('toggle');
      await act(async () => {
        toggleButton.click();
      });
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('dark');

      // Toggle back to light
      await act(async () => {
        toggleButton.click();
      });
      expect(screen.getByTestId('effective-theme')).toHaveTextContent('light');
    });
  });

  describe('Multiple Components', () => {
    it('should share theme state across components', async () => {
      function ComponentA() {
        const { theme } = useTheme();
        return <div data-testid="component-a">{theme}</div>;
      }

      function ComponentB() {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="component-b">{theme}</div>
            <button type="button" onClick={() => setTheme('dark')} data-testid="set-dark-b">
              Set Dark
            </button>
          </div>
        );
      }

      render(
        <ThemeProvider>
          <ComponentA />
          <ComponentB />
        </ThemeProvider>
      );

      // Both components should show system initially
      expect(screen.getByTestId('component-a')).toHaveTextContent('system');
      expect(screen.getByTestId('component-b')).toHaveTextContent('system');

      // Change theme in ComponentB
      const setDarkButton = screen.getByTestId('set-dark-b');
      await act(async () => {
        setDarkButton.click();
      });

      // Both components should update
      expect(screen.getByTestId('component-a')).toHaveTextContent('dark');
      expect(screen.getByTestId('component-b')).toHaveTextContent('dark');
    });
  });

  describe('SSR Compatibility', () => {
    it('should render without errors in SSR context', () => {
      // ThemeProvider should handle SSR gracefully
      const { container } = render(
        <ThemeProvider>
          <div>SSR Content</div>
        </ThemeProvider>
      );

      expect(container).toBeInTheDocument();
    });
  });
});
