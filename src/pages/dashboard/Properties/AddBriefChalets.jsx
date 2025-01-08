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
function AddBriefChalets() {
    const [type, settype] = useState("");
    const [value, setValue] = useState("");
    const [chalet_id ,setchalet_id] = useState(null);
 
    const lang = Cookies.get('lang') || 'en';
    const [chalets, setChalets] = useState([]);

    const navigate = useNavigate();
    useEffect(()=>{

      const fetchChalets = async () => {
        try {
            const response = await axios.get(`${API_URL}/chalets/getallchalets/${lang}`) ;
            setChalets(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchChalets()
    },[])
    const handleAddBriefChalets = async (e) => {
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
        Swal.fire({
          type: "Success!",
          text: " Breif Characteristics Chalets added successful.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/propertieschalets");
      } catch (error) {
        console.error(error);
        console.log("first",type,value,lang,chalet_id)
        Swal.fire({
          type: "Error!",
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة خاصثة شاليه" : "Add Breif Characteristics Chalets "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddBriefChalets}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "النوع" :"type"} </Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  settype(e.target.value);
                }}           />
                 <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الوصف" :"value"} </Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  setValue(e.target.value);
                }}           />
                   <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الشاليه" :"Chalets"}</Typography>
             
               <select 
                    onChange={(e)=>setchalet_id(e.target.value) }
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{lang ==='ar'? "اختر الشاليه" :"Select Chalets"}</option>
                    {
                    chalets.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>))
                  }
                   
                  </select>
            </div>            
          </div>

          <Button
  type="submit"
  className="mt-6 bg-[#D87C55] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
  fullWidth
>
{lang ==='ar'? "اضافة" : "Add  "}</Button>

        </form>
      </div>
    </section>
  );
}

export default AddBriefChalets;
