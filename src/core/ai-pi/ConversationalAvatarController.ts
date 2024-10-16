import { BaseAvatarController } from './BaseAvatarController';

export class ConversationalAvatarController extends BaseAvatarController {
  updateSystemMessage(message: string) {
    this.avatarClient.say(message);
  }

  updateConversationHistory(message: string) {
    this.avatarClient.setMessagesHistory([
      {
        role: 'system',
        content: message,
      },
    ]);
  }

  setMicrophoneMuted(isMuted: boolean) {
    if (isMuted) {
      this.avatarClient.disableMicrophone();
    } else {
      this.avatarClient.enableMicrophone();
    }
  }

  override async connect(
    videoElement: HTMLVideoElement,
    audioElement: HTMLAudioElement,
  ): Promise<any> {
    this.avatarClient.init(
      {
        videoElement,
      },
      audioElement,
    );
    await this.avatarClient.connect();
    return new Promise((resolve) =>
      setTimeout(() => {
        this.avatarClient.enableMicrophone();
        resolve(null);
      }, 1500),
    );
  }
}
