import React, { useState } from 'react';
import { Hash, Users, MessageSquare, Settings, UserPlus } from 'lucide-react';
import type { User } from '../types/chat';

interface ChatSidebarProps {
  currentRoom: string;
  rooms: string[];
  users: User[];
  onRoomSwitch: (room: string) => void;
  onPrivateChat: (user: User) => void;
  currentUserId: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  currentRoom,
  rooms,
  users,
  onRoomSwitch,
  onPrivateChat,
  currentUserId
}) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onRoomSwitch(newRoomName.trim());
      setNewRoomName('');
      setShowNewRoomInput(false);
    }
  };

  const otherUsers = users.filter(user => user.id !== currentUserId);

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-lg">Chat Rooms</h2>
      </div>

      {/* Rooms Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              Channels
            </h3>
            <button
              onClick={() => setShowNewRoomInput(!showNewRoomInput)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Create new room"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>

          {showNewRoomInput && (
            <form onSubmit={handleCreateRoom} className="mb-3">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name"
                className="w-full px-3 py-2 bg-gray-700 text-white text-sm rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </form>
          )}

          <div className="space-y-1">
            {rooms.map(room => (
              <button
                key={room}
                onClick={() => onRoomSwitch(room)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-left transition-colors ${
                  currentRoom === room
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Hash className="w-4 h-4" />
                <span className="text-sm font-medium truncate">{room}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Online Users */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center mb-3">
            <Users className="w-4 h-4 text-gray-400 mr-2" />
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
              Online ({users.length})
            </h3>
          </div>

          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center space-x-2">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full"></div>
                </div>
                <span className="text-gray-300 text-sm truncate flex-1">
                  {user.username}
                  {user.id === currentUserId && (
                    <span className="text-gray-500 ml-1">(you)</span>
                  )}
                </span>
                {user.id !== currentUserId && (
                  <button
                    onClick={() => onPrivateChat(user)}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Send private message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};