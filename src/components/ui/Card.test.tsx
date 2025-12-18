// Component Tests: Card
// UI Primitive component for card container layout

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  describe('Rendering', () => {
    it('should render card element', () => {
      const { container } = render(<Card>Test Card</Card>);

      const card = container.querySelector('div');
      expect(card).toBeInTheDocument();
    });

    it('should render as div element', () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild;
      expect(card).toBeInstanceOf(HTMLDivElement);
    });

    it('should render children text', () => {
      render(<Card>Card Content</Card>);

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render children with JSX', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should render complex nested structure', () => {
      render(
        <Card>
          <div>
            <h3>Header</h3>
            <div>
              <p>Body</p>
              <button type="button">Action</button>
            </div>
          </div>
        </Card>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });

  describe('Base Styles', () => {
    it('should apply all base styles', () => {
      const { container } = render(<Card>Styled Card</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass(
        'rounded-lg',
        'border',
        'border-gray-200',
        'bg-white',
        'p-6',
        'shadow-sm'
      );
    });

    it('should have rounded corners', () => {
      const { container } = render(<Card>Rounded</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('rounded-lg');
    });

    it('should have border', () => {
      const { container } = render(<Card>Border</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('border', 'border-gray-200');
    });

    it('should have white background', () => {
      const { container } = render(<Card>Background</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('bg-white');
    });

    it('should have padding', () => {
      const { container } = render(<Card>Padding</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('p-6');
    });

    it('should have shadow', () => {
      const { container } = render(<Card>Shadow</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('shadow-sm');
    });
  });

  describe('Custom className', () => {
    it('should merge custom className with base styles', () => {
      const { container } = render(<Card className="custom-class">Custom</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('rounded-lg'); // Base style still applied
    });

    it('should apply multiple custom classes', () => {
      const { container } = render(<Card className="class-1 class-2 class-3">Multiple</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('class-1', 'class-2', 'class-3');
    });

    it('should handle empty className', () => {
      const { container } = render(<Card className="">No Custom Class</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('rounded-lg'); // Base styles still applied
    });

    it('should not break with undefined className', () => {
      const { container } = render(<Card className={undefined}>Undefined</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('rounded-lg');
    });
  });

  describe('Children Variations', () => {
    it('should handle text content', () => {
      render(<Card>Simple text</Card>);

      expect(screen.getByText('Simple text')).toBeInTheDocument();
    });

    it('should handle Japanese text', () => {
      render(<Card>カードの内容</Card>);

      expect(screen.getByText('カードの内容')).toBeInTheDocument();
    });

    it('should handle numbers', () => {
      render(<Card>{12345}</Card>);

      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('should handle mixed content', () => {
      render(
        <Card>
          <span>Text</span>
          {42}
          <span>More text</span>
        </Card>
      );

      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('More text')).toBeInTheDocument();
    });

    it('should handle lists', () => {
      render(
        <Card>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </Card>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should handle forms', () => {
      render(
        <Card>
          <form>
            <input type="text" placeholder="Enter text" />
            <button type="submit">Submit</button>
          </form>
        </Card>
      );

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      const { container } = render(<Card>{''}</Card>);

      const card = container.querySelector('div');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-lg');
    });

    it('should handle whitespace children', () => {
      const { container } = render(<Card> </Card>);

      const card = container.querySelector('div');
      expect(card).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      const { container } = render(<Card>{null}</Card>);

      const card = container.querySelector('div');
      expect(card).toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      const { container } = render(<Card>{false}</Card>);

      const card = container.querySelector('div');
      expect(card).toBeInTheDocument();
    });

    it('should handle array of children', () => {
      render(
        <Card>
          {['Item 1', 'Item 2', 'Item 3'].map((item) => (
            <div key={item}>{item}</div>
          ))}
        </Card>
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });
  });

  describe('Nested Cards', () => {
    it('should support nested cards', () => {
      const { container } = render(
        <Card className="outer-card">
          <h2>Outer Card</h2>
          <Card className="inner-card">
            <p>Inner Card</p>
          </Card>
        </Card>
      );

      expect(screen.getByText('Outer Card')).toBeInTheDocument();
      expect(screen.getByText('Inner Card')).toBeInTheDocument();

      const cards = container.querySelectorAll('div.rounded-lg');
      expect(cards.length).toBeGreaterThanOrEqual(2);
    });

    it('should maintain styles in nested cards', () => {
      const { container } = render(
        <Card>
          <Card>Nested</Card>
        </Card>
      );

      const cards = container.querySelectorAll('div.rounded-lg');
      for (const card of cards) {
        expect(card).toHaveClass('border', 'bg-white', 'p-6');
      }
    });
  });

  describe('Semantic Usage', () => {
    it('should work for game cards', () => {
      render(
        <Card>
          <h3>Game Title</h3>
          <p>Game Description</p>
          <button type="button">Join Game</button>
        </Card>
      );

      expect(screen.getByText('Game Title')).toBeInTheDocument();
      expect(screen.getByText('Game Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Join Game' })).toBeInTheDocument();
    });

    it('should work for presenter cards', () => {
      render(
        <Card>
          <div>Presenter: 太郎</div>
          <div>Episodes: 3</div>
        </Card>
      );

      expect(screen.getByText('Presenter: 太郎')).toBeInTheDocument();
      expect(screen.getByText('Episodes: 3')).toBeInTheDocument();
    });

    it('should work for info cards', () => {
      render(
        <Card>
          <h4>Information</h4>
          <p>This is an informational message in a card.</p>
        </Card>
      );

      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('This is an informational message in a card.')).toBeInTheDocument();
    });
  });

  describe('Layout Combinations', () => {
    it('should work with flexbox layout', () => {
      const { container } = render(
        <Card className="flex items-center justify-between">
          <span>Left</span>
          <span>Right</span>
        </Card>
      );

      const card = container.querySelector('div');
      expect(card).toHaveClass('flex', 'items-center', 'justify-between');
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });

    it('should work with grid layout', () => {
      const { container } = render(
        <Card className="grid grid-cols-2 gap-4">
          <div>Column 1</div>
          <div>Column 2</div>
        </Card>
      );

      const card = container.querySelector('div');
      expect(card).toHaveClass('grid', 'grid-cols-2', 'gap-4');
      expect(screen.getByText('Column 1')).toBeInTheDocument();
      expect(screen.getByText('Column 2')).toBeInTheDocument();
    });

    it('should work with custom spacing', () => {
      const { container } = render(<Card className="p-8 m-4">Custom Spacing</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('p-8', 'm-4');
    });
  });

  describe('Variants (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should render default variant', () => {
      const { container } = render(<Card variant="default">Default Card</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-default', 'border', 'border-gray-200', 'shadow-sm');
    });

    it('should render elevated variant', () => {
      const { container } = render(<Card variant="elevated">Elevated Card</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-elevated', 'shadow-md');
    });

    it('should render outlined variant', () => {
      const { container } = render(<Card variant="outlined">Outlined Card</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-outlined', 'border-2', 'border-gray-300');
    });

    it('should render filled variant', () => {
      const { container } = render(<Card variant="filled">Filled Card</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-filled', 'bg-gray-50');
    });

    it('should use default variant when not specified', () => {
      const { container } = render(<Card>No Variant</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-default');
    });
  });

  describe('Interactive State (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should render non-interactive card by default', () => {
      const { container } = render(<Card>Non-Interactive</Card>);

      const card = container.querySelector('div');
      expect(card).not.toHaveClass('card-interactive');
      expect(card).not.toHaveClass('cursor-pointer');
    });

    it('should render interactive card when interactive prop is true', () => {
      const { container } = render(<Card interactive>Interactive Card</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-interactive', 'cursor-pointer');
    });

    it('should have hover scale on interactive cards', () => {
      const { container } = render(<Card interactive>Hover Me</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('hover:scale-[1.02]');
    });

    it('should have active scale on interactive cards', () => {
      const { container } = render(<Card interactive>Click Me</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('active:scale-[0.98]');
    });

    it('should have focus ring on interactive cards', () => {
      const { container } = render(<Card interactive>Focus Me</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('focus-within:ring-2', 'focus-within:ring-blue-500');
    });
  });

  describe('Padding Variants (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should apply no padding when padding="none"', () => {
      const { container } = render(<Card padding="none">No Padding</Card>);

      const card = container.querySelector('div');
      expect(card).not.toHaveClass('p-3');
      expect(card).not.toHaveClass('p-6');
      expect(card).not.toHaveClass('p-8');
    });

    it('should apply small padding when padding="sm"', () => {
      const { container } = render(<Card padding="sm">Small Padding</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('p-3');
    });

    it('should apply medium padding by default', () => {
      const { container } = render(<Card>Default Padding</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('p-6');
    });

    it('should apply medium padding when padding="md"', () => {
      const { container } = render(<Card padding="md">Medium Padding</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('p-6');
    });

    it('should apply large padding when padding="lg"', () => {
      const { container } = render(<Card padding="lg">Large Padding</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('p-8');
    });
  });

  describe('Dark Mode Support (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should have dark mode background classes', () => {
      const { container } = render(<Card>Dark Mode</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('bg-white', 'dark:bg-gray-800');
    });

    it('should have dark mode border for default variant', () => {
      const { container } = render(<Card variant="default">Dark Border</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('border-gray-200', 'dark:border-gray-700');
    });

    it('should have dark mode border for outlined variant', () => {
      const { container } = render(<Card variant="outlined">Dark Outlined</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('border-gray-300', 'dark:border-gray-600');
    });

    it('should have dark mode background for filled variant', () => {
      const { container } = render(<Card variant="filled">Dark Filled</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('bg-gray-50', 'dark:bg-gray-900');
    });
  });

  describe('Enhanced Base Styles (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should have card-base class', () => {
      const { container } = render(<Card>Base</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-base');
    });

    it('should have rounded corners', () => {
      const { container } = render(<Card>Rounded</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('rounded-lg');
    });

    it('should have smooth transitions', () => {
      const { container } = render(<Card>Animated</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('transition-all', 'duration-200', 'ease-out');
    });
  });

  describe('Combined Features (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should combine variant and interactive', () => {
      const { container } = render(
        <Card variant="elevated" interactive>
          Elevated Interactive
        </Card>
      );

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-elevated', 'card-interactive');
    });

    it('should combine variant, padding, and interactive', () => {
      const { container } = render(
        <Card variant="outlined" padding="lg" interactive>
          All Props
        </Card>
      );

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-outlined', 'p-8', 'card-interactive');
    });

    it('should combine variant, padding, interactive, and custom className', () => {
      const { container } = render(
        <Card variant="filled" padding="sm" interactive className="custom-class">
          Everything
        </Card>
      );

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-filled', 'p-3', 'card-interactive', 'custom-class');
    });

    it('should maintain backward compatibility with className only', () => {
      const { container } = render(<Card className="custom-padding">Legacy</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveClass('card-default', 'p-6', 'custom-padding');
    });
  });

  describe('HTML Attributes (Feature: 009-apple-hig-ui-redesign)', () => {
    it('should accept and apply onClick handler', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card interactive onClick={handleClick}>
          Clickable
        </Card>
      );

      const card = container.querySelector('div');
      card?.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should accept and apply data attributes', () => {
      const { container } = render(<Card data-testid="my-card">Data Attrs</Card>);

      expect(screen.getByTestId('my-card')).toBeInTheDocument();
    });

    it('should accept and apply aria attributes', () => {
      const { container } = render(<Card aria-label="Game card">Aria</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveAttribute('aria-label', 'Game card');
    });

    it('should accept and apply id attribute', () => {
      const { container } = render(<Card id="unique-card">ID</Card>);

      const card = container.querySelector('div');
      expect(card).toHaveAttribute('id', 'unique-card');
    });
  });
});
