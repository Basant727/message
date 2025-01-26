// Basic WhatsApp-like chat app using React (frontend), Node.js (backend), and Socket.io
// React frontend code (App.jsx)

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the backend

function App() {
  const [messages, setMessages] = useState([]); // List of messages
  const [message, setMessage] = useState('');  // Current message input
  const [username, setUsername] = useState(''); // Username
  const [connected, setConnected] = useState(false); // Connection state

  useEffect(() => {
    // Listen for messages from the server
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off('chat message');
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const fullMessage = { user: username || 'Anonymous', text: message };
      socket.emit('chat message', fullMessage); // Send message to the server
      setMessage(''); // Clear the input
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!connected ? (
        <div className="bg-white p-4 shadow rounded-md">
          <h1 className="text-lg font-bold mb-2">Enter Username</h1>
          <input
            type="text"
            placeholder="Your name"
            className="p-2 border rounded w-full mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setConnected(true)}
          >
            Join Chat
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg bg-white shadow-lg rounded-md">
          <div className="p-4 border-b text-lg font-bold">Chat Room</div>
          <div className="h-96 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <strong>{msg.user}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-4 border-t">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-grow border rounded p-2 mr-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
