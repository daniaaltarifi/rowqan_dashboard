import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateFooter() {
    const [title, settitle] = useState("");
       const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
      const fetchFooter = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/footer/getFooterById/${id}/${lang}`
          );
          settitle(response.data.title);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchFooter();
    }, [id]);

    const handleUpdateFooter = async (e) => {
      e.preventDefault();
      try {
        await axios.put(`${API_URL}/footer/updateFooter/${id}`,
            { "title":title, lang },  // Correctly format the payload
          {
              headers: {
                  "Content-Type": "application/json", // Correct Content-Type for JSON data
              },
          });
        Swal.fire({
          title: "Success!",
          text: "Footer Updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/footer");
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل " :"Update Footer"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateFooter}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* Brand Name Input */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" : "title "}title:</Typography>
              <Input
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={title}
                onChange={(e) => {
                  settitle(e.target.value);
                }}
              />
            </div>
           
          </div>
          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "تعديل " :"Update Footer"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateFooter;
