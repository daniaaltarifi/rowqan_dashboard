import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Cookies from 'js-cookie';
import './Styles/Brands.css';
import { useState,useEffect } from "react";
import SignIn from './pages/auth/sign-in';
import Abouts from "./pages/dashboard/About/Abouts.jsx";
import UpdateAbout from "./pages/dashboard/About/UpdateAbout.jsx";
import UpdateFooter from "./pages/dashboard/Footer/UpdateFooter.jsx";
import AddSocail from "./pages/dashboard/Footer/AddSocial.jsx";
import UpdateSocial from "./pages/dashboard/Footer/UpdateSocial.jsx";
import AddHeader from "./pages/dashboard/Header/AddHeader.jsx";
import UpdateHeader from "./pages/dashboard/Header/UpdateHeader.jsx";
import LanguageSwitcher from "./LanguageSwitcher";
import DirectionHandler from "./DirectionHandler";
import AddChalets from "./pages/dashboard/Chalets/AddChalets";
import UpdateChalets from "./pages/dashboard/Chalets/UpdateChalets";
import AddDetails from "./pages/dashboard/Chalets/AddDetails";
import UpdateDetails from "./pages/dashboard/Chalets/UpdateDetails";
import AddProperties from "./pages/dashboard/Properties/AddProperties";
import UpdateProerties from "./pages/dashboard/Properties/UpdateProperties";
import AddBriefChalets from "./pages/dashboard/Properties/AddBriefChalets";
import UpdateBriefChalets from "./pages/dashboard/Properties/UpdateBriefChalets";
import AddImagesChalets from "./pages/dashboard/Properties/AddImagesChalets";
import UpdateHero from "./pages/dashboard/About/UpdateHero";
import UpdateBlog from "./pages/dashboard/About/UpdateBlog";
import AddBlog from "./pages/dashboard/About/AddBlog";
import AddFooter from "./pages/dashboard/Footer/AddFooter";
import ReservationCalendar from "./pages/dashboard/Chalets/ReservationCalendar";
import UpdateLogo from "./pages/dashboard/Header/UpdateLogo";
import AddContact from "./pages/dashboard/Contact/AddContact";
import UpdateContact from "./pages/dashboard/Contact/UpdateContact";
import AddRightTimeChalets from "./pages/dashboard/TimeAndStatus/AddRightTimeChalet";
import UpdateRightTimeChalet from "./pages/dashboard/TimeAndStatus/UpdateRightTimeChalet";
import AddStatusChalet from "./pages/dashboard/TimeAndStatus/AddStatusChalet";
import UpdateStatusChalet from "./pages/dashboard/TimeAndStatus/UpdateStatusChalet";
// export const API_URL="https://rowqanbackend.rowqan.com";
import axios from 'axios'
import AddPropertiesChalet from "./pages/dashboard/Chalets/AddPropertiesChalet";
import AddCharacterChalets from "./pages/dashboard/Chalets/AddCharacterChalets";
import AddImagesSpecificChal from "./pages/dashboard/Chalets/AddImagesSpecificChal";
import Messages from "./ChaletsOwners DashBoard/Messages";
export const API_URL="http://localhost:5000";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('authtoken'));
  useEffect(() => {
    const token = Cookies.get('authtoken');
    if (token) {
      setIsAuthenticated(!!token);
      }
  }, []);
  
  const [ip, setIp] = useState(null);
  const [access, setAccess] = useState(null); 
 useEffect(() => {
    fetch("https://api.ipify.org?format=text")
      .then((response) => response.text())
      .then((data) => {
        setIp(data);
      })
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  useEffect(() => {
    if (ip) {
      axios
        .get(`${API_URL}/dashboard`, { params: { ip: ip } })
        .then((response) => {
          if (response.data.message === "Access granted to the dashboard") {
            setAccess(true); 
          } else {
            setAccess(false); 
          }
        })
        .catch((error) => {
          console.error("Error checking VPN or IP:", error);
          setAccess(false); 
        });
    }
  }, [ip]); 

  if (access === null) {
    return <div>Loading...</div>; 
  }

  if (!access) {
    return <div>Access denied due to VPN/Proxy </div>; 
  }   
  
  return (
    <>
      <DirectionHandler />
    <Routes>
      <Route path="/dashboard/*" element={
        isAuthenticated ? <Dashboard /> : <Navigate to="/auth/sign-in" replace />
      }> 
        <Route path="updatesocial/:id" element={<UpdateSocial />} />
        <Route path="addheader" element={<AddHeader />} />
        <Route path="updateheader/:id" element={<UpdateHeader />} />
        {/* <Route path="dashboard/abouts" element={<Abouts />} /> */}
<Route path="addchalet" element={<AddChalets />} />
<Route path="updatechalet/:id" element={<UpdateChalets />} />
<Route path="adddetails/:chalet_id" element={<AddDetails />} />
<Route path="updatedetails/:id" element={<UpdateDetails />} />
<Route path="addchaletproperties/:chalet_id" element={<AddPropertiesChalet />} />
<Route path="addproperties" element={<AddProperties />} />
<Route path="updatepropertieschalet/:id" element={<UpdateProerties />} />
<Route path="addcharchalets/:chalet_id" element={<AddCharacterChalets />} />
<Route path="addbriefchalets" element={<AddBriefChalets />} />
<Route path="updatebriefchalets/:id" element={<UpdateBriefChalets />} />
<Route path="addimgchalets/:chalet_id" element={<AddImagesSpecificChal />} />
<Route path="addimgchalets" element={<AddImagesChalets />} />
<Route path="abouts" element={<Abouts />} />
<Route path="updateabouts/:id" element={<UpdateAbout />} />
<Route path="updatehero/:id" element={<UpdateHero />} />
<Route path="addblog" element={<AddBlog />} />
<Route path="updateblog/:id" element={<UpdateBlog />} />
<Route path="addfooter" element={<AddFooter />} />
<Route path="updatefooter/:id" element={<UpdateFooter />} />
<Route path="addsocial" element={<AddSocail />} />
<Route path="reservationcalendar/:chalet_id" element={<ReservationCalendar />} />
<Route path="updatelogo/:id" element={<UpdateLogo />} />
<Route path="addcontact" element={<AddContact />} />
<Route path="updatecontact/:id" element={<UpdateContact />} />
<Route path="addrighttimechalet" element={<AddRightTimeChalets />} />
<Route path="updaterighttimechalet/:id" element={<UpdateRightTimeChalet />} />
<Route path="addstatuschalet" element={<AddStatusChalet />} />
<Route path="updatestatuschalet/:id" element={<UpdateStatusChalet />} />
<Route path="messagebetweenusers/:user_id" element={<Messages />} />

      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />

    </Routes>
    </>

    

  );  
}




export default App;