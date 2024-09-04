/** @jest-environment jsdom */
import '@testing-library/jest-dom';

import { act, render, renderHook, waitFor } from '@testing-library/react';
import {
  AvatarContext,
  AvatarContextType,
  AvatarProvider,
} from '../AvatarContext';
import { AvatarClient } from 'alpha-ai-avatar-sdk-js';
import { useAvatar } from '../../hooks/useAvatar';
import { ReactNode } from 'react';

describe('AvatarContext', () => {
  let mockClient: AvatarClient;

  beforeEach(() => {
    mockClient = new AvatarClient({ apiKey: 'test-key' });
  });

  describe('AvatarProvider', () => {
    it('renders children without crashing', async () => {
      const { getByText } = render(
        <AvatarProvider client={mockClient}>
          <div>Hello, Avatar!</div>
        </AvatarProvider>,
      );

      await waitFor(() => {
        expect(getByText('Hello, Avatar!')).toBeInTheDocument();
      });
    });
  });

  describe('useAvatar', () => {
    let mockContextValue: AvatarContextType;

    beforeEach(() => {
      mockContextValue = {
        client: mockClient,
        room: undefined,
        isConnected: false,
        isAvatarSpeaking: false,
        connect: jest.fn(),
        say: jest.fn(),
        stop: jest.fn(),
        switchAvatar: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    it('should return the context value', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AvatarContext.Provider value={mockContextValue}>
          {children}
        </AvatarContext.Provider>
      );

      const { result } = renderHook(() => useAvatar(), { wrapper });
      expect(result.current).toEqual(mockContextValue);
    });

    it('should update when context value changes', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AvatarContext.Provider value={mockContextValue}>
          {children}
        </AvatarContext.Provider>
      );

      const { result, rerender } = renderHook(() => useAvatar(), { wrapper });
      expect(result.current.isConnected).toBe(false);

      mockContextValue.isConnected = true;
      rerender();
      expect(result.current.isConnected).toBe(true);
    });

    it('should provide functioning methods from the context', async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AvatarContext.Provider value={mockContextValue}>
          {children}
        </AvatarContext.Provider>
      );

      const { result } = renderHook(() => useAvatar(), { wrapper });

      await act(async () => {
        await result.current.connect();
      });
      expect(mockContextValue.connect).toHaveBeenCalled();

      await act(async () => {
        await result.current.connect(2);
      });
      expect(mockContextValue.connect).toHaveBeenCalledWith(2);

      await act(async () => {
        await result.current.say('Hello');
      });
      expect(mockContextValue.say).toHaveBeenCalledWith('Hello');

      await act(async () => {
        await result.current.stop();
      });
      expect(mockContextValue.stop).toHaveBeenCalled();

      await act(async () => {
        await result.current.switchAvatar(2);
      });
      expect(mockContextValue.switchAvatar).toHaveBeenCalledWith(2);

      await act(async () => {
        await result.current.disconnect();
      });
      expect(mockContextValue.disconnect).toHaveBeenCalled();
    });
  });
});
