import React, { useEffect, useState } from "react";
import "../../../Styles/brands.css"; 
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
    Avatar,
    Chip,
    Tooltip,
    Progress,
    Button
  } from "@material-tailwind/react";
import Cookies from "js-cookie";
function Blogs() {
    const navigate = useNavigate();
    const [Blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [BlogsIdToDelete, setBlogsIdToDelete] = useState(null); // Store the ID of the Blogs to delete
    const lang = Cookies.get('lang') || 'en';

    const handleShow = (id) => {
      setBlogsIdToDelete(id); // Set the Blogs ID to delete
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
      setBlogsIdToDelete(null); // Reset the ID when closing
    };
  
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/blogs/get/blogs`);
        setBlogs(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/blogs/delete/blog/${id}`);
        setBlogs(Blogs.filter((b) => b.id !== id));
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      fetchBlogs();
    }, []);
  
  return (
    <>
    {/* <Link to="/dashboard/addBlogs"><Button className="mt-6" >Add Blogs</Button></Link> */}
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="green" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          {lang ==='ar'? "جدول المدونات" : "Blogs Table "}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addblog"><Button
  className="flex  bg-[#D87C55] items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة مدونة" : "Add Blogs "}
</Button></Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "العنوان" : "Title"}`,`${lang ==='ar'? "الوصف" :"Desrciption"}`,`${lang ==='ar'? "الصورة" : "Image"}`,`${lang ==='ar'? "تنفيذ" : "Action"}`].map((el) => (
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
            {Blogs.map(
              (Blog,index) => {
                const className = `py-3 px-5 ${index === Blogs.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={Blog.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {Blog.title}
                          </Typography>

                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {Blog.description}
                          </Typography>

                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar src={`${API_URL}/${Blog.img}`}alt={"Blogs"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                      <td className={className}>
                        <div className="flex items-center ">
                          <Button 
                    onClick={() => navigate(`/dashboard/updateblog/${Blog.id}`)}
                    className="mr-2 flex items-center bg-[#D87C55] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
                    onClick={() => handleShow(Blog.id)} // Pass the Blogs ID to handleShow
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
       id={BlogsIdToDelete} // Pass the Blogs ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default Blogs