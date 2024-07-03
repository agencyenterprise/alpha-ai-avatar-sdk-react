import {
  Avatar,
  useAvatar,
} from 'alpha-ai-avatar-sdk-react';
import { useAzureSpeechRecognition } from 'alpha-ai-avatar-sdk-react/plugins/stt/azure';
import { useEffect } from 'react';
import { Button } from './Button';

export function App() {
  const { room, isConnected, connect, say, stop, switchAvatar } = useAvatar();
  const { startRecognizing, stopRecognizing } = useAzureSpeechRecognition({
    subscriptionKey: 'AZURE_SUBSCRIPTION_KEY',
    serviceRegion: 'SERVICE_REGION', // westus, eastus...
    onSpeechRecognized: (transcript) => {
      console.log(transcript);
      say(transcript);
    },
  });

  useEffect(() => {
    if (isConnected) {
      startRecognizing();
    }
    return () => {
      stopRecognizing();
    };
  }, [isConnected, startRecognizing, stopRecognizing]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}>
      <Avatar style={{ borderRadius: '20px', width: 250, height: 250 }} />

      <div style={{ display: 'flex', gap: '10px' }}>
        {room ? (
          isConnected ? (
            <>
              <Button onClick={stop}>Stop Avatar</Button>
              <Button onClick={() => switchAvatar(4)}>Switch Avatar</Button>
            </>
          ) : (
            <p>Connecting...</p>
          )
        ) : (
          <Button onClick={() => connect()}>Connect</Button>
        )}
      </div>
    </div>
  );
}
