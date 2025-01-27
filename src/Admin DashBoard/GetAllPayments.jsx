import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import Swal from "sweetalert2";
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import Cookies from "js-cookie";

function GetAllPayments() {
  const [payments, setPayments] = useState([]);
  const lang = Cookies.get('lang') || 'en';

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/getAllPayments`);
      setPayments(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch payments. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
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
       
        await axios.put(`${API_URL}/payments/updatePaymentStatus/${id}`, {
          status: newStatus,
        });

        
        setPayments(payments.map((pay) => 
          pay.id === id ? { ...pay, status: newStatus } : pay
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
    fetchPayments();
  }, []);

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" style={{ backgroundColor: "#6DA6BA" }} className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Payments Table
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      User Name
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Phone Number
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Payment Method
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Status
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                     Action
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Reservation Info
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => {
                  const className = `py-3 px-5 ${index === payments.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                  return (
                    <tr key={payment.id}>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {payment.UserName || 'N/A'}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {payment.Phone_Number}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">
                          {payment.paymentMethod}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {payment.status}
                        </Typography>
                      </td>
                      {payment.status === 'Pending' ? (
                      <td className={className}>
                      <Button
                        onClick={() => handleUpdateStatus(payment.id, payment.status)}
                        className="text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-yellow-500"
                      >
                        {lang === "ar" ? "تحديث الحالة" : "Update Status"}
                      </Button>
                    </td>

                      ) : (
                        <td></td>
                      )}
                      <td className={className}>
                        {payment.Reservations_Chalet ? (
                          <div>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              Reservation ID: {payment.Reservations_Chalet.id}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              Start Date: {new Date(payment.Reservations_Chalet.start_date).toLocaleDateString()}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              Time: {payment.Reservations_Chalet.Time}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              Status: {payment.Reservations_Chalet.Status}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              Total Amount: ${payment.Reservations_Chalet.Total_Amount}
                            </Typography>
                          </div>
                        ) : (
                          <Typography className="text-xs font-normal text-blue-gray-500">No reservation</Typography>
                        )}
                      </td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default GetAllPayments;