import { useAvatarContext } from "../context/AvatarContext";

export const useAvatarClient = () => {
  const context = useAvatarContext();

  return {
    token: context.token,
    serverUrl: context.serverUrl,
  };
};
