import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Users as UsersIcon } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import UserList from './UserList';
import TypingIndicator from './TypingIndicator';
import ConnectionStatus from './ConnectionStatus';

interface User {
  id: string;
  name: string;
  avatar: string;
  joinedAt: Date;
}

interface Message {
  id: number;
  text: string;
  user: User;
  timestamp: Date;
  type: 'message' | 'notification';
}

interface ChatRoomProps {
  currentUser: User;
  users: User[];
  messages: Message[];
  typingUsers: Map<string, string>;
  isConnected: boolean;
  onSendMessage: (message: string) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  currentUser,
  users,
  messages,
  typingUsers,
  isConnected,
  onSendMessage,
  onStartTyping,
  onStopTyping
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUserList, setShowUserList] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const shouldShowAvatar = (message: Message, index: number) => {
    if (message.type === 'notification') return false;
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    return prevMessage.user.id !== message.user.id || prevMessage.type === 'notification';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex h-screen max-w-7xl mx-auto">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white shadow-xl">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Live Chat</h1>
                <p className="text-sm text-gray-500">{users.length} users online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ConnectionStatus isConnected={isConnected} />
              
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <UsersIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.user.id === currentUser.id}
                  showAvatar={shouldShowAvatar(message, index)}
                />
              ))
            )}
            
            <TypingIndicator typingUsers={typingUsers} />
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <ChatInput
            onSendMessage={onSendMessage}
            onStartTyping={onStartTyping}
            onStopTyping={onStopTyping}
            disabled={!isConnected}
          />
        </div>

        {/* User List Sidebar */}
        <div className={`
          ${showUserList ? 'block' : 'hidden'} lg:block
          w-80 bg-gray-50 border-l border-gray-200 p-4
          lg:relative absolute top-0 right-0 h-full z-10
          lg:z-auto
        `}>
          <UserList users={users} currentUserId={currentUser.id} />
        </div>
      </div>

      {/* Mobile Overlay */}
      {showUserList && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-5"
          onClick={() => setShowUserList(false)}
        />
      )}
    </div>
  );
};

export default ChatRoom;