import { ManualAvatarController } from '../../../core/ai-pi/ManualAvatarController';
import { useEffect, useRef } from 'react';

export interface ManualAvatarDisplayProps {
  avatarController: ManualAvatarController;
  width?: number;
  height?: number;
  className?: string;
}

export function ManualAvatarDisplay({
  avatarController,
  width = 512,
  height = 512,
  className,
}: ManualAvatarDisplayProps) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !audioRef.current) {
      return;
    }

    avatarController.connect(videoRef.current, audioRef.current);

    return () => {
      avatarController.disconnect();
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={className}
        style={{
          width,
          height,
        }}
      />
      <audio muted ref={audioRef} style={{ display: 'none' }} autoPlay />
    </>
  );
}
