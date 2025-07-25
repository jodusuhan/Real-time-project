export interface User {
  id: string;
  username: string;
  avatar: string;
  room?: string;
}

export interface Message {
  id: string;
  username: string;
  avatar: string;
  message: string;
  type?: 'text' | 'emoji' | 'system';
  timestamp: string;
  room: string;
}

export interface PrivateMessage {
  id: string;
  senderId: string;
  senderUsername: string;
  senderAvatar: string;
  targetId: string;
  targetUsername: string;
  message: string;
  timestamp: string;
}

export interface Room {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
}