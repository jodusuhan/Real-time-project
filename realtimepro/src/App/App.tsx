import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { LoginForm } from './components/LoginForm';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { TypingIndicator } from './components/TypingIndicator';
import { PrivateChat } from './components/PrivateChat';
import { useSocket } from './hooks/useSocket';
import type { User } from './types/chat';

function App() {
  const [currentUser, setCurrentUser] = useState<{ username: string; id: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [privateChatUser, setPrivateChatUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
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
  } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoin = (username: string, room: string) => {
    joinRoom(username, room);
    setCurrentUser({ username, id: socket?.id || '' });
    setIsLoggedIn(true);
  };

  const handlePrivateChat = (user: User) => {
    setPrivateChatUser(user);
    getPrivateMessages(user.id);
  };

  const handleSendPrivateMessage = (targetUserId: string, message: string) => {
    sendPrivateMessage(targetUserId, message);
  };

  const currentPrivateMessages = privateChatUser 
    ? privateMessages.get(privateChatUser.id) || []
    : [];

  if (!isLoggedIn) {
    return <LoginForm onJoin={handleJoin} rooms={rooms} />;
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <ChatSidebar
        currentRoom={currentRoom}
        rooms={rooms}
        users={users}
        onRoomSwitch={switchRoom}
        onPrivateChat={handlePrivateChat}
        currentUserId={currentUser?.id || ''}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-white text-lg font-semibold">#{currentRoom}</h1>
              <div className={`flex items-center space-x-1 ${connected ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {users.length} {users.length === 1 ? 'member' : 'members'}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.username === currentUser?.username}
            />
          ))}
          
          <TypingIndicator users={Array.from(typingUsers)} />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={sendMessage}
          onTyping={handleTyping}
          onStopTyping={stopTyping}
          disabled={!connected}
        />
      </div>

      {/* Private Chat Modal */}
      {privateChatUser && (
        <PrivateChat
          targetUser={privateChatUser}
          messages={currentPrivateMessages}
          currentUserId={currentUser?.id || ''}
          onSendMessage={handleSendPrivateMessage}
          onClose={() => setPrivateChatUser(null)}
        />
      )}
    </div>
  );
}

export default App;