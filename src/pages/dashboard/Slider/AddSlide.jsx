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
function AddSlide() {
    const [title, settitle] = useState("");
    const [subtitle, setsubtitle] = useState("");
    const [link_to, setlink_to] = useState("");
    const [img, setImg] = useState(null);
    const [imgName, setImgName] = useState("");
    const [main_product, setmain_product] = useState([]);
    const lang = Cookies.get('lang') || 'en';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImg(file);
            setImgName(file.name); // Set the image name
        } else {
            setImg(null);
            setImgName(""); // Reset if no file is selected
        }
    };
    const navigate = useNavigate();
    useEffect(()=>{

      const fetchMain_product_type = async () => {
        try {
          const response = await axios.get(`${API_URL}/mainproduct/getmainproduct`);
          setmain_product(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchMain_product_type()
    },[])
    const handleAddSlider = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("link_to", link_to);
      formData.append("img", img);
  
    
      try {
          const response = await axios.post(
            `${API_URL}/slider/add`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        Swal.fire({
          title: "Success!",
          text: "Slide added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/slider");
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة صورة" : "Add Slide "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddSlider}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "العنوان" :"Title"} </Typography>
              <Input
              required
                size="lg"
                placeholder="Fragrance"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  settitle(e.target.value);
                }}           />
                 <Typography variant="small" color="blue-gray" className="mb-2 font-medium">  {lang ==='ar'? "العنوان الفرعي" :"Subtitle"}              </Typography>
              <Input
              required
                size="lg"
                placeholder="Fragrance type"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setsubtitle(e.target.value)}
                />
                   <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الى صفحة" :"Link To"}</Typography>
             
               <select 
                    onChange={(e)=>{setlink_to(e.target.value)} }
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{lang ==='ar'? "اختر صنف" :"Select Category"}</option>
                    {
                    main_product.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>))
                  }
                   
                  </select>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الصورة" :"Image"}</Typography>
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

          <Button
  type="submit"
  className="mt-6 bg-[#D87C55] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
  fullWidth
>
{lang ==='ar'? "اضافة صورة" : "Add Slide "}</Button>

        </form>
      </div>
    </section>
  );
}

export default AddSlide;
