import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button
  } from "@material-tailwind/react";
import Cookies from "js-cookie";
function Header() {
    const navigate = useNavigate();
  const [header, setheader] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [headerIdToDelete, setheaderIdToDelete] = useState(null); // Store the ID of the Header to delete
  const lang = Cookies.get('lang') || 'en';

  const handleShow = (id) => {
    setheaderIdToDelete(id); // Set the Header ID to delete
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setheaderIdToDelete(null); // Reset the ID when closing
  };

  const fetchheader = async () => {
    try {
      const response = await axios.get(`${API_URL}/header/getallheader`);
      setheader(response.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/header/deleteheader/${id}`);
      setheader(header.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchheader();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add Header</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="green" className="mb-8 p-6">
        <Typography variant="h6" color="white">
         {lang ==='ar'? "جدول اعلى الصفحة " :"Header Table"}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addheader">
    <Button
  className="flex bg-[#D87C55] items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة " :"Add header"}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "العنوان" :"Title"}`,`${lang ==='ar'? "اللغة" :"Lang"}`,`${lang ==='ar'? "الصنف" :"Category"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
                <th
                  key={el}
                  className="border-b border-blue-gray-50 py-3 px-5 "
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {header.map(
              (Head,index) => {
                const className = `py-3 px-5 ${index === Head.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={Head.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {Head.title}
                          </Typography>
                        

                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {Head.lang}
                          </Typography>
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {Head.name}
                          </Typography>
                      </Typography>
                    </td>
                
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updateheader/${Head.id}`)}
                            className="mr-2 bg-[#D87C55] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
                    onClick={() => handleShow(Head.id)} // Pass the Header ID to handleShow
                    className="text-white-600 bg-[#F5C16C] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "حذف" : "Delete "}
                          </Button>
                        </div>
                      </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
    <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
       id={headerIdToDelete} // Pass the Header ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Header