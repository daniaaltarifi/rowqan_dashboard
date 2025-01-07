import React, { useState, useEffect,useMemo,useCallback } from 'react';
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
        title: "",
        lang: "",
        category_id: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const [main_product, setmain_product] = useState([]);
    const fetchmain_product = useCallback(async () => {
        try {
          const response = await fetch(`${API_URL}/mainproduct/getmainproduct`);
          if (!response.ok) throw new Error('Failed to fetch main_product');
          const data = await response.json();
          setmain_product(data);
        } catch (error) {
          console.error('Error fetching main_product:', error);
        }
      }, []);
      
    useEffect(() => {
        const fetchheader = async () => {
            try {
                const response = await axios.get(`${API_URL}/header/getheaderbyid/${id}`);
                setheader(response.data); // Assuming the API response has the same structure
            } catch (error) {
                console.error(error);
            }
        };
      
          fetchheader();
          fetchmain_product()
    }, [id]);
    const main_productOptions = useMemo(() => main_product.map(catg => (
        <option key={catg.id} value={catg.id}>{catg.name}</option>
      )), [main_product]);
    
    const handleUpdateheader = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${API_URL}/header/updateheader/${id}`, header);
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
                title: "Error!",
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
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "العنوان" :"Title"}</Typography>
                            <Input
                                name="title" // Ensure name is set for correct state mapping
                                size="lg"
                                placeholder="dse1"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={header.title}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "اللغة" :"Lang"}</Typography>
                             <select
                              name="lang"
                              value={header.lang}  
                              onChange={handleChange}
                            className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{lang ==='ar'? " اختر اللغة" :"Select lang"}</option>
                    <option value="en">en</option>
                    <option value="ar">ar</option>
                  </select>
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الصنف" :" Category:"}</Typography>
                                <select 
                    name="category_id" 
                    value={header.category_id}
                    onChange={handleChange}
                    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{lang ==='ar'? "اختر الصنف" :"Select a category"}</option>
                    {main_productOptions}
                  </select>
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
