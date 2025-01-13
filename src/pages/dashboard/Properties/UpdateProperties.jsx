import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateProerties() {
    const [updateProerties, setUpdateProerties] = useState({
        title: "",
        Chalet_Id : "",
        img: null,
    });
    const [existing_img, setExistingImg] = useState(null);
    const [chalets, setChalets] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchproperbyid = async () => {
            try {
                const response = await axios.get(`${API_URL}/propschalets/getPropChaletById/${id}/${lang}`);
                setUpdateProerties({
                    title: response.data.title,
                    Chalet_Id : response.data.Chalet_Id,
                     img: null, // Reset img to null initially; will update with file input
                });
                setExistingImg(response.data.image);
                console.log("first", response.data.status?.id)
            } catch (error) {
                console.error(error);
            }
        };

        fetchproperbyid();
    }, [id]);

    useEffect(()=>{

        const fetchChalets = async () => {
            try {
                const response = await axios.get(`${API_URL}/chalets/getallchalets/${lang}`) ;
                setChalets(response.data);
            } catch (error) {
              console.error(error);
            }
          };
          fetchChalets()
      },[])

    const handleUpdateProerties = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", updateProerties.title);
        formData.append("Chalet_Id", updateProerties.Chalet_Id );
        formData.append("lang", lang );
        if (updateProerties.img) {
            formData.append("image", updateProerties.img);
        }

        try {
            await axios.put(`${API_URL}/propschalets/UpdatePropChalet/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire({
                title: "Success!",
                text: "Properties Chalets updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/propertieschalets");
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
        setUpdateProerties({
            ...updateProerties,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل خاصية  شاليه" :"Update Properties chalets"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateProerties}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
                            <Input
                                size="lg"
                                name='title'
                                placeholder="fragrance"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateProerties.title}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الشاليه" :"Chalets"}</Typography>
                            <select 
    onChange={handleChange}
    name="Chalet_Id "
    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={updateProerties.Chalet_Id } // Bind select value to Chalet_Id  state
>
    {chalets.map((item) => (
        <option key={item.id} value={item.id}>
            {item.title}
        </option>
    ))}
</select>

                        </div>

                        <Typography variant="small" color="blue-gray" className="font-medium">{lang ==='ar'? "الصورة" :"Image"}</Typography>
                        <div className="flex flex-col">
                            {existing_img && (
                                <img src={`https://res.cloudinary.com/dqimsdiht/${existing_img}`} alt="Existing " className="mb-2 w-32 h-32 object-cover" />
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
                                    {updateProerties.img ? updateProerties.img.name : "No image selected"}
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

export default UpdateProerties;
