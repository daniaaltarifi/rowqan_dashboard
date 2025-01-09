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
function UpdateHeader() {
    const lang = Cookies.get('lang') || 'en';

    const [header, setheader] = useState({
        header_name: "",
        lang: "",
        url: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();
   
    useEffect(() => {
        const fetchheader = async () => {
            try {
                const response = await axios.get(`${API_URL}/header/getHeaderById/${id}/${lang}`);
                setheader( 
                    {header_name: response.data.header_name,
                    url: response.data.url
                })
            } catch (error) {
                console.error(error);
            }
        };
      
          fetchheader();
    }, [id]);
    const handleUpdateheader = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${API_URL}/header/updateHeader/${id}`, header);
            Swal.fire({
                title: "Success!",
                text: "Header updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate('/dashboard/header');
        } catch (error) {
            console.error(error);
            Swal.fire({
                header_name: "Error!",
                text: "Failed to update. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleChange = (e) => {
        setheader({
            ...header,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل " :"Update Header"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateheader}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"header_name"}</Typography>
                            <Input
                                name="header_name" // Ensure name is set for correct state mapping
                                size="lg"
                                placeholder="dse1"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={header.header_name}
                                onChange={handleChange}
                                required
                            />
                
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium"> {lang ==='ar'? "الرابط" :"Url"}
                                         </Typography>
                                         <Input
                                         required
                                           size="lg"
                                           placeholder="ds12"
                                name="url" // Ensure name is set for correct state mapping

                                           value={header.url}
                                           className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                           onChange={handleChange}
                                           />
                                        
                        </div>
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                    {lang ==='ar'? "تعديل " :"Update Header"}                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdateHeader;
