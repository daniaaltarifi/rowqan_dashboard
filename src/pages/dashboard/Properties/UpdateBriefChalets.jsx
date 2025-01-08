import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';
function UpdateBriefChalets() {
    const [updateBriefChalets, setUpdateBriefChalets] = useState({
        type: "",
        value:"",
        chalet_id : "",
    });
    const [chalets, setChalets] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const lang = Cookies.get('lang') || 'en';

    useEffect(() => {
        const fetchbriefbyid = async () => {
            try {
                const response = await axios.get(`${API_URL}/BreifDetailsChalets/getById/${id}/${lang}`);
                setUpdateBriefChalets({
                    type: response.data.type,
                    value: response.data.value,
                    chalet_id : response.data.chalet_id,
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchbriefbyid();
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

    const handleUpdateBriefChalets = async (e) => {
        e.preventDefault();
      

        try {
            await axios.put(`${API_URL}/BreifDetailsChalets/updateBreif/${id}`, 
                {"type":updateBriefChalets.type,
                  "value":updateBriefChalets.value,
                  lang,"chalet_id":updateBriefChalets.chalet_id},  // Correctly format the payload
                {
                    headers: {
                        "Content-Type": "application/json", // Correct Content-Type for JSON data
                    },
                
            });
            Swal.fire({
                type: "Success!",
                text: "Breif Chalets updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/propertieschalets");
        } catch (error) {
            console.error(error);
            console.log("first error: ",updateBriefChalets.chalet_id)
            Swal.fire({
                type: "Error!",
                text: "Failed to update. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const handleChange = (e) => {
        const { name, type, files } = e.target;
        setUpdateBriefChalets({
            ...updateBriefChalets,
            [name]: type === "file" ? files[0] : e.target.value,
        });
    };

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">{lang ==='ar'? "تعديل وصف  شاليه" :"Update Breif Characteristics chalets"}</Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateBriefChalets}>
                    <div className="grid grid-cols-1 gap-6 ">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "النوع" :"type"}</Typography>
                            <Input
                                size="lg"
                                name='type'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateBriefChalets.type}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الوصف" :"value"}</Typography>
                            <Input
                                size="lg"
                                name='value'
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={updateBriefChalets.value}
                                onChange={handleChange}
                                required
                            />
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">{lang ==='ar'? "الشاليه" :"Chalets"}</Typography>
                            <select 
    onChange={handleChange}
    name="chalet_id "
    className="block w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={updateBriefChalets.chalet_id } // Bind select value to chalet_id  state
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

export default UpdateBriefChalets;
