import React, { useEffect, useState } from "react";
import "../../../Styles/brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button
} from "@material-tailwind/react";
import Cookies from "js-cookie";
function AllTermsAndConditions() {
    const navigate = useNavigate();
    const [termsAndConditions, setTermsAndConditions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [termsAndConditionsIdToDelete, setTermsAndConditionsIdToDelete] = useState(null); 
    const lang = Cookies.get('lang') || 'en';

    const handleShow = (id) => {
        setTermsAndConditionsIdToDelete(id);
        setShowModal(true);
    };
  
    const handleClose = () => {
        setShowModal(false);
        setTermsAndConditionsIdToDelete(null); 
    };
  
    const fetchTermsAndConditions = async () => {
        try {
            const response = await axios.get(`${API_URL}/TermsConditionsRouter/getAllTermsConditions`);
            setTermsAndConditions(response.data);
        } catch (error) {
            console.error(error);
        }
    };
  

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/TermsConditionsRouter/deleteTermsConditions/${id}`);
            setTermsAndConditions(termsAndConditions.filter((term) => term.id !== id));
        } catch (error) {
            console.error(error);
        }
    };
  
    useEffect(() => {
        fetchTermsAndConditions();
    }, []);
  
    return (
        <>
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="green" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        {lang ==='ar'? "جدول الشروط والأحكام" :"Terms and Conditions Table"}
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <Link to="/dashboard/Addtermsandconditions">
                        <Button
                            className="flex bg-[#D87C55] items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
                            style={{ marginLeft: '80px' }}
                        >
                            <PlusIcon className="h-5 w-5 mr-1" />   {lang ==='ar'? "اضافة الشروط والأحكام" :"Add Terms and Conditions "}
                        </Button>
                    </Link>
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {[`${lang ==='ar'? "العنوان" :"Title"}`, `${lang ==='ar'? "الوصف" :"Description"}`, `${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 ">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {termsAndConditions.map((term, index) => {
                                const className = `py-3 px-5 ${index === termsAndConditions.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                return (
                                    <tr key={term.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                                        {term.title}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {term.description}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center">
                                                <Button
                                                    onClick={() => navigate(`/dashboard/updatetermsandconditions/${term.id}`)}
                                                    className="mr-2 flex items-center bg-[#D87C55] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                                                >
                                                    <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                                                </Button>
                                                <Button
                                                    onClick={() => handleShow(term.id)} 
                                                    className="text-white-600 bg-[#F5C16C] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                                                >
                                                    <TrashIcon className="h-5 w-5 mr-1" />  {lang ==='ar'? "حذف" : "Delete "}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            <DeleteModule 
                showModal={showModal} 
                handleClose={handleClose} 
                handleDelete={handleDelete} 
                id={termsAndConditionsIdToDelete} 
            />
        </div>  
        </>
    );
}

export default AllTermsAndConditions;
