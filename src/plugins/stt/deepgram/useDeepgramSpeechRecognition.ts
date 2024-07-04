import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { DeepgramSpeechRecognition } from './DeepgramSpeechRecognition';
import { LiveSchema } from '@deepgram/sdk';

export type UseSpeechRecognitionOptions = {
  apiKey: string;
  onSpeechRecognized: (transcript: string) => void;
  deepgramOptions?: LiveSchema;
};

export function useDeepgramSpeechRecognition({
  apiKey,
  onSpeechRecognized,
  deepgramOptions,
}: UseSpeechRecognitionOptions) {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef<DeepgramSpeechRecognition>(
    new DeepgramSpeechRecognition(),
  );

  const callbackRef = useRef(onSpeechRecognized);
  useLayoutEffect(() => {
    callbackRef.current = onSpeechRecognized;
  });

  const startRecognizing = useCallback(async () => {
    setIsRecognizing(true);
    recognitionRef.current.start(apiKey, callbackRef.current, deepgramOptions);
  }, []);

  const stopRecognizing = useCallback(async () => {
    setIsRecognizing(false);
    recognitionRef.current.stop();
  }, []);

  return { isRecognizing, startRecognizing, stopRecognizing };
}
