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
function UpdateSocial() {
    const [link_to, setlink_to] = useState("");
    const [icon, seticon] = useState(null);
    const [existing_icon, setExistingicon] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
      const fetchsocial = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/social/getsocialbyid/${id}`
          );
          setlink_to(response.data.link_to);
          setExistingicon(response.data.icon); 
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchsocial();
    }, [id]);

    const handleUpdateSocial = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("link_to", link_to);
      // Only append the new image if it's selected, otherwise leave it out
      if (icon) {
        formData.append("icon", icon);
      }

      try {
        await axios.put(`${API_URL}/social/updatesocial/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire({
          link_to: "Success!",
          text: "Social Media Updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/footer");
      } catch (error) {
        console.error(error);
        Swal.fire({
          link_to: "Error!",
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
          <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل تواصل اجنماعي " :"Update Social Media"}</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateSocial}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* Brand Name Input */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الرابط" :"Link to"}</Typography>
              <Input
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={link_to}
                onChange={(e) => {
                  setlink_to(e.target.value);
                }}
              />
            </div>
            <Typography variant="small" color="blue-gray" className=" font-medium">{lang ==='ar'? "الصورة" :"Icon"}</Typography>
            <div className="flex flex-col">
              {existing_icon && (
                <img src={`${API_URL}/${existing_icon}`} alt="Existing brand" className="mb-2 w-32 h-32 object-cover" />
              )}
                <Typography variant="small" color="blue-gray" className="mb-2 ">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>

              <div className="relative">
                <input
                  type="file"
                  id="file_input"
                  onChange={(e) => seticon(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                {lang ==='ar'? "اختر الصورة  " :" Choose an image"}
                </Button>
                <Typography>
                  {icon ? (
                    <p>{icon.name}</p> // Show selected image name
                  ) : (
                    <Typography variant="small" color="blue-gray" className="text-gray-500">  {lang ==='ar'? " لا يوجد صور مختارة  " :" No image selected"}</Typography>
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "تعديل تواصل اجنماعي " :"Update Social Media"}          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateSocial;
