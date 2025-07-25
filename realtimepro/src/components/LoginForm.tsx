import React, { useState } from 'react';
import { Users, MessageCircle } from 'lucide-react';

interface LoginFormProps {
  onJoin: (username: string, room: string) => void;
  rooms: string[];
}

export const LoginForm: React.FC<LoginFormProps> = ({ onJoin, rooms }) => {
  const [username, setUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('General');
  const [customRoom, setCustomRoom] = useState('');
  const [useCustomRoom, setUseCustomRoom] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const room = useCustomRoom ? customRoom : selectedRoom;
    if (username.trim() && room.trim()) {
      onJoin(username.trim(), room.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Chat</h1>
          <p className="text-gray-300">Connect with others in real-time</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-200 mb-2">
              Choose your username
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your username"
                maxLength={20}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Select a room
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existing-room"
                  name="room-type"
                  checked={!useCustomRoom}
                  onChange={() => setUseCustomRoom(false)}
                  className="w-4 h-4 text-blue-500"
                />
                <label htmlFor="existing-room" className="text-gray-200">
                  Join existing room
                </label>
              </div>
              
              {!useCustomRoom && (
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {rooms.map(room => (
                    <option key={room} value={room} className="bg-gray-800">
                      {room}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="custom-room"
                  name="room-type"
                  checked={useCustomRoom}
                  onChange={() => setUseCustomRoom(true)}
                  className="w-4 h-4 text-blue-500"
                />
                <label htmlFor="custom-room" className="text-gray-200">
                  Create new room
                </label>
              </div>

              {useCustomRoom && (
                <input
                  type="text"
                  value={customRoom}
                  onChange={(e) => setCustomRoom(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter room name"
                  maxLength={30}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            Join Chat Room
          </button>
        </form>
      </div>
    </div>
  );
};