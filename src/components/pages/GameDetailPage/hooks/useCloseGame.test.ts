// useCloseGame Hook Tests
// Feature: 007-game-closure
// Tests for the useCloseGame custom hook

import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCloseGame } from './useCloseGame';

// Mock the Server Action
vi.mock('@/app/actions/game', () => ({
  closeGameAction: vi.fn(),
}));

// Get reference to the mocked function
const { closeGameAction: mockCloseGameAction } = await import('@/app/actions/game');

describe('useCloseGame', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockCloseGameAction).mockReset();

    // Mock window.confirm to return true by default
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true)
    );
  });

  describe('initialization', () => {
    it('should initialize with loading=false and error=null', () => {
      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      expect(result.current.isClosing).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('closeGame', () => {
    it('should show confirmation dialog before closing', async () => {
      const mockConfirm = vi.fn(() => true);
      vi.stubGlobal('confirm', mockConfirm);

      vi.mocked(mockCloseGameAction).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      expect(mockConfirm).toHaveBeenCalledWith(
        'ゲームを締め切りますか？締め切り後は回答を受け付けなくなります。'
      );
    });

    it('should not call action if user cancels confirmation', async () => {
      const mockConfirm = vi.fn(() => false);
      vi.stubGlobal('confirm', mockConfirm);

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      expect(mockCloseGameAction).not.toHaveBeenCalled();
    });

    it('should set loading state during close action', async () => {
      vi.mocked(mockCloseGameAction).mockReturnValue(new Promise(() => {})); // Never resolves

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      act(() => {
        result.current.closeGame();
      });

      expect(result.current.isClosing).toBe(true);
    });

    it('should call closeGameAction with correct FormData', async () => {
      vi.mocked(mockCloseGameAction).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      expect(mockCloseGameAction).toHaveBeenCalledTimes(1);
      const formData = vi.mocked(mockCloseGameAction).mock.calls[0][0] as FormData;
      expect(formData.get('gameId')).toBe('game-123');
      expect(formData.get('confirmed')).toBe('true');
    });

    it('should call onSuccess callback on successful close', async () => {
      const mockOnSuccess = vi.fn();
      vi.mocked(mockCloseGameAction).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: mockOnSuccess,
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      });
    });

    it('should clear loading state after successful close', async () => {
      vi.mocked(mockCloseGameAction).mockResolvedValue({ success: true });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      await waitFor(() => {
        expect(result.current.isClosing).toBe(false);
      });
    });

    it('should set error state on failure', async () => {
      const errorMessage = 'Only the game creator can close the game';
      vi.mocked(mockCloseGameAction).mockResolvedValue({
        success: false,
        errors: { _form: [errorMessage] },
      });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      await waitFor(() => {
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isClosing).toBe(false);
      });
    });

    it('should call onError callback on failure', async () => {
      const mockOnError = vi.fn();
      const errorMessage = 'Game not found';
      vi.mocked(mockCloseGameAction).mockResolvedValue({
        success: false,
        errors: { _form: [errorMessage] },
      });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: mockOnError,
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(errorMessage);
      });
    });

    it('should handle multiple error messages', async () => {
      const errors = ['Error 1', 'Error 2'];
      vi.mocked(mockCloseGameAction).mockResolvedValue({
        success: false,
        errors: { _form: errors },
      });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Error 1');
      });
    });

    it('should handle action throwing an exception', async () => {
      const mockOnError = vi.fn();
      vi.mocked(mockCloseGameAction).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: mockOnError,
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('ゲームの締切に失敗しました');
        expect(mockOnError).toHaveBeenCalledWith('ゲームの締切に失敗しました');
        expect(result.current.isClosing).toBe(false);
      });
    });

    it('should prevent multiple simultaneous close attempts', async () => {
      vi.mocked(mockCloseGameAction).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 100);
          })
      );

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      // Start first close
      act(() => {
        result.current.closeGame();
      });

      expect(result.current.isClosing).toBe(true);

      // Attempt second close while first is in progress
      await act(async () => {
        await result.current.closeGame();
      });

      // Should only be called once
      await waitFor(() => {
        expect(mockCloseGameAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('error handling', () => {
    it('should clear error when closeGame is called again', async () => {
      // First call fails
      vi.mocked(mockCloseGameAction).mockResolvedValueOnce({
        success: false,
        errors: { _form: ['First error'] },
      });

      const { result } = renderHook(() =>
        useCloseGame({
          gameId: 'game-123',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        })
      );

      await act(async () => {
        await result.current.closeGame();
      });

      expect(result.current.error).toBe('First error');

      // Second call succeeds
      vi.mocked(mockCloseGameAction).mockResolvedValueOnce({ success: true });

      await act(async () => {
        await result.current.closeGame();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });
});
