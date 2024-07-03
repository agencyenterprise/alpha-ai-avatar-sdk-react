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
    region: string,
    onSpeechRecognized: (transcript: string) => void,
  ) {
    const token = await AzureToken.getToken(subscriptionKey, region);

    const speechConfig = SpeechConfig.fromAuthorizationToken(token, region);
    speechConfig.speechRecognitionLanguage = 'en-US';

    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

    this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
    this.recognizer.startContinuousRecognitionAsync();

    this.recognizer.recognized = (_, event) => {
      if (event.result.reason === ResultReason.RecognizedSpeech) {
        onSpeechRecognized(event.result.text);
      }
    };

    this.recognizer.canceled = () => {
      this.recognizer?.stopContinuousRecognitionAsync();
      this.recognizer?.close();
    };
  }

  stop() {
    this.recognizer?.stopContinuousRecognitionAsync();
  }
}
