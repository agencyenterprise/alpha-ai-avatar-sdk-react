import { Room, RoomEvent } from 'livekit-client';
import { ReactNode, createContext, useState } from 'react';
import {
  AvatarClient,
  MessageState,
  MessageType,
} from 'alpha-ai-avatar-sdk-js';
import {
  ParsedMessage,
  Prompt,
  TranscriberStatus,
} from 'alpha-ai-avatar-sdk-js';
import { ChatMessage } from '../core/types';

type SayOptions = {
  voiceName?: string;
  voiceStyle?: string;
  multilingualLang?: string;
  prosody?: {
    contour?: string;
    pitch?: string;
    range?: string;
    rate?: string;
    volume?: string;
  };
  ssmlVoiceConfig?: string; // Beta
};

export type AvatarContextType = {
  client: AvatarClient;
  room?: Room;
  messages: ChatMessage[];
  isConnected: boolean;
  isAvatarSpeaking: boolean;
  transcriberStatus: TranscriberStatus;
  connect: (
    avatarId?: number,
    conversational?: boolean,
    initialPrompt?: Prompt[],
  ) => Promise<void>;
  say: (message: string, options?: SayOptions) => Promise<void>;
  stop: () => Promise<void>;
  switchAvatar: (avatarId: number) => Promise<void>;
  enableMicrophone: () => Promise<void>;
  disableMicrophone: () => Promise<void>;
  clearMessages: () => void;
  disconnect: () => Promise<void>;
};

const AvatarContext = createContext<AvatarContextType>({
  client: new AvatarClient({ apiKey: '' }),
  room: undefined,
  messages: [],
  isConnected: false,
  isAvatarSpeaking: false,
  transcriberStatus: TranscriberStatus.Closed,
  connect: () => Promise.resolve(),
  say: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  switchAvatar: () => Promise.resolve(),
  enableMicrophone: () => Promise.resolve(),
  disableMicrophone: () => Promise.resolve(),
  clearMessages: () => {},
  disconnect: () => Promise.resolve(),
});

type AvatarProviderProps = {
  children: ReactNode;
  client: AvatarClient;
};

function AvatarProvider({ children, client }: AvatarProviderProps) {
  const [room, setRoom] = useState<Room>();
  const [isConnected, setIsConnected] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [transcriberStatus, setTranscriberStatus] = useState<TranscriberStatus>(
    TranscriberStatus.Closed,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  function handleDataReceived(data: Uint8Array) {
    const message: ParsedMessage = JSON.parse(new TextDecoder().decode(data));

    switch (message.type) {
      case MessageType.State:
        setIsAvatarSpeaking(message.data.state === MessageState.Speaking);
        break;
      case MessageType.Transcript:
        onTranscriptionHandler(message.data);
        break;
      case MessageType.TranscriberState:
        setTranscriberStatus(message.data.status);
        break;
      case MessageType.Error:
        throw new Error('Error from server');
    }
  }

  async function connect(avatarId?: number) {
    if (room && room.state !== 'disconnected') {
      return;
    }

    const newRoom = await client.connect(avatarId);

    newRoom
      .on(RoomEvent.Connected, () => {
        setIsConnected(true);
      })
      .on(RoomEvent.DataReceived, handleDataReceived)
      .on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
      });

    setRoom(newRoom);
  }

  async function sendMessage(message: any) {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(message));
    await room?.localParticipant?.publishData(data, { reliable: true });
  }

  async function say(message: string, options?: SayOptions) {
    await sendMessage({ message, ...options });
  }

  async function stop() {
    await sendMessage({ message: '', avatarAction: 1 });
  }

  async function switchAvatar(avatarId: number) {
    await disconnect();
    await connect(avatarId);
  }

  async function enableMicrophone() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (isConnected) {
        room?.localParticipant?.setMicrophoneEnabled(true);
      }
    } catch (error) {
      console.error('Error enabling conversational mode:', error);
    }
  }

  async function disableMicrophone() {
    if (isConnected) {
      room?.localParticipant?.setMicrophoneEnabled(false);
    }
  }

  function onTranscriptionHandler({
    role,
    message,
    isFinal,
  }: {
    role: string;
    message: string;
    isFinal: boolean;
  }) {
    setMessages((prevMessages) => {
      const lastIndex = prevMessages.length - 1;
      const lastMessage = prevMessages[lastIndex];

      if (role === lastMessage?.role) {
        prevMessages = prevMessages.slice(0, lastIndex);

        if (role === 'assistant' && !isFinal) {
          message = lastMessage.content + message;
        }
      }

      return [
        ...prevMessages,
        {
          role,
          content: message,
          isFinal,
        },
      ];
    });
  }

  function clearMessages() {
    setMessages([]);
  }

  async function disconnect() {
    await room?.disconnect();
    setRoom(undefined);
  }

  return (
    <AvatarContext.Provider
      value={{
        client,
        room,
        messages,
        isConnected,
        isAvatarSpeaking,
        transcriberStatus,
        connect,
        say,
        stop,
        switchAvatar,
        enableMicrophone,
        disableMicrophone,
        clearMessages,
        disconnect,
      }}>
      {children}
    </AvatarContext.Provider>
  );
}

export { AvatarContext, AvatarProvider };
