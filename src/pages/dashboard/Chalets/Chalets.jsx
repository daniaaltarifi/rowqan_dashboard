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
    Button,
  } from "@material-tailwind/react";

function Chalets() {
    const navigate = useNavigate();
  const [Chalets, setChalets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ChaletsIdToDelete, setChaletsIdToDelete] = useState(null); // Store the ID of the slide to delete
  const lang = Cookies.get('lang') || 'en';

const handleShow = (id) => {
    setChaletsIdToDelete(id);  // Set the ID to delete (chalet or details)
    setShowModal(true);  // Show the modal
  };
  
  const handleClose = () => {
    setShowModal(false);
    setChaletsIdToDelete(null); // Reset the ID when closing
  };

  const fetchChalets = async () => {
    try {
      const chaletsRes = await
        axios.get(`${API_URL}/chalets/getallchalets?lang=${lang}`)
      
      setChalets(chaletsRes.data);
      
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDelete = async () => {  
    try {
        await axios.delete(`${API_URL}/chalets/deletechalet/${ChaletsIdToDelete}/${lang}`);
        setChalets(Chalets.filter((chalet) => chalet.id !== ChaletsIdToDelete)); // Remove from list       
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchChalets();
  }, []);

  return (
    <>
    {/* <Button className="mt-6" >Add chalet</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
        <Typography variant="h6" color="white">
       {lang ==='ar'? "جدول الشاليهات" :"  Chalets Table "}
        </Typography>
      </CardHeader>
      <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addchalet">
    <Button
  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة شاليه" : "Add Chalets "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "العنوان" :"Title"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {Chalets.map(
              (chalet,index) => {
                const className = `py-3 px-5 ${index === Chalets.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                          
                return (
                  <tr key={chalet.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {chalet.title}
                          </Typography>
                         </div>
                      </div>
                    </td>


                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                            onClick={() => navigate(`/dashboard/updatechalet/${chalet.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1 " /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
                         onClick={() => handleShow(chalet.id)} // Pass 'chalet' type
                         className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "حذف" : "Delete "}
                          </Button>
                          <Button 
                           onClick={() => navigate(`/dashboard/reservationcalendar/${chalet.id}`)}
                           className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500 ms-2"
                              >
                          <CheckBadgeIcon class="h-6 w-6 text-white-500 " />See Reservation  
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
       id={ChaletsIdToDelete} // Pass the chalet ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Chalets