import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import { AvatarClient } from '../core/AvatarClient/AvatarClient';
import { Room } from 'livekit-client';

const AvatarContext = createContext<{
  token: string;
  serverUrl: string;
  client: AvatarClient;
  room: Room | undefined;
  updateRoom: (room: Room) => void;
}>({
  token: '',
  serverUrl: '',
  client: new AvatarClient({ apiKey: '' }),
  room: undefined,
  updateRoom: () => {},
});

type AvatarProviderType = {
  children: ReactNode;
  client: AvatarClient;
};

const AvatarProvider: React.FC<AvatarProviderType> = ({ children, client }) => {
  const [token, setToken] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [roomRef, setRoomRef] = useState<Room | undefined>();

  useEffect(() => {
    client.connect().then((data) => {
      const token = data.token;
      const serverUrl = data.serverUrl;

      setToken(token);
      setServerUrl(serverUrl);

      const room = new Room({
        adaptiveStream: true,
      });
      room.connect(serverUrl, token);
      setRoomRef(room);
    });
  }, []);

  return (
    <AvatarContext.Provider
      value={{
        token,
        serverUrl,
        client,
        room: roomRef,
        updateRoom: (room) => {
          setRoomRef(room);
        },
      }}>
      {children}
    </AvatarContext.Provider>
  );
};

const useAvatarContext = () => {
  const context = useContext(AvatarContext);

  if (context === undefined) {
    throw new Error('useUserContext was used outside of its Provider');
  }

  return context;
};

export { AvatarContext, AvatarProvider, useAvatarContext };
