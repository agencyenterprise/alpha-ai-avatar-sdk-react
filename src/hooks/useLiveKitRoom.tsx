import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Room, RoomEvent, Track } from "livekit-client";

import type { ConnectionQuality, RemoteTrack } from "livekit-client";

const encoder = new TextEncoder();

export type UseLiveKitRoomOptions = {
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef?: React.RefObject<HTMLAudioElement>;
  token: string;
  serverUrl: string;
  onSpeechRecognized?: (transcript: string) => void;
};

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

export function useLiveKitRoom({
  videoRef,
  audioRef,
  token,
  serverUrl,
  onSpeechRecognized,
}: UseLiveKitRoomOptions) {
  const callbackRef = useRef(onSpeechRecognized);

  useLayoutEffect(() => {
    callbackRef.current = onSpeechRecognized;
  });

  const roomRef = useRef<Room>();

  const [isConnected, setIsConnected] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [canPlaybackAudio, setCanPlaybackAudio] = useState(true);
  const [connectionQuality, setConnectionQuality] =
    useState<ConnectionQuality>();

  useEffect(() => {
    if (roomRef.current) {
      return;
    }

    const room = new Room({
      adaptiveStream: true,
    });

    room.prepareConnection(serverUrl, token);
    roomRef.current = room;

    function handleTrackSubscribed(track: RemoteTrack) {
      if (track.kind === Track.Kind.Video) {
        track.attach(videoRef.current!);
      } else if (
        audioRef &&
        track.kind === Track.Kind.Audio &&
        room.canPlaybackAudio
      ) {
        track.attach(audioRef.current!);
      }
    }

    function handleTrackUnsubscribed(track: RemoteTrack) {
      track.detach();
    }

    function handleAudioPlaybackStatusChanged() {
      setCanPlaybackAudio(room.canPlaybackAudio);
    }

    function handleDataReceived(data: Uint8Array) {
      const parsedMessage: ParsedMessage = JSON.parse(
        new TextDecoder().decode(data)
      );
      const message = parsedMessage.data.message;

      if (parsedMessage.type === MessageType.State) {
        if (parsedMessage.data.state === MessageState.Speaking) {
          setIsAvatarSpeaking(true);
        } else {
          setIsAvatarSpeaking(false);
        }
      }

      if (parsedMessage.type === MessageType.Error) {
        console.error("Error from server", message);
      }

      if (
        parsedMessage.type === MessageType.Transcript &&
        callbackRef.current
      ) {
        callbackRef.current(message);
      }
    }

    room
      .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
      .on(
        RoomEvent.AudioPlaybackStatusChanged,
        handleAudioPlaybackStatusChanged
      )
      .on(RoomEvent.DataReceived, handleDataReceived)
      .on(RoomEvent.Connected, () => {
        console.log("connected to room");
        setIsConnected(true);
      })
      .on(RoomEvent.LocalTrackUnpublished, (track) => {
        console.log("local track unpublished", track);
      })
      .on(RoomEvent.MediaDevicesError, (error) => {
        console.error("media devices error", error);
      })
      .on(RoomEvent.ConnectionStateChanged, (state) => {
        console.log("connection state changed", state);
      })
      .on(RoomEvent.Reconnecting, () => {
        console.log("reconnecting...");
      })
      .on(RoomEvent.ConnectionQualityChanged, (connectionQuality) => {
        setConnectionQuality(connectionQuality);
      });

    console.log("connecting to room...");
    room.connect(serverUrl, token);
  }, [audioRef, serverUrl, token, videoRef]);

  function handleConfirmAudioPlayback() {
    roomRef.current?.startAudio();
  }

  const say = useCallback((message: string) => {
    const data = encoder.encode(JSON.stringify({ message }));
    roomRef.current?.localParticipant?.publishData(data, { reliable: true });
  }, []);

  const stop = useCallback(() => {
    const data = encoder.encode(
      JSON.stringify({ message: "", avatarAction: 1 })
    );
    roomRef.current?.localParticipant?.publishData(data, { reliable: true });
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    roomRef.current?.disconnect();
    roomRef.current = undefined;
  }, []);

  return {
    isConnected,
    isAvatarSpeaking,
    room: roomRef.current,
    canPlaybackAudio,
    connectionQuality,
    handleConfirmAudioPlayback,
    say,
    stop,
    disconnect,
  };
}
