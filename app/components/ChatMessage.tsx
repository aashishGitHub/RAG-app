import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`chat-message ${
          isUser ? "user-message" : "assistant-message"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={`text-xs mt-2 ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          Time: {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
