import React, { useEffect, useState } from "react";
import "../../../Styles/brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button
} from "@material-tailwind/react";

function PrivacyPolicies() {
    const navigate = useNavigate();
    const [privacyPolicies, setPrivacyPolicies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [privacyPolicyIdToDelete, setPrivacyPolicyIdToDelete] = useState(null); 
    const lang = Cookies.get('lang') || 'en';

    const handleShow = (id) => {
        setPrivacyPolicyIdToDelete(id);
        setShowModal(true);
    };
  
    const handleClose = () => {
        setShowModal(false);
        setPrivacyPolicyIdToDelete(null); 
    };
  
    const fetchPrivacyPolicies = async () => {
        try {
            const response = await axios.get(`${API_URL}/privacypolicy/getprivacypolicy`);
            setPrivacyPolicies(response.data);
        } catch (error) {
            console.error(error);
        }
    };
  

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/privacypolicy/deleteprivacypolicy/${id}`);
            setPrivacyPolicies(privacyPolicies.filter((policy) => policy.id !== id));
        } catch (error) {
            console.error(error);
        }
    };
  
    useEffect(() => {
        fetchPrivacyPolicies();
    }, []);
  
    return (
        <>
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <Card>
                <CardHeader variant="gradient" color="green" className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        {lang ==='ar'? "جدول سياسة الخصوصية" :"Privacy Policy Table"}
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <Link to="/dashboard/Addprivacypolicy">
                        <Button
                            className="flex bg-[#D87C55] items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
                            style={{ marginLeft: '80px' }}
                        >
                            <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة سياسة الخصوصية" :"Add Privacy Policy"}
                        </Button>
                    </Link>
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {[`${lang ==='ar'? "العنوان" :"Title"}`, `${lang ==='ar'? "الوصف" :"Description"}`, `${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {privacyPolicies.map((policy, index) => {
                                const className = `py-3 px-5 ${index === privacyPolicies.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                return (
                                    <tr key={policy.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                                        {policy.title}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {policy.description}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center">
                                                <Button
                                                    onClick={() => navigate(`/dashboard/updateprivacypolicy/${policy.id}`)}
                                                    className="mr-2 flex items-center bg-[#D87C55] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                                                >
                                                    <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                                                </Button>
                                                <Button
                                                    onClick={() => handleShow(policy.id)} 
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
                id={privacyPolicyIdToDelete} 
            />
        </div>  
        </>
    );
}

export default PrivacyPolicies;
