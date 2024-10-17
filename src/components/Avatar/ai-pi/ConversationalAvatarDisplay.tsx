import { ManualAvatarController } from '../../../core/ai-pi/ManualAvatarController';
import { ConversationalAvatarController } from '../../../core/ai-pi/ConversationalAvatarController';
import { useEffect, useRef } from 'react';

export type ChatTranscriptRole = 'user' | 'assistant';

export type ChatTranscriptMessage = {
  message: string;
  role: ChatTranscriptRole;
  isFinal: boolean;
};

export interface ConversationalAvatarDisplayProps {
  avatarController: ManualAvatarController | ConversationalAvatarController;
  width?: number;
  height?: number;
  className?: string;
  onChatTranscriptUpdate?: (message: ChatTranscriptMessage) => void;
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

    const handleChatTranscriptUpdate = (message: ChatTranscriptMessage) => {
      if (message.isFinal) {
        onChatTranscriptUpdate(message);
      }
    };

    avatarController.connect(videoRef.current, audioRef.current).then(() => {
      avatarController.avatarClient.addEventListener(
        'transcription',
        handleChatTranscriptUpdate,
      );
    });

    return () => {
      avatarController.disconnect();
      avatarController.avatarClient.removeEventListener(
        'transcription',
        handleChatTranscriptUpdate,
      );
    };
  }, []);

  return (
    <div style={{ height, width }} className={className}>
      <div className='aspect-square w-full relative'>
        <video
          ref={videoRef}
          height={height}
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
