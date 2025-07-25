import React from 'react';
import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (message.type === 'system') {
    return (
    <div className="flex justify-center my-2">
        <div className="bg-gray-600/30 text-gray-400 px-3 py-1 rounded-full text-sm">
          {message.message}
        </div>
 </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-xs lg:max-w-md`}>
        {!isOwn && (
          <img
            src={message.avatar}
            alt={message.username}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
        )}
        
        <div className={`${isOwn ? 'mr-2' : 'ml-2'}`}>
          {!isOwn && (
            <div className="text-sm text-gray-400 mb-1">
              {message.username}
            </div>
          )}
          
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-500 text-white rounded-br-sm'
                : 'bg-gray-700 text-gray-100 rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed">{message.message}</p>
          </div>
          
          <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};