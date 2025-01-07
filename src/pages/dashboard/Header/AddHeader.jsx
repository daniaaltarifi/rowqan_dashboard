import React, { useState,useMemo, useEffect,useCallback } from 'react';
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
import axios from 'axios'; 
import Cookies from 'js-cookie';
function AddHeader() {
    const [title, settitle] = useState("");
  const [lang, setlang] = useState("");
  const [category_id, setcategory_id] = useState("");
  const navigate = useNavigate();
  const [main_product, setmain_product] = useState([]);
  const language = Cookies.get('lang') || 'en';

  const handleAddDiscounttitle = async (e) => {
    e.preventDefault();
   
    try {
      const response = await axios.post(
        `${API_URL}/header/addheader`,
        {title,lang,category_id},
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
        title: "Error!",
        text: "Failed to add. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const fetchmain_product = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/mainproduct/getmainproduct`);
      if (!response.ok) throw new Error('Failed to fetch main_product');
      const data = await response.json();
      setmain_product(data);
    } catch (error) {
      console.error('Error fetching main_product:', error);
    }
  }, []);
  useEffect(()=>{
    fetchmain_product()
  },[])
  const main_productOptions = useMemo(() => main_product.map(catg => (
    <option key={catg.id} value={catg.id}>{catg.name}</option>
  )), [main_product]);

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{language ==='ar'? "اضافة " :"Add header"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddDiscounttitle}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {language ==='ar'? "العنوان" :"Title"}
              </Typography>
              <Input
              required
                size="lg"
                placeholder="ds12"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    settitle(e.target.value);
                  }}           />
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{language ==='ar'? "اللغة" :"Lang"}

              </Typography>
              <select 
                    onChange={(e)=>{setlang(e.target.value)}} 
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value=""> {language ==='ar'? " اختر اللغة" :"Select lang"}</option>
                    <option value="en">en</option>
                    <option value="ar">ar</option>
                  </select>
             

             <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {language ==='ar'? "الصنف" :" Category:"}
            </Typography>
                   <select 
                    name="category_id" 
                    onChange={(e)=>{setcategory_id(e.target.value)}} 
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{language ==='ar'? "اختر الصنف" :"Select a category"}</option>
                    {main_productOptions}
                  </select>



            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "اضافة " :"Add header"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddHeader;
