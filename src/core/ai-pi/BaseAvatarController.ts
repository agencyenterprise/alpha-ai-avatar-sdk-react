import { AvatarClient, AvatarClientConfig } from 'alpha-ai-avatar-sdk-js';

export class BaseAvatarController {
  public avatarClient: AvatarClient;

  constructor(config: AvatarClientConfig) {
    this.avatarClient = new AvatarClient(config);
  }

  stopSpeaking() {
    this.avatarClient.stop();
  }

  async connect(
    videoElement: HTMLVideoElement,
    audioElement: HTMLAudioElement,
  ) {
    this.avatarClient.init(
      {
        videoElement,
      },
      audioElement,
    );
    await this.avatarClient.connect();
  }

  disconnect() {
    this.avatarClient.disconnect();
  }
}
