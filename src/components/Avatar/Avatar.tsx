import { useWebAvatar } from '../../hooks/useWebAvatar';

export type AvatarProps = React.ComponentPropsWithoutRef<'video'>;

export function Avatar(props: AvatarProps) {
  const { videoRef, audioRef } = useWebAvatar();

  return (
    <>
      <video
        data-testid='avatar-video'
        ref={videoRef}
        autoPlay
        playsInline
        muted
        {...props}
      />
      <audio
        data-testid='avatar-audio'
        ref={audioRef}
        style={{ display: 'none' }}
        autoPlay
        muted
      />
    </>
  );
}
