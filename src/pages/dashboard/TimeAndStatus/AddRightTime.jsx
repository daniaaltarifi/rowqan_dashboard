import React, { useState } from 'react';
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
function AddRightTime() {
  const [name, setName] = useState("");
  const [type_of_time, setTypeOfTime] = useState("");
  const [from_time, setFromTime] = useState("");
  const [to_time, setToTime] = useState("");
  const [price, setPrice] = useState("");
  const [after_offer, setAfterOffer] = useState("");
  const [imageName, setImageName] = useState("");
  const lang = Cookies.get('lang') || 'en';
  const { chalet_id } = useParams();

 

  const navigate = useNavigate();

  const handleAddRightTime = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("type_of_time", type_of_time);
    formData.append("from_time", from_time);
    formData.append("to_time", to_time);
    formData.append("lang", lang);
    formData.append("price", price);
    if (after_offer) formData.append("After_Offer", after_offer);
    formData.append("chalet_id", chalet_id);

    try {
      const response = await axios.post(
        `${API_URL}/RightTimes/createrighttime`,
        formData,
      );
      Swal.fire({
        title: "Success!",
        text: "Right Time added successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      navigate("/dashboard/chalets");
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
          <Typography variant="h2" className="font-bold mb-4">
            {lang === 'ar' ? "إضافة وقت مناسب" : "Add Right Time"}
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={handleAddRightTime}
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "الاسم" : "Name"}
              </Typography>
              <Input
                required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setName(e.target.value)}
              />

              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "نوع الوقت" : "Type of Time"}
              </Typography>
              <Input
                required
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setTypeOfTime(e.target.value)}
              />

              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "من الساعة" : "From Time"}
              </Typography>
              <Input
                required
                type="time"
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setFromTime(e.target.value)}
              />

              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "إلى الساعة" : "To Time"}
              </Typography>
              <Input
                required
                type="time"
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setToTime(e.target.value)}
              />

              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "السعر" : "Price"}
              </Typography>
              <Input
                required
                type="number"
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setPrice(e.target.value)}
              />

              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                {lang === 'ar' ? "عرض بعد الخصم (اختياري)" : "After Offer (Optional)"}
              </Typography>
              <Input
                type="number"
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                onChange={(e) => setAfterOffer(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 bg-[#6DA6BA] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
            fullWidth
          >
            onClick=({handleAddRightTime})
            {lang === 'ar' ? "إضافة" : "Add"}
           
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddRightTime;
