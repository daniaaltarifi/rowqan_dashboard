import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
import Form from 'react-bootstrap/Form';

function UpdateRightTime() {
    const [updateRightTime, setUpdateRightTime] = useState({
        type_of_time: "",
        from_time:"",
        to_time:"",
        price:"",
        After_Offer:""
    });
    const navigate = useNavigate();
    const { chalet_id,time_id } = useParams();
    const lang = Cookies.get('lang') || 'en';
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/RightTimes/getrighttimebyid/${time_id}/${lang}`);
                setUpdateRightTime({
                    type_of_time: response.data.type_of_time,
                    from_time: response.data.from_time,
                    to_time: response.data.to_time,
                    price: response.data.price,
                    After_Offer: response.data.After_Offer,
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchStatus();
    }, [time_id]);
    const handleUpdateRightTime = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/RightTimes/updaterighttime/${time_id}`, 
                 { "type_of_time":updateRightTime.type_of_time,"from_time":updateRightTime.from_time,"to_time":updateRightTime.to_time,"price":updateRightTime.price,"After_Offer":updateRightTime.After_Offer, lang,chalet_id },  // Correctly format the payload
                {
                    headers: {
                        "Content-Type": "application/json", // Correct Content-Type for JSON data
                    },
                });
            Swal.fire({
                status: "Success!",
                text: "Right Time updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/chalets");
        } catch (error) {
            console.error(error);
            Swal.fire({
                status: "Error!",
                text: "Failed to update. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleChange = (e) => {
        const { name, type, files } = e.target;
        setUpdateRightTime({
            ...updateRightTime,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل وقت الشاليه" :"Update Right Time chalets"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateRightTime}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الوقت" :"type_of_time"}</Typography>
                            {/* <Input
                                size="lg"
                                name='type_of_time'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateRightTime.type_of_time}
                                onChange={handleChange}
                                required
                            />  */}
                             <Form.Select 
              className="form-select "style={{height: '40px'}}
              name='type_of_time'
              value={updateRightTime.type_of_time}
              onChange={handleChange}              >
              <option value="">{lang === "ar" ? "اختر نوع الوقت" : "Select Type of Time"}</option>
              <option value="Morning">{lang === "ar" ? "صباحي" : "Morning"}</option>
              <option value="Evening">{lang === "ar" ? "مسائي" : "Evening"}</option>
              <option value="Full Day">{lang === "ar" ? "كل اليوم" : "Full Day"}</option>
            </Form.Select>
                        </div>
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "من الوقت" :"from_time"}</Typography>
                            <Input
                                size="lg"
                                name='from_time'
                                type='time'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateRightTime.from_time}
                                onChange={handleChange}
                                required
                            /> 
                        </div>
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الى الوقت" :"to_time"}</Typography>
                            <Input
                                size="lg"
                                name='to_time'
                                type='time'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateRightTime.to_time}
                                onChange={handleChange}
                                required
                            /> 
                        </div>
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "السعر" :"price"}</Typography>
                            <Input
                                size="lg"
                                name='price'
                                type='number'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateRightTime.price}
                                onChange={handleChange}
                                required
                            /> 
                        </div>
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "السعر بعد الخصم" :"After Offer (Optional)"}</Typography>
                            <Input
                                size="lg"
                                name='After_Offer'
                                type='number'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateRightTime.After_Offer}
                                onChange={handleChange}
                                
                            /> 
                        </div>
                    </div>
                    <Button type="submit" className="mt-6" fullWidth>
                    {lang ==='ar'? "تعديل " :"Update "}                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdateRightTime;
