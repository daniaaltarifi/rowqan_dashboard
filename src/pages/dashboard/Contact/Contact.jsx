import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon, PlusIcon,CheckBadgeIcon  } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Button,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { authorsTableData, projectsTableData } from "@/data";
function Contact() {
    const navigate = useNavigate();
  const [Contact, setContact] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ContactIdToDelete, setContactIdToDelete] = useState(null); // Store the ID of the slide to delete
  const [itemType, setItemType] = useState(null); // Store the ID of the slide to delete
  const lang = Cookies.get('lang') || 'en';

//   const handleShow = (id) => {
//     setContactIdToDelete(id); // Set the slide ID to delete
//     setShowModal(true);
//   };
const handleShow = (id, type) => {
    setContactIdToDelete(id);  // Set the ID to delete (cont or details)
    setItemType(type);   // Set the type (either 'cont' or 'details')
    setShowModal(true);  // Show the modal
  };
  
  const handleClose = () => {
    setShowModal(false);
    setContactIdToDelete(null); // Reset the ID when closing
  };

  const fetchContact = async () => {
    try {
      const ContactRes = await
        axios.get(`${API_URL}/Contacts/getAllContacts/${lang}`);
      setContact(ContactRes.data);
      
    } catch (error) {
      console.error(error);
    }
  };
  

  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/Contacts/deleteContacts/${id}/${lang}`);
      setContact(Contact.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add cont</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول التواصل" :"  Contact Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addcontact">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة تواصل" : "Add Contact "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "العنوان" :"Title"}`,`${lang ==='ar'? " الرابط" :"link"}`,`${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {Contact.map(
              (cont,index) => {
                const className = `py-3 px-5 ${index === Contact.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={cont.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {cont.title}
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
                            {cont.action}
                          </Typography>
                      </Typography>
                    </td>
                    <td>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar   src={`https://res.cloudinary.com/dqimsdiht/${cont.image}`} alt={"Contact"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatecontact/${cont.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
                     onClick={() => handleShow(cont.id)} // Pass 'cont' type
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
       id={ContactIdToDelete} // Pass the cont ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Contact