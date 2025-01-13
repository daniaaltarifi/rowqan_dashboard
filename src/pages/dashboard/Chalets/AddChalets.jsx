import React, { useEffect, useState } from 'react';
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
import { data } from 'autoprefixer';
function AddChalets() {
    const [title, settitle] = useState("");
    const [reserve_price, setreserve_price] = useState("");
    const [intial_Amount, setintial_Amount] = useState("");
    const [status_id , setstatus_id ] = useState("");
    const [img, setImg] = useState(null);
    const [imgName, setImgName] = useState("");
    const [status, setstatus] = useState([]);
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

      const fetchstatus_type = async () => {
        try {
          const response = await axios.get(`${API_URL}/status/getallstatuses/${lang}`)          ;
          setstatus(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchstatus_type()
    },[])
    const handleAddChalets = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("lang", lang);
      formData.append("status_id", status_id);
      formData.append("reserve_price", reserve_price);
      formData.append("intial_Amount", intial_Amount);
      formData.append("image", img);
  
    
      try {
          const response = await axios.post(
            `${API_URL}/chalets/createchalet`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        // Swal.fire({
        //   title: "Success!",
        //   text: "Chalets added successful.",
        //   icon: "success",
        //   confirmButtonText: "OK",
        // });
        const chalet_id=response.data.id
        navigate(`/dashboard/adddetails/${chalet_id}`);
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة شاليه" : "Add Chalets "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddChalets}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "العنوان" :"Title"} </Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  settitle(e.target.value);
                }}           />
                 <Typography variant="small" color="blue-gray" className="mb-2 font-medium">  {lang ==='ar'? "سعر الحجز" :"Starting_price"}              </Typography>
              <Input
              required
              type='number'
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setreserve_price(e.target.value)}
                />
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "قيمة الحجز" :"intial_Amount"} </Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  setintial_Amount(e.target.value);
                }}           />
                   <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الحالة" :"status"}</Typography>
             
               <select 
                    onChange={(e)=>setstatus_id(e.target.value) }
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{lang ==='ar'? "اختر الحالة" :"Select status"}</option>
                    {
                    status.map((item) => (
                    <option key={item.id} value={item.id}>{item.status}</option>))
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
  className="mt-6 bg-[#6DA6BA] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
  fullWidth
>
{lang ==='ar'? "اضافة" : "Add  "}</Button>

        </form>
      </div>
    </section>
  );
}

export default AddChalets;
