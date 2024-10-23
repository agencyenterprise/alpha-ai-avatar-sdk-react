import { ConversationalAvatarController } from '../../../core/ai-pi/ConversationalAvatarController';
import { useEffect, useRef, useState } from 'react';

type ChatMessageRole = 'user' | 'assistant';

type ChatMessage = {
  id: number;
  content: string;
  role: ChatMessageRole;
  isFinal: boolean;
};

type ChatTranscriptMessage = {
  message: string;
  role: ChatMessageRole;
  isFinal: boolean;
};

export interface ChatProps {
  avatarController: ConversationalAvatarController;
}

export function Chat({ avatarController }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleChatTranscriptUpdate = ({
      role,
      message,
      isFinal,
    }: ChatTranscriptMessage) => {
      setMessages((prevMessages) => {
        const lastIndex = prevMessages.length - 1;
        const lastMessage = prevMessages[lastIndex];

        if (role === lastMessage?.role) {
          if (role === 'assistant' && !isFinal) {
            const newContent = message.slice(lastMessage.content.length);
            if (newContent.trim() === '') {
              return prevMessages;
            }
            message = lastMessage.content + newContent;
          }
          prevMessages = prevMessages.slice(0, lastIndex);
        }

        return [
          ...prevMessages,
          {
            id: Date.now(),
            role,
            content: message,
            isFinal,
          },
        ];
      });
    };

    avatarController.avatarClient.addEventListener(
      'transcription',
      handleChatTranscriptUpdate,
    );

    return () => {
      avatarController.avatarClient.removeEventListener(
        'transcription',
        handleChatTranscriptUpdate,
      );
    };
  }, []);

  return (
    <>
      <div>
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === 'user' ? 'user' : 'assistant'}>
            {message.content || '...'}
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </>
  );
}
