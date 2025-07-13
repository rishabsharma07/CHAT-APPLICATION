import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

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

interface TypingIndicator {
  userId: string;
  userName?: string;
  isTyping: boolean;
}

export const useSocket = (serverUrl: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    socketRef.current = io(serverUrl);
    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('users:update', (userList: User[]) => {
      setUsers(userList);
    });

    socket.on('messages:history', (messageHistory: Message[]) => {
      setMessages(messageHistory);
    });

    socket.on('message:received', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user:joined', (user: User) => {
      const notification: Message = {
        id: Date.now(),
        text: `${user.name} joined the chat`,
        user: user,
        timestamp: new Date(),
        type: 'notification'
      };
      setMessages(prev => [...prev, notification]);
    });

    socket.on('user:left', (user: User) => {
      const notification: Message = {
        id: Date.now(),
        text: `${user.name} left the chat`,
        user: user,
        timestamp: new Date(),
        type: 'notification'
      };
      setMessages(prev => [...prev, notification]);
    });

    socket.on('typing:update', (data: TypingIndicator) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (data.isTyping && data.userName) {
          newMap.set(data.userId, data.userName);
        } else {
          newMap.delete(data.userId);
        }
        return newMap;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  const joinChat = (userData: { name: string; avatar: string }) => {
    socketRef.current?.emit('user:join', userData);
  };

  const sendMessage = (text: string) => {
    socketRef.current?.emit('message:send', { text });
  };

  const startTyping = () => {
    socketRef.current?.emit('typing:start');
  };

  const stopTyping = () => {
    socketRef.current?.emit('typing:stop');
  };

  return {
    isConnected,
    users,
    messages,
    typingUsers,
    joinChat,
    sendMessage,
    startTyping,
    stopTyping
  };
};