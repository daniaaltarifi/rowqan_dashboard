import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import logo from "../Images/logo.png";
import send from "../Images/paper-plane.png";
import axios from "axios";
import { API_URL } from '@/App';
import Cookies from 'js-cookie';
import '../Styles/ChatBot.css';

function ChatPage() {
  const { userId } = useParams();
  console.log(`Th User Id Is:${userId}`)
  const location = useLocation();
  const lang = Cookies.get('lang') || 'en';
  const chalet_title = location.state?.chalet_title || null;
  const receiverId = Cookies.get('receiverId');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/betweenMessage/${userId}/4`);
    
        if (res.data && Array.isArray(res.data)) {
          const newMessages = res.data.map((messageObj) => {
            return {
              text: messageObj.message,
              type: messageObj.status === "sent" ? "received" : "sent",
            };
          });
          setMessages(newMessages);
        } else {
          console.error("Unexpected data format", res.data);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    
    fetchMessages();
  

    const socketInstance = socketIOClient(API_URL);
    setSocket(socketInstance);
  
    
    socketInstance.on("receive_message", (messageData) => {
      
      if (messageData.senderId !== userId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: messageData.message,
            type: "received",
          },
        ]);
      }
    });
  
    
    return () => {
      socketInstance.disconnect();
    };
  }, [userId, receiverId]);
  
  
  const sendMessage = async () => {
    const message = newMessage.trim();
  
    if (message && socket) {
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, type: "sent" },
      ]);
  
      try {
        const res = await axios.post(`${API_URL}/messages/SendMessage`, {
          senderId: userId,
          message,
          status: "received",
          lang,
          receiverId: receiverId
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
      
      
      setNewMessage("");
    }
  };
  
  
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  
  useEffect(() => {
    const chatBody = document.getElementById("chatBody");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-window">
       
        <div className="chat-header" style={{ backgroundColor: '#5d99ae', color: 'white', padding: '10px 15px', borderRadius: '10px 10px 0 0' }}>
          <div className="chat-header-content">
            <img src={logo} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
            <div className="header-info">
              <h4 style={{ margin: '0', fontSize: '16px' }}>Chalets Owner</h4>
              {chalet_title && <p style={{ margin: '0', fontSize: '12px' }}>{chalet_title}</p>}
            </div>
          </div>
        </div>

       
        <div 
          className="chat-body" 
          id="chatBody"
          style={{ 
            backgroundColor: '#f0f0f0', 
            padding: '15px', 
            height: '400px', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {messages.map((message, index) => (
            <div 
              className={`message-container ${message.type}`} 
              key={index}
              style={{ 
                display: 'flex', 
                justifyContent: message.type === 'sent' ? 'flex-end' : 'flex-start',
                marginBottom: '8px'
              }}
            >
              <div 
                className={`message-bubble ${message.type}`}
                style={{ 
                  backgroundColor: message.type === 'sent' ? '#e7d7bd' : '#ffffff',
                  color: 'black',
                  padding: '8px 12px',
                  borderRadius: '18px',
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              >
                <div className="message-text">{message.text}</div>
                
              </div>
            </div>
          ))}
        </div>

        <div 
          className="chat-input-container"
          style={{
            display: 'flex',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderTop: '1px solid #ddd',
            borderRadius: '0 0 10px 10px'
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              flex: '1',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '20px',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={sendMessage}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#5d99ae',
              color: 'white',
              border: 'none',
              marginLeft: '10px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <img src={send} alt="send" width="20px" height="20px" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;