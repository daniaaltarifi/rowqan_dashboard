import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from 'js-cookie';
import { API_URL } from "@/App";
import Swal from 'sweetalert2';
export function SignIn({ setIsAuthenticated }) {

  const [passwordvisible, setPasswordvisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [ip, setIp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
    const lang = Cookies.get('lang') || 'en';

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("https://api.ipify.org?format=text")
      .then((response) => response.text())
      .then((data) => setIp(data))
      .catch((error) => console.error("Error fetching IP address:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisible = () => setPasswordvisible(!passwordvisible);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = formData;
  
    if (!email || !password) {
      setErrorMessage("Please fill in both fields.");
      return;
    }
  
    try {
      let res;
  
      if (!mfaCode) {
        res = await axios.post(`${API_URL}/users/login`, {
          email,
          password,
          mfaCode,
          ip,
        }, {
          withCredentials: true,
        });
  
        if (res.status === 200 && res.data === "MFA code has been sent to your email. Please enter the code to complete login.") {
          setSmShow(true);
  
          Swal.fire({
            title: lang === 'ar' ? 'تم إرسال الكود بنجاح' : 'MFA Code Sending Successfully',
            icon: 'success',
            confirmButtonText: lang === 'ar' ? 'موافق' : 'OK',
          });
        }
      } else {
        res = await axios.post(`${API_URL}/users/login`, {
          email,
          password,
          mfaCode,
          ip,
        }, {
          withCredentials: true,
        });
  
        if (res.status === 200) {
          Cookies.set('authtoken', res.data.token, { expires: 7, secure: true });
          Cookies.set('userRole', res.data.user_type_id);
          Cookies.set('receiverId', res.data.id);
          setIsAuthenticated(true);
          if (res.data.user_type_id === 1) {
            navigate('/dashboard/home');
          } else if (res.data.user_type_id === 4) {
            navigate('/HomeChaletsOwners');
          } else if (res.data.user_type_id === 5) {
            navigate('/HomeSuperAdmin');
          } else {
            setErrorMessage("You are not authorized to access.");
            Swal.fire({
              title: lang === 'ar' ? 'تم إرسال الكود بنجاح' : 'You are not authorized to access.',
              icon: 'error',
              confirmButtonText: lang === 'ar' ? 'نعم' : 'Okay',
              confirmButtonColor: '#3B82F6'
            });
          }
        } else {
          setErrorMessage("Invalid MFA code or login failed.");
          Swal.fire({
            title: lang === 'ar' ? 'تم إرسال الكود بنجاح' : 'Invalid MFA code or login failed.',
            icon: 'error',
            confirmButtonText: lang === 'ar' ? 'موافق' : 'OK',
            confirmButtonColor: '#3B82F6'
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
  
  
      if (error.response && error.response.status === 400) {
        Swal.fire({
          title: lang === 'ar' ? 'عنوان البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Login failed',
          icon: 'error',
          confirmButtonText: lang === 'ar' ? 'موافق' : 'OK',
          confirmButtonColor: '#3B82F6'
        });
      }
      else if (error.response && error.response.status === 403) {
        Swal.fire({
          title: lang === 'ar' ? 'تم حظر عنوان IP الخاص بك بسبب محاولات تسجيل الدخول الفاشلة العديدة' : 'Your IP is blocked due to too many failed login attempts',
          icon: 'error',
          confirmButtonText: lang === 'ar' ? 'موافق' : 'OK',
          confirmButtonColor: '#3B82F6'
        });
      }
      else if(!mfaCode){
        Swal.fire({
          title: lang === 'ar' ? 'تم إرسال الكود بنجاح' : 'Invalid MFA code or login failed.',
          icon: 'error',
          confirmButtonText: lang === 'ar' ? 'موافق' : 'OK',
          confirmButtonColor: '#3B82F6'
        });
      } 
            
      else {
        setErrorMessage("An error occurred during login.");
      }
    }
  };
  

  return (
    <section className="m-8 flex gap-4">
    <div className="w-full lg:w-3/5 mt-24">
      <div className="text-center mb-6">
        <Typography variant="h2" className="font-bold mb-4">
          {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </Typography>
        <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
          {lang === 'ar' ? 'أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول' : 'Enter your email and password to Sign In.'}
        </Typography>
      </div>
      <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
            {lang === 'ar' ? 'البريد الالكتروني' : 'Your email'}
          </Typography>
          <Input
            name="email"
            type="email"
            size="lg"
            placeholder="name@mail.com"
            value={formData.email}
            onChange={handleChange}
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
            {lang === 'ar' ? 'كلمة السر' : 'Password'}
          </Typography>
          <div className="relative">
            <Input
              name="password"
              type={passwordvisible ? "text" : "password"}
              size="lg"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <button
              type="button"
              onClick={togglePasswordVisible}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {passwordvisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
  
        <Button type="submit" className="mt-6" fullWidth style={{backgroundColor:"#6DA6BA"}}>
          {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </Button>
  
        {errorMessage && (
          <div
            className="error-message mt-3"
            style={{
              color: "red",
              fontSize: "14px",
              textAlign: "center",
              marginBottom: "2vh",
            }}
          >
            {errorMessage}
          </div>
        )}
  
        {smShow && (
          <div className="mt-4">
            <Typography variant="small" color="blue-gray" className="font-medium">
              {lang === 'ar' ? 'أدخل الكود' : 'Enter the Code'}
            </Typography>
            <Input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <Button onClick={handleSubmit} className="mt-4" fullWidth style={{backgroundColor:"#6DA6BA"}}>
              {lang === 'ar' ? 'تسجيل الدخول' : 'SIGN-IN'}
            </Button>
          </div>
        )}
      </form>
    </div>
  
  <div className="w-full lg:w-2/5 h-full hidden lg:block" >
  <img
    src="/img/chal.jpg"
    style={{height:"90vh"}}
    className="h-full w-full object-cover rounded-3xl"
  />
</div>


  </section>
  
  );
}

export default SignIn;
