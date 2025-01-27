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
                {["#","Chalet Title","time", "starting_price", "Total Amount", "Date", "reservation_type"].map((el) => (
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
                      <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.id}</Typography>
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
                      <Typography className="text-xs font-semibold text-blue-gray-600">{new Date(reservation.date).toLocaleDateString()}</Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">{reservation.reservation_type}</Typography>
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
