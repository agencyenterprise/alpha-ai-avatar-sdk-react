import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { AvatarClient } from "../classes/AvatarClient/AvatarClient";

const AvatarContext = createContext<{
  client: AvatarClient;
  token: string;
  serverUrl: string;
}>({
  client: new AvatarClient({ apiKey: "" }),
  token: "",
  serverUrl: "",
});

type AvatarProviderType = {
  client: AvatarClient;
  children: ReactNode;
};

const AvatarProvider: React.FC<AvatarProviderType> = ({ client, children }) => {
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");

  useEffect(() => {
    client.connect().then((room) => {
      setToken(room.token);
      setServerUrl(room.serverUrl);
    });
  }, []);

  return (
    <AvatarContext.Provider value={{ client, token, serverUrl }}>
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
