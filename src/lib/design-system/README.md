# Design System Utilities

This directory contains utility functions and hooks for the Apple HIG-based design system.

## Files

- `tokens.ts` - TypeScript exports for design tokens
- `useTheme.ts` - Dark mode theme hook
- `classNames.ts` - Utility for combining CSS classes
- `useAccessibility.ts` - Accessibility preferences hook

## Usage

### Theme Hook

```typescript
import { useTheme } from '@/lib/design-system/useTheme';

function MyComponent() {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {effectiveTheme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

### Class Names Utility

```typescript
import { classNames } from '@/lib/design-system/classNames';

const buttonClasses = classNames(
  'base-button',
  isActive && 'active',
  variant === 'primary' && 'primary'
);
```

## Related Documentation

- See `/specs/009-apple-hig-ui-redesign/quickstart.md` for usage examples
- See `/specs/009-apple-hig-ui-redesign/contracts/design-system-types.ts` for type definitions
