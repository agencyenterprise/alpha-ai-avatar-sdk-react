export type GetTokenResponse = {
  token: string | null;
  region: string | null;
  error?: string;
};

export type UseSpeechRecognitionOptions = {
  subscriptionKey: string;
  serviceRegion: string;
  onSpeechRecognized: (transcript: string) => void;
};
