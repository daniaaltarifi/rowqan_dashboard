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
function UpdateCertificate() {
    const [certificate_name, setCertificateName] = useState("");
    const [certificate_img, setCertificateImg] = useState(null);
    const [existing_img, setExistingImg] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
      const fetchBrand = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/certificate/getcertificatebyid/${id}`
          );
          setCertificateName(response.data.certificate_name);
          setExistingImg(response.data.certificate_img); // Assuming the response includes the image URL
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchBrand();
    }, [id]);

    const handleUpdateCertificate = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("certificate_name", certificate_name);
      // Only append the new image if it's selected, otherwise leave it out
      if (certificate_img) {
        formData.append("certificate_img", certificate_img);
      }

      try {
        await axios.put(`${API_URL}/certificate/updatecert/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire({
          title: "Success!",
          text: "Brand Updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/brands");
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
          <Typography variant="h2" className="font-bold mb-4">               {lang ==='ar'? "تعديل الشهادة " :" Update Certificate "}
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateCertificate}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* Brand Name Input */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "اسم الشهادة" :"certificate Name"}</Typography>
              <Input
                size="lg"
                placeholder="Espirt"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={certificate_name}
                onChange={(e) => {
                  setCertificateName(e.target.value);
                }}
              />
            </div>

            {/* Brand Image Input */}
            <Typography variant="small" color="blue-gray" className=" font-medium">{lang ==='ar'? "الصورة" :"Image"}</Typography>
            <div className="flex flex-col">
              {existing_img && (
                <img src={`${API_URL}/${existing_img}`} alt="Existing brand" className="mb-2 w-32 h-32 object-cover" />
              )}
                <Typography variant="small" color="blue-gray" className="mb-2 ">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>

              <div className="relative">
                <input
                  type="file"
                  id="file_input"
                  onChange={(e) => setCertificateImg(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                            {lang ==='ar'? "اختر الصورة  " :" Choose an image"}

                </Button>
                <Typography>
                  {certificate_img ? (
                    <p>{certificate_img.name}</p> // Show selected image name
                  ) : (
                    <Typography variant="small" color="blue-gray" className="text-gray-500">   {lang ==='ar'? " لا يوجد صور مختارة  " :" No image selected"}</Typography>
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-6" fullWidth>
          {lang ==='ar'? "تعديل الشهادة " :" Update Certificate "}          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateCertificate;
