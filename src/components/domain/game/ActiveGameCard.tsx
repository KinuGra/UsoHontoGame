/**
 * ActiveGameCard Component
 * Feature: 005-top-active-games (User Story 2 & 3)
 * Feature: 001-lie-detection-answers (Answer submission navigation)
 *
 * Displays a single active game with:
 * - Game title
 * - Player count (current / limit)
 * - Formatted creation time
 * - Clickable navigation to answer submission page
 */

import Link from 'next/link';
import type { ActiveGameListItem } from '@/types/game';

export interface ActiveGameCardProps {
  /** Game information to display */
  game: ActiveGameListItem;
}

/**
 * ActiveGameCard - Presentational component with navigation
 * Links to answer submission page for participants to submit their answers
 */
export function ActiveGameCard({ game }: ActiveGameCardProps) {
  const playerCountText = game.playerLimit
    ? `${game.playerCount} / ${game.playerLimit}人`
    : `${game.playerCount}人`;

  return (
    <Link
      href={`/games/${game.id}/answer`}
      aria-label={`${game.title} の回答ページへ移動`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <article>
        {/* Game Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{game.title}</h3>

        {/* Game Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          {/* Player Count */}
          <div className="flex items-center gap-2">
            <span className="font-medium">{playerCountText}</span>
          </div>

          {/* Creation Time */}
          <time dateTime={game.createdAt} className="text-gray-500">
            {game.formattedCreatedAt}
          </time>
        </div>
      </article>
    </Link>
  );
}
