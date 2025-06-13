import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import socketService from '../utils/socket';
import api from '../utils/api';

const AuctionChat = ({ itemId, isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && itemId) {
      fetchMessages();
      joinChatRoom();
    }

    return () => {
      if (socketService.socket) {
        socketService.socket.off('new-message');
      }
    };
  }, [isOpen, itemId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/chat/${itemId}/messages`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChatRoom = () => {
    if (socketService.socket) {
      socketService.socket.emit('join-chat', itemId);
      
      socketService.socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        itemId,
        message: newMessage.trim(),
        type: 'text'
      };

      const response = await api.post('/chat/messages', messageData);
      
      // Emit to socket for real-time delivery
      if (socketService.socket) {
        socketService.socket.emit('send-message', response.data.data);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="auction-chat">
      <div className="chat-header">
        <h3>Auction Chat</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          <>
            {messages.map(message => (
              <div
                key={message._id}
                className={`message ${message.sender._id === user?.id ? 'own' : 'other'} ${message.type}`}
              >
                <div className="message-header">
                  <span className="sender-name">
                    {message.sender.firstName} {message.sender.lastName}
                  </span>
                  <span className="message-time">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
                <div className="message-content">
                  {message.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form className="chat-input" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          maxLength={500}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default AuctionChat;
