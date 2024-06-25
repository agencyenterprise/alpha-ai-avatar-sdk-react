import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useRef,
} from "react";
import { AvatarClient } from "../classes/AvatarClient/AvatarClient";
import { Room } from "livekit-client";

const AvatarContext = createContext<{
  client: AvatarClient;
  token: string;
  serverUrl: string;
  room: Room | undefined;
}>({
  client: new AvatarClient({ apiKey: "" }),
  token: "",
  serverUrl: "",
  room: undefined,
});

type AvatarProviderType = {
  client: AvatarClient;
  children: ReactNode;
};

const AvatarProvider: React.FC<AvatarProviderType> = ({ client, children }) => {
  const roomRef = useRef<Room | undefined>();
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");

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
      roomRef.current = room;
    });
  }, []);

  return (
    <AvatarContext.Provider
      value={{ client, token, serverUrl, room: roomRef.current }}
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
