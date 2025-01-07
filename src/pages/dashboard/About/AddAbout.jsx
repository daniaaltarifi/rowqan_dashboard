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
function AddAbout() {
    const [title, setTitle] = useState(""); 
    const [description, setDescription] = useState("");
    const [img, setImg] = useState(null); 
    const [imgName, setImgName] = useState(""); 
    const lang = Cookies.get('lang') || 'en';

    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImg(file);
          setImgName(file.name); 
        } else {
          setImg(null);
          setImgName(""); 
        }
    };

    const navigate = useNavigate();

    
    const handleAddAbout = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("img", img);

      try {
        const response = await axios.post(
          `${API_URL}/about/addabout`, 
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: "About post added successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/about"); 
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة عن مزرعتنا" :"Add About"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddAbout}>
          <div className="grid grid-cols-1 gap-6">
            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" : "Title: "}</Typography>
              <Input
                required
                size="lg"
                placeholder="Enter the title"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>

            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الوصف" :"Description"}</Typography>
              <Input
                required
                size="lg"
                placeholder="Enter the description"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setDescription(e.target.value)} 
              />
            </div>

            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الصورة" :"Image"}</Typography>
              <Typography variant="small" color="blue-gray" className="mb-2">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>
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
               
                {imgName && (
                  <Typography variant="small" color="blue-gray" className="mt-2">
                    Selected File: {imgName}
                  </Typography>
                )}
              </div>
            </div>
          </div>

        
          <Button type="submit" className="mt-6" fullWidth>
            {lang ==='ar'? "اضافة" :" Add About Post"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddAbout;
