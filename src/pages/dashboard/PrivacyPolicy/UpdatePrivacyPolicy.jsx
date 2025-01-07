import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; 
import Cookies from 'js-cookie';
function UpdatePrivacyPolicy() {
    const [title, setTitle] = useState(""); 
    const [description, setDescription] = useState(""); 
    const { id } = useParams();
    const navigate = useNavigate();
    const lang = Cookies.get('lang') || 'en';

  
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await axios.get(`${API_URL}/privacypolicy/getprivacypolicybyid/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Failed to fetch privacy policy", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch privacy policy. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    useEffect(() => {
      fetchPrivacyPolicy();
    }, [id]);


    const handleUpdatePrivacyPolicy = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.put(
          `${API_URL}/privacypolicy/update/privacypolicy/${id}`,
          { title, description },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: "Privacy policy updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/privacypolicies");
      } catch (error) {
        console.error("Error updating privacy policy", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update the privacy policy. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعدبل سياسة الخصوصية" :"Update Privacy Policy"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdatePrivacyPolicy}>
          <div className="grid grid-cols-1 gap-6">
            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
              <Input
                required
                size="lg"
                placeholder="Enter the title"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={title}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

          </div>

          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "تعدبل سياسة الخصوصية" :"Update Privacy Policy"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdatePrivacyPolicy;
