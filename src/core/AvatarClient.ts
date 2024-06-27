import { HTTPClient } from './HTTPClient';
import { AvatarClientConfig, CreateRoomResponse, GetAvatarsResponse, GetSupportedVoicesResponse } from './types';

export class AvatarClient extends HTTPClient {
  private avatarId?: number;

  constructor(config: AvatarClientConfig) {
    super(config.baseUrl ?? 'https://avatar.alpha.school', config.apiKey);
    this.avatarId = config.avatarId;
  }

  connect(avatarId?: number) {
    return this.post<CreateRoomResponse>('/rooms', {
      avatarId: avatarId ?? this.avatarId,
    });
  }

  getAvatars() {
    return this.get<GetAvatarsResponse>('/avatars');
  }

  getSupportedVoices() {
    return this.get<GetSupportedVoicesResponse>('/supported-voices');
  }
}
