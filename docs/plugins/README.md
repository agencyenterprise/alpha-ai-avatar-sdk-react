# Plugins

## Speach to Text (STT)

Converts spoken language into written text. It enables applications to transcribe audio input in real-time or from recordings, facilitating voice commands, transcription, and accessibility features.

### Azure

[Azure Speech-to-Text (STT)](https://azure.microsoft.com/en-us/products/ai-services/speech-to-text) documentation.

#### Usage

1. **Import the Plugin**

   To use the Azure Speech-to-Text plugin, start by importing it:

   ```javascript
   import { useAzureSpeechRecognition } from 'alpha-ai-avatar-sdk-react/plugins/stt/azure';
   ```

2. **Configure the Plugin**

   Use the plugin by initializing it with your Azure subscription key and service region. Define a callback function to handle the recognized speech:

   ```javascript
   const { startRecognizing, stopRecognizing } = useAzureSpeechRecognition({
     subscriptionKey: 'AZURE_SUBSCRIPTION_KEY',
     serviceRegion: 'SERVICE_REGION', // e.g., 'westus', 'eastus'
     onSpeechRecognized: (transcript) => {
       console.log(transcript);
       say(transcript);
     },
   });
   ```

3. **Example**

   For a complete example, refer to our [Azure Speech-to-Text plugin example](/examples/stt-azure-plugin).

### Deepgram

[Deepgram Speech-to-Text (STT)](https://developers.deepgram.com/docs/getting-started-with-live-streaming-audio) documentation.

#### Usage

1. **Import the Plugin**

   To use the Deepgram Speech-to-Text plugin, start by importing it:

   ```javascript
   import { useDeepgramSpeechRecognition } from 'alpha-ai-avatar-sdk-react/plugins/stt/deepgram';
   ```

2. **Configure the Plugin**

   Use the plugin by initializing it with your Deepgram API Key. Define a callback function to handle the recognized speech:

   ```javascript
   const { startRecognizing, stopRecognizing } = useDeepgramSpeechRecognition({
     apiKey: 'API_KEY',
     onSpeechRecognized: (transcript) => {
       console.log(transcript);
       say(transcript);
     },
     deepgramOptions: {}, // Optional
   });
   ```

3. **Example**

   For a complete example, refer to our [Deepgram Speech-to-Text plugin example](/examples/stt-deepgram-plugin).
