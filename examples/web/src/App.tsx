import { Avatar, useAvatar } from 'alpha-ai-avatar-sdk-react';
import { Button } from './Button';

export function App() {
  const { room, isConnected, connect, say, stop, switchAvatar } = useAvatar();

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
              <Button onClick={() => say('Hello, how are you?')}>Say</Button>
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
