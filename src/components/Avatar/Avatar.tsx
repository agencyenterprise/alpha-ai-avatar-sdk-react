import { useWebAvatar } from '../../hooks/useWebAvatar';

export type AvatarProps = React.ComponentPropsWithoutRef<'video'>;

export function Avatar(props: AvatarProps) {
  const { videoRef, audioRef } = useWebAvatar();

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted {...props} />
      <audio ref={audioRef} style={{ display: 'none' }} autoPlay muted />
    </>
  );
}
