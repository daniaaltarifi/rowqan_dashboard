import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import Swal from "sweetalert2";
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import Cookies from "js-cookie";
import '../Styles/Chalets.css'
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteModule from "@/Components/DeleteModule";

function GetAllPayments() {
  const [payments, setPayments] = useState([]);
  const lang = Cookies.get('lang') || 'en';
 const [showModal, setShowModal] = useState(false);
  const [paymentIdToDelete, setpaymentIdToDelete] = useState(null); 
  const handleShow = (id) => {
    setpaymentIdToDelete(id);  // Set the ID to delete (chalet or details)
    setShowModal(true);  // Show the modal
  };
  
  const handleClose = () => {
    setShowModal(false);
    setpaymentIdToDelete(null); // Reset the ID when closing
  };
  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/getAllPayments`);
      setPayments(response.data);
    } catch (error) {
      console.error(error);
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
  const handleDelete = async () => {  
    try {
        await axios.delete(`${API_URL}/payments/deletePayment/${paymentIdToDelete}`);
        setPayments(payments.filter((payment) => payment.id !== paymentIdToDelete)); // Remove from list       
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" style={{ backgroundColor: "#6DA6BA" }} className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Payments Table
            </Typography>
          </CardHeader>
          <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
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
                    Starting Price                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    initial Amount                   </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Remainning Amount                 </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                    Total Amount                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      Invoice
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
                  <th className="border-b border-blue-gray-50 py-3 px-5 ">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                     Delete Reservation
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
      payments.map((payment, index) => {
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
              <Typography className="text-xs font-normal text-blue-gray-500">
                {payment.Reservations_Chalet?.starting_price}
              </Typography>
            </td>
            <td className={className}>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {payment.initialAmount}
              </Typography>
            </td>
            <td className={className}>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {payment.RemainningAmount}
              </Typography>
            </td>
            <td className={className}>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {payment.Reservations_Chalet?.Total_Amount}
              </Typography>
            </td>
            <td className={className}>
              {payment.image  ? <img src={payment.image} onClick={() => window.open(payment.image, "_blank")}height={"500px"}width={"100px"}/> : null  }
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
                  <Typography className="text-xs font-normal text-blue-gray-500">
                  Additional visitors: {payment.Reservations_Chalet.additional_visitors}
                  </Typography>
                  <Typography className="text-xs font-normal text-blue-gray-500">
                  Number of days: {payment.Reservations_Chalet.number_of_days}
                  </Typography>
                </div>
              ) : (
                <Typography className="text-xs font-normal text-blue-gray-500">No reservation</Typography>
              )}
            </td>
            <td >
                <Button 
                 onClick={() => handleShow(payment.id)}
                 className="mb-3 text-white-600 bg-[#F2C79D] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500">
                 <TrashIcon className="h-5 w-4 mr-1" /> {lang ==='ar'? "حذف" : "Delete "}
                 </Button>
            </td>
          </tr>
        );
      })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-3 px-5 text-center">
                      <Typography variant="small" color="blue-gray">
                        No payments found.
                      </Typography>
                    </td>
                  </tr>

                )}
         
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
      <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
       id={paymentIdToDelete} // Pass the chalet ID to DeleteModule
      />
    </>
  );
}

export default GetAllPayments;