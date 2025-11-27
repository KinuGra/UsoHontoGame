/**
 * Session Server Actions Tests
 * Tests for session management server actions
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EmptyNicknameError, NicknameTooLongError } from '@/server/domain/value-objects/Nickname';

// Mock dependencies at top level
const mockSessionRepository = {
  create: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockSessionService = {
  getCurrentSessionId: vi.fn(),
};

// Create mock class constructor
class MockCookieSessionRepository {
  create = mockSessionRepository.create;
  findById = mockSessionRepository.findById;
  update = mockSessionRepository.update;
  delete = mockSessionRepository.delete;
}

// Mock use case implementations
const mockCreateSessionExecute = vi.fn();
const mockSetNicknameExecute = vi.fn();
const mockValidateSessionExecute = vi.fn();

class MockCreateSession {
  constructor(public repository: unknown) {}
  execute = mockCreateSessionExecute;
}

class MockSetNickname {
  constructor(public repository: unknown) {}
  execute = mockSetNicknameExecute;
}

class MockValidateSession {
  constructor(public repository: unknown) {}
  execute = mockValidateSessionExecute;
}

vi.mock('@/server/infrastructure/repositories/CookieSessionRepository', () => ({
  CookieSessionRepository: MockCookieSessionRepository,
}));

vi.mock('@/server/infrastructure/di/SessionServiceContainer', () => ({
  SessionServiceContainer: {
    getSessionService: () => mockSessionService,
  },
}));

vi.mock('@/server/application/use-cases/session/CreateSession', () => ({
  CreateSession: MockCreateSession,
}));

vi.mock('@/server/application/use-cases/session/SetNickname', () => ({
  SetNickname: MockSetNickname,
}));

vi.mock('@/server/application/use-cases/session/ValidateSession', () => ({
  ValidateSession: MockValidateSession,
}));

// Import after mocks
const { createSessionAction, setNicknameAction, validateSessionAction } = await import('./session');

describe('Session Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createSessionAction', () => {
    it('should create session successfully', async () => {
      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      mockCreateSessionExecute.mockResolvedValue(mockSession);

      const result = await createSessionAction();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.sessionId).toBe('test-session-id-123');
      }
    });

    it('should return error when session creation fails', async () => {
      mockCreateSessionExecute.mockRejectedValue(new Error('Database error'));

      const result = await createSessionAction();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('SESSION_CREATION_FAILED');
        expect(result.error.message).toBe('Failed to create session');
      }
    });

    it('should call CreateSession use case', async () => {
      mockCreateSessionExecute.mockResolvedValue({
        sessionId: 'test-session-id',
        nickname: null,
      });

      await createSessionAction();

      expect(mockCreateSessionExecute).toHaveBeenCalledTimes(1);
    });
  });

  describe('setNicknameAction', () => {
    it('should set nickname successfully', async () => {
      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      const mockUpdatedSession = {
        sessionId: 'test-session-id-123',
        nickname: 'TestUser',
      };

      mockCreateSessionExecute.mockResolvedValue(mockSession);
      mockSetNicknameExecute.mockResolvedValue(mockUpdatedSession);

      const result = await setNicknameAction('TestUser');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.nickname).toBe('TestUser');
      }
    });

    it('should return error for empty nickname', async () => {
      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      mockCreateSessionExecute.mockResolvedValue(mockSession);
      mockSetNicknameExecute.mockRejectedValue(new EmptyNicknameError());

      const result = await setNicknameAction('');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('EMPTY_NICKNAME');
        expect(result.error.message).toBe('ニックネームを入力してください');
      }
    });

    it('should return error for nickname too long', async () => {
      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      const longNickname = 'a'.repeat(51);

      mockCreateSessionExecute.mockResolvedValue(mockSession);
      mockSetNicknameExecute.mockRejectedValue(new NicknameTooLongError());

      const result = await setNicknameAction(longNickname);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('NICKNAME_TOO_LONG');
        expect(result.error.message).toBe('ニックネームは50文字以内で入力してください');
      }
    });

    it('should return generic error for unexpected errors', async () => {
      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      mockCreateSessionExecute.mockResolvedValue(mockSession);
      mockSetNicknameExecute.mockRejectedValue(new Error('Unexpected error'));

      const result = await setNicknameAction('TestUser');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('NICKNAME_UPDATE_FAILED');
        expect(result.error.message).toBe('ニックネームの設定に失敗しました');
      }
    });

    it('should return error when use case returns null', async () => {
      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      mockCreateSessionExecute.mockResolvedValue(mockSession);
      mockSetNicknameExecute.mockResolvedValue(null);

      const result = await setNicknameAction('TestUser');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('NICKNAME_UPDATE_FAILED');
      }
    });

    it('should handle session creation before setting nickname', async () => {
      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      mockCreateSessionExecute.mockResolvedValue(mockSession);
      mockSetNicknameExecute.mockResolvedValue({
        ...mockSession,
        nickname: 'NewUser',
      });

      await setNicknameAction('NewUser');

      expect(mockCreateSessionExecute).toHaveBeenCalledTimes(1);
      expect(mockSetNicknameExecute).toHaveBeenCalledWith('test-session-id-123', 'NewUser');
    });
  });

  describe('validateSessionAction', () => {
    it('should validate existing session successfully', async () => {
      mockSessionService.getCurrentSessionId.mockResolvedValue('test-session-id-123');

      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: 'TestUser',
      };

      mockValidateSessionExecute.mockResolvedValue(mockSession);

      const result = await validateSessionAction();

      expect(result.valid).toBe(true);
      expect(result.sessionId).toBe('test-session-id-123');
      expect(result.nickname).toBe('TestUser');
      expect(result.hasNickname).toBe(true);
    });

    it('should return invalid when no session ID in cookies', async () => {
      mockSessionService.getCurrentSessionId.mockResolvedValue(null);

      const result = await validateSessionAction();

      expect(result.valid).toBe(false);
      expect(result.sessionId).toBeNull();
      expect(result.nickname).toBeNull();
      expect(result.hasNickname).toBe(false);
    });

    it('should return invalid when session not found', async () => {
      mockSessionService.getCurrentSessionId.mockResolvedValue('test-session-id-123');
      mockValidateSessionExecute.mockResolvedValue(null);

      const result = await validateSessionAction();

      expect(result.valid).toBe(false);
      expect(result.sessionId).toBeNull();
      expect(result.nickname).toBeNull();
      expect(result.hasNickname).toBe(false);
    });

    it('should handle session without nickname', async () => {
      mockSessionService.getCurrentSessionId.mockResolvedValue('test-session-id-123');

      const mockSession = {
        sessionId: 'test-session-id-123',
        nickname: null,
      };

      mockValidateSessionExecute.mockResolvedValue(mockSession);

      const result = await validateSessionAction();

      expect(result.valid).toBe(true);
      expect(result.sessionId).toBe('test-session-id-123');
      expect(result.nickname).toBeNull();
      expect(result.hasNickname).toBe(false);
    });

    it('should return invalid when validation throws error', async () => {
      mockSessionService.getCurrentSessionId.mockRejectedValue(new Error('Session service error'));

      const result = await validateSessionAction();

      expect(result.valid).toBe(false);
      expect(result.sessionId).toBeNull();
      expect(result.nickname).toBeNull();
      expect(result.hasNickname).toBe(false);
    });

    it('should call session service to get current session ID', async () => {
      mockSessionService.getCurrentSessionId.mockResolvedValue('test-session-id-123');
      mockValidateSessionExecute.mockResolvedValue({
        sessionId: 'test-session-id-123',
        nickname: 'TestUser',
      });

      await validateSessionAction();

      expect(mockSessionService.getCurrentSessionId).toHaveBeenCalledTimes(1);
    });
  });
});
