import { useWebAvatar } from '../../hooks/useWebAvatar';

export type AvatarProps = React.ComponentPropsWithoutRef<'video'>;

export function Avatar(rest: AvatarProps) {
  const { videoRef, audioRef } = useWebAvatar();

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted {...rest} />
      <audio ref={audioRef} style={{ display: 'none' }} autoPlay muted />
    </>
  );
}
