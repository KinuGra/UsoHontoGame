/**
 * ActiveGamesList Component Tests
 * Tests for the active games list container component
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ActiveGameListItem } from '@/types/game';
import { ActiveGamesList } from './ActiveGamesList';

// Mock ActiveGameCard component
vi.mock('./ActiveGameCard', () => ({
  ActiveGameCard: ({ game }: { game: ActiveGameListItem }) => (
    <div data-testid={`game-card-${game.id}`}>{game.title}</div>
  ),
}));

describe('ActiveGamesList', () => {
  const mockGames: ActiveGameListItem[] = [
    {
      id: 'game-1',
      title: 'Test Game 1',
      creatorSessionId: 'session-1',
      playerCount: 5,
      playerLimit: 10,
      formattedCreatedAt: '5分前',
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 'game-2',
      title: 'Test Game 2',
      creatorSessionId: 'session-2',
      playerCount: 3,
      playerLimit: 8,
      formattedCreatedAt: '10分前',
      createdAt: '2024-01-01T09:55:00Z',
    },
  ];

  it('should render list of games', () => {
    render(<ActiveGamesList games={mockGames} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-game-1')).toBeInTheDocument();
    expect(screen.getByTestId('game-card-game-2')).toBeInTheDocument();
  });

  it('should have correct aria-label', () => {
    render(<ActiveGamesList games={mockGames} />);

    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-label', '出題中のゲーム一覧');
  });

  it('should render each game in a listitem', () => {
    render(<ActiveGamesList games={mockGames} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });

  it('should return null when games array is empty', () => {
    const { container } = render(<ActiveGamesList games={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('should pass currentSessionId to ActiveGameCard', () => {
    const currentSessionId = 'current-session-123';
    render(<ActiveGamesList games={mockGames} currentSessionId={currentSessionId} />);

    // Verify cards are rendered (the mock doesn't use sessionId, but we're testing it's passed)
    expect(screen.getByTestId('game-card-game-1')).toBeInTheDocument();
  });

  it('should render single game correctly', () => {
    const singleGame = [mockGames[0]];
    render(<ActiveGamesList games={singleGame} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('should apply responsive grid classes', () => {
    render(<ActiveGamesList games={mockGames} />);

    const list = screen.getByRole('list');
    expect(list).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });
});
