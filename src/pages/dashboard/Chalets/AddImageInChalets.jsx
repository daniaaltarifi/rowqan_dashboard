import React, { useEffect, useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; // Ensure Axios is imported
import Cookies from 'js-cookie';
function AddImagesInChalets({chalet_id}) {
    const [imgName, setImgName] = useState("");
     const [images, setImages] = useState([]);
    const lang = Cookies.get('lang') || 'en';
    const [chalets, setChalets] = useState([]);
   const handleFileChange = (e) => {
        const files =Array.from(e.target.files);
        if (files.length > 0) {
            setImages(files); // Store files in state
            setImgName(files.map((file) => file.name).join(", ")); // Store file names for display
          } else {
            setImages([]); // Reset if no files are selected
            setImgName("");
          }
    };
    const navigate = useNavigate();
    const handleAddImagesInChalets = async () => {
      const formData = new FormData();
      formData.append("chalet_id", chalet_id );
      images.forEach((file, index) => {
        formData.append("image", file); // 'images[]' to treat it as an array in the backend
      });  
    
      try {
          const response = await axios.post(
            `${API_URL}/chaletsimages/createchaletImage`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        Swal.fire({
          title: "Success!",
          text: "Chalets added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/chalets");
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
    const handleNavigateToImagesChalet=()=>{
        navigate(`/dashboard/chalets`);
   
       }
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        {/* <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة صور شاليه" : "Add images Chalets "}</Typography>
        </div> */}
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" >
          <div className="grid grid-cols-1 gap-6 ">
                {/* First Column */}
                <div className="flex flex-col">
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الصور" :"Images"}</Typography>
                    <Typography variant="small" color="blue-gray" className="mb-2 ">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>
                                <div className="relative">
                                    <input
                                       type="file"
                                        id="file_input"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        multiple
                                    />
                                    <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                                    {lang ==='ar'? "اختر الصورة  " :" Choose an image"}
                                    </Button>
                    <Typography variant="small" color="blue-gray" className="mb-2 ">{lang ==='ar'? "  . اذا كنت لا تريد اضافة صور انقر على التالي " :"If you don`t want to add images click next to skip."}</Typography>

                                     {/* Display the image name if it exists */}
<div className="file-preview flex mt-4">
        {images.map((file, index) => {
            if (file.type.startsWith("image/")) {
                // For image files
                return (
                    <div key={index} className='mx-5'>
                        <img
                            src={URL.createObjectURL(file)} // Display the image
                            alt={file.name}
                            style={{ width: "70px", height: "70px", objectFit: "cover" }} // Style the image
                        />
                        <Typography variant="small" color="blue-gray">
                            {file.name}
                        </Typography>
                    </div>
                );
            } else if (file.type.startsWith("video/")) {
                // For video files
                return (
                    <div key={index}>
                        <video
                            width="120"
                            height="200"
                            src={URL.createObjectURL(file)} // Display the video
                        >
                        </video>
                        <Typography variant="small" color="blue-gray">
                            {file.name}
                        </Typography>
                    </div>
                    );
                   } else {
                return null;
                 }
                  })}
                 </div>
               </div>
    
                </div>            
          </div>
        <div>
          <Button
type="button" 
onClick={handleAddImagesInChalets}
  className="mt-6 bg-[#6DA6BA] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
  style={{width:"48%"}}
>
{lang ==='ar'? "اضافة" : "Add  "}</Button>
<Button
  type="submit"
  className="mt-6 ms-2  bg-[#F2C79D] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
  style={{width:"50%"}}
onClick={handleNavigateToImagesChalet}
>
{lang ==='ar'? "التالي" : "Next  "}</Button>
</div>

        </form>
      </div>
    </section>
  );
}

export default AddImagesInChalets;
