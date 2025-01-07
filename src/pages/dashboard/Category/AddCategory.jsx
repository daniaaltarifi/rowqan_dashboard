import React, { useState } from 'react';
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
import Cookies from "js-cookie";

function AddCategory() {
    const [name, setname] = useState("");
  const navigate = useNavigate();
  const lang = Cookies.get('lang') || 'en';

  const handleAddcategory = async (e) => {
    e.preventDefault();
   
    try {
      const response = await axios.post(
        `${API_URL}/mainproduct/add`,
        {name},
      );
      Swal.fire({
        title: "Success!",
        text: "Category added successful.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/category");
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة صنف" : "Add Category "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddcategory}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الاسم" : "name: "}
              </Typography>
              <Input
              required
                size="lg"
                placeholder="ds12"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                    setname(e.target.value);
                  }}           />
            </div>            
          </div>

          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "اضافة صنف" : "Add Category "}          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddCategory;
