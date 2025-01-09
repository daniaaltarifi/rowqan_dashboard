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
function AddBlog() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [img, setimg] = useState(null);
    const [imgName, setImgName] = useState("");
    const lang = Cookies.get('lang') || 'en';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setimg(file);
            setImgName(file.name); // Set the image name
        } else {
          setimg(null);
            setImgName(""); // Reset if no file is selected
        }
    };
    const navigate = useNavigate();
    const handleAddBlog = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", img);
      formData.append("lang", lang);
  
      try {
        const response = await axios.post(
          `${API_URL}/Blogs/createBlog`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire({
          title: "Success!",
          text: "Blog added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/setting");
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة مدونة" : "Add Blogs "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddBlog}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" : "Title"}</Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    setTitle(e.target.value);
                  }} 
                 />
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الوصف" :"Desrciption"}</Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    setDescription(e.target.value);
                  }} />
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الصورة" : "Blog Image:"}</Typography>
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
                {imgName && (
                    <Typography variant="small" color="blue-gray" className="mt-2">
                        Selected File: {imgName}
                    </Typography>
                )}
                            </div>

            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
           {lang ==='ar'? "اضافة مدونة" : "Add Blog"}
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddBlog;
