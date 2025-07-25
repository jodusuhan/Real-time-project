# Real-Time Chat Application with Socket.IO

A modern, feature-rich real-time chat application built with React, Node.js, Express, and Socket.IO. This application provides a Discord/Slack-like experience with real-time messaging, multiple chat rooms, private messaging, and typing indicators.

## Features

### Core Features
- **Real-time messaging** with Socket.IO
- **Multiple chat rooms** with the ability to create new rooms
- **Private one-on-one messaging**
- **Live typing indicators**
- **Online user status** and user list
- **Message timestamps**
- **Join/leave notifications**
- **Emoji support** with emoji picker
- **Responsive design** for desktop and mobile

### UI/UX Features
- **Modern dark theme** inspired by Discord/Slack
- **Beautiful gradient login screen**
- **Smooth animations** and transitions
- **Auto-generated avatars** using DiceBear API
- **Real-time connection status**
- **Message bubbles** with proper alignment
- **Hover effects** and micro-interactions

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **UUID** - Unique message IDs

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Socket.IO Client** - Real-time communication

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands
- **PostCSS** - CSS processing

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd realtime-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 3001) and frontend development server (port 3000) concurrently.

4. **Open your browser**
   Navigate to `http://localhost:3000` to access the application.

## Usage

### Getting Started
1. **Enter your username** on the login screen
2. **Choose a room** - either join an existing room or create a new one
3. **Start chatting** - send messages, use emojis, and see real-time updates

### Features Guide
- **Switch rooms**: Click on any room in the sidebar to switch
- **Create new room**: Click the "+" button next to "Channels"
- **Private messaging**: Click the message icon next to any user's name
- **Emoji picker**: Click the smile icon in the message input
- **Typing indicators**: Start typing to show others you're active

### Default Rooms
The application comes with three default rooms:
- **General** - Main discussion room
- **Random** - Casual conversations
- **Tech Talk** - Technology discussions

## Project Structure

```
realtime-chat-app/
├── server.js                 # Express server with Socket.IO
├── src/
│   ├── components/           # React components
│   │   ├── LoginForm.tsx     # User authentication form
│   │   ├── ChatSidebar.tsx   # Room and user list
│   │   ├── ChatMessage.tsx   # Individual message component
│   │   ├── MessageInput.tsx  # Message input with emoji picker
│   │   ├── TypingIndicator.tsx # Typing status display
│   │   └── PrivateChat.tsx   # Private messaging modal
│   ├── hooks/
│   │   └── useSocket.ts      # Socket.IO connection hook
│   ├── types/
│   │   └── chat.ts           # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # React entry point
│   └── index.css             # Tailwind CSS imports
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Socket.IO Events

### Client to Server
- `join` - Join a chat room
- `send_message` - Send a message to current room
- `send_private_message` - Send a private message
- `switch_room` - Change to a different room
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `get_private_messages` - Retrieve private message history

### Server to Client
- `room_info` - Room details and message history
- `users_update` - Updated user list for current room
- `new_message` - New message in current room
- `new_private_message` - New private message
- `user_joined` - User joined notification
- `user_left` - User left notification
- `user_typing` - Someone is typing
- `user_stop_typing` - Someone stopped typing
- `rooms_list` - Available rooms list

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the appearance by modifying the classes in the components or updating the `tailwind.config.js` file.

### Adding Features
- **Message persistence**: Integrate with MongoDB or Firebase
- **File sharing**: Add support for image/file uploads
- **Voice/Video calls**: Integrate WebRTC for audio/video
- **Message reactions**: Add emoji reactions to messages
- **User roles**: Implement admin/moderator roles

## Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run server
   ```

The built files will be served from the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.