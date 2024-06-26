import { Base } from '../base';
import { Config, CreateRoom, GetAvatars, GetSupportedVoices } from './types';

export class AvatarClient extends Base {
  private baseUrl: string;
  private avatarId?: number;

  constructor(config: Config) {
    super();
    this.baseUrl = config.baseUrl || 'https://avatar.alpha.school';
    this.avatarId = config.avatarId;
    this.setApiKey(config.apiKey);
  }

  connect(avatarId?: number): Promise<CreateRoom> {
    return this.invoke(`${this.baseUrl}/rooms`, {
      method: 'POST',
      body: JSON.stringify({
        avatarId: avatarId || this.avatarId,
      }),
    });
  }

  getAvatars(): Promise<GetAvatars> {
    return this.invoke(`${this.baseUrl}/avatars`);
  }

  getSupportedVoices(): Promise<GetSupportedVoices> {
    return this.invoke(`${this.baseUrl}/supported-voices`);
  }
}
