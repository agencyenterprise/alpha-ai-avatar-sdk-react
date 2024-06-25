import { useState } from "react";
import { useAvatarContext } from "../context/AvatarContext";
import { Room, RoomEvent } from "livekit-client";

const encoder = new TextEncoder();

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

export const useAvatarClient = () => {
  const context = useAvatarContext();

  const [isConnected, setIsConnected] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);

  const room = context.room;
  const token = context.token;
  const serverUrl = context.serverUrl;

  const handleDataReceived = (data: Uint8Array) => {
    const parsedMessage: ParsedMessage = JSON.parse(
      new TextDecoder().decode(data)
    );

    if (parsedMessage.type === MessageType.State) {
      if (parsedMessage.data.state === MessageState.Speaking) {
        setIsAvatarSpeaking(true);
      } else {
        setIsAvatarSpeaking(false);
      }
    }

    if (parsedMessage.type === MessageType.Error) {
      throw new Error("Error from server");
    }
  };

  const say = (message: string) => {
    const data = encoder.encode(JSON.stringify({ message }));
    room?.localParticipant?.publishData(data, { reliable: true });
  };

  const stop = () => {
    const data = encoder.encode(
      JSON.stringify({ message: "", avatarAction: 1 })
    );
    room?.localParticipant?.publishData(data, { reliable: true });
  };

  const getAvatars = () => {
    return context.client.getAvatars();
  };

  const disconnect = () => {
    setIsConnected(false);
    room?.disconnect();
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

  room
    ?.on(RoomEvent.Connected, () => {
      setIsConnected(true);
    })
    .on(RoomEvent.DataReceived, handleDataReceived);

  return {
    room,
    token,
    serverUrl,
    isConnected,
    isAvatarSpeaking,
    say,
    stop,
    getAvatars,
    switchAvatar,
    disconnect,
  };
};
