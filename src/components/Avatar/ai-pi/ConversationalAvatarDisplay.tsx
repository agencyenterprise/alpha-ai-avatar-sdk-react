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
