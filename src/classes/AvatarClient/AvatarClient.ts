import { Base } from "../base";
import { Config, CreateRoom, GetAvatars } from "./types";

export class AvatarClient extends Base {
  private apiKey: string;
  private baseUrl: string;
  private avatarId?: number;

  constructor(config: Config) {
    super();
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://avatar.alpha.school";
    this.avatarId = config.avatarId;
  }

  connect(avatarId?: number): Promise<CreateRoom> {
    return this.invoke(`${this.baseUrl}/rooms`, this.apiKey, {
      method: "POST",
      body: JSON.stringify({
        avatarId: avatarId || this.avatarId,
      }),
    });
  }

  getAvatars(): Promise<GetAvatars> {
    return this.invoke(`${this.baseUrl}/avatars`, this.apiKey);
  }
}
