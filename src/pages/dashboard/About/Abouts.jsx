import React, { useEffect, useState } from "react";
import "../../../Styles/brands.css"; 
import axios from "axios";
import { API_URL } from "../../../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../../../Components/DeleteModule.jsx";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Button
} from "@material-tailwind/react";
import '../../../Styles/Chalets.css'

function Abouts() {
    const navigate = useNavigate();
    const [about, setAbout] = useState([]);
    const [hero, setHero] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const lang = Cookies.get('lang') || 'en';
      const [showModal, setShowModal] = useState(false);
    
  const [blogidToDelete, setblogidToDelete] = useState(null); // Store the ID of the slide to delete

    const handleShow = (id) => {
        setblogidToDelete(id);
        setShowModal(true);
    };
  
    const handleClose = () => {
        setShowModal(false);
        setblogidToDelete(null); 
    };
  
    const fetchAbout = async () => {
        try {
            const [aboutRes,heroRes,blogsRes] = await Promise.all([
                axios.get(`${API_URL}/aboutUs/getabout/${lang}`),
                axios.get(`${API_URL}/heroes/getAllHeroes/${lang}`),
                axios.get(`${API_URL}/Blogs/getAllBlogs/${lang}`),
            ]) 
            setAbout(aboutRes.data);
            setHero(heroRes.data)
            setBlogs(blogsRes.data)
        } catch (error) {
            console.error(error);
        }
    };
  
    useEffect(() => {
        fetchAbout();
    }, []);
    const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/Blogs/deleteBlog/${id}/${lang}`);
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
    return (
        <>
        <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
                <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        {lang ==='ar'? "جدول الرئيسية" : "Hero Table "}
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {[`${lang ==='ar'? "العنوان" :"Title"}`, `${lang ==='ar'? "الوصف" :"Description"}`,`${lang ==='ar'? "عنوان الزر" :"button title"}`, `${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "تنفيذ" :"Action"}` ].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 ">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hero.map((main, index) => {
                                const className = `py-3 px-5 ${index === hero.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                return (
                                    <tr key={main.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                                        {main.title}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <main className="text-xs font-semibold text-blue-gray-600">
                                                {main.description}
                                            </main>
                                        </td>
                                        <td className={className}>
                                            <main className="text-xs font-semibold text-blue-gray-600">
                                                {main.title_btn}
                                            </main>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                <Avatar         src={`https://res.cloudinary.com/dqimsdiht/${main.image}`}  alt={"main Image"} size="lg" variant="rounded" />
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center">
                                                <Button
                                                    onClick={() => navigate(`/dashboard/updatehero/${main.id}`)}
                                                    className="mr-2 flex items-center bg-[#6DA6BA] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                                                >
                                                    <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            <Card>
                <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        {lang ==='ar'? "جدول عن روقان" : "About Table "}
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {[`${lang ==='ar'? "العنوان" :"Title"}`, `${lang ==='ar'? "الوصف" :"Description"}`, `${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "تنفيذ" :"Action"}` ].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 ">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {about.map((about, index) => {
                                const className = `py-3 px-5 ${index === about.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                return (
                                    <tr key={about.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                                        {about.title}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {about.description}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                <Avatar         src={`https://res.cloudinary.com/dqimsdiht/${about.image}`}  alt={"About Image"} size="lg" variant="rounded" />
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center">
                                                <Button
                                                    onClick={() => navigate(`/dashboard/updateabouts/${about.id}`)}
                                                    className="mr-2 flex items-center bg-[#6DA6BA] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                                                >
                                                    <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
            <Card>
                <CardHeader variant="gradient"style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
                    <Typography variant="h6" color="white">
                        {lang ==='ar'? "جدول المدونة" : "Blogs Table "}
                    </Typography>
                </CardHeader>
                 <Link to="/dashboard/addblog">
                    <Button
                  className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#F2C79D]"
                  style={{ marginLeft: '80px' }} 
                >
                  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة مدونة" : "Add Blog "}
                </Button>
                </Link>
                <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                            <tr>
                                {[`${lang ==='ar'? "العنوان" :"Title"}`, `${lang ==='ar'? "الوصف" :"Description"}`, `${lang ==='ar'? "الصورة" :"Image"}`,`${lang ==='ar'? "تنفيذ" :"Action"}` ].map((el) => (
                                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 ">
                                        <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {el}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, index) => {
                                const className = `py-3 px-5 ${index === blogs.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                                return (
                                    <tr key={blog.id}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                                        {blog.title}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {/* {blog.description} */}
                                           <div dangerouslySetInnerHTML={{ __html: blog.description }}  />
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                <Avatar         src={`https://res.cloudinary.com/dqimsdiht/${blog.image}`}  alt={"About Image"} size="lg" variant="rounded" />
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex items-center">
                                                <Button
                                                    onClick={() => navigate(`/dashboard/updateblog/${blog.id}`)}
                                                    className="mr-2 flex items-center bg-[#6DA6BA] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                                                >
                                                    <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                                                </Button>
                                                <Button 
                                                  onClick={() => handleShow(blog.id)}className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                                                                          >
                                                                            <TrashIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "حذف" : "Delete "}
                                                                          </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
                <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
       id={blogidToDelete} // Pass the chalet ID to DeleteModule
      />
            </Card>
           
        </div>  
        </>
    );
}

export default Abouts;
