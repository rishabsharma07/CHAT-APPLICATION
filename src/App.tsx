import React, { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';

interface User {
  id: string;
  name: string;
  avatar: string;
  joinedAt: Date;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  
  const {
    isConnected,
    users,
    messages,
    typingUsers,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping
  } = useSocket('http://localhost:3001');

  const handleJoin = (userData: { name: string; avatar: string }) => {
    const user: User = {
      id: 'temp-id', // This will be updated by the server
      name: userData.name,
      avatar: userData.avatar,
      joinedAt: new Date()
    };
    
    setCurrentUser(user);
    setHasJoined(true);
    joinChat(userData);
  };

  if (!hasJoined || !currentUser) {
    return <JoinForm onJoin={handleJoin} />;
  }

  // Update current user ID once we have it from the server
  const updatedCurrentUser = users.find(u => u.name === currentUser.name) || currentUser;

  return (
    <ChatRoom
      currentUser={updatedCurrentUser}
      users={users}
      messages={messages}
      typingUsers={typingUsers}
      isConnected={isConnected}
      onSendMessage={sendMessage}
      onStartTyping={startTyping}
      onStopTyping={stopTyping}
    />
  );
}

export default App;