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
  const [briefChar, setbriefChar] = useState([]);
  const [imgChalets, setImgChalets] = useState([]);
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
      const [PropertiesRes,DetailsRes,imgChalRes] = await Promise.all([
        axios.get(`${API_URL}/propschalets/getAllPropsChalet/${lang}`),
        axios.get(`${API_URL}/BreifDetailsChalets/getAllBreifChalet/${lang}`),
        axios.get(`${API_URL}/chalets/getallchalets/${lang}`),

      ]) 
      setProperties(PropertiesRes.data);
      setbriefChar(DetailsRes.data);
      setImgChalets(imgChalRes.data)
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
        await axios.delete(`${API_URL}/BreifDetailsChalets/deleteBreif/${PropertiesIdToDelete}/${lang}`);
        setbriefChar(briefChar.filter((detail) => detail.id !== PropertiesIdToDelete)); // Remove from list
      }
      else if (itemType === 'images') {
        await axios.delete(`${API_URL}/chaletsimages/deleteChaletImage/${PropertiesIdToDelete}`);
        setImgChalets(
          imgChalets.map((detail) => {
            const filteredImages = detail.ChaletsImages?.filter((img) => img.id !== PropertiesIdToDelete);
            return { ...detail, ChaletsImages: filteredImages };
          })
        );
              }
    } catch (error) {
      console.error(error);
    }
  };
  


  useEffect(() => {
    fetchProperties();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add chalet</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول خصائص الشاليهات" :"  Properties Chalets Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addchaletproperties">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
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
            <Typography  
             variant="small"
              color="blue-gray"
                className="font-semibold">
              {chalet.title}
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
                            {chalet.Chalet?.title}
                          </Typography>
                      </Typography>
                    </td>
                    <td>
                    <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar   src={`https://res.cloudinary.com/durjqlivi/${chalet.image}`} alt={"Properties"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatepropertieschalet/${chalet.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
   onClick={() => handleShow(chalet.id, 'properties')} // Pass 'chalet' type
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
       id={PropertiesIdToDelete} // Pass the chalet ID to DeleteModule
      />
      <Card>
      <CardHeader variant="gradient"style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول تفاصيل الشاليهات" :" Brief Characteristics Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addbriefchalets">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة  تفاصيل شاليه" : "Add Breif Characteristics Chalets "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "النوع" :"type"}`,`${lang ==='ar'? "الوصف" :"value"}`,`${lang ==='ar'? "الشاليه" :"chalet "}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {briefChar.map(
              (details,index) => {
                const className = `py-3 px-5 ${index === briefChar.length - 1 ? "" : "border-b border-blue-gray-50"}`;


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
                            {details.type}
                          </Typography>
                        
                        </div>
                      </div>
                    </td><td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {details.value}
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
                            {details.Chalet?.title}
                          </Typography>
                      </Typography>
                    </td>                 
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatebriefchalets/${details.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
                          onClick={() => handleShow(details.id, 'details')}className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
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
    <Card>
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول صور الشاليهات" :" Chalets Images Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addimgchalets">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة  تفاصيل شاليه" : "Add image Chalet "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "الشاليه" :"chalet "}`,`${lang ==='ar'? "الصور" :"images"}`].map((el) => (
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
            {imgChalets.map(
              (details,index) => {
                const className = `py-3 px-5 ${index === briefChar.length - 1 ? "" : "border-b border-blue-gray-50"}`;


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
                            {details.title}
                          </Typography>
                        
                        </div>
                      </div>
                    </td>
                    <td className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
  {details.ChaletsImages.map((img, index) => (
    <Typography className="text-xs font-semibold text-blue-gray-600" key={index} style={{ marginRight: '10px' }}>
      <Avatar 
        src={`https://res.cloudinary.com/durjqlivi/${img.image}`} 
        alt={"chalets"} 
        size="lg" 
        variant="rounded" 
        style={{ marginRight: '8px' }}  // Adds space between the images
      />
        <div style={{ display: 'flex', justifyContent:"center" }}>
       <TrashIcon className="h-5 w-5 mr-1"onClick={() => handleShow(img.id, 'images')}/> 
       </div>
    </Typography>
  ))}
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