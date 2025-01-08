import React, { useEffect, useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; // Ensure Axios is imported
import Cookies from 'js-cookie';
function AddSocail() {
    const [link_to, setlink_to] = useState("");
    const [icon, seticon] = useState(null);
    const [iconName, seticonName] = useState("");
    const [footer, setfooter] = useState([]);
    const lang = Cookies.get('lang') || 'en';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          seticon(file);
            seticonName(file.name); // Set the image name
        } else {
          seticon(null);
            seticonName(""); // Reset if no file is selected
        }
    };
    const navigate = useNavigate();
    const handleAddSocail = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("link_to", link_to);
      formData.append("icon", icon);  
      try {
        const response = await axios.post(
          `${API_URL}/footericons/createFooterIcon`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire({
          link_to: "Success!",
          text: "icon added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/footer");
      } catch (error) {
        console.error(error);
        Swal.fire({
          link_to: "Error!",
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة صورة " :"Add icon"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddSocail}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الرابط" :"Link to"}</Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    setlink_to(e.target.value);
                  }} 
                 />
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الصورة" :"Icon"}</Typography>
                <Typography variant="small" color="blue-gray" className="mb-2 ">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>
                            <div className="relative">
                                <input
                                required
                                    type="file"
                                    id="file_input"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                                {lang ==='ar'? "اختر الصورة  " :" Choose an image"}
                                </Button>
                                 {/* Display the image name if it exists */}
                {iconName && (
                    <Typography variant="small" color="blue-gray" className="mt-2">
                        Selected File: {iconName}
                    </Typography>
                )}
                            </div>

            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "اضافة  " :"Add icon"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddSocail;
