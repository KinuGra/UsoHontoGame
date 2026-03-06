export interface IFavoriteRepository {
  toggle(sessionId: string, gameId: string): Promise<boolean>; // true=追加, false=削除
  findBySession(sessionId: string): Promise<string[]>; // gameIdの配列
}
