import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateLogo() {
    const [updateLogo, setUpdateLogo] = useState({
        img: null,
    });
    const [existing_img, setExistingImg] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchlogo = async () => {
            try {
                const response = await axios.get(`${API_URL}/logos/getlogobyid/${id}`);
                setUpdateLogo({
                     img: null, // Reset img to null initially; will update with file input
                });
                setExistingImg(response.data.image);
            } catch (error) {
                console.error(error);
            }
        };

        fetchlogo();
    }, [id]);

    const handleUpdateLogo = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (updateLogo.img) {
            formData.append("image", updateLogo.img);
        }

        try {
            await axios.put(`${API_URL}/logos/updatelogo/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                title: "Success!",
                text: "logo updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/header");
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
        setUpdateLogo({
            ...updateLogo,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل الصورة" :"Update Logo"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateLogo}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <Typography variant="small" color="blue-gray" className="font-medium">{lang ==='ar'? "الصورة" :"Image"}</Typography>
                        <div className="flex flex-col">
                            {existing_img && (
                                <img src={`https://res.cloudinary.com/dqimsdiht/${existing_img}`} alt="Existing brand" className="mb-2 w-32 h-32 object-cover" />
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
                                    {updateLogo.img ? updateLogo.img.name : "No image selected"}
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

export default UpdateLogo;
