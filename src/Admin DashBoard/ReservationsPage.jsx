import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; 
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../App";
import '../Styles/Chalets.css'
import { TrashIcon} from "@heroicons/react/24/outline";
import DeleteModule from "@/Components/DeleteModule";
import Cookies from "js-cookie";

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const lang = Cookies.get('lang') || 'en';
  const [reservationIdToDelete, setreservationIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const handleShow = (id) => {
    setreservationIdToDelete(id);  
    setShowModal(true);  
  };
  
  const handleClose = () => {
    setShowModal(false);
    setreservationIdToDelete(null);
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${API_URL}/ReservationsChalets/getAllReservationChalet/${lang}`);
      const sortedReservations = response.data.sort((a, b) => b.id - a.id);
      setReservations(sortedReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Confirmed" : "Pending"; 

    const result = await Swal.fire({
      title: lang === "ar" ? "هل أنت متأكد من تحديث الحالة؟" : "Are you sure to update the status?",
      text: lang === "ar" ? "ستتم تحديث الحالة لهذا الحجز." : "The status for this reservation will be updated.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang === "ar" ? "نعم، تحديث الحالة!" : "Yes, update the status!",
      cancelButtonText: lang === "ar" ? "إلغاء" : "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/ReservationsChalets/updateReservations/${id}`, {
          status: newStatus,
        });
        
        setReservations(reservations.map((reservation) => 
          reservation.id === id ? { ...reservation, status: newStatus } : reservation
        ));

        Swal.fire(
          lang === "ar" ? "تم التحديث!" : "Updated!",
          lang === "ar" ? "تم تحديث الحالة بنجاح." : "The status has been updated successfully.",
          "success"
        );
      } catch (error) {
        console.error("Error updating status:", error);
        Swal.fire(
          lang === "ar" ? "خطأ!" : "Error!",
          lang === "ar" ? "حدث خطأ أثناء محاولة تحديث الحالة." : "An error occurred while trying to update the status.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async () => {  
    try {
        await axios.delete(`${API_URL}/ReservationsChalets/reservations/${reservationIdToDelete}/${lang}`);
        setReservations(reservations.filter((reservation) => reservation.id !== reservationIdToDelete)); 
    } catch (error) {
      console.error(error);
    }
  };

 
  const tableHeaders = ["ID", `User`, "Chalet Title", "time", "starting_price", "Total Amount", "Start Date", "reservation_type"];
  if (reservations.some(res => res.user && res.user.user_type_id === 1)) {
    tableHeaders.push(lang === "ar" ? "حذف الحجز للمسؤولين" : "Delete Reservation For Admins");
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" style={{ backgroundColor: "#6DA6BA" }} className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {lang === "ar" ? "جدول الحجوزات" : "Reservations Table"}
          </Typography>
        </CardHeader>
        <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {tableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.length > 0 ? (
                reservations.map((reservation, index) => {
                  const className = `py-3 px-5 ${index === reservations.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                  return (
                    <tr key={reservation.id}>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.id}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {reservation.user ? `${reservation.user.name} ` : `No user`}
                        </Typography>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {reservation.user ? `${reservation.user.email} ` : ``}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.chalet.title}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.time}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.starting_price}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.total_amount}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(reservation.start_date).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.reservation_type}</Typography>
                      </td>
                      {reservation.user && reservation.user.user_type_id === 1 ? (
                        <td className={className}>
                          <Button 
                            onClick={() => handleShow(reservation.id)} 
                            className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" /> {lang === 'ar' ? "حذف" : "Delete"}
                          </Button> 
                        </td>
                      ) : null}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-3 px-5 text-center">
                    <Typography variant="small" className="text-blue-gray-400">
                      {lang === "ar" ? "لا توجد حجوزات" : "No reservations found"}
                    </Typography>
                  </td>
                </tr>
              )}
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
  );
}

export default ReservationsPage;