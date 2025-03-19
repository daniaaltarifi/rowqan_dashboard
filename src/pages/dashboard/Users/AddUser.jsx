import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { Eye, EyeOff } from 'lucide-react';
import { API_URL } from "../../../App.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import Cookies from 'js-cookie';

function AddUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("+962");
    const [phoneError, setPhoneError] = useState("");
    const [country, setCountry] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [repeat_password, setRepeat_password] = useState("");
    const [userRole, setUserRole] = useState("");
    const [roles, setRoles] = useState([]);
    const lang = Cookies.get('lang') || 'en';
    const [passwordError, setPasswordError] = useState("");
    const [Chalets, setChalets] = useState([]);
    const [selectedChalets, setSelectedChalets] = useState([]);

    const navigate = useNavigate();

    
    const handlePhoneNumberChange = (e) => {
        let value = e.target.value;
        
        
        if (!value.startsWith('+962')) {
            value = '+962' + value.replace('+962', '');
        }
        
        
        const numberPart = value.slice(4);
        if (!/^\d*$/.test(numberPart)) {
            return;
        }

        
        if (value.length <= 13) {
            setPhoneNumber(value);  
            if (value.length === 13) {
                const jordanianNumberRegex = /^\+962[7-9][0-9]{8}$/;
                if (!jordanianNumberRegex.test(value)) {
                    setPhoneError(lang === 'ar' ? "رقم هاتف أردني غير صالح" : "Invalid Jordanian phone number");
                } else {
                    setPhoneError("");
                }
            } else {
                setPhoneError(lang === 'ar' ? "يجب أن يتكون رقم الهاتف من 9 أرقام بعد 962+" : "Phone number must be 9 digits after +962");
            }
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (phoneError) {
            Swal.fire({
                title: "Error!",
                text: phoneError,
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (password !== repeat_password) {
            setPasswordError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'The Password and Repeat Password does not match');
            return;
        }

        const userData = {
            name,
            email,
            phone_number: phoneNumber,
            country,
            password,
            repeat_password,
            user_type_id: Number(userRole),
            lang,
        };

        if (Number(userRole) === 5) {
            Swal.fire({
                title: lang === 'ar' ? "فشل" : "Failure",
                text: lang === 'ar' ? "ليس لدى المسؤول صلاحية إنشاء مسؤول متميز" : "The admin does not have the authority to create a super admin.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        if (Number(userRole) === 1) {
            userData.chalet_ids = selectedChalets;
        }

        try {
            await axios.post(`${API_URL}/users/createAdmin`, userData);
            Swal.fire({
                title: lang === 'ar' ? "نجاح!" : "Success!",
                text: lang === 'ar' ? "تمت إضافة المستخدم بنجاح." : "User added successfully.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/dashboard/usersAdmin");
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || (lang === 'ar' ? "فشل في إضافة المستخدم. حاول مرة اخرى" : "Failed to add user. Please try again");
            Swal.fire({
                title: lang === 'ar' ? "خطأ!" : "Error!",
                text: errorMessage,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const fetchRoles = useCallback(async () => {
        try {
            const [responseUsersTypes, resChalets] = await Promise.all([
                axios.get(`${API_URL}/userstypes/getAllUsersTypes/${lang}`),
                axios.get(`${API_URL}/chalets/getchalets/${lang}`)
            ]);
            
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
                            <div className="relative">
                                <Input
                                    required
                                    size="lg"
                                    type="tel"
                                    value={phoneNumber}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    onChange={handlePhoneNumberChange}
                                />
                                {phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                                )}
                            </div>

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
                            <div className="relative">
                                <Input
                                    required
                                    size="lg"
                                    type={showPassword ? "text" : "password"}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (repeat_password && e.target.value !== repeat_password) {
                                            setPasswordError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'The Password and Repeat Password does not match');
                                        } else {
                                            setPasswordError('');
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                {lang === 'ar' ? "تأكيد كلمة المرور" : "repeat password"}
                            </Typography>
                            <div className="relative">
                                <Input
                                    required
                                    size="lg"
                                    type={showRepeatPassword ? "text" : "password"}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    onChange={(e) => {
                                        setRepeat_password(e.target.value);
                                        if (password && e.target.value !== password) {
                                            setPasswordError(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'The Password and Repeat Password does not match');
                                        } else {
                                            setPasswordError('');
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                >
                                    {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {passwordError && (
                                <p className="text-red-500 mt-2 text-sm">{passwordError}</p>
                            )}

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
                                <option value="" className="text-gray-500">
                                    {lang === 'ar' ? "اختيار الدور" : "Select Role"}
                                </option>
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

                            {userRole === "1" && (
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
                        className="mt-6 bg-[#6DA6BA] text-white focus:outline-none focus:ring-2 focus:ring-[#D87C55] focus:ring-opacity-50"
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