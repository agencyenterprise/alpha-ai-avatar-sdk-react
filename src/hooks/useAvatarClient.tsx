import { useState } from 'react';
import { useAvatarContext } from '../contexts/AvatarContext';
import { Room, RoomEvent } from 'livekit-client';

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

type ParsedMessage = {
  data: {
    message: string;
    state: MessageState;
  };
  type: MessageType;
};

type SendMessageOptions = {
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

const encoder = new TextEncoder();

export const useAvatarClient = () => {
  const context = useAvatarContext();

  const [isConnected, setIsConnected] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

  const room = context.room;
  const token = context.token;
  const client = context.client;
  const serverUrl = context.serverUrl;

  const handleDataReceived = (data: Uint8Array) => {
    const parsedMessage: ParsedMessage = JSON.parse(
      new TextDecoder().decode(data),
    );

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
  };

  const sendMessage = (message: string, options?: SendMessageOptions) => {
    const data = encoder.encode(JSON.stringify({ message, ...options }));
    room?.localParticipant?.publishData(data, { reliable: true });
  };

  const stop = () => {
    const data = encoder.encode(
      JSON.stringify({ message: '', avatarAction: 1 }),
    );
    room?.localParticipant?.publishData(data, { reliable: true });
  };

  const switchAvatar = (avatarId: number) => {
    disconnect();
    context.client.connect(avatarId).then((data) => {
      const token = data.token;
      const serverUrl = data.serverUrl;

      const room = new Room({
        adaptiveStream: true,
      });
      room.connect(serverUrl, token).then(() => {
        context.updateRoom(room);
      });
    });
  };

  const disconnect = () => {
    setIsConnected(false);
    room?.disconnect();
  };

  room
    ?.on(RoomEvent.Connected, () => {
      setIsConnected(true);
    })
    .on(RoomEvent.DataReceived, handleDataReceived)
    .on(RoomEvent.Disconnected, () => {
      setIsConnected(false);
    });

  return {
    room,
    client,
    token,
    serverUrl,
    isConnected,
    isAvatarSpeaking,
    sendMessage,
    stop,
    switchAvatar,
    disconnect,
  };
};
