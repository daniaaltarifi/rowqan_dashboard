import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateChalets() {
    const [updateChalets, setUpdateChalets] = useState({
        title: "",
        reserve_price: "",
        status_id: "",
        img: null,
    });
    const [existing_img, setExistingImg] = useState(null);
    const [status, setstatus] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchSlider = async () => {
            try {
                const response = await axios.get(`${API_URL}/chalets/getchaletbyid/${id}`);
                setUpdateChalets({
                    title: response.data.title,
                    reserve_price: response.data.reserve_price,
                    status_id: response.data.status?.[0]?.id,
                     img: null, // Reset img to null initially; will update with file input
                });
                setExistingImg(response.data.image);
                console.log("first", response.data.status?.id)
            } catch (error) {
                console.error(error);
            }
        };

        fetchSlider();
    }, [id]);

    useEffect(()=>{

        const fetchstatus_type = async () => {
          try {
            const response = await axios.get(`${API_URL}/status/getallstatuses/${lang}`) ;
            setstatus(response.data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchstatus_type()
      },[])

    const handleUpdateChalets = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", updateChalets.title);
        formData.append("reserve_price", updateChalets.reserve_price);
        formData.append("status_id", updateChalets.status_id);
        if (updateChalets.img) {
            formData.append("image", updateChalets.img);
        }

        try {
            await axios.put(`${API_URL}/chalets/updatechalet/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                title: "Success!",
                text: "Chalets updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/chalets");
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

    const handleChange = (e) => {
        const { name, type, files } = e.target;
        setUpdateChalets({
            ...updateChalets,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل شاليه" :"Update chalets"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateChalets}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
                            <Input
                                size="lg"
                                name='title'
                                placeholder="fragrance"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateChalets.title}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "سعر الحجز" :"reserve_price"}</Typography>
                            <Input
                                size="lg"
                                placeholder="fragrance type"
                                name="reserve_price"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateChalets.reserve_price}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الحالة" :"status"}</Typography>
                            <select 
    onChange={handleChange}
    name="status_id"
    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={updateChalets.status_id} // Bind select value to status_id state
>
    {status.map((item) => (
        <option key={item.id} value={item.id}>
            {item.status}
        </option>
    ))}
</select>

                        </div>

                        <Typography variant="small" color="blue-gray" className="font-medium">{lang ==='ar'? "الصورة" :"Image"}</Typography>
                        <div className="flex flex-col">
                            {existing_img && (
                                <img src={`https://res.cloudinary.com/durjqlivi/${existing_img}`} alt="Existing brand" className="mb-2 w-32 h-32 object-cover" />
                            )}
                <Typography variant="small" color="blue-gray" className="mb-2 ">{lang ==='ar'? "من المستحسن استخدام تنسيق WebP للصور." :"It is recommended to use the WebP format for images."}</Typography>

                            <div className="relative">
                                <input
                                    type="file"
                                    id="file_input"
                                    name="img"
                                    onChange={handleChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                                {lang ==='ar'? "اختر الصورة  " :" Choose an image"}
                                </Button>
                                <Typography variant="small" color="blue-gray" className="mt-2">
                                    {updateChalets.img ? updateChalets.img.name : "No image selected"}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                    {lang ==='ar'? "تعديل " :"Update "}                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdateChalets;
