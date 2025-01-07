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
    Button,
  } from "@material-tailwind/react";
  import Cookies from "js-cookie";

function Category() {
    const navigate = useNavigate();
  const [category, setcategory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryIdToDelete, setcategoryIdToDelete] = useState(null); // Store the ID of the slide to delete
  const lang = Cookies.get('lang') || 'en';

  const handleShow = (id) => {
    setcategoryIdToDelete(id); // Set the slide ID to delete
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setcategoryIdToDelete(null); // Reset the ID when closing
  };

  const fetchcategory = async () => {
    try {
      const response = await axios.get(`${API_URL}/mainproduct/getmainproduct`);
      setcategory(response.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/mainproduct/delete/${id}`);
      setcategory(category.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchcategory();
  }, []);
  return (
    <>
    {/* <Button className="mt-6" >Add catg</Button> */}
   
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="green" className="mb-8 p-6">
        <Typography variant="h6" color="white">
 {lang ==='ar'? "جدول الاصناف" : "  Category Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addcategory">
    <Button
  className="flex items-center bg-[#D87C55] transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة صنف" : "Add Category "}
</Button>
</Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "الاسم" : "Name"}`, `${lang ==='ar'? "تنفيذ" : "Action"}`].map((el) => (
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
            {category.map(
              (catg,index) => {
                const className = `py-3 px-5 ${index === category.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={catg.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* <Avatar src={img} alt={name} size="sm" variant="rounded" /> */}
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {catg.name}
                          </Typography>
                        </div>
                       
                      </div>
                    </td>
                     <td className={className}>
                        <div className="flex items-center">
                          <Button 
                    onClick={() => handleShow(catg.id)} // Pass the catg ID to handleShow
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
       id={categoryIdToDelete} // Pass the catg ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Category