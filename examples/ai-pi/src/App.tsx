import {
  ConversationalAvatarController,
  ConversationalAvatarDisplay,
} from 'alpha-ai-avatar-sdk-react';

// const avatarController = new ConversationalAvatarController({
//   apiKey: 's76hu0jzWThfnscn',
//   initialPrompt: [
//     {
//       role: 'system',
//       content: 'Act like Albert Einstein',
//     },
//   ],
// });

export function App() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '20px',
      }}>
        hello
      {/* <ConversationalAvatarDisplay avatarController={avatarController} /> */}
    </div>
  );
}
