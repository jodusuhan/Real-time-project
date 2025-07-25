import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage for rooms and users
const rooms = new Map();
const users = new Map();
const privateMessages = new Map();

// Serve static files from the dist directory in production
app.use(express.static(join(__dirname, 'dist')));

// Default rooms
const defaultRooms = ['General', 'Random', 'Tech Talk'];
defaultRooms.forEach(roomName => {
  rooms.set(roomName, {
    id: roomName,
    name: roomName,
    users: new Set(),
    messages: []
  });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', ({ username, room }) => {
    // Store user info
    users.set(socket.id, {
      id: socket.id,
      username,
      room,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    });

    // Join the room
    socket.join(room);

    // Add user to room
    if (!rooms.has(room)) {
      rooms.set(room, {
        id: room,
        name: room,
        users: new Set(),
        messages: []
      });
    }
    
    const roomData = rooms.get(room);
    roomData.users.add(socket.id);

    // Send room info to user
    socket.emit('room_info', {
      room: roomData.name,
      users: Array.from(roomData.users).map(userId => users.get(userId)).filter(Boolean),
      messages: roomData.messages.slice(-50) // Send last 50 messages
    });

    // Notify others in room
    socket.to(room).emit('user_joined', {
      username,
      timestamp: new Date().toISOString()
    });

    // Send updated user list to room
    io.to(room).emit('users_update', 
      Array.from(roomData.users).map(userId => users.get(userId)).filter(Boolean)
    );

    // Send available rooms
    socket.emit('rooms_list', Array.from(rooms.keys()));
  });

  // Handle sending messages
  socket.on('send_message', ({ room, message, type = 'text' }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const messageData = {
      id: uuidv4(),
      username: user.username,
      avatar: user.avatar,
      message,
      type,
      timestamp: new Date().toISOString(),
      room
    };

    // Store message in room
    const roomData = rooms.get(room);
    if (roomData) {
      roomData.messages.push(messageData);
      // Keep only last 100 messages per room
      if (roomData.messages.length > 100) {
        roomData.messages = roomData.messages.slice(-100);
      }
    }

    // Send message to all users in room
    io.to(room).emit('new_message', messageData);
  });

  // Handle private messages
  socket.on('send_private_message', ({ targetUserId, message }) => {
    const sender = users.get(socket.id);
    const target = users.get(targetUserId);
    
    if (!sender || !target) return;

    const messageData = {
      id: uuidv4(),
      senderId: socket.id,
      senderUsername: sender.username,
      senderAvatar: sender.avatar,
      targetId: targetUserId,
      targetUsername: target.username,
      message,
      timestamp: new Date().toISOString()
    };

    // Store private message
    const chatId = [socket.id, targetUserId].sort().join('-');
    if (!privateMessages.has(chatId)) {
      privateMessages.set(chatId, []);
    }
    privateMessages.get(chatId).push(messageData);

    // Send to both users
    socket.emit('new_private_message', messageData);
    socket.to(targetUserId).emit('new_private_message', messageData);
  });

  // Handle typing indicators
  socket.on('typing_start', ({ room }) => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(room).emit('user_typing', { username: user.username });
    }
  });

  socket.on('typing_stop', ({ room }) => {
    const user = users.get(socket.id);
    if (user) {
      socket.to(room).emit('user_stop_typing', { username: user.username });
    }
  });

  // Handle room switching
  socket.on('switch_room', ({ newRoom }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const oldRoom = user.room;
    
    // Leave old room
    socket.leave(oldRoom);
    const oldRoomData = rooms.get(oldRoom);
    if (oldRoomData) {
      oldRoomData.users.delete(socket.id);
      io.to(oldRoom).emit('users_update', 
        Array.from(oldRoomData.users).map(userId => users.get(userId)).filter(Boolean)
      );
    }

    // Join new room
    user.room = newRoom;
    socket.join(newRoom);

    if (!rooms.has(newRoom)) {
      rooms.set(newRoom, {
        id: newRoom,
        name: newRoom,
        users: new Set(),
        messages: []
      });
    }

    const newRoomData = rooms.get(newRoom);
    newRoomData.users.add(socket.id);

    // Send room info
    socket.emit('room_info', {
      room: newRoomData.name,
      users: Array.from(newRoomData.users).map(userId => users.get(userId)).filter(Boolean),
      messages: newRoomData.messages.slice(-50)
    });

    // Update users in new room
    io.to(newRoom).emit('users_update', 
      Array.from(newRoomData.users).map(userId => users.get(userId)).filter(Boolean)
    );
  });

  // Handle getting private messages
  socket.on('get_private_messages', ({ targetUserId }) => {
    const chatId = [socket.id, targetUserId].sort().join('-');
    const messages = privateMessages.get(chatId) || [];
    socket.emit('private_messages_history', { targetUserId, messages });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const user = users.get(socket.id);
    if (user) {
      const room = user.room;
      const roomData = rooms.get(room);
      
      if (roomData) {
        roomData.users.delete(socket.id);
        
        // Notify others in room
        socket.to(room).emit('user_left', {
          username: user.username,
          timestamp: new Date().toISOString()
        });

        // Send updated user list
        io.to(room).emit('users_update', 
          Array.from(roomData.users).map(userId => users.get(userId)).filter(Boolean)
        );
      }
    }

    users.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});