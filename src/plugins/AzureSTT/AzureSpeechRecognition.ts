import {
  AudioConfig,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';

import { AzureToken } from './AzureToken';

export class AzureSpeechRecognition {
  recognizer: SpeechRecognizer | undefined;

  async start(
    subscriptionKey: string,
    serviceRegion: string,
    onSpeechRecognized: (transcript: string) => void,
  ) {
    try {
      const { token, region, error } = await AzureToken.getToken(
        subscriptionKey,
        serviceRegion,
      );

      if (!token || !region || error) {
        throw new Error(error);
      }

      const speechConfig = SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = 'en-US';

      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

      this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
      this.recognizer.startContinuousRecognitionAsync(() =>
        console.log('started speech recognition'),
      );

      this.recognizer.recognized = (_, event) => {
        if (event.result.reason === ResultReason.RecognizedSpeech) {
          onSpeechRecognized(event.result.text);
        }
      };

      this.recognizer.canceled = () => {
        this.recognizer?.stopContinuousRecognitionAsync();
        this.recognizer?.close();
      };
    } catch (error) {
      console.log('error starting speech recognition', error);
    }
  }

  stop() {
    this.recognizer?.stopContinuousRecognitionAsync();
  }
}
