import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateContact() {
    const [updateContact, setUpdateContact] = useState({
        title: "",
        action: "",
        img: null,
    });
    const [existing_img, setExistingImg] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchcontact = async () => {
            try {
                const response = await axios.get(`${API_URL}/ContactUs/getcontactusid/${id}/${lang}`);
                setUpdateContact({
                    title: response.data.title,
                    action: response.data.action,
                     img: null, // Reset img to null initially; will update with file input
                });
                setExistingImg(response.data.image);
            } catch (error) {
                console.error(error);
            }
        };

        fetchcontact();
    }, [id]);

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", updateContact.title);
        formData.append("action", updateContact.action);
        formData.append("lang", lang);
        if (updateContact.img) {
            formData.append("image", updateContact.img);
        }

        try {
            await axios.put(`${API_URL}/Contacts/updateContacts/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                title: "Success!",
                text: "Contact updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/contact");
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
        setUpdateContact({
            ...updateContact,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل تواصل" :"Update Contact"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateContact}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
                            <Input
                                size="lg"
                                name='title'
                                placeholder="fragrance"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateContact.title}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الرابط" :"link"}</Typography>
                            <Input
                                size="lg"
                                name="action"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateContact.action}
                                onChange={handleChange}
                                required
                            />
                            
                        </div>

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
                                    {updateContact.img ? updateContact.img.name : "No image selected"}
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

export default UpdateContact;
