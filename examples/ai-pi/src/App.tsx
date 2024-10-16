import React, { useState, useEffect } from 'react';
import { ConversationalAvatarController, ConversationalAvatarDisplay } from 'alpha-ai-avatar-sdk-react';
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

interface ChatMessage {
  text: string;
  speaker: 'assistant' | 'user';
}

interface AlphaAISampleChatAppProps {
  apiKey?: string;
}

const AlphaAISampleChatApp: React.FC<AlphaAISampleChatAppProps> = ({ apiKey = 'YOUR_API_KEY' }) => {
  const [chatTranscript, setChatTranscript] = useState<ChatMessage[]>([]);
  const [isMicrophoneMuted, setIsMicrophoneMuted] = useState(false);

  const avatarController = new ConversationalAvatarController({
    apiKey,
    initialConversationConfig: {
      systemMessage: 'You are a helpful AI assistant.',
      conversationHistory: [],
    },
  });

  useEffect(() => {
    // Clean up the controller when the component unmounts
    return () => {
      avatarController.stopSpeaking();
    };
  }, []);

  const handleChatTranscriptUpdate = (
    updatedChunk: { chunkString: string; speaker: 'assistant' | 'user' },
    fullTranscript: ChatMessage[]
  ) => {
    setChatTranscript(fullTranscript);
  };

  const toggleMicrophone = () => {
    const newMuteState = !isMicrophoneMuted;
    setIsMicrophoneMuted(newMuteState);
    avatarController.setMicrophoneMute(newMuteState);
  };

  return (
    <Box className="flex flex-col md:flex-row h-screen p-4 bg-gray-100">
      <Box className="w-full md:w-1/2 mb-4 md:mb-0 md:pr-4">
        <Paper elevation={3} className="h-full flex items-center justify-center">
          <ConversationalAvatarDisplay
            avatarController={avatarController}
            height={400}
            width={400}
            onChatTranscriptUpdate={handleChatTranscriptUpdate}
          />
        </Paper>
      </Box>
      <Box className="w-full md:w-1/2">
        <Paper elevation={3} className="h-full p-4 flex flex-col">
          <Typography variant="h5" className="mb-4">
            Chat Transcript
          </Typography>
          <List className="flex-grow overflow-auto">
            {chatTranscript.map((message, index) => (
              <ListItem key={index} className={`mb-2 ${message.speaker === 'user' ? 'justify-end' : ''}`}>
                <Paper
                  elevation={1}
                  className={`p-2 max-w-3/4 ${
                    message.speaker === 'user' ? 'bg-blue-100' : 'bg-green-100'
                  }`}
                >
                  <ListItemText primary={message.text} />
                </Paper>
              </ListItem>
            ))}
          </List>
          <Box className="mt-4 flex justify-center">
            <IconButton onClick={toggleMicrophone} color={isMicrophoneMuted ? 'default' : 'primary'}>
              {isMicrophoneMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AlphaAISampleChatApp;

// import {
//   ConversationalAvatarController,
//   ConversationalAvatarDisplay,
// } from 'alpha-ai-avatar-sdk-react';

// const avatarController = new ConversationalAvatarController({
//   apiKey: 's76hu0jzWThfnscn',
//   initialPrompt: [
//     {
//       role: 'system',
//       content: 'Act like Albert Einstein',
//     },
//   ],
// });

// export function App() {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         flexDirection: 'column',
//         color: 'black',
//         gap: '20px',
//       }}>
//       <p>conversational mode example</p>
//       <ConversationalAvatarDisplay avatarController={avatarController} />
//     </div>
//   );
// }
