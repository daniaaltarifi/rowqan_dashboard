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

function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [lang] = useState("en");

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${API_URL}/ReservationsChalets/getAllReservationChalet/${lang}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Confirmed" : "Pending"; // التبديل بين الحالة الحالية والحالة الجديدة

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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" style={{ backgroundColor: "#6DA6BA" }} className="mb-8 p-6">
          <Typography variant="h6" color="white">
            {lang === "ar" ? "جدول الحجوزات" : "Reservations Table"}
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Chalet Title", "Reserve Price", "Total Amount", "Date", "Status", "Action"].map((el) => (
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
                      <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.chalet.title}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.reserve_price}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.total_amount}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{new Date(reservation.date).toLocaleDateString()}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.status}</Typography>
                    </td>
                    <td className={className}>
                      <Button
                        onClick={() => handleUpdateStatus(reservation.id, reservation.status)}
                        className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-yellow-500"
                      >
                        {lang === "ar" ? "تحديث الحالة" : "Update Status"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default ReservationsPage;
