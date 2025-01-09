import React, { useState } from 'react';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; 
import Cookies from 'js-cookie';
function AddHeader() {
    const [header_name, setheader_name] = useState("");
  const [url, seturl] = useState("");
  const navigate = useNavigate();
  const language = Cookies.get('lang') || 'en';

  const handleheader_name = async (e) => {
    e.preventDefault();
   
    try {
      const response = await axios.post(
        `${API_URL}/header/createHeader`,
        {header_name,"lang":language,"url":url},
      );
      Swal.fire({
        title: "Success!",
        text: "Header added successful.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/header");
    } catch (error) {
      console.error(error);
      Swal.fire({
        header_name: "Error!",
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
          <Typography variant="h2" className="font-bold mb-4">{language ==='ar'? "اضافة " :"Add header"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleheader_name}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {language ==='ar'? "العنوان" :"header_name"}
              </Typography>
              <Input
              required
                size="lg"
                placeholder="ds12"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    setheader_name(e.target.value);
                  }}           />
             
             <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {language ==='ar'? "الرابط" :"Url"}
              </Typography>
              <Input
              required
                size="lg"
                placeholder="ds12"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    seturl(e.target.value);
                  }}           />
             
            

            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
          {language ==='ar'? "اضافة " :"Add header"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddHeader;
