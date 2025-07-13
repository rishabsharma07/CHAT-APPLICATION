import React from 'react';
import UserAvatar from './UserAvatar';

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Message {
  id: number;
  text: string;
  user: User;
  timestamp: Date;
  type: 'message' | 'notification';
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  showAvatar 
}) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (message.type === 'notification') {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {showAvatar && !isOwn && (
        <UserAvatar name={message.user.name} avatar={message.user.avatar} size="sm" />
      )}
      
      {!showAvatar && !isOwn && <div className="w-8" />}
      
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {showAvatar && !isOwn && (
          <span className="text-xs text-gray-500 mb-1 px-1">
            {message.user.name}
          </span>
        )}
        
        <div
          className={`
            px-4 py-2 rounded-2xl shadow-sm
            ${isOwn 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
            }
          `}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
        
        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
      
      {showAvatar && isOwn && (
        <UserAvatar name={message.user.name} avatar={message.user.avatar} size="sm" />
      )}
      
      {!showAvatar && isOwn && <div className="w-8" />}
    </div>
  );
};

export default MessageBubble;