import React, { useState } from 'react';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; // Ensure Axios is imported
import Cookies from 'js-cookie';
function AddFooter() {
    const [title, settitle] = useState("");
    const lang = Cookies.get('lang') || 'en';

    const navigate = useNavigate();
    const handleAddFooter = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `${API_URL}/footer/createFooter`,
          {"title":title,lang},
          {
            headers: {
                "Content-Type": "application/json", // Correct Content-Type for JSON data
            },
        }
        );
        Swal.fire({
          title: "Success!",
          text: "Footer added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/footer");
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to add. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
  
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة اسفل الصفحة " :"Add Footer"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddFooter}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    settitle(e.target.value);
                  }} 
                 />
            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "اضافة " :"Add"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddFooter;
