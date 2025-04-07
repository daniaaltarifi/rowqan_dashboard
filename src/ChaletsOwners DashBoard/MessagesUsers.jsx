import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import '../Styles/MessagesUsers.css'; 

import { API_URL } from '@/App';
function MessagesUsers() {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const userId = Cookies.get('userId') || '4'; 
  const listRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(conv => 
        conv.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/messages/getMessagesByReciever/${userId}`);
      
     
      const processedData = processConversations(response.data);
      setConversations(processedData);
      setFilteredConversations(processedData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const processConversations = (messages) => {
    
    const conversationsMap = {};
    
    messages.forEach(message => {
      const senderId = message.senderId;
      
      
      if (!message.Sender) return;
      
      if (!conversationsMap[senderId]) {
        conversationsMap[senderId] = {
          user: {
            id: senderId,
            name: message.Sender.name,
            email: message.Sender.email,
            image: message.Sender.image 
          },
          messages: [],
          unreadCount: 0,
          lastActivity: new Date(0)
        };
      }
      
      
      conversationsMap[senderId].messages.push(message);
      
      
      const messageTime = new Date(message.createdAt).getTime();
      if (messageTime > conversationsMap[senderId].lastActivity.getTime()) {
        conversationsMap[senderId].lastActivity = new Date(messageTime);
      }
      
      
      if (!message.isRead) {
        conversationsMap[senderId].unreadCount++;
      }
    });
    
    
    return Object.values(conversationsMap)
      .sort((a, b) => b.lastActivity - a.lastActivity)
      .map(conv => {
        
        const sortedMessages = [...conv.messages].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        return {
          ...conv,
          latestMessage: sortedMessages[0]
        };
      });
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>Messages</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="conversations-list" ref={listRef}>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading conversations...</p>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <Link 
            to={`ChatPage/${conversation.user.id}`} 
            className="conversation-item" 
            key={conversation.user.id}
          >
              <div className="user-avatar">
                {/* <img 
                  src={conversation.user.image} 
                  alt={conversation.user.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                /> */}
                {conversation.unreadCount > 0 && (
                  <span className="unread-badge">{conversation.unreadCount}</span>
                )}
              </div>
              
              <div className="conversation-details">
                <div className="conversation-header">
                  <div className="user-name-container">
                    <i className="person-icon">&#128100;</i>
                    <h3 className={conversation.unreadCount > 0 ? 'unread-name' : ''}>
                      {conversation.user.name}
                      <span className="user-email">{conversation.user.email ? ` (${conversation.user.email.split('@')[0]})` : ''}</span>
                    </h3>
                  </div>
                  <span className="message-time">
                    {formatMessageTime(conversation.latestMessage.createdAt)}
                  </span>
                </div>
                
                <p className={conversation.unreadCount > 0 ? 'unread-message' : 'message-preview'}>
                  {truncateMessage(conversation.latestMessage.message, screenSize < 576 ? 30 : 40)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <p>No messages found</p>
            <button className="refresh-button" onClick={fetchConversations}>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesUsers;