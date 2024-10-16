import { ManualAvatarController } from '../../../core/ai-pi/ManualAvatarController';
import { ConversationalAvatarController } from '../../../core/ai-pi/ConversationalAvatarController';
import { ParsedMessage } from 'alpha-ai-avatar-sdk-js';
import { useEffect, useRef } from 'react';

export interface ConversationalAvatarDisplayProps {
  avatarController: ManualAvatarController | ConversationalAvatarController;
  width?: number;
  height?: number;
  className?: string;
  onChatTranscriptUpdate?: (message: ParsedMessage) => void;
}

export function ConversationalAvatarDisplay({
  avatarController,
  width = 512,
  height = 512,
  className,
  onChatTranscriptUpdate = () => {},
}: ConversationalAvatarDisplayProps) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !audioRef.current) {
      return;
    }

    avatarController.connect(videoRef.current, audioRef.current);
    avatarController.avatarClient.addEventListener(
      'transcript',
      onChatTranscriptUpdate,
    );

    return () => {
      avatarController.disconnect();
      avatarController.avatarClient.removeEventListener(
        'transcript',
        onChatTranscriptUpdate,
      );
    };
  }, []);

  return (
    <div style={{ width, height }} className={className}>
      <div className='aspect-square w-full relative'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='absolute inset-0 w-full h-full object-cover bg-gray-200'
        />
      </div>
      <audio muted ref={audioRef} style={{ display: 'none' }} autoPlay />
    </div>
  );
}
