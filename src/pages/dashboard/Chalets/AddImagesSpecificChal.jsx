import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; // Ensure Axios is imported
import Cookies from 'js-cookie';
function AddImagesSpecificChal() {
  const {chalet_id}=useParams()

  const [img, setImg] = useState([]);
    const [imgName, setImgName] = useState("");
    const lang = Cookies.get('lang') || 'en';
    const [chalets, setChalets] = useState([]);

    const handleFileChange = (e) => {
        const files =Array.from(e.target.files);
        if (files.length > 0) {
            setImg(files); // Store files in state
            setImgName(files.map((file) => file.name).join(", ")); // Store file names for display
          } else {
            setImg([]); // Reset if no files are selected
            setImgName("");
          }
    };
    const navigate = useNavigate();
    const handleAddImagesSpecificChal = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("chalet_id", chalet_id );
      img.forEach((file, index) => {
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
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة صور شاليه" : "Add images Chalets "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddImagesSpecificChal}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الصورة" :"Image"}</Typography>
                <Typography variant="small" color="blue-gray" className="mb-2 ">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>
                            <div className="relative">
                                <input
                                required
                                    type="file"
                                    id="file_input"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    multiple
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

          <Button
  type="submit"
  className="mt-6 bg-[#6DA6BA] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
  fullWidth
>
{lang ==='ar'? "اضافة" : "Add  "}</Button>

        </form>
      </div>
    </section>
  );
}

export default AddImagesSpecificChal;
