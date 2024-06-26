# Avatar SDK Functions Documentation

This documentation aims to provide a clear structure for users to easily understand and implement the Avatar SDK functionalities.

## Avatar Client

### Initialization

To create an instance of the `AvatarClient`, use the following code:

```javascript
const client = new AvatarClient({
  apiKey: 'YOUR_API_KEY', // Required: Your API key for authentication.
  baseUrl: 'https://staging.avatar.alpha.school', // Optional: Customize base URL for staging (default is the production URL).
  avatarId: 1, // Optional: Pre-select an avatar by ID.
});
```

### Configuration Options

- **`apiKey`** (required): Your API key for authentication.
- **`baseUrl`** (optional): URL for the staging environment. Defaults to the production URL.
- **`avatarId`** (optional): ID of the avatar to initialize.

## Avatar Component

To display an avatar, use the `Avatar` component:

```javascript
<Avatar style={{ borderRadius: '20px', width: 250, height: 250 }} />
```

### Available Options

- **`style`** (optional): Custom styles for the avatar video component.

## Avatar Client Hook

### Usage

The `useAvatarClient` hook provides access to various client functionalities:

```javascript
const client = useAvatarClient();
```

### Properties and Methods

- **`room`**: Instance of the LiveKit room. Provides access to room callbacks.
- **`client`**: Core API for available routes.

  - **`connect`**: Connect to the room.
  - **`getAvatars`**: Retrieve all avatars available to your API Key.
  - **`getSupportedVoices`**: Retrieve all supported voices in English from Azure.

    ```javascript
    client.client.getSupportedVoices().then((voices) => {
      console.log(voices);
    });
    ```

- **`token`**: Token generated for your room.
- **`serverUrl`**: Server URL generated for your room.
- **`isConnected`**: Boolean indicating if the avatar is connected.
- **`isAvatarSpeaking`**: Boolean indicating if the avatar is speaking.
- **`sendMessage`**: Sends a message for the avatar to say with various options:

  - **`voiceName`**: Specify the voice name.
  - **`voiceStyle`**: Specify the voice style.

    ```javascript
    client.sendMessage('Hello, World!', {
      voiceName: 'en-US-DavisNeural',
      voiceStyle: 'angry',
    });
    ```

  - **`multilingualLang`**: To use a language other than English, ensure the `voiceName` supports multilingual and specify the language.

    ```javascript
    client.sendMessage('Hello, World!', {
      voiceName: 'en-US-AndrewMultilingualNeural',
      multilingualLang: 'es-ES',
    });
    ```

  - **`prosody`**: Configure pitch, contour, range, rate, and volume for text-to-speech output. Refer to [Azure documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice#adjust-prosody) for possible values.

    ```javascript
    client.sendMessage('Hello, World!', {
      voiceName: 'en-US-AndrewMultilingualNeural',
      prosody: {
        contour: '(0%, 20Hz) (10%,-2st) (40%, 10Hz)',
        pitch: 'high',
        range: '50%',
        rate: 'x-fast',
        volume: 'loud',
      },
    });
    ```

  - **`ssmlVoiceConfig`**: Allows for comprehensive SSML `voice` element configuration, including math, pauses, and silence.

    ```javascript
    client.sendMessage('', {
      multilingualLang: 'en-US',
      ssmlVoiceConfig:
        "<voice name='en-US-AndrewMultilingualNeural'><mstts:express-as style='angry'><mstts:viseme type='FacialExpression'>Hello, World!</mstts:viseme></mstts:express-as></voice>",
    });
    ```

- **`stop`**: Interrupts the avatar from speaking.

  ```javascript
  client.stop();
  ```

- **`switchAvatar`**: Switch to a different avatar available to your API Key.

  ```javascript
  client.switchAvatar(2);
  ```

- **`disconnect`**: Disconnect the avatar.
