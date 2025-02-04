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
  Avatar,
  Chip,
  Tooltip,
  Progress,
  Button,
} from "@material-tailwind/react";

function ReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reservationIdToDelete, setReservationIdToDelete] = useState(null);
  const [itemType, setItemType] = useState(null);
  const lang = Cookies.get('lang') || 'en';

  const handleShow = (id, type) => {
    setReservationIdToDelete(id);
    setItemType(type);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setReservationIdToDelete(null);
  };

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_URL}/ReservationsChalets/getAllReservationChalet/${lang}`);
      setReservations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (itemType === 'reservation') {
        await axios.delete(`${API_URL}/reservations/deletereservation/${reservationIdToDelete}/${lang}`);
        setReservations(reservations.filter((reservation) => reservation.id !== reservationIdToDelete));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="green" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {lang === 'ar' ? "جدول الحجوزات" : "Reservations Table"}
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <Link to="/dashboard/addreservation">
              <Button
                className="flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500 bg-[#D87C55]"
                style={{ marginLeft: '80px' }}
              >
                <PlusIcon className="h-5 w-5 mr-1" /> {lang === 'ar' ? "إضافة حجز" : "Add Reservation"}
              </Button>
            </Link>
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[`${lang === 'ar' ? "العنوان" : "Title"}`, `${lang === 'ar' ? "السعر" : "Reserved Price"}`, `${lang === 'ar' ? "الحالة" : "Status"}`, `${lang === 'ar' ? "تنفيذ" : "Reserved Price - Total Amount"}`,
                    `${lang === 'ar' ? "التاريخ" : "CashBack Percent"}`, `${lang === 'ar' ? "الزوار الاضافيين" : "Date"}`,`${lang === 'ar' ? "الزوار الاضافيين" : "Additional Visitors"}`,
                    `${lang === 'ar' ? "صفحة التفاصيل" : "Details"}`
                  ].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation, index) => {
                  const className = `py-3 px-5 ${index === reservations.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                  return (
                    <tr key={reservation.id}>
                     
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {reservation.chalet.title}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {reservation.reserve_price}
                          </Typography>
                        </Typography>
                      </td>
                      <td className={className} style={{ backgroundColor: reservation.status === 'pending' ? '#A9A9A9' : reservation.status === 'approved' ? '#3498db' : reservation.status === 'rejected' ? '#e74c3c' : '' }}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          <Typography variant="small" color="blue-gray" className="font-semibold">
                            {reservation.status}
                          </Typography>
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {reservation.initial_amount} - {reservation.total_amount}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {reservation.cashback}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(reservation.date).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {reservation.additional_visitors}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="flex items-center">
                          <Button
                            onClick={() => navigate(`/dashboard/reservationdetails/${reservation.id}`)}
                            className="mr-2 bg-[#D87C55] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                          >
                            See Details
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
          id={reservationIdToDelete}
        />
      </div>
    </>
  );
}

export default ReservationsPage;
