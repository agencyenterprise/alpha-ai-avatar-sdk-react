# Avatar SDK Documentation

## Introduction

This SDK allows developers to integrate both manual and conversational avatars into their applications. It supports real-time voice synthesis, background layers, and conversational features powered by a backend AI system. This guide will walk you through how to set up and use the SDK for both manual and conversational avatar control.

## Installation
> Ensure the application is added to your npm library:
```xml
<LIBRARY>
   <NAME>alpha-ai-avatar-sdk-js</NAME>
   <VERSION>latest</VERSION>
</LIBRARY>
```

```bash
npm install alpha-ai-avatar-sdk-react
# OR
yarn add alpha-ai-avatar-sdk-react
```

---

# Avatar Components & Use cases 

### Manual Control Avatar vs Conversation Mode Avatar: 
- The manually controlled avatar (`<ManualAvatarDisplay/>`) requires developers to directly use the `avatarController.speak()` command, giving full control over the avatar's speech.

- The conversational avatar (`<ConversationalAvatarDisplay />`) interacts with the AvatarService backend LLM. Developers can adjust the LLM that powers the avatar's speech through the conversation state via .setSystemMessage() and .setConversationHistory() but have no direct control over the avatar's speech output.

### Instructions for Choosing Manual Control Avatar (<ManualAvatarDisplay/>) vs Conversational Mode Avatar (<ConversationalAvatarDisplay />)
#### **Select Manual Control when:**
- The application does not require user microphone input or the application requires custom logic for handling user voice input
- The application requires its own logic/controls for generating responses via LLM
- The application is a guided/scripted experience where the avatar's speech is predetermined and does not require dynamic responses to user input.
- The interaction requires precise control over the avatar's speech content and timing, and deviations from the script are not acceptable.
- The application involves delivering content that does not require input or responses from users, such as instructional videos or presentations.
- The deployment environment is public or semi-public where user input varies minimally and a set script is preferable for consistency, like in kiosks or exhibits.

#### **Select Conversational Mode when:**
- The user is chatting with their microphone input
- The interaction benefits from or requires dynamic responses that adapt to user inputs, questions, or behaviors in real-time.
- The use case involves engaging users in a dialogue where the avatar needs to interpret and respond to free-form user input, as in customer support or educational applications.
- The application aims to provide a highly interactive user experience that mimics human-like conversational abilities, suitable for roles like virtual assistants or interactive storytellers.

---

## Manual Control Setup

### Basic Setup of Manual Controller & Display:
- **Required `ManualAvatarController()`**: Create the avatar controller within the component: 
```tsx
const App = () => {
    const avatarController = new ManualAvatarController({apiKey: 'YOUR_API_KEY'});
    // .. rest of application ..
```
 
- **Required `<ManualAvatarDisplay/>`**: Pass the avatar controller to the AvatarDisplay component as a prop.
```tsx
    <ManualAvatarDisplay
        avatarController={avatarController}
        /* All other props are OPTIONAL, start simple and add customization as needed */
    />
```

## Conversational Mode Setup

### Basic Setup of Conversational Controller & Display:
- **Required `ConversationalAvatarController()`**: Create the avatar controller within the component: 
```tsx
import { ConversationalAvatarController } from 'alpha-ai-avatar-sdk-react';
const App = () => {
    const avatarController = new ConversationalAvatarController({
        apiKey: 'YOUR_API_KEY',
        initialPrompt: [
            {
                role: 'system',
                content: 'Act like Albert Einstein',
            },
        ],
    });
    // .. rest of application ..
```
 
- **Required `<ConversationalAvatar/>`**: Pass the avatar controller to the <ConversationalAvatar /> component as a prop.
```tsx
    <ConversationalAvatarDisplay
        avatarController={avatarController}
        /* All other props are OPTIONAL, start simple and add customization as needed */
    />
```

# Controller & Display Properties

## Avatar Controller 
> `const avatarController: ManualAvatarController = new ManualAvatarController(config: BaseControllerConfig);`
> `const avatarController: ConversationalAvatarController = new ConversationalAvatarController(config: ConversationControllerConfig);`

### Initialization Configurations

```tsx
interface BaseControllerConfig {
   apiKey: string;
}

interface ManualAvatarConfig extends BaseControllerConfig { }

interface ConversationalConfig extends BaseControllerConfig {
    initialConversationConfig: { 
        systemMessage: string;
        conversationHistory: { text: string, speaker: 'assistant' | 'user' }[];
    }
}

```
### Controller Methods
```tsx
interface BaseAvatarController {
   stopSpeaking: () => void;
}

interface ManualAvatarController extends BaseAvatarControllerProps {
    speak: (text: string, overrideVoice?: VoiceConfig) => void;
}

interface ConversationalAvatarController extends BaseControllerConfig {
    updateSystemMessage: (message: string) => void;
    updateConversationHistory: (history: { role: 'user' | 'system', content: string }[]) => void;
    setMicrophoneMute: (isMuted: boolean) => void;
}
```

## Avatar Display
```tsx
interface BaseAvatarDisplayProps {
   avatarController: AvatarController;
   height: number;
   width: number;
   className?: string; // optional
}

type ChatTranscriptRole = 'user' | 'assistant';

type ChatTranscriptMessage = {
  message: string;
  role: ChatTranscriptRole;
};

interface ConversationalAvatarDisplayProps extends BaseAvatarDisplayProps {
    onChatTranscriptUpdate: (message: ChatTranscriptMessage) => void;
}

```
