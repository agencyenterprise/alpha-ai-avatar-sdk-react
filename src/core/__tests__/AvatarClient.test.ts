import { AvatarClient } from '../AvatarClient';
import {
  AvatarClientConfig,
  CreateRoomResponse,
  GetAvatarsResponse,
  GetSupportedVoicesResponse,
} from '../types';

global.fetch = jest.fn();

describe('AvatarClient', () => {
  const config: AvatarClientConfig = {
    apiKey: 'test-key',
    baseUrl: 'http://localhost:5000',
    avatarId: 1,
  };

  let avatarClient: AvatarClient;

  beforeEach(() => {
    avatarClient = new AvatarClient(config);
    (fetch as jest.Mock).mockClear();
  });

  describe('connect', () => {
    let mockResponse: CreateRoomResponse;

    beforeEach(() => {
      mockResponse = {
        token: 'test-token',
        serverUrl: 'https://livekit.io',
      };
    });

    it('should create a room with the provided avatarId', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await avatarClient.connect(456);

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/rooms',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
          body: JSON.stringify({ avatarId: 456 }),
        }),
      );
    });

    it('should create a room with the default avatarId from the client if none is provided', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await avatarClient.connect();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/rooms',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
          body: JSON.stringify({ avatarId: 1 }),
        }),
      );
    });

    it('should create a room with the avatarId as null if none is provided', async () => {
      avatarClient = new AvatarClient({
        apiKey: 'test-key',
        baseUrl: 'http://localhost:5000',
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await avatarClient.connect();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/rooms',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
          body: '{}',
        }),
      );
    });

    it('should create a room with the production base url if none is provided', async () => {
      avatarClient = new AvatarClient({
        apiKey: 'test-key',
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await avatarClient.connect();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://avatar.alpha.school/rooms',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
          body: '{}',
        }),
      );
    });
  });

  describe('getAvatars', () => {
    it('should fetch the list of avatars', async () => {
      const mockResponse: GetAvatarsResponse = [
        {
          id: 1,
          name: 'Avatar 1',
          thumbnail: 'http://localhost:5000/avatar1.png',
        },
        {
          id: 2,
          name: 'Avatar 2',
          thumbnail: 'http://localhost:5000/avatar2.png',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await avatarClient.getAvatars();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/avatars',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
        }),
      );
    });
  });

  describe('getSupportedVoices', () => {
    it('should fetch the list of supported voices', async () => {
      const mockResponse: GetSupportedVoicesResponse = [
        {
          displayName: 'Guy',
          shortName: 'en-US-GuyNeural',
          gender: 'Male',
          locale: 'en-US',
          styleList: [
            'newscast',
            'angry',
            'cheerful',
            'sad',
            'excited',
            'friendly',
            'terrified',
            'shouting',
            'unfriendly',
            'whispering',
            'hopeful',
          ],
          wordsPerMinute: '215',
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await avatarClient.getSupportedVoices();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:5000/supported-voices',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-API-Key': 'test-key',
          }),
        }),
      );
    });
  });
});
