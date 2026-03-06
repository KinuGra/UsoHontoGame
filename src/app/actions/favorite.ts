'use server';

import { createFavoriteRepository } from '@/server/infrastructure/repositories';
import { SessionServiceContainer } from '@/server/infrastructure/di/SessionServiceContainer';

export async function toggleFavorite(gameId: string): Promise<boolean> {
  const sessionId = await SessionServiceContainer.requireCurrentSession();
  const repo = createFavoriteRepository();
  return repo.toggle(sessionId, gameId);
}

export async function getFavoriteGameIds(): Promise<string[]> {
  const sessionId = await SessionServiceContainer.requireCurrentSession();
  const repo = createFavoriteRepository();
  return repo.findBySession(sessionId);
}
