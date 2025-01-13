import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App.jsx";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DeleteModule from "../Components/DeleteModule.jsx";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";

function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [itemType, setItemType] = useState(null);
  const lang = Cookies.get('lang') || 'en';

  const handleShow = (id, type) => {
    setUserIdToDelete(id);
    setItemType(type);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setUserIdToDelete(null);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/Users/getAllUsers/${lang}`);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (itemType === 'user') {
        await axios.delete(`${API_URL}/users/deleteUser/${userIdToDelete}/${lang}`);
        setUsers(users.filter((user) => user.id !== userIdToDelete));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="green" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {lang === 'ar' ? "المستخدمين" : "Users"}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <Link to="/dashboard/adduser">
              <Button
                className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#D87C55]"
                style={{ marginLeft: '80px' }}
              >
                <PlusIcon className="h-5 w-5 mr-1" /> {lang === 'ar' ? "إضافة مستخدم" : "Add User"}
              </Button>
            </Link>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[`${lang === 'ar' ? "اسم المستخدم" : "User Name"}`, `${lang === 'ar' ? "البريد الإلكتروني" : "Email"}`, `${lang === 'ar' ? "رقم الهاتف" : "Phone Number"}`, `${lang === 'ar' ? "الدولة" : "Country"}`, `${lang === 'ar' ? "اللغة" : "Language"}`, `${lang === 'ar' ? "إجراءات" : "Actions"}`].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const className = `py-3 px-5 ${index === users.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                  return (
                    <tr key={user.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {user.name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.phone_number}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.country}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {user.lang}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center">
                          {/* <Button
                            onClick={() => navigate(`/dashboard/updateuser/${user.id}`)}
                            className="mr-2 bg-[#D87C55] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> {lang === 'ar' ? "تعديل" : "Edit"}
                          </Button> */}
                          <Button
                            onClick={() => handleShow(user.id, 'user')}
                            className="text-white-600 bg-[#F5C16C] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" /> {lang === 'ar' ? "حذف" : "Delete"}
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
        <DeleteModule
          showModal={showModal}
          handleClose={handleClose}
          handleDelete={handleDelete}
          id={userIdToDelete}
        />
      </div>
    </>
  );
}

export default UsersPage;
