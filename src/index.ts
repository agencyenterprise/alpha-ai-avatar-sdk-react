import { AvatarClient } from "./classes/AvatarClient/AvatarClient";

// Classes
export { AvatarClient };

// Context
export { AvatarProvider } from "./context/AvatarContext";

// Hooks
export { useAvatarClient } from "./hooks/useAvatarClient";

// Components
export * from "./components/Avatar/Avatar";

// TODO:
// - Add autoConnect flag
// - Choose an specific avatarId (if they want)
// - Make the livekit callbacks available to the user
