// DTO for response status tracking (User Story 1)
// Feature: 006-results-dashboard
// Feature: 007-game-closure (User Story 3 - added shouldContinuePolling)

export interface ResponseStatusDto {
  gameId: string;
  gameName: string;
  gameStatus: '準備中' | '出題中' | '締切';
  participants: ParticipantStatusDto[];
  totalParticipants: number;
  submittedCount: number;
  allSubmitted: boolean;
  shouldContinuePolling: boolean; // false when game is closed (締切)
  lastUpdated: Date;
}

export interface ParticipantStatusDto {
  nickname: string;
  hasSubmitted: boolean;
  submittedAt?: Date; // Only present if hasSubmitted is true
}
