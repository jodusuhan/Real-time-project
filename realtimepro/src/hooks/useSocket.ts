import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { User, Message, PrivateMessage } from '../types/chat';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [privateMessages, setPrivateMessages] = useState<Map<string, PrivateMessage[]>>(new Map());
  const [rooms, setRooms] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    newSocket.on('room_info', ({ room, users: roomUsers, messages: roomMessages }) => {
      setCurrentRoom(room);
      setUsers(roomUsers);
      setMessages(roomMessages);
    });

    newSocket.on('users_update', (roomUsers: User[]) => {
      setUsers(roomUsers);
    });

    newSocket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('new_private_message', (message: PrivateMessage) => {
      setPrivateMessages(prev => {
        const updated = new Map(prev);
        const otherId = message.senderId === newSocket.id ? message.targetId : message.senderId;
        const existing = updated.get(otherId) || [];
        updated.set(otherId, [...existing, message]);
        return updated;
      });
    });

    newSocket.on('private_messages_history', ({ targetUserId, messages: history }) => {
      setPrivateMessages(prev => {
        const updated = new Map(prev);
        updated.set(targetUserId, history);
        return updated;
      });
    });

    newSocket.on('rooms_list', (roomsList: string[]) => {
      setRooms(roomsList);
    });

    newSocket.on('user_joined', ({ username }) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        username: 'System',
        avatar: '',
        message: `${username} joined the room`,
        type: 'system',
        timestamp: new Date().toISOString(),
        room: currentRoom
      }]);
    });

    newSocket.on('user_left', ({ username }) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        username: 'System',
        avatar: '',
        message: `${username} left the room`,
        type: 'system',
        timestamp: new Date().toISOString(),
        room: currentRoom
      }]);
    });

    newSocket.on('user_typing', ({ username }) => {
      setTypingUsers(prev => new Set([...prev, username]));
    });

    newSocket.on('user_stop_typing', ({ username }) => {
      setTypingUsers(prev => {
        const updated = new Set(prev);
        updated.delete(username);
        return updated;
      });
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinRoom = (username: string, room: string) => {
    if (socket) {
      socket.emit('join', { username, room });
    }
  };

  const sendMessage = (message: string, type: 'text' | 'emoji' = 'text') => {
    if (socket && currentRoom) {
      socket.emit('send_message', { room: currentRoom, message, type });
    }
  };

  const sendPrivateMessage = (targetUserId: string, message: string) => {
    if (socket) {
      socket.emit('send_private_message', { targetUserId, message });
    }
  };

  const switchRoom = (newRoom: string) => {
    if (socket) {
      socket.emit('switch_room', { newRoom });
      setMessages([]);
    }
  };

  const getPrivateMessages = (targetUserId: string) => {
    if (socket) {
      socket.emit('get_private_messages', { targetUserId });
    }
  };

  const startTyping = () => {
    if (socket && currentRoom) {
      socket.emit('typing_start', { room: currentRoom });
    }
  };

  const stopTyping = () => {
    if (socket && currentRoom) {
      socket.emit('typing_stop', { room: currentRoom });
    }
  };

  const handleTyping = () => {
    startTyping();
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  return {
    socket,
    connected,
    currentRoom,
    users,
    messages,
    privateMessages,
    rooms,
    typingUsers,
    joinRoom,
    sendMessage,
    sendPrivateMessage,
    switchRoom,
    getPrivateMessages,
    handleTyping,
    stopTyping
  };
};