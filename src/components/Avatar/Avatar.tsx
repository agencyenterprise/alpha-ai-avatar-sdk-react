import { useRef } from "react";
import { useAvatarClient } from "../../hooks/useAvatarClient";
import { useLiveKitRoom } from "../../hooks/useLiveKitRoom";

export type AvatarProps = {
  style?: React.CSSProperties;
};

export const Avatar = ({ style, ...rest }: AvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const avatarClient = useAvatarClient();
  useLiveKitRoom({
    videoRef,
    audioRef,
    room: avatarClient.room,
  });

  return (
    <div {...rest}>
      <video ref={videoRef} style={style} autoPlay playsInline muted />
      <audio ref={audioRef} className="hidden" autoPlay playsInline muted />
    </div>
  );
};
