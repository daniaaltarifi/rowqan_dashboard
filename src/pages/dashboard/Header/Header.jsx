import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Avatar
  } from "@material-tailwind/react";
import Cookies from "js-cookie";
import '../../../Styles/Chalets.css'

function Header() {
    const navigate = useNavigate();
  const [header, setheader] = useState([]);
  const [logo, setLogo] = useState([]);
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
      const [headerresponse,logoRes] = await Promise.all([
        axios.get(`${API_URL}/header/getAllHeaders/${lang}`),
        axios.get(`${API_URL}/logos/getalllogos`)
      ]) 
      setheader(headerresponse.data);
      setLogo(logoRes.data)
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/header/deleteHeader/${id}/${lang}`);
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
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
         {lang ==='ar'? "جدول اعلى الصفحة " :"Header Table"}
        </Typography>
      </CardHeader>
      <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addheader">
    <Button
  className="flex bg-[#F2C79D] items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة " :"Add header"}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "العنوان" :"Title"}`,`${lang ==='ar'? "اللغة" :"Lang"}`,`${lang ==='ar'? "الرابط" :"Url"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
                            {Head.header_name}
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
                            {Head.url}
                          </Typography>
                      </Typography>
                    </td>
                
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updateheader/${Head.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
                    onClick={() => handleShow(Head.id)} // Pass the Header ID to handleShow
                    className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
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
          <tr>
              {[`${lang ==='ar'? "الصورة" :"Logo"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            <tbody>
            {logo.map(
              (log,index) => {
                const className = `py-3 px-5 ${index === logo.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={log.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar src={`https://res.cloudinary.com/dqimsdiht/${log.image}`} alt={'logo'} size="lg" variant="rounded" />
                      
                      </div>
                    </td>                   
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatelogo/${log.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
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