import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { AvatarClient } from "../classes/AvatarClient/AvatarClient";
import { Room } from "livekit-client";

const AvatarContext = createContext<{
  client: AvatarClient;
  token: string;
  serverUrl: string;
  room: Room | undefined;
  updateRoom: (room: Room) => void;
}>({
  client: new AvatarClient({ apiKey: "" }),
  token: "",
  serverUrl: "",
  room: undefined,
  updateRoom: () => {},
});

type AvatarProviderType = {
  client: AvatarClient;
  children: ReactNode;
};

const AvatarProvider: React.FC<AvatarProviderType> = ({ client, children }) => {
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");
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
        client,
        token,
        serverUrl,
        room: roomRef,
        updateRoom: (room) => {
          setRoomRef(room);
        },
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

const useAvatarContext = () => {
  const context = useContext(AvatarContext);

  if (context === undefined) {
    throw new Error("useUserContext was used outside of its Provider");
  }

  return context;
};

export { AvatarContext, AvatarProvider, useAvatarContext };
