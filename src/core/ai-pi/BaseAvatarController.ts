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

    let canAutoPlay = false;

    try {
      await audioElement.play();
      canAutoPlay = true;
    } catch (error) {
      console.error('Error playing audio:', error);
    }

    await this.avatarClient.connect();

    if (!canAutoPlay) {
      this.waitUserGestureToPlayAudio(audioElement);
    }
  }

  waitUserGestureToPlayAudio(audioElement: HTMLAudioElement) {
    const interactionEvents = [
      'click',
      'scroll',
      'keydown',
      'touchstart',
      'mousemove',
      'touchmove',
      'touchend',
    ];

    const enableAudio = () => {
      audioElement.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    };

    interactionEvents.forEach((eventType) => {
      document.addEventListener(eventType, enableAudio, {
        once: true,
        passive: true,
      });
    });
  }

  disconnect() {
    this.avatarClient.disconnect();
  }
}
