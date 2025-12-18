# Design Tokens

This directory contains CSS custom properties (design tokens) for the Apple HIG-based design system.

## Files

- `colors.css` - Color tokens for light and dark modes
- `spacing.css` - Spacing tokens based on 8px grid system
- `typography.css` - Font family, size, and weight tokens
- `shadows.css` - Elevation and shadow tokens
- `borders.css` - Border radius and width tokens

## Usage

Import tokens in your components or global styles:

```typescript
import '@/styles/tokens/colors.css';
import '@/styles/tokens/spacing.css';
```

Use tokens via CSS custom properties:

```css
.my-element {
  color: var(--text-primary);
  background: var(--bg-primary);
  padding: var(--spacing-md);
}
```

## Related Documentation

- See `/specs/009-apple-hig-ui-redesign/quickstart.md` for usage examples
- See `/specs/009-apple-hig-ui-redesign/data-model.md` for token definitions
