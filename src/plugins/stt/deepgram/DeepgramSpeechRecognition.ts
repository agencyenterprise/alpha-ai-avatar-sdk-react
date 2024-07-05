import { ListenLiveClient, LiveSchema, createClient } from '@deepgram/sdk';
import { LiveTranscriptionEvents } from '@deepgram/sdk';

export class DeepgramSpeechRecognition {
  live: ListenLiveClient | undefined;
  mediaRecorder: MediaRecorder | undefined;

  start(
    apiKey: string,
    onSpeechRecognized: (transcript: string) => void,
    deepgramOptions?: LiveSchema,
  ) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);

      const deepgram = createClient(apiKey);
      this.live = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        ...deepgramOptions,
      });

      this.live.on(LiveTranscriptionEvents.Open, () => {
        this.mediaRecorder?.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0) {
            this.live?.send(event.data);
          }
        });
        this.mediaRecorder?.start(250);

        this.live?.on(LiveTranscriptionEvents.Transcript, (transcription) => {
          const transcript = transcription.channel.alternatives[0].transcript;
          if (transcript && transcription.is_final) {
            onSpeechRecognized(transcript);
          }
        });
      });
    });
  }

  stop() {
    this.mediaRecorder?.stop();
    this.live?.finish();
  }
}
