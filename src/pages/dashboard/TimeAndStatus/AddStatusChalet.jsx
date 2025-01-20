import React, {useState } from 'react';
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
function AddStatusChalet() {
    const [status, setstatus] = useState("");
    const lang = Cookies.get('lang') || 'en';

    const navigate = useNavigate();
      const handleAddStatusChalet = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_URL}/status/createstatus`,
                { status, lang },  // Correctly format the payload
                {
                    headers: {
                        "Content-Type": "application/json", // Correct Content-Type for JSON data
                    },
                }
            );
            Swal.fire({
                title: "Success!",
                text: "Status Chalet added successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/status");
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "اضافة حالة للشاليه" : "Add Status Chalets "}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddStatusChalet}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* First Column */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الحالة" :"status"} </Typography>
              <Input
              required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => {
                  setstatus(e.target.value);
                }}           />              
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

export default AddStatusChalet;
