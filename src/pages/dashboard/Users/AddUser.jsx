import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';

function AddUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");
    const [password, setPassword] = useState(""); 
    const [userRole, setUserRole] = useState(""); 
    const [roles, setRoles] = useState([]);
    const lang = Cookies.get('lang') || 'en';

    const navigate = useNavigate();

    const handleAddUser = async (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            phone_number: phoneNumber,
            country,
            password,
            lang,
            user_type_id: userRole, 
        };

        try {
            await axios.post(`${API_URL}/users/createUser`, userData);
            Swal.fire({
                title: "Success!",
                text: "User added successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/usersAdmin");
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to add user. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const fetchRoles = useCallback(async () => {
      try {
        const response = await axios.get(`${API_URL}/userstypes/getAllUsersTypes/${lang}`);
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setRoles(response.data); 
        } else {
          console.error("Error: Roles data is not in the expected format.");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    }, [lang]);

    useEffect(() => {
      fetchRoles();
    }, [fetchRoles]);

    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        {lang === 'ar' ? "إضافة مستخدم" : "Add User"}
                    </Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleAddUser}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "اسم المستخدم" : "Name"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "البريد الإلكتروني" : "Email"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                type="email"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "رقم الهاتف" : "Phone Number"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                type="tel"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "البلد" : "Country"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setCountry(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "كلمة المرور" : "Password"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                type="password"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "نوع المستخدم" : "User Type"}
                            </Typography>
                            <select
    className="form-select block w-full p-3 mt-2 text-lg bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#D87C55] focus:border-[#D87C55] focus:outline-none"
    name="user_role"
    value={userRole}
    onChange={(e) => setUserRole(e.target.value)} 
    required
>
    <option value="" className="text-gray-500">{lang === 'ar' ? "اختيار الدور" : "Select Role"}</option>
    {roles.length > 0 ? (
      roles.map((role) => (
        <option key={role.id} value={role.id} className="text-black">
          {role.type}
        </option>
      ))
    ) : (
      <option disabled>{lang === 'ar' ? "جارِ تحميل الأدوار..." : "Loading roles..."}</option>
    )}
</select>

                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="mt-6 bg-[#6DA6BA] text-white  focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
                        fullWidth
                    >
                        {lang === 'ar' ? "إضافة" : "Add"}
                    </Button>
                </form>
            </div>
        </section>
    );
}

export default AddUser;
