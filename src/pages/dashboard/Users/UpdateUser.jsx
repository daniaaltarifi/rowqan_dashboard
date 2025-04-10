import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';

function UpdateUser() {
    const { id } = useParams();  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");
    const [password, setPassword] = useState(""); 
    const [userRole, setUserRole] = useState(""); 
    const [roles, setRoles] = useState([]);
    const lang = Cookies.get('lang') || 'en';
    const [Chalets, setChalets] = useState([]);
    const [selectedChalets, setSelectedChalets] = useState([]);
  
    const navigate = useNavigate();


    const handleUpdateUser = async (e) => {
        e.preventDefault();

       
        const userData = {
            name,
            email,
            phone_number: phoneNumber,
            country,
            lang,
            user_id:id,
            user_type_id: userRole, 
        };

        try {
            await axios.put(`${API_URL}/users/updateUser/${id}`, userData);  
            Swal.fire({
                title: "Success!",
                text: "User updated successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/usersAdmin");
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update user. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    
    const fetchUserData = useCallback(async () => {
      try {
        const response = await axios.get(`${API_URL}/users/getUserById/${id}/${lang}`);
        const user = response.data;
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setPhoneNumber(user.phone_number);
          setCountry(user.country);
          if (user.Users_Type.length > 0) {
            setUserRole(user.Users_Type[0].id);  
          } else {
            console.error("User type not found");
          }
          setSelectedChalets(user.chalets.map((chalet) => chalet.id));  // Update selected chalets state
        } else {
          console.error("User not found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }, [id]);

    
    const fetchRoles = useCallback(async () => {
      try {
        const[responseUsersTypes,resChalets] = await Promise.all([
            axios.get(`${API_URL}/userstypes/getAllUsersTypes/${lang}`),
            axios.get(`${API_URL}/chalets/getchalets/${lang}`)
        ])
        if (Array.isArray(responseUsersTypes.data)) {
          setRoles(responseUsersTypes.data); 
        } else {
          console.error("Error: Roles data is not in the expected format.");
        }
        if (Array.isArray(resChalets.data)) {
            setChalets(resChalets.data); 
        } else {
            console.error("Error: Chalets data is not in the expected format.");
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    }, [lang]);

    useEffect(() => {
      fetchUserData();  
      fetchRoles();  
    }, [fetchUserData, fetchRoles]);
    console.log("user",userRole)


    return (
        <section className="m-8 flex gap-4">
            <div className="w-full mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        {lang === 'ar' ? "تحديث المستخدم" : "Update User"}
                    </Typography>
                </div>
                <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateUser}>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex flex-col">
                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "اسم المستخدم" : "Name"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={name}
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
                                value={email}
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
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "البلد" : "Country"}
                            </Typography>
                            <Input
                                required
                                size="lg"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "كلمة المرور" : "Password"}
                            </Typography>
                            <Input
                                size="lg"
                                type="password"
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                value={password}
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
                            {Number(userRole) === 1 && (
  <div className="mt-4">
    <label className="block text-lg font-semibold">
      {lang === 'ar' ? "اختر الشاليهات" : "Select Chalets"}
    </label>
    <div className="grid grid-cols-2 gap-3 mt-2">
      {Chalets.map((chalet) => (
        <label key={chalet.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={chalet.id}
            checked={selectedChalets.includes(chalet.id)}
            onChange={(e) => {
              const checked = e.target.checked;
              setSelectedChalets((prev) =>
                checked ? [...prev, chalet.id] : prev.filter((id) => id !== chalet.id)
              );
            }}
            className="w-5 h-5 text-[#D87C55] border-gray-300 rounded focus:ring-[#D87C55]"
          />
          <span>{chalet.title}</span>
        </label>
      ))}
    </div>
  </div>
)}

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

export default UpdateUser;
