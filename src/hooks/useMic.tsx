import { useEffect, useState } from 'react';

export function useMic() {
  const [isMicEnabled, setIsMicEnabled] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setIsMicEnabled(true);
      })
      .catch(() => {
        setIsMicEnabled(false);
      });
  }, []);

  return { isMicEnabled };
}
