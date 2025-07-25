import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const emojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🎉', '🔥', '💯' ,
'😃',
'😄',
'😁',
'😆',
'😅',
'😂',
'🤣',
'🥲',
'🥹',
'☺️',
'😊',
'😇',
'🙂',
'🙃',
'😉',
'😌',
'😍',
'🥰',
'😘',
'😗',
'😙',
'😚',
'😋',
'😛',
'😝',
'😜',
'🤪',
'🤨',
'🧐',
'🤓',
'😎',
'🥸',
'🤩',
'🥳',
'🙂‍↕️',
'😏',
'🙂‍↔️',
'😞',
'😔',
'😟',
'😕',
'🙁',
'☹️',
'😣',
'😖',
'😫',
'😩',
'🥺',
'😢',
'😭',
'😮‍💨',
'😤',
'😠',
'😡',
'🤬',
'🤯',
'😳',
'🥵',
'🥶',
'😱',
'😨',
'😰',
'😥',
'😓',
'🫣',
'🤗',
'🫡',
'🤔',
'🫢',
'🤭',
'🤫',
'🤥',
'😶',
'😶‍🌫️',
'😐',
'😑',
'😬',
'🫨',
'🫠',
'🙄',
'😯',
'😦',
'😧',
'😮',
'😲',
'🥱',
'😴',
'🤤',
'😪',
'😵',
'😵‍💫',
'🫥',
'🤐',
'🥴',
'🤢',
'🤮',
'🤧',
'😷',
'🤒',
'🤕',
'🤑',
'🤠',
'😈',
'👿',
'👹',
'👺',
'🤡',
'💩',
'👻'];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      onStopTyping();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="border-t border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength={500}
          />
          
          {/* Emoji Picker */}
          <div className="absolute right-12 bottom-3">
            <button
              type="button"
              onClick={() => setShowEmojis(!showEmojis)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>
            
            {showEmojis && (
              <div className="absolute bottom-8 right-0 bg-gray-800 border border-gray-700 rounded-lg p-2 grid grid-cols-5 gap-1 shadow-lg">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="p-1 hover:bg-gray-700 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};