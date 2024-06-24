import { AvatarClient } from "./classes/AvatarClient/AvatarClient";

// Classes
export { AvatarClient };

// Context
export { AvatarProvider } from "./context/AvatarContext";

// Hooks
export { useAvatarClient } from "./hooks/useAvatarClient";

// Components
export * from "./components/AvatarComponent/AvatarComponent";

// TODO:
// - Add autoConnect flag
// - Choose an specific avatarId (if they want)
// - Make the livekit callbacks available to the user
// - Add the "say", "stop" function...
// - Add a way to change the style of the video
// - Remove utils
// - Find a better name for the file structure
