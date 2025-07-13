import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected users and chat history
const users = new Map();
const messages = [];
const typingUsers = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('user:join', (userData) => {
    users.set(socket.id, {
      id: socket.id,
      name: userData.name,
      avatar: userData.avatar,
      joinedAt: new Date()
    });

    // Send current messages to the new user
    socket.emit('messages:history', messages);

    // Broadcast updated user list
    io.emit('users:update', Array.from(users.values()));

    // Notify others about new user
    socket.broadcast.emit('user:joined', users.get(socket.id));
  });

  // Handle new messages
  socket.on('message:send', (messageData) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now() + Math.random(),
      text: messageData.text,
      user: user,
      timestamp: new Date(),
      type: 'message'
    };

    messages.push(message);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages.shift();
    }

    // Broadcast message to all users
    io.emit('message:received', message);
  });

  // Handle typing indicators
  socket.on('typing:start', () => {
    const user = users.get(socket.id);
    if (!user) return;

    typingUsers.add(socket.id);
    socket.broadcast.emit('typing:update', {
      userId: socket.id,
      userName: user.name,
      isTyping: true
    });
  });

  socket.on('typing:stop', () => {
    typingUsers.delete(socket.id);
    socket.broadcast.emit('typing:update', {
      userId: socket.id,
      isTyping: false
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    
    if (user) {
      users.delete(socket.id);
      typingUsers.delete(socket.id);
      
      // Notify others about user leaving
      socket.broadcast.emit('user:left', user);
      
      // Broadcast updated user list
      io.emit('users:update', Array.from(users.values()));
    }
    
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});