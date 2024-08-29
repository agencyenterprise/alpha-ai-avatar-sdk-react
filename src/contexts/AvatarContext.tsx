import { Room, RoomEvent } from 'livekit-client';
import { ReactNode, createContext, useState } from 'react';
import { AvatarClient } from '../core/AvatarClient';
import {
  MessageState,
  MessageType,
  ParsedMessage,
  Prompt,
  TranscriberMessage,
} from '../core/types';
import { EventEmitter } from 'events';

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
  messages: TranscriberMessage[];
  isConnected: boolean;
  isAvatarSpeaking: boolean;
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
  addEventListener: (
    eventName: string,
    listener: (...args: any[]) => void,
  ) => void;
  removeEventListener: (
    eventName: string,
    listener: (...args: any[]) => void,
  ) => void;
  disconnect: () => Promise<void>;
};

const AvatarContext = createContext<AvatarContextType>({
  client: new AvatarClient({ apiKey: '' }),
  room: undefined,
  messages: [],
  isConnected: false,
  isAvatarSpeaking: false,
  connect: () => Promise.resolve(),
  say: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  switchAvatar: () => Promise.resolve(),
  enableMicrophone: () => Promise.resolve(),
  disableMicrophone: () => Promise.resolve(),
  addEventListener: () => {},
  removeEventListener: () => {},
  disconnect: () => Promise.resolve(),
});

type AvatarProviderProps = {
  children: ReactNode;
  client: AvatarClient;
};

function AvatarProvider({ children, client }: AvatarProviderProps) {
  const eventEmitter: EventEmitter = new EventEmitter();

  const [room, setRoom] = useState<Room>();
  const [isConnected, setIsConnected] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [messages, setMessages] = useState<TranscriberMessage[]>([]);

  function handleDataReceived(data: Uint8Array) {
    const message: ParsedMessage = JSON.parse(new TextDecoder().decode(data));

    if (message.type === MessageType.State) {
      if (message.data.state === MessageState.Speaking) {
        setIsAvatarSpeaking(true);
      } else {
        setIsAvatarSpeaking(false);
      }
    }

    if (message.type === MessageType.Transcript) {
      onTranscriptionHandler(message.data);
      eventEmitter.emit('transcription', message.data);
    }

    if (message.type === MessageType.TranscriberState) {
      eventEmitter.emit('transcriberStatusChange', message.data.status);
    }

    if (message.type === MessageType.Error) {
      throw new Error('Error from server');
    }
  }

  async function connect(
    avatarId?: number,
    conversational?: boolean,
    initialPrompt?: any,
  ) {
    if (room && room.state !== 'disconnected') {
      return;
    }

    const newRoom = new Room({ adaptiveStream: true });

    newRoom
      .on(RoomEvent.Connected, () => {
        setIsConnected(true);
        console.log('Connected to room');
      })
      .on(RoomEvent.DataReceived, handleDataReceived)
      .on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
      });

    setRoom(newRoom);

    const { token, serverUrl } = await client.connect(
      avatarId,
      conversational,
      initialPrompt,
    );

    await newRoom.connect(serverUrl, token);
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

  function addEventListener(
    eventName: string,
    listener: (...args: any[]) => void,
  ) {
    eventEmitter.on(eventName, listener);
  }

  function removeEventListener(
    eventName: string,
    listener: (...args: any[]) => void,
  ) {
    eventEmitter.off(eventName, listener);
  }

  async function disconnect() {
    await room?.disconnect();
    setRoom(undefined);
  }

  const onTranscriptionHandler = ({
    role,
    message,
    isFinal,
  }: {
    role: string;
    message: string;
    isFinal: boolean;
  }) => {
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
  };

  return (
    <AvatarContext.Provider
      value={{
        client,
        room,
        messages,
        isConnected,
        isAvatarSpeaking,
        connect,
        say,
        stop,
        switchAvatar,
        enableMicrophone,
        disableMicrophone,
        addEventListener,
        removeEventListener,
        disconnect,
      }}>
      {children}
    </AvatarContext.Provider>
  );
}

export { AvatarContext, AvatarProvider };
