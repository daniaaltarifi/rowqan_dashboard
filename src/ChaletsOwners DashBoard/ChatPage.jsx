import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '@/App';
import Cookies from 'js-cookie';
import profile from '../Images/user.png';
import '../Styles/ChatPage.css'; // We'll create this CSS file

// Import icons (assuming you're using Heroicons or similar)
import { 
  ArrowLeft, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  Smile,
  Send
} from 'react-feather'; // Or any other icon library you prefer

function ChatPage() {
  const { userId } = useParams(); // Partner/recipient user ID from URL
  const navigate = useNavigate();
  const messagesEndRef = useRef(null); // Reference for auto-scrolling
  const fileInputRef = useRef(null); // Reference for file input
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Get current user details from cookies
  const lang = Cookies.get('lang') || 'en';
  const currentUserId = Cookies.get('userId');
  
  // Fetch partner info and chat history on component mount
  useEffect(() => {
    fetchPartnerInfo();
    fetchMessages();
    
    // Set up polling for new messages
    const interval = setInterval(() => {
      fetchMessages(false); // Pass false to avoid showing loading state
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, [userId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchPartnerInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setPartner(response.data);
    } catch (error) {
      console.error('Error fetching partner info:', error);
    }
  };
  
  const fetchMessages = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      // Fetch messages between current user and partner
      const response = await axios.get(`${API_URL}/messages/conversation/${currentUserId}/${userId}`);
      
      if (response.data && Array.isArray(response.data)) {
        setMessages(response.data);
        
        // Mark messages as read if needed
        markMessagesAsRead();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };
  
  const markMessagesAsRead = async () => {
    try {
      await axios.post(`${API_URL}/messages/markAsRead`, {
        receiverId: currentUserId,
        senderId: userId
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    setSending(true);
    
    try {
      // Prepare message data
      const messageData = {
        message: newMessage.trim(),
        senderId: currentUserId,
        receiverId: userId
      };
      
      // Send the message
      await axios.post(`${API_URL}/messages/SendMessage`, messageData);
      
      // Clear input field
      setNewMessage('');
      
      // Refresh messages
      fetchMessages(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(lang === 'ar' ? 'فشل في إرسال الرسالة' : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleAttachFile = () => {
    fileInputRef.current.click();
  };
  
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Reset time part for comparison
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Calculate difference in days
    const diffTime = todayDate - messageDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return lang === 'ar' ? 'اليوم' : 'Today';
    } else if (diffDays === 1) {
      return lang === 'ar' ? 'الأمس' : 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric' 
      });
    }
  };
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at);
      const dateString = date.toDateString();
      
      if (!groups[dateString]) {
        groups[dateString] = [];
      }
      
      groups[dateString].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };
  
  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };
  
  return (
    <div className="chat-page" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="header-left">
          <button className="back-button" onClick={handleGoBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="partner-avatar">
            <img 
              src={partner?.image || profile} 
              alt={partner?.name || (lang === 'ar' ? 'مستخدم' : 'User')} 
            />
          </div>
          <div className="partner-info">
            <h4>{partner?.name || (lang === 'ar' ? 'مستخدم' : 'User')}</h4>
            <span className="status">
              {lang === 'ar' ? 'متصل الآن' : 'Online'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-button">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="chat-messages">
        {loading ? (
          <div className="loading-messages">
            <div className="loader"></div>
            <p>{lang === 'ar' ? 'جاري تحميل الرسائل...' : 'Loading messages...'}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>{lang === 'ar' ? 'لا توجد رسائل. ابدأ محادثة جديدة!' : 'No messages. Start a new conversation!'}</p>
          </div>
        ) : (
          groupMessagesByDate().map((group, groupIndex) => (
            <div key={groupIndex} className="message-group">
              <div className="date-divider">
                <span>{formatDate(group.date)}</span>
              </div>
              
              {group.messages.map((message, index) => {
                const isSentByMe = message.senderId.toString() === currentUserId.toString();
                return (
                  <div 
                    key={message.id || index} 
                    className={`message ${isSentByMe ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.message}</p>
                      <span className="message-time">
                        {formatTime(message.created_at)}
                        {isSentByMe && (
                          <span className="check">
                            ✓✓
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="chat-input">
        <div className="input-actions">
          <button className="action-button">
            <Smile size={24} />
          </button>
          <button className="action-button" onClick={handleAttachFile}>
            <Paperclip size={24} />
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={(e) => console.log(e.target.files)}
            />
          </button>
        </div>
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'اكتب رسالة...' : 'Type a message...'}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!newMessage.trim() || sending}
          >
            {newMessage.trim() ? <Send size={24} /> : <Mic size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;