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
import '../Styles/Chalets.css'

function ChaletsOwnersPage() {
  const navigate = useNavigate();
  const [chaletsOwners, setChaletsOwners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ownerIdToDelete, setOwnerIdToDelete] = useState(null);
  const [itemType, setItemType] = useState(null);
  const lang = Cookies.get('lang') || 'en';

  const handleShow = (id, type) => {
    setOwnerIdToDelete(id);
    setItemType(type);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setOwnerIdToDelete(null);
  };

  const fetchChaletsOwners = async () => {
    try {
      const res = await axios.get(`${API_URL}/userstypes/getAllChaletsOwners/${lang}`);
      setChaletsOwners(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (itemType === 'owner') {
        await axios.delete(`${API_URL}/chaletsowners/deleteOwner/${ownerIdToDelete}/${lang}`);
        setChaletsOwners(chaletsOwners.filter((owner) => owner.id !== ownerIdToDelete));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChaletsOwners();
  }, []);

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" style={{ backgroundColor: '#6DA6BA' }} className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {lang === 'ar' ? "مالكي الشاليهات" : "Chalets Owners"}
            </Typography>
          </CardHeader>
          <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[`${lang === 'ar' ? "اسم المالك" : "Owner Name"}`, `${lang === 'ar' ? "البريد الإلكتروني" : "Email"}`, `${lang === 'ar' ? "رقم الهاتف" : "Phone Number"}`, `${lang === 'ar' ? "الدولة" : "Country"}`, `${lang === 'ar' ? "اللغة" : "Language"}`, `${lang === 'ar' ? "إجراءات" : "Actions"}`].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chaletsOwners.map((owner, index) => {
                  const className = `py-3 px-5 ${index === chaletsOwners.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                  return (
                    <tr key={owner.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {owner.name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {owner.email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {owner.phone_number}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {owner.country}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {owner.lang}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center">
                          <Button
                            onClick={() => navigate(`/dashboard/updateowner/${owner.id}`)}
                            className="mr-2 bg-[#6DA6BA] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            <PencilIcon className="h-5 w-5 mr-1" /> {lang === 'ar' ? "تعديل" : "Edit"}
                          </Button>
                          <Button
                            onClick={() => handleShow(owner.id, 'owner')}
                            className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
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
          id={ownerIdToDelete}
        />
      </div>
    </>
  );
}

export default ChaletsOwnersPage;
