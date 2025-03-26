import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';

function UpdatePayment() {
    const { id } = useParams();  
    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [remainingAmount, setRemainingAmount] = useState("");
    const [initialAmount, setInitialAmount] = useState("");
    const [method, setMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const lang = Cookies.get('lang') || 'en';

    const navigate = useNavigate();

    const handleUpdatePayment = async (e) => {
        e.preventDefault();

        const paymentData = {
            UserName: userName,
            Phone_Number: phoneNumber,
            RemainningAmount: parseFloat(remainingAmount),
            initialAmount: parseFloat(initialAmount),
            Method: method,
            paymentMethod: paymentMethod
        };

        try {
            await axios.put(`http://localhost:5000/payments/updatePayment/${id}`, paymentData);  
            Swal.fire({
                title: "Success!",
                text: "Payment updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/GetAllPayments"); 
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update payment. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const fetchPaymentData = useCallback(async () => {
      try {
        const response = await axios.get(`http://localhost:5000/payments/getPaymentById/${id}`);
        const payment = response.data;
        if (payment) {
          setUserName(payment.UserName);
          setPhoneNumber(payment.Phone_Number);
          setRemainingAmount(payment.RemainningAmount.toString());
          setInitialAmount(payment.initialAmount.toString());
          setMethod(payment.Method);
          setPaymentMethod(payment.paymentMethod);
        } else {
          console.error("Payment not found");
        }
      } catch (err) {
        console.error("Error fetching payment data:", err);
      }
    }, [id]);

    useEffect(() => {
      fetchPaymentData();
    }, [fetchPaymentData]);

    const paymentMethodOptions = [
      { value: 'cash', label: 'Cash' },
      { value: 'credit', label: 'Credit Card' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'online', label: 'Online Payment' }
    ];

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        {lang === 'ar' ? "تحديث الدفعة" : "Update Payment"}
                    </Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdatePayment}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "اسم المستخدم" : "User Name"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "رقم الهاتف" : "Phone Number"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                type="tel"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "المبلغ المتبقي" : "Remaining Amount"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                type="number"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={remainingAmount}
                                onChange={(e) => setRemainingAmount(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "المبلغ الأولي" : "Initial Amount"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                type="number"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={initialAmount}
                                onChange={(e) => setInitialAmount(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "الطريقة" : "Method"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "طريقة الدفع" : "Payment Method"}
                            </Typography>
                            <select
                                className="form-select block w-full p-3 mt-2 text-lg bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#D87C55] focus:border-[#D87C55] focus:outline-none"
                                name="payment_method"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)} 
                                required
                            >
                                <option value="" className="text-gray-500">
                                    {lang === 'ar' ? "اختيار طريقة الدفع" : "Select Payment Method"}
                                </option>
                                {paymentMethodOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="text-black">
                                        {lang === 'ar' ? 
                                            (option.value === 'cash' ? 'نقدي' :
                                            option.value === 'credit' ? 'بطاقة ائتمان' :
                                            option.value === 'bank_transfer' ? 'تحويل بنكي' :
                                            option.value === 'online' ? 'دفع عبر الإنترنت' : 
                                            option.label) : 
                                            option.label
                                        }
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="mt-6 bg-[#D87C55] text-white hover:bg-[#D87C55]/80 focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
                        fullWidth
                    >
                        {lang === 'ar' ? "تحديث" : "Update"}
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default UpdatePayment;