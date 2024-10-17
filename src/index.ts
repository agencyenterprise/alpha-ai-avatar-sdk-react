// Types
export * from 'alpha-ai-avatar-sdk-js';
export type * from 'alpha-ai-avatar-sdk-js';

// Classes
export { AvatarClient } from 'alpha-ai-avatar-sdk-js';

// Context
export { AvatarProvider } from './contexts/AvatarContext';

// Hooks
export { useAvatar } from './hooks/useAvatar';

// Components
export * from './components/Avatar/Avatar';

// AI-PI
export { ConversationalAvatarController } from './core/ai-pi/ConversationalAvatarController';
export { ManualAvatarController } from './core/ai-pi/ManualAvatarController';
export { BaseAvatarController } from './core/ai-pi/BaseAvatarController';
export {
  ConversationalAvatarDisplay,
  ConversationalAvatarDisplayProps,
} from './components/Avatar/ai-pi/ConversationalAvatarDisplay';
export {
  ManualAvatarDisplay,
  ManualAvatarDisplayProps,
} from './components/Avatar/ai-pi/ManualAvatarDisplay';
export type * from './components/Avatar/ai-pi/ConversationalAvatarDisplay';
export type * from './components/Avatar/ai-pi/ManualAvatarDisplay';
