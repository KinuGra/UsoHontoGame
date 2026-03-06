import { nanoid } from 'nanoid';
import type { PrismaClient } from '@/generated/prisma/client';
import type { IFavoriteRepository } from '@/server/domain/repositories/IFavoriteRepository';

export class PrismaFavoriteRepository implements IFavoriteRepository {
  constructor(private readonly prisma: PrismaClient) { }

  async toggle(sessionId: string, gameId: string): Promise<boolean> {
    const existing = await this.prisma.favorite.findUnique({
      where: { sessionId_gameId: { sessionId, gameId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return false;
    }

    await this.prisma.favorite.create({
      data: { id: nanoid(), sessionId, gameId },
    });
    return true;
  }

  async findBySession(sessionId: string): Promise<string[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { sessionId },
      select: { gameId: true },
    });
    return favorites.map((f) => f.gameId);
  }
}
