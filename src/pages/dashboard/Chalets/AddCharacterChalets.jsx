import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios'; // Ensure Axios is imported
import Cookies from 'js-cookie';
function AddCharacterChalets() {
      const {chalet_id}=useParams()
  
    const [type, settype] = useState("");
    const [value, setValue] = useState("");
 
    const lang = Cookies.get('lang') || 'en';
    const [chalets, setChalets] = useState([]);

    const navigate = useNavigate();
    const handleAddCharacterChalets = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post(
            `${API_URL}/BreifDetailsChalets/createBreif`,
            { type,value,lang,chalet_id},  // Correctly format the payload
            {
                headers: {
                    "Content-Type": "application/json", // Correct Content-Type for JSON data
                },
            }
          );
        // Swal.fire({
        //   type: "Success!",
        //   text: " Breif Characteristics Chalets added successful.",
        //   icon: "success",
        //   confirmButtonText: "OK",
        // });
        settype("")
        setValue("")
      } catch (error) {
        console.error(error);
        Swal.fire({
          type: "Error!",
          text: "Failed to add. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    const handleNavigateToImagesChalet=()=>{
      navigate(`/dashboard/addimgchalets/${chalet_id}`);
 
     }
  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة خاصثة شاليه" : "Add Breif Characteristics Chalets "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddCharacterChalets}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "النوع" :"type"} </Typography>
              <Input
              required
                size="lg"
                value={type}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  settype(e.target.value);
                }}           />
                 <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الوصف" :"value"} </Typography>
              <Input
              required
                size="lg"
                value={value}
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  setValue(e.target.value);
                }}           />
            </div>            
          </div>
<div>

          <Button
  type="submit"
  className="mt-6 bg-[#F2C79D] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
  style={{width:"48%"}}
>
{lang ==='ar'? "اضافة" : "Add  "}</Button>
<Button
  type="submit"
  className="mt-6 ms-2  bg-[#6DA6BA] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
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

export default AddCharacterChalets;
