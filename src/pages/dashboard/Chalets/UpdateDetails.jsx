import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateDetails() {
    const [updateDetails, setUpdateDetails] = useState({
        Detail_Type: "",
        chalet_id: "",
    });
    const [chalets, setChalets] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchSlider = async () => {
            try {
                const response = await axios.get(`${API_URL}/chaletsdetails/getChaletDetailsById/${id}/${lang}`);
                setUpdateDetails({
                    Detail_Type: response.data.Detail_Type,
                    chalet_id: response.data.chalet_id,
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchSlider();
    }, [id]);

    useEffect(()=>{

        const fetchChalets= async () => {
          try {
            const response = await axios.get(`${API_URL}/chalets/getallchalets/${lang}`) ;
            setChalets(response.data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchChalets()
      },[])

    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/chaletsdetails/updatedetails/${id}`, 
                 { "Detail_Type":updateDetails.Detail_Type, lang, "chalet_id":updateDetails.chalet_id },  // Correctly format the payload
                {
                    headers: {
                        "Content-Type": "application/json", // Correct Content-Type for JSON data
                    },
                });
            Swal.fire({
                Detail_Type: "Success!",
                text: "Chalets Details updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/chalets");
        } catch (error) {
            console.error(error);
            Swal.fire({
                Detail_Type: "Error!",
                text: "Failed to update. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleChange = (e) => {
        const { name, type, files } = e.target;
        setUpdateDetails({
            ...updateDetails,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل شاليه" :"Update chalets"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateDetails}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "التفصيل" :"Detail_Type"}</Typography>
                            <Input
                                size="lg"
                                name='Detail_Type'
                                placeholder="fragrance"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateDetails.Detail_Type}
                                onChange={handleChange}
                                required
                            />
                       
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الشاليه" :"chalet_id"}</Typography>
                            <select 
    onChange={handleChange}
    name="chalet_id"
    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={updateDetails.chalet_id} // Bind select value to status_id state
>
    {chalets.map((item) => (
        <option key={item.id} value={item.id}>
            {item.title}
        </option>
    ))}
</select>


                       
                        </div>
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                    {lang ==='ar'? "تعديل " :"Update "}                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdateDetails;
