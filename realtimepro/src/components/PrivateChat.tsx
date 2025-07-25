import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { User, PrivateMessage } from '../types/chat';
import { MessageInput } from './MessageInput';

interface PrivateChatProps {
  targetUser: User;
  messages: PrivateMessage[];
  currentUserId: string;
  onSendMessage: (targetUserId: string, message: string) => void;
  onClose: () => void;
}

export const PrivateChat: React.FC<PrivateChatProps> = ({
  targetUser,
  messages,
  currentUserId,
  onSendMessage,
  onClose
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={targetUser.avatar}
              alt={targetUser.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <h3 className="text-white font-semibold">{targetUser.username}</h3>
              <p className="text-gray-400 text-sm">Private conversation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-xs`}>
                  {!isOwn && (
                    <img
                      src={message.senderAvatar}
                      alt={message.senderUsername}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                    />
                  )}
                  
                  <div className={`${isOwn ? 'mr-2' : 'ml-2'}`}>
                    <div
                      className={`px-3 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    
                    <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <MessageInput
          onSendMessage={(message) => onSendMessage(targetUser.id, message)}
          onTyping={() => {}}
          onStopTyping={() => {}}
          placeholder={`Message ${targetUser.username}...`}
        />
      </div>
    </div>
  );
};