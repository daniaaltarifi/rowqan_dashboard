import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon, PlusIcon  } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button,
  } from "@material-tailwind/react";
function RightTimeChalets() {
    const navigate = useNavigate();
  const [RightTimeChalets, setRightTimeChalets] = useState([]);
  const [statuesChalets, setstatuesChalets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [RightTimeChaletsIdToDelete, setRightTimeChaletsIdToDelete] = useState(null); // Store the ID of the slide to delete
  const [itemType, setItemType] = useState(null); // Store the ID of the slide to delete
  const lang = Cookies.get('lang') || 'en';

const handleShow = (id, type) => {
    setRightTimeChaletsIdToDelete(id);  // Set the ID to delete (chalet or details)
    setItemType(type);   // Set the type (either 'chalet' or 'details')
    setShowModal(true);  // Show the modal
  };
  
  const handleClose = () => {
    setShowModal(false);
    setRightTimeChaletsIdToDelete(null); // Reset the ID when closing
  };

  const fetchRightTimeChalets = async () => {
    try {
      const [RightTimeChaletsRes,statusRes] = await Promise.all([
        axios.get(`${API_URL}/RightTimes/getallrighttimes/${lang}`),
        axios.get(`${API_URL}/status/getallstatuses/${lang}`)
      ]) 
      setRightTimeChalets(RightTimeChaletsRes.data);
      setstatuesChalets(statusRes.data);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDelete = async () => {
    // const { idToDelete, itemType } = this.state;
  
    try {
      // Conditional logic to handle different delete operations
      if (itemType === 'righttime') {
        await axios.delete(`${API_URL}/RightTimes/deleterighttime/${RightTimeChaletsIdToDelete}/${lang}`);
        setRightTimeChalets(RightTimeChalets.filter((chalet) => chalet.id !== RightTimeChaletsIdToDelete)); // Remove from list
      } else if (itemType === 'status') {
        await axios.delete(`${API_URL}/status/deletestatus/${RightTimeChaletsIdToDelete}/${lang}`);
        setstatuesChalets(statuesChalets.filter((detail) => detail.id !== RightTimeChaletsIdToDelete)); // Remove from list
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    fetchRightTimeChalets();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add chalet</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول اوقات الحجز" :"  Right Time Chalets Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addrighttimechalet">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة وقت حجز" : "Add Right Time Chalets "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "الاسم" :"Title"}`,`${lang ==='ar'? "الوقت" :"Time"}`,`${lang ==='ar'? "السعر" :"Price"}`,`${lang ==='ar'? "الشاليه" :"Chalet "}`,`${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {RightTimeChalets.map(
              (times,index) => {
                const className = `py-3 px-5 ${index === RightTimeChalets.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={times.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {times.name}
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
                            {times.time}
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
                            {times.price}
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
                            {times.Chalet?.title }
                          </Typography>
                      </Typography>
                    </td>
                    <td>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar   src={`https://res.cloudinary.com/durjqlivi/${times.image}`} alt={"RightTimeChalets"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updaterighttimechalet/${times.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
   onClick={() => handleShow(times.id, 'righttime')} // Pass 'chalet' type
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
        </table>
      </CardBody>
    </Card>
    <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
       id={RightTimeChaletsIdToDelete} // Pass the chalet ID to DeleteModule
      />
      <Card>
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }}className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول حالة الشاليهات" :"  Status Chalets Details Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addstatuschalet">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة  حالة شاليه" : "Add Status Chalets "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "الحالة" :"status"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {statuesChalets.map(
              (statues,index) => {
                const className = `py-3 px-5 ${index === statuesChalets.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={statues.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {statues.status}
                          </Typography>
                        </div>
                      </div>
                    </td>            
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatestatuschalet/${statues.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
  onClick={() => handleShow(statues.id, 'status')}className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
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
  </div>  
  </>
  )
}

export default RightTimeChalets