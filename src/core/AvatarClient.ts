import { HTTPClient } from './HTTPClient';
import {
  AvatarClientConfig,
  CreateRoomResponse,
  GetAvatarsResponse,
  GetSupportedVoicesResponse,
  Prompt,
} from './types';

export class AvatarClient extends HTTPClient {
  private avatarId?: number;
  private conversational: boolean = false;
  private initialPrompt?: Prompt[];

  constructor(config: AvatarClientConfig) {
    super(config.baseUrl ?? 'https://avatar.alpha.school', config.apiKey);
    this.avatarId = config.avatarId;
    this.conversational = config.conversational ?? false;
    this.initialPrompt = config.initialPrompt;
  }

  connect(
    avatarId?: number,
    conversational?: boolean,
    initialPrompt?: Prompt[],
  ) {
    return this.post<CreateRoomResponse>('/rooms', {
      avatarId: avatarId ?? this.avatarId,
      conversational: conversational ?? this.conversational,
      initialPrompt: initialPrompt ?? this.initialPrompt,
    });
  }

  getAvatars() {
    return this.get<GetAvatarsResponse>('/avatars');
  }

  getSupportedVoices() {
    return this.get<GetSupportedVoicesResponse>('/supported-voices');
  }
}
