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
// export const API_URL="https://mazr3tnabackend.kassel.icu";
export const API_URL="http://localhost:5000";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('authtoken'));
  useEffect(() => {
    const token = Cookies.get('authtoken');
    if (token) {
      setIsAuthenticated(!!token);
      }
  }, []);
  
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


     
        {/* ////////////////////////////////////////////////// */}
<Route path="addchalet" element={<AddChalets />} />
<Route path="updatechalet/:id" element={<UpdateChalets />} />
<Route path="adddetails" element={<AddDetails />} />
<Route path="updatedetails/:id" element={<UpdateDetails />} />
<Route path="addchaletproperties" element={<AddProperties />} />
<Route path="updatepropertieschalet/:id" element={<UpdateProerties />} />
<Route path="addbriefchalets" element={<AddBriefChalets />} />
<Route path="updatebriefchalets/:id" element={<UpdateBriefChalets />} />
<Route path="addimgchalets" element={<AddImagesChalets />} />
<Route path="abouts" element={<Abouts />} />
<Route path="updateabouts/:id" element={<UpdateAbout />} />
<Route path="updatehero/:id" element={<UpdateHero />} />
<Route path="addblog" element={<AddBlog />} />
<Route path="updateblog/:id" element={<UpdateBlog />} />
<Route path="addfooter" element={<AddFooter />} />
<Route path="updatefooter/:id" element={<UpdateFooter />} />
<Route path="addsocial" element={<AddSocail />} />

      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />

    </Routes>
    </>

  );
}

export default App;