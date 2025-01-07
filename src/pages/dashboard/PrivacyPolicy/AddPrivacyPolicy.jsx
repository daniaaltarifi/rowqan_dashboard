import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; 
import Cookies from 'js-cookie';
function AddPrivacyPolicy() {
    const [title, setTitle] = useState(""); 
    const [description, setDescription] = useState(""); 
    const lang = Cookies.get('lang') || 'en';

    const navigate = useNavigate();


    const handleAddPrivacyPolicy = async (e) => {
      e.preventDefault();
      
      try {
     
        const response = await axios.post(
          `${API_URL}/privacypolicy/addprivacypolicy`, 
          { title, description },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: "Privacy policy added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/privacypolicies");
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add the privacy policy. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة سياسة الخصوصية" :"Add Privacy Policy"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddPrivacyPolicy}>
          <div className="grid grid-cols-1 gap-6">
            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
              <Input
                required
                size="lg"
                placeholder="Enter the title"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الوصف" :"Description"}`</Typography>
              <Input
                required
                size="lg"
                placeholder="Enter the description"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

          </div>

          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "اضافة سياسة الخصوصية" :"Add Privacy Policy"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddPrivacyPolicy;
