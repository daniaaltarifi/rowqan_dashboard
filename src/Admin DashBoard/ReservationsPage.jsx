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
import { TrashIcon} from "@heroicons/react/24/outline";
import DeleteModule from "@/Components/DeleteModule";
import Cookies from "js-cookie";

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const lang = Cookies.get('lang') || 'en';
  const [reservationIdToDelete, setreservationIdToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Custom styles objects
  const styles = {
    deletableRow: {
      background: 'linear-gradient(135deg, #AFB7AB 0%, #6DA6BA 50%, #F2C79D 100%)',
      transition: 'all 0.3s ease',
      position: 'relative',
    },
    adminLabel: {
      position: 'absolute',
      top: '0',
      right: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      color: 'white',
      padding: '2px 8px',
      fontSize: '10px',
      borderRadius: '0 0 0 8px',
    }
  };

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

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async () => {  
    try {
      await axios.delete(`${API_URL}/ReservationsChalets/reservations/${reservationIdToDelete}/${lang}`);
      setReservations(reservations.filter((reservation) => reservation.id !== reservationIdToDelete)); 
      handleClose();
      Swal.fire({
        title: lang === "ar" ? "تم الحذف!" : "Deleted!",
        text: lang === "ar" ? "تم حذف الحجز بنجاح." : "The reservation has been deleted successfully.",
        icon: "success"
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: lang === "ar" ? "خطأ!" : "Error!",
        text: lang === "ar" ? "حدث خطأ أثناء محاولة حذف الحجز." : "An error occurred while trying to delete the reservation.",
        icon: "error"
      });
    }
  };

  const tableHeaders = [
    "ID", 
    `User`, 
    "Chalet Title", 
    "time", 
    "starting_price", 
    "Total Amount", 
    "Start Date", 
    "reservation_type",
    lang === "ar" ? "حذف الحجز للمسؤولين" : "Delete"
  ];

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-lg rounded-lg">
        <CardHeader variant="gradient" className="mb-8 p-6" style={{ backgroundColor: "#6DA6BA" }}>
          <Typography variant="h6" color="white">
            {lang === "ar" ? "جدول الحجوزات" : "Reservations Table"}
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {tableHeaders.map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 bg-gray-50">
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
                  const isDeleteEnabled = reservation.user && reservation.user.user_type_id === 1;
                  const className = `py-3 px-5 ${index === reservations.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                  
                  return (
                    <tr 
                      key={reservation.id} 
                      style={isDeleteEnabled ? styles.deletableRow : {}}
                      className="transition-all hover:bg-gray-50 relative"
                    >
                      {isDeleteEnabled && (
                        <div style={styles.adminLabel}>
                          Delete Admin Reserve
                        </div>
                      )}
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.id}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.user ? `${reservation.user.name} ` : `No user`}
                        </Typography>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.user ? `${reservation.user.email} ` : ``}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.chalet.title}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.time}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.starting_price}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.total_amount}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {new Date(reservation.start_date).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'}`}>
                          {reservation.reservation_type}
                        </Typography>
                      </td>
                      {isDeleteEnabled && (
                        <td className={className} style={{ display: 'flex', alignItems: 'center' }}>
                          <Typography className={`text-xs font-semibold ${isDeleteEnabled ? 'text-white' : 'text-blue-gray-600'} mr-[200px]`}>
                            {lang === "ar" ? "حذف الحجز للمسؤولين" : "Delete"}
                          </Typography>
                          <button 
                            onClick={() => handleShow(reservation.id)} 
                            className="flex items-center gap-2 px-4 py-2 rounded-md 
                                     bg-white/20 backdrop-blur-sm border border-white/30
                                     text-white transition-all duration-300 cursor-pointer
                                     hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-500"
                          >
                            <TrashIcon className="h-5 w-5" /> 
                            {lang === 'ar' ? "حذف" : "Delete"}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="py-8 px-5 text-center text-gray-500 italic">
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