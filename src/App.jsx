import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Cookies from 'js-cookie';
import './Styles/Brands.css';
import { useState,useEffect } from "react";
import AddUser from "./pages/dashboard/Users/AddUser.jsx";
import UpdateUser from "./pages/dashboard/Users/UpdateUser.jsx";
import AddBrand from "./pages/dashboard/Brands/AddCertificate.jsx";
import UpdateBrand from "./pages/dashboard/Brands/UpdateCertificate.jsx";
import AddCode from "./pages/dashboard/Codes/AddCodes.jsx";
import UpdateCode from "./pages/dashboard/Codes/UpdateCode.jsx";
import AddSlide from "./pages/dashboard/Slider/AddSlide.jsx";
import UpdateSlide from "./pages/dashboard/Slider/UpdateSlide.jsx";
import SignIn from './pages/auth/sign-in';


import AddCategory from "./pages/dashboard/Category/AddCategory";
import AddProduct from "./pages/dashboard/Products/AddProducts/AddProduct";
import UpdateProduct from "./pages/dashboard/Products/UpdateProducts";
import UpdateVariant from "./pages/dashboard/Products/UpdateVariants.jsx";
import AddBlog from "./pages/dashboard/Blogs/AddBlog.jsx";
import UpdateBlog from "./pages/dashboard/Blogs/UpdateBlog.jsx";

import Abouts from "./pages/dashboard/About/Abouts.jsx";
import AddAbout from "./pages/dashboard/About/AddAbout.jsx";
import UpdateAbout from "./pages/dashboard/About/UpdateAbout.jsx";
import UpdateFooter from "./pages/dashboard/Footer/UpdateFooter.jsx";
import AddSocail from "./pages/dashboard/Footer/AddSocial.jsx";
import UpdateSocial from "./pages/dashboard/Footer/UpdateSocial.jsx";

import UpdatePrivacyPolicy from "./pages/dashboard/PrivacyPolicy/UpdatePrivacyPolicy.jsx"
import PrivacyPolicies from "./pages/dashboard/PrivacyPolicy/AllPrivacyPolicy.jsx";
import AddPrivacyPolicy from "./pages/dashboard/PrivacyPolicy/AddPrivacyPolicy.jsx";
import UpdateTermsAndConditions from "./pages/dashboard/TermsConditions/UpdateTermsAndConditions.jsx";
import AddHeader from "./pages/dashboard/Header/AddHeader.jsx";
import UpdateHeader from "./pages/dashboard/Header/UpdateHeader.jsx";
import LanguageSwitcher from "./LanguageSwitcher";
import DirectionHandler from "./DirectionHandler";
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
        <Route path="adduser" element={<AddUser />} />
        <Route path="updateuser/:id" element={<UpdateUser />} />
        <Route path="addcertificate" element={<AddBrand />} />
        <Route path="updatebrand" element={<UpdateBrand />} />
        <Route path="addcode" element={<AddCode />} />
        <Route path="updatecode/:id" element={<UpdateCode />} />
        <Route path="addslide" element={<AddSlide />} />
        <Route path="updateslide/:id" element={<UpdateSlide />} />
        <Route path="addcategory" element={<AddCategory />} />
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="addblog" element={<AddBlog />} />
        <Route path="updateblog/:id" element={<UpdateBlog />} />
        <Route path="updatefooter/:id" element={<UpdateFooter />} />
        <Route path="addsocial" element={<AddSocail />} />
        <Route path="updatesocial/:id" element={<UpdateSocial />} />
        <Route path="addheader" element={<AddHeader />} />
        <Route path="updateheader/:id" element={<UpdateHeader />} />


        <Route path="abouts" element={<Abouts />} />
        <Route path="dashboard/abouts" element={<Abouts />} />
        <Route path="addabout" element={<AddAbout />} />
        <Route path="updateproducts/:id" element={<UpdateProduct />} /> 
        <Route path="updatevariants/:id" element={<UpdateVariant />} />
        <Route path="updateabouts/:id" element={<UpdateAbout />} />

        <Route  path="allprivacypolicy"  element={<PrivacyPolicies/>} />
        <Route  path="addprivacypolicy"  element={<AddPrivacyPolicy/>} />
        <Route  path="updateprivacypolicy"  element={<UpdatePrivacyPolicy/>} />
        <Route  path="updatetermsandconditions"  element={<UpdateTermsAndConditions/>} />
      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />

    </Routes>
    </>

  );
}

export default App;