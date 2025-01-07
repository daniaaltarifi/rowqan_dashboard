import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateAbout() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState(null);
    const [existingImg, setExistingImg] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); 
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
      const fetchAboutPost = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/about/getaboutpostbyid/${id}` 
          );
          setTitle(response.data.title); 
          setDescription(response.data.description); 
          setExistingImg(response.data.img); 
        } catch (error) {
          console.error(error);
        }
      };

      fetchAboutPost();
    }, [id]);

    
    const handleUpdateAbout = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", title); 
      formData.append("description", description);
      if (img) {
        formData.append("img", img);
      }

      try {
       
        await axios.put(`${API_URL}/about/updatedaboutpost/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire({
          title: "Success!",
          text: "About post updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/about");
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? " تعديل عن مزرعتنا" : "Update About "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateAbout}>
          <div className="grid grid-cols-1 gap-6">
            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" : "Title: "}</Typography>
              <Input
                size="lg"
                placeholder="Enter title"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value); 
                }}
              />
            </div>

            
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الوصف" :"Description"}</Typography>
              <Input
                size="lg"
                placeholder="Enter description"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value); 
                }}
              />
            </div>

          
            <div className="flex flex-col">
              {existingImg && (
                <img src={`${API_URL}/${existingImg}`} alt="Existing about" className="mb-2 w-32 h-32 object-cover" />
              )}
              <Typography variant="small" color="blue-gray" className="font-medium">{lang ==='ar'? "الصورة" :"Image"}</Typography>
              <Typography variant="small" color="blue-gray" className="mb-2">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>
              <div className="relative">
                <input
                  type="file"
                  id="file_input"
                  onChange={(e) => setImg(e.target.files[0])} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                {lang ==='ar'? "اختر الصورة  " :" Choose an image"}
                </Button>
                <Typography>
                  {img ? (
                    <p>{img.name}</p> 
                  ) : (
                    <Typography variant="small" color="blue-gray" className="text-gray-500">                  {lang ==='ar'? " لا يوجد صور مختارة  " :" No image selected"}
</Typography>
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-6" fullWidth>
                          {lang ==='ar'? "تعديل  " :" Update About Post    "}

          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateAbout;
