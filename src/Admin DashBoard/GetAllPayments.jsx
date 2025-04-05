import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import Swal from "sweetalert2";
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, IconButton } from "@material-tailwind/react";
import Cookies from "js-cookie";
import '../Styles/Chalets.css'
import { TrashIcon, PencilIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DeleteModule from "@/Components/DeleteModule";
import { useNavigate } from 'react-router-dom';

function GetAllPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const lang = Cookies.get('lang') || 'en';
  const [showModal, setShowModal] = useState(false);
  const [paymentIdToDelete, setpaymentIdToDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleShow = (id) => {
    setpaymentIdToDelete(id);  
    setShowModal(true);  
  };
  
  const handleEdit = (payment) => {
    navigate(`/dashboard/updatePayment/${payment.id}`, { 
      state: { paymentData: payment } 
    });
  };
  
  const handleClose = () => {
    setShowModal(false);
    setpaymentIdToDelete(null);
  };

  const handleShowDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedPayment(null);
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/payments/getAllPayments`);
      
      const sortedPayments = response.data.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return b.id - a.id;
      });
      setPayments(sortedPayments);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    let newStatus = "Confirmed"; 
    
    if (currentStatus === "Confirmed") {
      newStatus = "Pending";
    }
  
    const result = await Swal.fire({
      title: lang === "ar" ? "هل أنت متأكد من تحديث الحالة؟" : "Are you sure to update the status?",
      text: lang === "ar" 
        ? `ستتم تحديث الحالة لهذا الحجز من "${currentStatus}" إلى "${newStatus}".` 
        : `The status for this reservation will be updated from "${currentStatus}" to "${newStatus}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: lang === "ar" ? "نعم، تحديث الحالة!" : "Yes, update the status!",
      cancelButtonText: lang === "ar" ? "إلغاء" : "Cancel",
    });
  
    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/payments/updatePaymentStatus/${id}`, {
          status: newStatus,
        });
        
        setPayments(payments.map((pay) => 
          pay.id === id ? { ...pay, status: newStatus } : pay
        ));
  
        Swal.fire(
          lang === "ar" ? "تم التحديث!" : "Updated!",
          lang === "ar" 
            ? `تم تحديث الحالة بنجاح من "${currentStatus}" إلى "${newStatus}".` 
            : `The status has been updated successfully from "${currentStatus}" to "${newStatus}".`,
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
      handleClose();
      Swal.fire({
        title: lang === "ar" ? "تم الحذف!" : "Deleted!",
        text: lang === "ar" ? "تم حذف الدفعة بنجاح." : "The payment has been deleted successfully.",
        icon: "success"
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: lang === "ar" ? "خطأ!" : "Error!",
        text: lang === "ar" ? "حدث خطأ أثناء محاولة حذف الدفعة." : "An error occurred while trying to delete the payment.",
        icon: "error"
      });
    }
  };

  // Define the simplified headers for main table
  const mainTableHeaders = [
    {
      id: "userName",
      text: lang === "ar" ? "اسم المستخدم" : "User Name"
    },
    {
      id: "phoneNumber",
      text: lang === "ar" ? "رقم الهاتف" : "Phone Number"
    },
    {
      id: "status",
      text: lang === "ar" ? "الحالة" : "Status"
    },
    {
      id: "details",
      text: lang === "ar" ? "التفاصيل" : "Details"
    },
    {
      id: "actions",
      text: lang === "ar" ? "الإجراءات" : "Actions"
    }
  ];

  // Define the detailed headers for modal
  const detailsTableHeaders = [
    {
      id: "userName",
      text: lang === "ar" ? "اسم المستخدم" : "User Name"
    },
    {
      id: "phoneNumber",
      text: lang === "ar" ? "رقم الهاتف" : "Phone Number"
    },
    {
      id: "paymentMethod",
      text: lang === "ar" ? "طريقة الدفع" : "Payment Method"
    },
    {
      id: "startingPrice",
      text: lang === "ar" ? "السعر المبدئي" : "Starting Price"
    },
    {
      id: "initialAmount",
      text: lang === "ar" ? "المبلغ الأولي" : "Initial Amount"
    },
    {
      id: "remainingAmount",
      text: lang === "ar" ? "المبلغ المتبقي" : "Remaining Amount"
    },
    {
      id: "totalAmount",
      text: lang === "ar" ? "المبلغ الإجمالي" : "Total Amount"
    },
    {
      id: "status",
      text: lang === "ar" ? "الحالة" : "Status"
    }
  ];

  return (
    <>
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" style={{ backgroundColor: "#6DA6BA" }} className="mb-8 p-6">
            <Typography variant="h6" color="white">
              {lang === "ar" ? "جدول المدفوعات" : "Payments Table"}
            </Typography>
          </CardHeader>
          <CardBody className="table-container overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {mainTableHeaders.map((header) => (
                    <th key={header.id} className="border-b border-blue-gray-50 py-3 px-5 bg-gray-50">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {header.text}
                      </Typography>
                    </th>
                  ))}
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
                          <div className={`px-2 py-1 rounded-md inline-block ${
                            payment.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                            payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            <Typography className="text-xs font-semibold">
                              {payment.status}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          <Button
                            onClick={() => handleShowDetails(payment)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-gray-50 text-blue-gray-700 rounded-md transition-all hover:bg-blue-gray-100"
                          >
                            <EyeIcon className="h-5 w-5" /> 
                            {lang === 'ar' ? "عرض التفاصيل" : "See Details"}
                          </Button>
                        </td>
                        <td className={className}>
                          <div className="flex flex-col gap-2">
                            {payment.status === 'Pending' || payment.status === 'Cancelled' || payment.status === 'Confirmed' ? (
                              <Button
                                onClick={() => handleUpdateStatus(payment.id, payment.status)}
                                className={`text-white ${payment.status === 'Confirmed' ? 'bg-[#6DA6BA]' : 'bg-[#F2C79D]'} flex items-center justify-center transition duration-300 ease-in hover:shadow-lg ${payment.status === 'Confirmed' ? 'hover:shadow-blue-500' : 'hover:shadow-yellow-500'} px-2 py-1 text-xs w-20`}
                                size="sm"
                              >
                                {lang === "ar" 
                                  ? (payment.status === 'Confirmed' ? "إلغاء" : "تأكيد") 
                                  : (payment.status === 'Confirmed' ? "Cancel" : "Accept")}
                              </Button>
                            ) : null}
                            <Button 
                              onClick={() => handleEdit(payment)}
                              className="text-white bg-[#6DA6BA] flex items-center justify-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500 px-2 py-1 text-xs w-20"
                              size="sm"
                            >
                              <PencilIcon className="h-3 w-3 mr-1" /> 
                              {lang === 'ar' ? "تعديل" : "Edit"}
                            </Button>
                            <Button 
                              onClick={() => handleShow(payment.id)}
                              className="text-white bg-[#F2C79D] flex items-center justify-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500 px-2 py-1 text-xs w-20"
                              size="sm"
                            >
                              <TrashIcon className="h-3 w-3 mr-1" /> 
                              {lang === 'ar' ? "حذف" : "Delete"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={mainTableHeaders.length} className="py-8 px-5 text-center text-gray-500 italic">
                      <Typography variant="small" className="text-blue-gray-400">
                        {lang === "ar" ? "لا توجد مدفوعات" : "No payments found"}
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModule 
        showModal={showModal} 
        handleClose={handleClose} 
        handleDelete={handleDelete} 
        id={paymentIdToDelete}
      />

      {/* Details Modal */}
      <Dialog
        open={showDetailsModal}
        handler={handleCloseDetails}
        size="xxl"
        className="bg-white rounded-lg shadow-xl"
      >
        <DialogHeader className="flex justify-between items-center bg-blue-gray-50 rounded-t-lg">
          <Typography variant="h6">
            {lang === "ar" ? "تفاصيل الدفع" : "Payment Details"}
          </Typography>
          <IconButton 
            variant="text" 
            color="blue-gray" 
            onClick={handleCloseDetails}
            className="w-8 h-8 p-0 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="p-4">
          {selectedPayment && (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-lg font-bold mb-3 text-blue-gray-800 border-b pb-2">
                    {lang === "ar" ? "معلومات الدفع" : "Payment Information"}
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "اسم المستخدم" : "User Name"}:</span>
                      <span className="text-blue-gray-800">{selectedPayment.UserName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "رقم الهاتف" : "Phone Number"}:</span>
                      <span className="text-blue-gray-800">{selectedPayment.Phone_Number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "طريقة الدفع" : "Payment Method"}:</span>
                      <span className="text-blue-gray-800">{selectedPayment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "السعر المبدئي" : "Starting Price"}:</span>
                      <span className="text-blue-gray-800">{selectedPayment.Reservations_Chalet?.starting_price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "المبلغ الأولي" : "Initial Amount"}:</span>
                      <span className="text-blue-gray-800">{selectedPayment.initialAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "المبلغ المتبقي" : "Remaining Amount"}:</span>
                      <span className="text-blue-gray-800">{selectedPayment.RemainningAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "المبلغ الإجمالي" : "Total Amount"}:</span>
                      <span className="text-blue-gray-800">{selectedPayment.Reservations_Chalet?.Total_Amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "الحالة" : "Status"}:</span>
                      <span className={`px-2 py-1 rounded-md ${
                        selectedPayment.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                        selectedPayment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-lg font-bold mb-3 text-blue-gray-800 border-b pb-2">
                    {lang === "ar" ? "معلومات الحجز" : "Reservation Information"}
                  </h5>
                  {selectedPayment.Reservations_Chalet ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "رقم الحجز" : "Reservation ID"}:</span>
                        <span className="text-blue-gray-800">{selectedPayment.Reservations_Chalet.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "تاريخ البدء" : "Start Date"}:</span>
                        <span className="text-blue-gray-800">{new Date(selectedPayment.Reservations_Chalet.start_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "الوقت" : "Time"}:</span>
                        <span className="text-blue-gray-800">{selectedPayment.Reservations_Chalet.Time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "الحالة" : "Status"}:</span>
                        <span className="text-blue-gray-800">{selectedPayment.Reservations_Chalet.Status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "المبلغ الإجمالي" : "Total Amount"}:</span>
                        <span className="text-blue-gray-800">${selectedPayment.Reservations_Chalet.Total_Amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "الزوار الإضافيين" : "Additional Visitors"}:</span>
                        <span className="text-blue-gray-800">{selectedPayment.Reservations_Chalet.additional_visitors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-blue-gray-600">{lang === "ar" ? "عدد الأيام" : "Number of Days"}:</span>
                        <span className="text-blue-gray-800">{selectedPayment.Reservations_Chalet.number_of_days}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-blue-gray-500 py-3 italic">
                      {lang === "ar" ? "لا يوجد حجز مرتبط" : "No reservation linked"}
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Image section */}
              {selectedPayment.image && (
                <div className="mt-6">
                  <h5 className="text-lg font-bold mb-3 text-blue-gray-800 border-b pb-2">
                    {lang === "ar" ? "صورة الفاتورة" : "Invoice Image"}
                  </h5>
                  <div className="flex justify-center">
                    <div className="relative border border-gray-200 rounded-lg p-2 max-w-md">
                      <img 
                        src={selectedPayment.image} 
                        alt="Invoice" 
                        className="max-w-full h-auto rounded cursor-pointer" 
                        onClick={() => window.open(selectedPayment.image, "_blank")}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                        {lang === "ar" ? "انقر للتكبير" : "Click to enlarge"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons section */}
              <div className="mt-6 flex flex-wrap gap-3 justify-end">
                <Button
                  onClick={handleCloseDetails}
                  className="bg-gray-300 text-gray-700 transition-all hover:bg-gray-400 px-3 py-1.5 text-xs w-20 flex items-center justify-center"
                  size="sm"
                >
                  {lang === "ar" ? "إغلاق" : "Close"}
                </Button>

                {selectedPayment.status === 'Pending' || selectedPayment.status === 'Cancelled' || selectedPayment.status === 'Confirmed' ? (
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedPayment.id, selectedPayment.status);
                      handleCloseDetails();
                    }}
                    className={`text-white ${selectedPayment.status === 'Confirmed' ? 'bg-[#6DA6BA]' : 'bg-[#F2C79D]'}`}
                  >
                    {lang === "ar" 
                      ? (selectedPayment.status === 'Confirmed' ? "إلغاء التأكيد" : "تأكيد الحجز") 
                      : (selectedPayment.status === 'Confirmed' ? "Cancel Confirmation" : "Accept Reservation")}
                  </Button>
                ) : null}

                <Button
                  onClick={() => {
                    handleEdit(selectedPayment);
                    handleCloseDetails();
                  }}
                  className="bg-[#6DA6BA] text-white px-3 py-1.5 text-xs w-20 flex items-center justify-center"
                  size="sm"
                >
                  <PencilIcon className="h-3 w-3 mr-1 inline-block" /> 
                  {lang === 'ar' ? "تعديل" : "Edit"}
                </Button>

                <Button
                  onClick={() => {
                    handleShow(selectedPayment.id);
                    handleCloseDetails();
                  }}
                  className="bg-[#F2C79D] text-white px-3 py-1.5 text-xs w-20 flex items-center justify-center"
                  size="sm"
                >
                  <TrashIcon className="h-3 w-3 mr-1 inline-block" /> 
                  {lang === 'ar' ? "حذف" : "Delete"}
                </Button>
              </div>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  );
}

export default GetAllPayments;