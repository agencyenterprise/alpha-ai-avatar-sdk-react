import React, { useState, useEffect, useRef } from 'react';
import {
  ConversationalAvatarController,
  ConversationalAvatarDisplay,
} from 'alpha-ai-avatar-sdk-react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

interface ChatWithAvatarProps {
  apiKey?: string;
  initialPrompt?: { role: string; content: string }[];
  height?: number;
  width?: number;
}

export const App: React.FC<ChatWithAvatarProps> = ({
  apiKey = 's76hu0jzWThfnscn',
  initialPrompt = [{ role: 'system', content: 'Act like Albert Einstein' }],
  height = 400,
  width = 600,
}) => {
  const [avatarController, setAvatarController] =
    useState<ConversationalAvatarController | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new ConversationalAvatarController({
      apiKey,
      initialPrompt,
    });
    setAvatarController(controller);

    return () => {
      controller.stopSpeaking();
    };
  }, [apiKey, initialPrompt]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim() && avatarController) {
      setTranscript((prev) => [...prev, `You: ${userInput}`]);
      setUserInput('');
      // In a real implementation, you would send this input to the avatar for processing
      // This is just a placeholder to simulate a response
      setTimeout(() => {
        setTranscript((prev) => [
          ...prev,
          `Avatar: This is a simulated response to "${userInput}"`,
        ]);
      }, 1000);
    }
  };

  const toggleMicrophone = () => {
    if (avatarController) {
      avatarController.setMicrophoneMute(!isMicMuted);
      setIsMicMuted(!isMicMuted);
    }
  };

  const handleChatTranscriptUpdate = (message: any) => {
    console.log(message);
    if (message.type === 0 && message.data.isFinal) {
      setTranscript((prev) => [
        ...prev,
        `${message.data.role}: ${message.data.message}`,
      ]);
    }
  };

  return (
    <Paper className='p-4 max-w-2xl mx-auto'>
      <Box className='mb-4'>
        {avatarController && (
          <ConversationalAvatarDisplay
            avatarController={avatarController}
            height={height}
            width={width}
            onChatTranscriptUpdate={handleChatTranscriptUpdate}
            className='mx-auto'
          />
        )}
      </Box>
      <Paper
        ref={transcriptRef}
        className='h-60 overflow-y-auto p-4 mb-4'
        elevation={3}>
        {transcript.map((message, index) => (
          <Typography key={index} className='mb-2'>
            {message}
          </Typography>
        ))}
      </Paper>
      <Box className='flex items-center'>
        <TextField
          fullWidth
          variant='outlined'
          value={userInput}
          onChange={handleUserInput}
          placeholder='Type your message here...'
          className='mr-2'
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleSendMessage}
          className='mr-2'>
          Send
        </Button>
        <Button
          variant='contained'
          color={isMicMuted ? 'secondary' : 'primary'}
          onClick={toggleMicrophone}>
          {isMicMuted ? <MicOffIcon /> : <MicIcon />}
        </Button>
      </Box>
    </Paper>
  );
};
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
