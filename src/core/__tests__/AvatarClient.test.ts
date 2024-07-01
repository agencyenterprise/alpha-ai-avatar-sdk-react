import { AvatarClient } from '../AvatarClient';
import {
  CreateRoomResponse,
  GetAvatarsResponse,
  GetSupportedVoicesResponse,
} from '../types';

jest.mock('../AvatarClient');

describe('AvatarClient', () => {
  let apiKey: string;
  let baseUrl: string;
  let client: jest.Mocked<AvatarClient>;

  let mockConnect: jest.Mock;
  let mockGetAvatars: jest.Mock;
  let mockGetSupportedVoices: jest.Mock;

  beforeEach(() => {
    apiKey = 'test-key';
    baseUrl = 'http://localhost:5000';

    jest.clearAllMocks();

    mockConnect = jest.fn();
    mockGetAvatars = jest.fn();
    mockGetSupportedVoices = jest.fn();

    (AvatarClient as jest.MockedClass<typeof AvatarClient>).mockImplementation(
      () =>
        ({
          connect: mockConnect,
          getAvatars: mockGetAvatars,
          getSupportedVoices: mockGetSupportedVoices,
        }) as unknown as AvatarClient,
    );

    client = new AvatarClient({
      apiKey,
    }) as jest.Mocked<AvatarClient>;
  });

  describe('constructor', () => {
    it('should use the provided baseUrl and apiKey', () => {
      new AvatarClient({
        baseUrl,
        apiKey,
      });
      expect(AvatarClient).toHaveBeenCalledWith({
        baseUrl,
        apiKey,
      });
    });

    it('should use the default baseUrl if not provided', () => {
      new AvatarClient({ apiKey });
      expect(AvatarClient).toHaveBeenCalledWith({
        apiKey,
      });
    });
  });

  describe('connect', () => {
    it('should call connect with the correct avatarId', async () => {
      await client.connect(456);
      expect(mockConnect).toHaveBeenCalledWith(456);
    });

    it('should return the response from connect', async () => {
      const mockResponse: CreateRoomResponse = {
        serverUrl: 'http://livekit.com',
        token: 'test-token',
      };
      mockConnect.mockResolvedValue(mockResponse);
      const response = await client.connect(456);
      expect(response).toEqual(mockResponse);
    });
  });

  describe('getAvatars', () => {
    it('should call getAvatars', async () => {
      await client.getAvatars();
      expect(mockGetAvatars).toHaveBeenCalled();
    });

    it('should return the response from getAvatars', async () => {
      const mockResponse: GetAvatarsResponse = [
        {
          id: 1,
          name: 'Avatar 1',
          thumbnail: 'http://localhost:5000/avatar-1.png',
        },
      ];
      mockGetAvatars.mockResolvedValue(mockResponse);
      const response = await client.getAvatars();
      expect(response).toEqual(mockResponse);
    });
  });

  describe('getSupportedVoices', () => {
    it('should call getSupportedVoices', async () => {
      await client.getSupportedVoices();
      expect(mockGetSupportedVoices).toHaveBeenCalled();
    });

    it('should return the response from getSupportedVoices', async () => {
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
      mockGetSupportedVoices.mockResolvedValue(mockResponse);
      const response = await client.getSupportedVoices();
      expect(response).toEqual(mockResponse);
    });
  });
});
