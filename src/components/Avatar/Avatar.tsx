import { useRef } from 'react';
import { useAvatarClient } from '../../hooks/useAvatarClient';
import { useLiveKitRoom } from '../../hooks/useLiveKitRoom';

export type AvatarProps = React.ComponentPropsWithoutRef<'video'>;

export function Avatar(rest: AvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { room } = useAvatarClient();

  useLiveKitRoom({
    videoRef,
    audioRef,
    room,
  });

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted {...rest} />
      <audio ref={audioRef} className='hidden' autoPlay playsInline muted />
    </>
  );
};
