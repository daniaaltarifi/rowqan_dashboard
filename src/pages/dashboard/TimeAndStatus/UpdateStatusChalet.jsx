import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateStatusChalet() {
    const [updateStatusChalet, setUpdateStatusChalet] = useState({
        status: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`${API_URL}/status/getstatusbyid/${id}/${lang}`);
                setUpdateStatusChalet({
                    status: response.data.status,
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchStatus();
    }, [id]);

    const handleUpdateStatusChalet = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/status/updatestatus/${id}`, 
                 { "status":updateStatusChalet.status, lang },  // Correctly format the payload
                {
                    headers: {
                        "Content-Type": "application/json", // Correct Content-Type for JSON data
                    },
                });
            Swal.fire({
                status: "Success!",
                text: "Chalets status updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/timeandstatus");
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
        setUpdateStatusChalet({
            ...updateStatusChalet,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل حالة  الشاليه" :"Update status chalets"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateStatusChalet}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الحالة" :"status"}</Typography>
                            <Input
                                size="lg"
                                name='status'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateStatusChalet.status}
                                onChange={handleChange}
                                required
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

export default UpdateStatusChalet;