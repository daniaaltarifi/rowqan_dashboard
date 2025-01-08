import React, { useEffect, useState } from "react";
import "../../../Styles/Brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx"
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
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
function Properties() {
    const navigate = useNavigate();
  const [Properties, setProperties] = useState([]);
  const [PropertiesDetails, setPropertiesDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [PropertiesIdToDelete, setPropertiesIdToDelete] = useState(null); // Store the ID of the slide to delete
  const [itemType, setItemType] = useState(null); // Store the ID of the slide to delete
  const lang = Cookies.get('lang') || 'en';

//   const handleShow = (id) => {
//     setPropertiesIdToDelete(id); // Set the slide ID to delete
//     setShowModal(true);
//   };
const handleShow = (id, type) => {
    setPropertiesIdToDelete(id);  // Set the ID to delete (chalet or details)
    setItemType(type);   // Set the type (either 'chalet' or 'details')
    setShowModal(true);  // Show the modal
  };
  
  const handleClose = () => {
    setShowModal(false);
    setPropertiesIdToDelete(null); // Reset the ID when closing
  };

  const fetchProperties = async () => {
    try {
      const [PropertiesRes,DetailsRes] = await Promise.all([
        axios.get(`${API_URL}/chalets/getAllChaletProps/${lang}`),
        // axios.get(`${API_URL}/Propertiesdetails/getalldetails/${lang}`)
      ]) 
      setProperties(PropertiesRes.data);
      setPropertiesDetails(DetailsRes.data);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDelete = async () => {
    // const { idToDelete, itemType } = this.state;
  
    try {
      // Conditional logic to handle different delete operations
      if (itemType === 'properties') {
        await axios.delete(`${API_URL}/propschalets/DeletePropChalet/${PropertiesIdToDelete}/${lang}`);
        setProperties(Properties.filter((chalet) => chalet.id !== PropertiesIdToDelete)); // Remove from list
      } else if (itemType === 'details') {
        await axios.delete(`${API_URL}/Propertiesdetails/deleteddetaile/${PropertiesIdToDelete}/${lang}`);
        setPropertiesDetails(PropertiesDetails.filter((detail) => detail.id !== PropertiesIdToDelete)); // Remove from list
      }
    } catch (error) {
      console.error(error);
    }
  };
  

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/Properties/deletechalet/${id}/${lang}`);
//       setProperties(Properties.filter((b) => b.id !== id));
//     } catch (error) {
//       console.error(error);
//     }
//   };

  useEffect(() => {
    fetchProperties();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add chalet</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="green" className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول خصائص الشاليهات" :"  Properties Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addchalet">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#D87C55]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة خاصية شاليه" : "Add Properties "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "العنوان" :"Title"}`,`${lang ==='ar'? "الشاليه" :"Chalets"}`,`${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {Properties.map(
              (chalet,index) => {
                const className = `py-3 px-5 ${index === Properties.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={chalet.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                            
                        {chalet.Chalets_Props.map((property) => (
          <div key={property.id} >
            <Typography  
             variant="small"
              color="blue-gray"
                className="font-semibold">
              {property.title}
            </Typography>
          </div>
        ))}

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
                            {chalet.title}
                          </Typography>
                      </Typography>
                    </td>
                    <td>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar   src={`https://res.cloudinary.com/durjqlivi/${chalet.Chalets_Props?.[0]?.image}`} alt={"Properties"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatechalet/${chalet.id}`)}
                            className="mr-2 bg-[#D87C55] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
   onClick={() => handleShow(chalet.id, 'properties')} // Pass 'chalet' type
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
       id={PropertiesIdToDelete} // Pass the chalet ID to DeleteModule
      />
      <Card>
      <CardHeader variant="gradient" color="green" className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول تفاصيل الشاليهات" :"  Properties Details Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/adddetails">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#D87C55]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة  تفاصيل شاليه" : "Add Properties Details "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "التفاصيل" :"Detail_Type"}`,`${lang ==='ar'? "الشاليه" :"chalet "}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {PropertiesDetails.map(
              (details,index) => {
                const className = `py-3 px-5 ${index === PropertiesDetails.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={details.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {details.Detail_Type}
                          </Typography>
                          {/* <Typography className="text-xs font-normal text-blue-gray-500">
                            {chalet.last_name}
                          </Typography> */}

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
                            {details.Chalet?.title}
                          </Typography>
                      </Typography>
                    </td>                 
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatedetails/${details.id}`)}
                            className="mr-2 bg-[#D87C55] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
  onClick={() => handleShow(details.id, 'details')}className="text-white-600 bg-[#F5C16C] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
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

export default Properties