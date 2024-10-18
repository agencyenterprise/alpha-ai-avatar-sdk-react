import { SynthesizerOptions } from 'alpha-ai-avatar-sdk-js';
import { BaseAvatarController } from './BaseAvatarController';

export class ManualAvatarController extends BaseAvatarController {
  speak(text: string, overrideVoice?: SynthesizerOptions) {
    this.avatarClient.say(text, overrideVoice);
  }
}
