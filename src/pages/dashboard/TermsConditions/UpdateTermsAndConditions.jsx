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
function UpdateTermsAndConditions() {
    const [title, setTitle] = useState(""); 
    const [description, setDescription] = useState(""); 
    const { id } = useParams();
    const navigate = useNavigate();
    const lang = Cookies.get('lang') || 'en';

  
    const fetchTermsAndConditions = async () => {
      try {
        const response = await axios.get(`${API_URL}/TermsConditionsRouter/getTermsConditionsbyid/${id}`);
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Failed to fetch terms and conditions", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch terms and conditions. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    useEffect(() => {
      fetchTermsAndConditions();
    }, [id]);

   
    const handleUpdateTermsAndConditions = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.put(
          `${API_URL}/TermsConditionsRouter/updateTermsConditions/${id}`,
          { title, description },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: "Terms and conditions updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/termsandconditions");
      } catch (error) {
        console.error("Error updating terms and conditions", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update the terms and conditions. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعدسل الشروط والأحكام" :"Update Terms and Conditions"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateTermsAndConditions}>
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
          {lang ==='ar'? "تعدسل الشروط والأحكام" :"Update Terms and Conditions"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateTermsAndConditions;
