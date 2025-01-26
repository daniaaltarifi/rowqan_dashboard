import React, { useEffect, useState } from 'react'
import '../Styles/ChatBot.css'
import axios from 'axios'
import { API_URL } from '@/App'
import Cookies from 'js-cookie';
import profile from "../Images/user.png";
import { Link, useParams } from 'react-router-dom';

function UsersByChaletsMessages() {
    const {chalet_id}=useParams()
  const [recentMessages,setRecentMessages]=useState([])
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
 const lang = Cookies.get('lang') || 'en';
 const receiverId = Cookies.get('receiverId');
  
  useEffect(()=>{
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/getMessagesByRecieverId/${receiverId}/${chalet_id}`);
          setRecentMessages(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchMessages();
  },[])
  const dataToDisplay = searchQuery ? searchResults : recentMessages;

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter the courses based on the search query
    const filteredResults = recentMessages.filter((message) =>
      message.Sender?.name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };
  return (
   <div className="left-panel">
        <div className="search-bar">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={handleInputChange}            />
        </div>

        <div className="recent-chats">
          {dataToDisplay.map((message)=>(
            <Link 
            to={`messagebetweenusers/${message.senderId}`}
            >
            <div className="recent-chat" key={message.id}>
                <img src={profile} alt="Profile"/>
                <div className="chat-info">
                    <h5>{message.Sender?.name}</h5>
                    <p>{message.message}</p>
                </div>
            </div>
            </Link>

          ))}
        </div>
    </div>  )
}

export default UsersByChaletsMessages