import { Base } from "../base";
import { Config, CreateRoom, GetAvatars } from "./types";

export class AvatarClient extends Base {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    super();
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://avatar.alpha.school";
  }

  connect(avatarId?: number): Promise<CreateRoom> {
    return this.invoke(`${this.baseUrl}/rooms`, this.apiKey, {
      method: "POST",
      body: JSON.stringify({
        avatarId: avatarId,
      }),
    });
  }

  getAvatars(): Promise<GetAvatars> {
    return this.invoke(`${this.baseUrl}/avatars`, this.apiKey);
  }
}
