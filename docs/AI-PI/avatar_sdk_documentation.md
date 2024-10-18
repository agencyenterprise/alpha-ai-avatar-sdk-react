
**IMPORTANT, FIRST ENSURE LIBRARY IS INSTALLED, ADD THIS TO <EXTRA_LIBRARIES>**
"""
<LIBRARY>
   <NAME>alpha-ai-avatar-sdk-react</NAME>
   <VERSION>latest</VERSION>
</LIBRARY>
"""

**IMPORTANT** Use of `useEffect` will CRASH the avatar, do not use this. Only use `useState` for the application code.

**IMPORTANT** Use the API Key Values in the documentation, DO NOT GENERATE CODE USING ENV VARIABLES.

# Avatar SDK Documentation

## Introduction

This SDK allows developers to integrate both manual and conversational avatars into their applications. It supports real-time voice synthesis, background layers, and conversational features powered by a backend AI system. This guide will walk you through how to set up and use the SDK for both manual and conversational avatar control.


Create a game of who wants to be a millionaire, where the avatar acts as the host reading the questions & responding appropriately when the user answers. Use GPT to generate questions for each level increasing in difficulty, also use GPT to know if the answer is correct and generate a response.

---

# Avatar Components & Use cases 

### Manual Control Avatar vs Conversation Mode Avatar: 

- The manually controlled avatar (`<ManualAvatarDisplay/>`) requires developers to directly use the `avatarController.speak()` command, giving full control over the avatar's speech.

- The conversational avatar (`<ConversationalAvatarDisplay />`) interacts with the AvatarService backend LLM. Developers can adjust the LLM that powers the avatar's speech through the conversation state via .setSystemMessage() and .setConversationHistory() but have no direct control over the avatar's speech output.

### Instructions for Choosing `<ManualAvatarDisplay/>`vs `<ConversationalAvatarDisplay/>`

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

## Required Manual Control Setup

### Basic Setup of Manual Controller & Display:
- **Required `ManualAvatarController()`** initilized using `useState`.  

- **Required `<ManualAvatarDisplay/>`**: Pass the avatar controller to the AvatarDisplay component as a prop.

```tsx
import { ManualAvatarController, ManualAvatarDisplay } from 'alpha-ai-avatar-sk-react';
const App = () => {
    // note: DO NOT USE `setAvatarController`, you must instantiate it here.
    const [avatarController, setAvatarController] = useState(new ManualAvatarController({apiKey: 'XX_AVATAR_API_KEY_XX'}));


    // ... application code  ...
    
    return (
            // .. UI components ..
        <ManualAvatarDisplay
            avatarController={avatarController}
            /* All other props are OPTIONAL, start simple and add customization as needed */
        />
        // .. UI components ..
    )
```

## Required Conversational Mode Setup

### Basic Setup of Conversational Controller & Display:
- **Required `ConversationalAvatarController()`** initilized using `useState`.  

- **Required `<ConversationalAvatar/>`**: Pass the avatar controller to the <ConversationalAvatar /> component as a prop.
```tsx
import { ConversationalAvatarController, ConversationalAvatarDisplay } from 'alpha-ai-avatar-sk-react';
const App = () => {

    // note: DO NOT USE `setAvatarController`, you must instantiate ManualAvatarController with useState for it to work properly
    const [avatarController, setAvatarController] =  useState(new ConversationalAvatarController({
        apiKey: 'XX_AVATAR_API_KEY_XX',
        initialPrompt: [
            {
                role: 'system',
                content: 'Act like Albert Einstein',
            },
        ],
    }));

    // ... application code  ...
    
    return (
            // .. UI components ..
        <ConversationalAvatarDisplay
            avatarController={avatarController}
            /* All other props are OPTIONAL, start simple and add customization as needed */
        />
        // .. UI components ..
    )
```

# Controller & Display Properties

## Avatar Controller 

### Initialization Configurations

```tsx
interface BaseControllerConfig {
   apiKey: string;
}

// new ManualAvatarController(config: ManualAvatarConfig);
interface ManualAvatarConfig extends BaseControllerConfig { }

// new ConversationalAvatarController(config: ConversationControllerConfig);
interface ConversationControllerConfig extends BaseControllerConfig {
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

interface ConversationalAvatarDisplayProps extends BaseAvatarDisplayProps { }
interface ManualAvatarDisplayProps extends BaseAvatarDisplayProps { }

```

### Using GPT Api for Content Generation

**DO NOT REQUEST JSON FORMAT, OR ANY FORMAT THAT REQUIRES PARSING. USE PLAIN TEXT RESPONSES ONLY.**

```tsx
// copy this function exactly, use when needed for content generation
const getGptApiResponse = async (promptRules: string, promptRequest: string) => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer XX_OPENAI_API_KEY_XX' },
        body: JSON.stringify({
            model: "gpt-4o", // USE THIS MODEL ID EXACTLY (gpt-4o)
            messages: [
            { role: "system", content: promptRules }
            { role: "user", content: promptRequest },
        ]})
    });

    const data = await response.json();
    return data.choices[0].message.content.trim()
};
```