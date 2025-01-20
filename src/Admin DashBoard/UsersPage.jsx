import React, { useEffect, useState } from "react";

import axios from "axios";
import { API_URL } from "../App.jsx";
import { Link, useNavigate } from "react-router-dom";

import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';

function Users() {
    const navigate = useNavigate();
    const [users, setusers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setuserIdToDelete] = useState(null);
    const lang = Cookies.get('lang') || 'en';

    const handleShow = (id) => {
        setuserIdToDelete(id); 
        setShowModal(true);    
    };

    const handleClose = () => {
        setShowModal(false);      
        setuserIdToDelete(null);  
    };

    const fetchusers = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/getAllUsers/${lang}`);
            setusers(response.data);
            console.log("first user", response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
          
          await axios.delete(`${API_URL}/users/DeleteUser/${id}/${lang}`);
        setusers(users.filter((chalet) => chalet.id !== userIdToDelete));
        Swal.fire({
                 title: "Success!",
                 text: "user deleted successful.",
                 icon: "success",
                 confirmButtonText: "OK",
               });
        } catch (error) {
            console.error(error);

           
            Swal.fire({
                title: "Error!",
                text: "Failed to delete user. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };



    useEffect(() => {
        fetchusers();
    }, []);

    return (
        <>
            <div className="mt-12 mb-8 flex flex-col gap-12">
                <Card>
                    <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
                        <Typography variant="h6" color="white">
                            {lang === 'ar' ? "جدول المستخدمين" : "Users Table"}
                        </Typography>
                    </CardHeader>
                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <Link to="/dashboard/adduser">
                            <Button
                                className="flex items-center bg-[#F2C79D] transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
                                style={{ marginLeft: '80px' }}
                            >
                                <PlusIcon className="h-5 w-5 mr-1" />
                                {lang === 'ar' ? " اضافة مستخدم" : "Add User"}
                            </Button>
                        </Link>
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {[`${lang === 'ar' ? "الاسم الكامل" : "Full Name "}`,
                                    `${lang === 'ar' ? "البريد الالكتروني" : "Email "}`,
                                    `${lang === 'ar' ? "الصلاحية" : "Role"}`,
                                    `${lang === 'ar' ? "الرصيد" : "Balance"}`,
                                    `${lang === 'ar' ? "تنفيذ" : "Action"}`].map((el) => (
                                        <th key={el} className="border-b border-blue-gray-50 py-3 px-5 ">
                                            <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    const className = `py-3 px-5 ${index === users.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                    return (
                                        <tr key={user.id}>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                                            {user.name} 
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {user.email}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-normal text-blue-gray-500">
                                                    {user.phone_number}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {user.country}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                            <div className="flex space-x-4 rtl:space-x-reverse">
    <Button
        onClick={() => handleDelete(user.id)}
        className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
    >
        <TrashIcon className="h-5 w-5 mr-1" />
        {lang === 'ar' ? "حذف" : "Delete"}
    </Button>

    <Button
        onClick={() => navigate(`/dashboard/updateUser/${user.id}`)} 
        className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
    >
        <PencilIcon className="h-5 w-5 mr-1" /> 
        {lang === 'ar' ? "تعديل" : "Update"}
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
            </div>


        </>
    );
}

export default Users;
