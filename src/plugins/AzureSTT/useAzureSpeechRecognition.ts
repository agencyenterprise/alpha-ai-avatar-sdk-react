import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { AzureSpeechRecognition } from './AzureSpeechRecognition';
import { UseSpeechRecognitionOptions } from './types';

export function useAzureSpeechRecognition({
  subscriptionKey,
  serviceRegion,
  onSpeechRecognized,
}: UseSpeechRecognitionOptions) {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef<AzureSpeechRecognition>(
    new AzureSpeechRecognition(),
  );

  const callbackRef = useRef(onSpeechRecognized);
  useLayoutEffect(() => {
    callbackRef.current = onSpeechRecognized;
  });

  const startRecognizing = useCallback(async () => {
    setIsRecognizing(true);

    await recognitionRef.current.start(
      subscriptionKey,
      serviceRegion,
      callbackRef.current,
    );
  }, []);

  const stopRecognizing = useCallback(async () => {
    setIsRecognizing(false);
    recognitionRef.current.stop();
  }, []);

  return { isRecognizing, startRecognizing, stopRecognizing };
}
