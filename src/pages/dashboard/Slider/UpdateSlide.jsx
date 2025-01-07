import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateSlide() {
    const [updateslide, setUpdateSlide] = useState({
        title: "",
        subtitle: "",
        link_to: "",
        img: null,
    });
    const [existing_img, setExistingImg] = useState(null);
    const [main_product, setmain_product] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchSlider = async () => {
            try {
                const response = await axios.get(`${API_URL}/slider/getbyid/${id}`);
                setUpdateSlide({
                    title: response.data[0].title,
                    subtitle: response.data[0].subtitle,
                    link_to: response.data[0].link_to,
                    img: null, // Reset img to null initially; will update with file input
                });
                setExistingImg(response.data[0].img);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSlider();
    }, [id]);

    useEffect(()=>{

        const fetchMain_product_type = async () => {
          try {
            const response = await axios.get(`${API_URL}/mainproduct/getmainproduct`);
            setmain_product(response.data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchMain_product_type()
      },[])

    const handleUpdateSlide = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", updateslide.title);
        formData.append("subtitle", updateslide.subtitle);
        formData.append("link_to", updateslide.link_to);
        if (updateslide.img) {
            formData.append("img", updateslide.img);
        }

        try {
            await axios.put(`${API_URL}/slider/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                title: "Success!",
                text: "Slide updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/slider");
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
        setUpdateSlide({
            ...updateslide,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل الصورة" :"Update Slide"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateSlide}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
                            <Input
                                size="lg"
                                name='title'
                                placeholder="fragrance"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateslide.title}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان الفرعي" :"Subtitle"}</Typography>
                            <Input
                                size="lg"
                                placeholder="fragrance type"
                                name="subtitle"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateslide.subtitle}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الى صفحة" :"Link To"}</Typography>
                            <select 
    onChange={handleChange}
    name="link_to"
    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={updateslide.link_to} // Bind select value to link_to state
>
    {main_product.map((item) => (
        <option key={item.id} value={item.id}>
            {item.name}
        </option>
    ))}
</select>

                        </div>

                        <Typography variant="small" color="blue-gray" className="font-medium">`${lang ==='ar'? "الصورة" :"Image"}`</Typography>
                        <div className="flex flex-col">
                            {existing_img && (
                                <img src={`${API_URL}/${existing_img}`} alt="Existing brand" className="mb-2 w-32 h-32 object-cover" />
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
                                    {updateslide.img ? updateslide.img.name : "No image selected"}
                                </Typography>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                    {lang ==='ar'? "تعديل الصورة" :"Update Slide"}                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdateSlide;
