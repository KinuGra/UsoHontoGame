// SessionServiceContainer Tests
// Tests for session service dependency injection container

import { beforeEach, describe, expect, it } from 'vitest';
import type { ISessionService } from '@/server/application/services/ISessionService';
import { SessionServiceContainer } from './SessionServiceContainer';

describe('SessionServiceContainer', () => {
  beforeEach(() => {
    // Reset singleton for each test
    SessionServiceContainer.resetForTesting();
  });

  describe('getSessionService', () => {
    it('should return a session service instance', () => {
      const service = SessionServiceContainer.getSessionService();

      expect(service).toBeDefined();
      expect(service).toHaveProperty('getCurrentSessionId');
      expect(service).toHaveProperty('validateCurrentSession');
      expect(service).toHaveProperty('requireCurrentSession');
    });

    it('should return the same instance on multiple calls (singleton pattern)', () => {
      const service1 = SessionServiceContainer.getSessionService();
      const service2 = SessionServiceContainer.getSessionService();

      expect(service1).toBe(service2);
    });

    it('should create new instance after reset', () => {
      const service1 = SessionServiceContainer.getSessionService();

      SessionServiceContainer.resetForTesting();

      const service2 = SessionServiceContainer.getSessionService();

      expect(service1).not.toBe(service2);
    });
  });

  describe('resetForTesting', () => {
    it('should reset the singleton instance', () => {
      const service1 = SessionServiceContainer.getSessionService();

      SessionServiceContainer.resetForTesting();

      const service2 = SessionServiceContainer.getSessionService();

      // Different instances after reset
      expect(service1).not.toBe(service2);
    });

    it('should allow getting new instance after reset', () => {
      SessionServiceContainer.getSessionService();

      SessionServiceContainer.resetForTesting();

      const service = SessionServiceContainer.getSessionService();

      expect(service).toBeDefined();
    });
  });

  describe('setSessionService', () => {
    it('should set custom session service', () => {
      const mockService: ISessionService = {
        getCurrentSessionId: async () => 'mock-session',
        validateCurrentSession: async () => ({ valid: true, sessionId: 'mock-session' }),
        requireCurrentSession: async () => 'mock-session',
      };

      SessionServiceContainer.setSessionService(mockService);

      const service = SessionServiceContainer.getSessionService();

      expect(service).toBe(mockService);
    });

    it('should replace existing instance with custom service', () => {
      const service1 = SessionServiceContainer.getSessionService();

      const mockService: ISessionService = {
        getCurrentSessionId: async () => 'mock-session',
        validateCurrentSession: async () => ({ valid: true, sessionId: 'mock-session' }),
        requireCurrentSession: async () => 'mock-session',
      };

      SessionServiceContainer.setSessionService(mockService);

      const service2 = SessionServiceContainer.getSessionService();

      expect(service1).not.toBe(service2);
      expect(service2).toBe(mockService);
    });

    it('should allow using custom service immediately after set', () => {
      const mockService: ISessionService = {
        getCurrentSessionId: async () => 'custom-id',
        validateCurrentSession: async () => ({ valid: true, sessionId: 'custom-id' }),
        requireCurrentSession: async () => 'custom-id',
      };

      SessionServiceContainer.setSessionService(mockService);

      const service = SessionServiceContainer.getSessionService();

      expect(service.getCurrentSessionId).toBe(mockService.getCurrentSessionId);
      expect(service.validateCurrentSession).toBe(mockService.validateCurrentSession);
    });
  });
});
