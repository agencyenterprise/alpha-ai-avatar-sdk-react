import { useRef } from "react";
import { useAvatarClient } from "../../hooks/useAvatarClient";
import { useLiveKitRoom } from "../../hooks/useLiveKitRoom";

export type AvatarProps = {
  token: string;
  serverUrl: string;
};

export const AvatarComponent = ({}: AvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const avatarClient = useAvatarClient();
  useLiveKitRoom({
    videoRef,
    audioRef,
    token: avatarClient.token,
    serverUrl: avatarClient.serverUrl,
  });

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <audio ref={audioRef} className="hidden" autoPlay playsInline muted />
    </div>
  );
};
