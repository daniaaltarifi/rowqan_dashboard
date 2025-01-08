
import axios from 'axios';
import { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../App';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Create Context
const UserContext = createContext();

// Create a custom hook to access the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Initialize userId state
const navigate=useNavigate()
const lang = location.pathname.split("/")[1] || "en";
  // You can fetch the user ID when the app loads (e.g., from cookies or API)
  const fetchUserId = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/verifytoken`, {
        withCredentials: true,
      });
      setUserId(response.data.userId); // Store the user ID in global state
    } catch (error) {
      console.log("Error fetching user ID:", error.message);
    }
  };
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
      setUserId(null);
      navigate(`/${lang}/login`)
    } catch (error) {
      console.error('Logout error', error);
    }
  };
  // Fetch user data when the component mounts
  useEffect(() => {
    // Fetch user ID whenever the token changes
    fetchUserId();
  }, [fetchUserId]); // Dependency on token, it re-runs whenever token changes

  UserProvider.propTypes = {
    children: PropTypes.string.isRequired, 
  };
  return (
    <UserContext.Provider value={{ userId, setUserId,logout }}>
      {children}
    </UserContext.Provider>
  );
};