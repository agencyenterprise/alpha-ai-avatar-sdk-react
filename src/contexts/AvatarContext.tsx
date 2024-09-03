import { Room, RoomEvent } from 'livekit-client';
import { ReactNode, createContext, useState } from 'react';
import { AvatarClient } from 'alpha-ai-avatar-sdk-js';

enum MessageState {
  Idle = 0,
  Loading = 1,
  Speaking = 2,
  Active = 3,
}

enum MessageType {
  Transcript = 0,
  State = 1,
  Error = 2,
}

type Message = {
  data: {
    message: string;
    state: MessageState;
  };
  type: MessageType;
};

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
  isConnected: boolean;
  isAvatarSpeaking: boolean;
  connect: (avatarId?: number) => Promise<void>;
  say: (message: string, options?: SayOptions) => Promise<void>;
  stop: () => Promise<void>;
  switchAvatar: (avatarId: number) => Promise<void>;
  disconnect: () => Promise<void>;
};

const AvatarContext = createContext<AvatarContextType>({
  client: new AvatarClient({ apiKey: '' }),
  room: undefined,
  isConnected: false,
  isAvatarSpeaking: false,
  connect: () => Promise.resolve(),
  say: () => Promise.resolve(),
  stop: () => Promise.resolve(),
  switchAvatar: () => Promise.resolve(),
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

  function handleDataReceived(data: Uint8Array) {
    const parsedMessage: Message = JSON.parse(new TextDecoder().decode(data));

    if (parsedMessage.type === MessageType.State) {
      if (parsedMessage.data.state === MessageState.Speaking) {
        setIsAvatarSpeaking(true);
      } else {
        setIsAvatarSpeaking(false);
      }
    }

    if (parsedMessage.type === MessageType.Error) {
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

  async function disconnect() {
    await room?.disconnect();
    setRoom(undefined);
  }

  return (
    <AvatarContext.Provider
      value={{
        client,
        room,
        isConnected,
        isAvatarSpeaking,
        connect,
        say,
        stop,
        switchAvatar,
        disconnect,
      }}>
      {children}
    </AvatarContext.Provider>
  );
}

export { AvatarContext, AvatarProvider };
