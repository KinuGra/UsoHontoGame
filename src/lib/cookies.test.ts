/**
 * Cookie Utilities Tests
 * Tests for cookie helper functions used in session management
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { deleteCookie, getCookie, setCookie } from './cookies';

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Cookie Utilities', () => {
  let mockCookieStore: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    // Create fresh mock cookie store for each test
    mockCookieStore = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    };

    // Mock cookies() to return our mock store
    const { cookies } = await import('next/headers');
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue(mockCookieStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getCookie', () => {
    it('should return cookie value when cookie exists', async () => {
      const mockCookieValue = 'test-session-id-123';
      mockCookieStore.get.mockReturnValue({ value: mockCookieValue });

      const result = await getCookie('sessionId');

      expect(result).toBe(mockCookieValue);
      expect(mockCookieStore.get).toHaveBeenCalledWith('sessionId');
      expect(mockCookieStore.get).toHaveBeenCalledTimes(1);
    });

    it('should return null when cookie does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined);

      const result = await getCookie('nonexistent');

      expect(result).toBeNull();
      expect(mockCookieStore.get).toHaveBeenCalledWith('nonexistent');
    });

    it('should return null when cookie value is undefined', async () => {
      mockCookieStore.get.mockReturnValue({ value: undefined });

      const result = await getCookie('sessionId');

      expect(result).toBeNull();
    });

    it('should handle multiple sequential calls', async () => {
      mockCookieStore.get
        .mockReturnValueOnce({ value: 'first-value' })
        .mockReturnValueOnce({ value: 'second-value' })
        .mockReturnValueOnce(undefined);

      const result1 = await getCookie('cookie1');
      const result2 = await getCookie('cookie2');
      const result3 = await getCookie('cookie3');

      expect(result1).toBe('first-value');
      expect(result2).toBe('second-value');
      expect(result3).toBeNull();
      expect(mockCookieStore.get).toHaveBeenCalledTimes(3);
    });
  });

  describe('setCookie', () => {
    it('should set cookie with default options', async () => {
      await setCookie('testCookie', 'testValue');

      expect(mockCookieStore.set).toHaveBeenCalledWith('testCookie', 'testValue', {
        httpOnly: false,
        secure: false, // NODE_ENV is test by default
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
      expect(mockCookieStore.set).toHaveBeenCalledTimes(1);
    });

    it('should set cookie with custom httpOnly option', async () => {
      await setCookie('sessionId', 'secure-session-123', {
        httpOnly: true,
      });

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'sessionId',
        'secure-session-123',
        expect.objectContaining({
          httpOnly: true,
        })
      );
    });

    it('should set cookie with custom secure option', async () => {
      await setCookie('testCookie', 'testValue', {
        secure: true,
      });

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'testCookie',
        'testValue',
        expect.objectContaining({
          secure: true,
        })
      );
    });

    it('should set cookie with custom maxAge option', async () => {
      const customMaxAge = 3600; // 1 hour

      await setCookie('tempCookie', 'tempValue', {
        maxAge: customMaxAge,
      });

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'tempCookie',
        'tempValue',
        expect.objectContaining({
          maxAge: customMaxAge,
        })
      );
    });

    it('should set cookie with custom path option', async () => {
      await setCookie('pathCookie', 'pathValue', {
        path: '/admin',
      });

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'pathCookie',
        'pathValue',
        expect.objectContaining({
          path: '/admin',
        })
      );
    });

    it('should set cookie with custom sameSite option', async () => {
      await setCookie('strictCookie', 'strictValue', {
        sameSite: 'strict',
      });

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'strictCookie',
        'strictValue',
        expect.objectContaining({
          sameSite: 'strict',
        })
      );
    });

    it('should set cookie with all custom options', async () => {
      await setCookie('fullCustomCookie', 'customValue', {
        httpOnly: true,
        secure: true,
        maxAge: 7200,
        path: '/api',
        sameSite: 'none',
      });

      expect(mockCookieStore.set).toHaveBeenCalledWith('fullCustomCookie', 'customValue', {
        httpOnly: true,
        secure: true,
        maxAge: 7200,
        path: '/api',
        sameSite: 'none',
      });
    });

    it('should use production secure flag when NODE_ENV is production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      await setCookie('prodCookie', 'prodValue');

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'prodCookie',
        'prodValue',
        expect.objectContaining({
          secure: true,
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle empty string value', async () => {
      await setCookie('emptyCookie', '');

      expect(mockCookieStore.set).toHaveBeenCalledWith('emptyCookie', '', expect.any(Object));
    });
  });

  describe('deleteCookie', () => {
    it('should delete cookie by name', async () => {
      await deleteCookie('testCookie');

      expect(mockCookieStore.delete).toHaveBeenCalledWith('testCookie');
      expect(mockCookieStore.delete).toHaveBeenCalledTimes(1);
    });

    it('should delete multiple cookies sequentially', async () => {
      await deleteCookie('cookie1');
      await deleteCookie('cookie2');
      await deleteCookie('cookie3');

      expect(mockCookieStore.delete).toHaveBeenCalledTimes(3);
      expect(mockCookieStore.delete).toHaveBeenNthCalledWith(1, 'cookie1');
      expect(mockCookieStore.delete).toHaveBeenNthCalledWith(2, 'cookie2');
      expect(mockCookieStore.delete).toHaveBeenNthCalledWith(3, 'cookie3');
    });

    it('should handle deleting non-existent cookie gracefully', async () => {
      // Delete should work even if cookie doesn't exist
      await deleteCookie('nonexistentCookie');

      expect(mockCookieStore.delete).toHaveBeenCalledWith('nonexistentCookie');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle set-get-delete cookie lifecycle', async () => {
      // Set cookie
      await setCookie('lifecycleCookie', 'lifecycleValue');
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'lifecycleCookie',
        'lifecycleValue',
        expect.any(Object)
      );

      // Get cookie
      mockCookieStore.get.mockReturnValue({ value: 'lifecycleValue' });
      const value = await getCookie('lifecycleCookie');
      expect(value).toBe('lifecycleValue');

      // Delete cookie
      await deleteCookie('lifecycleCookie');
      expect(mockCookieStore.delete).toHaveBeenCalledWith('lifecycleCookie');
    });

    it('should handle updating existing cookie', async () => {
      // Set initial value
      await setCookie('updateCookie', 'initialValue');

      // Update with new value
      await setCookie('updateCookie', 'updatedValue', {
        maxAge: 7200,
      });

      expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
      expect(mockCookieStore.set).toHaveBeenLastCalledWith(
        'updateCookie',
        'updatedValue',
        expect.objectContaining({
          maxAge: 7200,
        })
      );
    });
  });
});
