/**
 * ThemeProvider
 * Feature: 009-apple-hig-ui-redesign
 * Theme context provider for dark mode management
 */

'use client';

import type { ReactNode } from 'react';

interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
}

/**
 * ThemeProvider Component
 *
 * Wraps the application to provide theme management functionality.
 * This is a simple wrapper that ensures the theme system is properly initialized.
 *
 * The actual theme logic is handled by the useTheme hook, which manages:
 * - Theme state (light, dark, system)
 * - localStorage persistence
 * - System preference detection
 * - DOM updates (data-theme attribute)
 *
 * @example
 * ```tsx
 * // In root layout
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ThemeProvider>
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // In any component
 * import { useTheme } from '@/lib/design-system/useTheme';
 *
 * function MyComponent() {
 *   const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Current theme: {effectiveTheme}</p>
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // For now, ThemeProvider is a simple wrapper.
  // The useTheme hook handles all theme logic independently.
  // This provider exists for future extensibility and to match
  // the pattern established in the project (LanguageProvider, AccessibilityProvider).

  // We could add a ThemeContext here if we wanted to optimize re-renders,
  // but for the MVP, the hook-based approach is simpler and sufficient.

  return <>{children}</>;
}
