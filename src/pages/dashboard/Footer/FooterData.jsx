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
    Button
  } from "@material-tailwind/react";
 import Cookies from "js-cookie";
function FooterData() {
    const navigate = useNavigate();
    const [Footer, setFooter] = useState([]);
    const [socail, setSocial] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [FooterIdToDelete, setFooterIdToDelete] = useState(null); // Store the ID of the Footer to delete
    const lang = Cookies.get('lang') || 'en';

    const handleShow = (id) => {
      setFooterIdToDelete(id); // Set the Footer ID to delete
      setShowModal(true);
    };
  
    const handleClose = () => {
      setShowModal(false);
      setFooterIdToDelete(null); // Reset the ID when closing
    };
  
    const fetchFooter = async () => {
      try {
        const response = await axios.get(`${API_URL}/footer/get/footer`);
        setFooter(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchSocial = async () => {
      try {
        const response = await axios.get(`${API_URL}/social/get/social`);
        setSocial(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      fetchFooter();
      fetchSocial()
    }, []);
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${API_URL}/social/delete/social/${id}`);
        setSocial(Blogs.filter((b) => b.id !== id));
      } catch (error) {
        console.error(error);
      }
    };
  return (
    <>
    {/* <Link to="/dashboard/addFooter"><Button className="mt-6" >Add Footer</Button></Link> */}
    <div className="mt-12 mb-8 flex flex-col gap-12">
        
    <Card>
      <CardHeader variant="gradient" color="green" className="mb-8 p-6">
        <Typography variant="h6" color="white">
        {lang ==='ar'? "جدول اسفل الصفحة " :"Footer Table"}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "البريد الالكتروني" : "Email "}`,`${lang ==='ar'? "الرقم" : "Phone"}`,`${lang ==='ar'? "الصورة" : "Logo"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
            {Footer.map(
              (foot,index) => {
                const className = `py-3 px-5 ${index === Footer.length - 1 ? "" : "border-b border-blue-gray-50"}`;


                return (
                  <tr key={foot.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {foot.email}
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
                            {foot.phone}
                          </Typography>

                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar src={`${API_URL}/${foot.logo}`}alt={"Footer"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                      <td className={className}>
                        <div className="flex items-center ">
                          <Button 
                    onClick={() => navigate(`/dashboard/updatefooter/${foot.id}`)}
                    className="mr-2 flex items-center bg-[#D87C55] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
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
    <Card>
      <CardHeader variant="gradient" color="green" className="mb-8 p-6">
        <Typography variant="h6" color="white">
          {lang ==='ar'? "جدول التواصل الاجتماعي" :"Social Media Table"}
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
      <Link to="/dashboard/addsocial"><Button
  className="flex  bg-[#D87C55] items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '80px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "اضافة تواصل اجنماعي " :"Add Social media"}
</Button></Link>
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {[`${lang ==='ar'? "الرابط" :"Link to"}`,`${lang ==='ar'? "الصورة" :"Icon"}`,`${lang ==='ar'? "تنفيذ" :"Action"}`].map((el) => (
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
          {socail.map(
              (soc,index) => {
                const className = `py-3 px-5 ${index === socail.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={soc.id}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {soc.link_to}
                          </Typography>

                        </div>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      <Avatar src={`${API_URL}/${soc.icon}`}alt={"Footer"} size="md" variant="rounded" />
                      </Typography>
                    </td>
                      <td className={className}>
                        <div className="flex items-center ">
                          <Button 
                    onClick={() => navigate(`/dashboard/updatesocial/${soc.id}`)}
                    className="mr-2 flex items-center bg-[#D87C55] transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> {lang ==='ar'? "تعديل" : "Edit "}
                          </Button>
                          <Button 
                    onClick={() => handleShow(soc.id)} // Pass the Blogs ID to handleShow
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
       id={FooterIdToDelete} // Pass the Blogs ID to DeleteModule
      />
  </div>  
  </>
  )
}

export default FooterData