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
    <div className={className}>
      <div className='aspect-square w-full relative'>
        <video
          ref={videoRef}
          height={height}
          width={width}
          autoPlay
          playsInline
          muted
          className='absolute inset-0 w-full object-cover bg-gray-200'
        />
      </div>
      <audio muted ref={audioRef} style={{ display: 'none' }} autoPlay />
    </div>
  );
}
