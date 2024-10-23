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

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  avatarController: ConversationalAvatarController;
  userDisplayName?: string;
  avatarDisplayName?: string;
}

export function Chat({
  avatarController,
  userDisplayName = 'You',
  avatarDisplayName = 'Alpha AI',
  ...containerProps
}: ChatProps) {
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      {...containerProps}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '512px',
        maxHeight: '300px',
        overflowY: 'auto',
        ...containerProps?.style,
      }}>
      <div>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px',
            }}>
            <div
              style={{
                fontWeight: 'bold',
                marginBottom: '5px',
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
              {message.role === 'user' ? userDisplayName : avatarDisplayName}
            </div>
            <div
              style={{
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '60%',
                margin: '5px 0',
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor:
                  message.role === 'user' ? '#dcf8c6' : '#f1f0f0',
                textAlign: message.role === 'user' ? 'right' : 'left',
              }}>
              {message.content || '...'}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
