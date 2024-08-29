import {
  Avatar,
  TranscriberStatus,
  useAvatar,
} from 'alpha-ai-avatar-sdk-react';
import { Button } from './Button';
import { useEffect } from 'react';

export function App() {
  const {
    room,
    isConnected,
    connect,
    disconnect,
    say,
    stop,
    messages,
    switchAvatar,
    enableMicrophone,
    addEventListener,
    removeEventListener,
  } = useAvatar();

  useEffect(() => {
    const onTranscriberStatusChangeHandler = (status: TranscriberStatus) => {
      console.log('Transcriber status changed:', status);
    };

    addEventListener(
      'transcriberStatusChange',
      onTranscriberStatusChangeHandler,
    );

    return () => {
      removeEventListener(
        'transcriberStatusChange',
        onTranscriberStatusChangeHandler,
      );
    };
  }, []);

  useEffect(() => {
    console.log('Messages:', messages);
  }, [messages]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}>
      <Avatar style={{ borderRadius: '20px', width: 512, height: 512 }} />

      <div style={{ display: 'flex', gap: '10px' }}>
        {room ? (
          isConnected ? (
            <>
              <Button onClick={() => say('Hello, how are you?')}>Say</Button>
              <Button onClick={stop}>Stop Avatar</Button>
              <Button onClick={() => switchAvatar(4)}>Switch Avatar</Button>
              <Button onClick={() => enableMicrophone()}>
                Enable microphone
              </Button>
              <Button onClick={() => disconnect()}>Disconnect</Button>
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
