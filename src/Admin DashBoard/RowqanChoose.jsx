import React, { useEffect, useState } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { TrashIcon, PlusIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter
} from "@material-tailwind/react";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
import '../Styles/Chalets.css';
import DeleteModule from "@/Components/DeleteModule.jsx";

function RowqanChoose() {
    const navigate = useNavigate();
    const [chooseData, setChooseData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [chooseIdToDelete, setChooseIdToDelete] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const lang = Cookies.get('lang') || 'en';

    const handleShow = (id) => {
        setChooseIdToDelete(id); 
        setShowModal(true);    
    };

    const handleClose = () => {
        setShowModal(false);      
        setChooseIdToDelete(null);  
    };

    const handleShowDetails = (item) => {
        setSelectedItem(item);
        setDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setDetailsModal(false);
        setSelectedItem(null);
    };

    const fetchChooseData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/RowqanChoose/getallChoose`);
            setChooseData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/RowqanChoose/delete/${chooseIdToDelete}`);
            setChooseData(chooseData.filter((item) => item.id !== chooseIdToDelete));
            Swal.fire({
                title: "Success!",
                text: "Request deleted successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete request. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    useEffect(() => {
        fetchChooseData();
    }, []);

    return (
        <>
            <div className="mt-12 mb-8 flex flex-col gap-12">
                <Card>
                    <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
                        <Typography variant="h6" color="white">
                            {lang === 'ar' ? "جدول طلبات الاختيار" : "Rowqan Choose Requests"}
                        </Typography>
                    </CardHeader>
                    <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
                        <Link to="/dashboard/AddChooseRowqan">
                            <Button
                                className="flex items-center bg-[#F2C79D] transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
                                style={{ marginLeft: '80px' }}
                            >
                                <PlusIcon className="h-5 w-5 mr-1" />
                                {lang === 'ar' ? " اضافة طلب الى روقان " : "Add Request For Rowqan Choose"}
                            </Button>
                        </Link>
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {[
                                        `${lang === 'ar' ? "الاسم الكامل" : "Full Name"}`,
                                        `${lang === 'ar' ? "رقم الهاتف" : "Phone Number"}`,
                                        `${lang === 'ar' ? "التفاصيل" : "Details"}`,
                                        `${lang === 'ar' ? "تنفيذ" : "Action"}`
                                    ].map((el) => (
                                        <th key={el} className="border-b border-blue-gray-50 py-3 px-5 ">
                                            <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                                {el}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {chooseData.map((item, index) => {
                                    const className = `py-3 px-5 ${index === chooseData.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                    return (
                                        <tr key={item.id}>
                                            <td className={className}>
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <Typography variant="small" color="blue-gray" className="font-semibold">
                                                            {item.Full_Name}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={className}>
                                                <Typography className="text-xs font-semibold text-blue-gray-600">
                                                    {item.Phone_Number}
                                                </Typography>
                                            </td>
                                            <td className={className}>
                                                <Button
                                                    onClick={() => handleShowDetails(item)}
                                                    className="text-white-600 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                                                >
                                                    <EyeIcon className="h-5 w-5 mr-1" />
                                                    {lang === 'ar' ? "اظهار التفاصيل" : "See Details"}
                                                </Button>
                                            </td>
                                            <td className={className}>
                                                <Button
                                                    onClick={() => handleShow(item.id)}
                                                    className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                                                >
                                                    <TrashIcon className="h-5 w-5 mr-1" />
                                                    {lang === 'ar' ? "حذف" : "Delete"}
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>

            
            <DeleteModule 
                showModal={showModal} 
                handleClose={handleClose} 
                handleDelete={handleDelete} 
                id={chooseIdToDelete}
            />

            
            <Dialog open={detailsModal} handler={handleCloseDetails} size="lg">
                <DialogHeader>
                    {lang === 'ar' ? "تفاصيل الطلب" : "Request Details"}
                </DialogHeader>
                <DialogBody divider className="overflow-y-auto">
                    {selectedItem && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "الاسم الكامل" : "Full Name"}
                                </Typography>
                                <Typography variant="paragraph">{selectedItem.Full_Name}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "رقم الهاتف" : "Phone Number"}
                                </Typography>
                                <Typography variant="paragraph">{selectedItem.Phone_Number}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "نوع الحجز" : "Reservation Type"}
                                </Typography>
                                <Typography variant="paragraph">{selectedItem.reservation_type}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "تاريخ البدء" : "Start Date"}
                                </Typography>
                                <Typography variant="paragraph">{new Date(selectedItem.startDate).toLocaleDateString()}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "المدة" : "Duration"}
                                </Typography>
                                <Typography variant="paragraph">{selectedItem.Duration}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "عدد الزوار" : "Visitors"}
                                </Typography>
                                <Typography variant="paragraph">{selectedItem.number_of_visitors}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "المرافق" : "Facilities"}
                                </Typography>
                                <Typography variant="paragraph">{selectedItem.Facilities.join(", ")}</Typography>
                            </div>
                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {lang === 'ar' ? "الميزانية" : "Budget"}
                                </Typography>
                                <Typography variant="paragraph">{selectedItem.Budget} JOD</Typography>
                            </div>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button 
                        onClick={handleCloseDetails} 
                        className="bg-[#6DA6BA]"
                    >
                        {lang === 'ar' ? "إغلاق" : "Close"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default RowqanChoose;