import { useLocation, Link ,useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,

  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { API_URL } from "@/App";
import Cookies from "js-cookie";
import axios from "axios";
import LanguageSwitcher from "@/LanguageSwitcher";
export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const lang = Cookies.get('lang') || 'en';

  const navigate=useNavigate()
  const handleLogout = async () => {
    Swal.fire({
      title: lang === 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are You Sure To Logged Out from this System',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: lang === 'ar' ? 'نعم' : 'Okay',
      cancelButtonText: lang === 'ar' ? 'لا' : 'Cancel',
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#F87171',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_URL}/users/logout`,
            {},
            { withCredentials: true }
          );
          if (response.data.message === "Logged out successfully") {
            navigate(`/auth/sign-in`);
            Cookies.remove('authtoken');
            Cookies.remove('userRole');
            // localStorage.removeItem("account");
            // window.location.reload()
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    });
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
        <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
            <Button
             onClick={handleLogout}
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                {lang ==='ar'? "تسجيل الخروج" :"Logout"  }      
            </Button>
            <IconButton
             onClick={handleLogout}
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
            <LanguageSwitcher/> 

          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
