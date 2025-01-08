import {
  HomeIcon,
  UserCircleIcon,
  TagIcon, 
  ShoppingBagIcon,
  CreditCardIcon,
  WalletIcon,
  ChatBubbleLeftEllipsisIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid"; 
import { BiSolidCoupon } from "react-icons/bi";
import { Home, Products } from "@/pages/dashboard";
import Feedback from "./pages/dashboard/Feedback/Feedback";
import Wallet from "./pages/dashboard/Wallet/Wallet";
import Category from "./pages/dashboard/Category/Category";
import Blogs from "./pages/dashboard/Blogs/Blogs";

import Cookies from "js-cookie";
import Chalets from "./pages/dashboard/Chalets/Chalets";
import Properties from "./pages/dashboard/Properties/Properties";
import HomeAdminPage from "./Admin DashBoard/HomeAdminPage";
import UsersPage from "./Admin DashBoard/UsersPage";
import ChaletsOwnersPage from "./Admin DashBoard/ChaletsOwnersPage";
import ReservationsPage from "./Admin DashBoard/ReservationsPage";
import ChaletsPage from "./Admin DashBoard/ChaletsPage";
import HomeChaletOwners from "./ChaletsOwners DashBoard/HomeChaletOwners";
import Messages from "./ChaletsOwners DashBoard/Messages";
import ReservationePage from "./ChaletsOwners DashBoard/ReservationePage";
import HomeSuperAdmin from "./SuperAdmin DashBoard/HomeSuperAdmin";


const lang = Cookies.get('lang') || 'en';
const userRole = Cookies.get('userRole'); 

console.log(`The User Role is: ${userRole}`);

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
    
      ...(userRole === '1' ? [
        {
          icon: <HomeIcon {...icon} />,
          name: lang ==='ar'? "الرئيسية" :"Home",
          path: "/home",
          element: <Home />,
        },
        {
          icon: <TagIcon {...icon} />,
          name: lang === 'ar' ? "مالكي الشاليهات" : "Chalets Owners Page",
          path: "/HomeAdmin",
          element: <HomeAdminPage />,
        },
        {
          icon: <TagIcon {...icon} />,
          name: lang === 'ar' ? "مالكي الشاليهات" : "Chalets Owners Page",
          path: "/chaletOwners",
          element: <ChaletsOwnersPage />,
        },
        {
          icon: <BiSolidCoupon {...icon} />,
          name: lang === 'ar' ? "صفحة الحجوزات" : "Reservations Page",
          path: "/reservationsPage",
          element: <ReservationsPage/>,
        },
        {
          icon: <ShoppingBagIcon {...icon} />,
          name:lang ==='ar'? "الشاليهات" : "Chalets",
          path: "/chalets",
          element: <Chalets />,
        },  {
          icon: <ShoppingBagIcon {...icon} />,
          name:lang ==='ar'? "خصائص الشاليهات" : "Properties Chalets",
          path: "/propertieschalets",
          element: <Properties />,
        },
        {
          icon: <WalletIcon {...icon} />,
          name: lang === 'ar' ? "المحفظة" : "Wallet",
          path: "/wallet",
          element: <Wallet />,
        },
        {
          icon: <NewspaperIcon {...icon} />,
          name: lang === 'ar' ? "المدونات" : "Blogs",
          path: "/blogs",
          element: <Blogs />,
        },
        {
          icon: <ChatBubbleLeftEllipsisIcon {...icon} />,
          name: lang === 'ar' ? "الاراء" : "FeedBack",
          path: "/feedback",
          element: <Feedback />,
        },
      ] : []),

      ...(userRole === '4' ? [
        {
          icon: <TagIcon {...icon} />,
          name: lang === 'ar' ? "الصفحة الرئيسية لمالكي الشاليهات" : "Home Chalets Owners Page",
          path: "/HomeChaletsOwners",
          element:<HomeChaletOwners/>,
        },
        {
          icon: <TagIcon {...icon} />,
          name: lang === 'ar' ? "صفحة الرسائل لمالكي الشاليهات" : "Messages of Chalets Owners Page",
          path: "/Messages",
          element:<Messages/>,
        },
        {
          icon: <WalletIcon {...icon} />,
          name: lang === 'ar' ? "صفحة الحجوزات لمالكي الشاليهات" : "Reservation Page Of Chalets Owners Page",
          path: "/ReservationChaletsOwnersPage",
          element: <ReservationePage/>,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: lang === 'ar' ? "صفحة المستخدمين لمالكي الشاليهات" : "Users page",
          path: "/Users",
          element: <UsersPage/>,
        },
      ] : []),

      ...(userRole === '5' ? [
        {
          icon: <TagIcon {...icon} />,
          name: lang === 'ar' ? "الصفحة الرئيسية" : "Home Page",
          path: "/HomeSuperAdmin",
          element:<HomeSuperAdmin/>,
        },
        {
          icon: <TagIcon {...icon} />,
          name: lang === 'ar' ? "صفحة  الشاليهات" : "Chalets Page",
          path: "/Chalets",
          element:<ChaletsPage/>,
        },
        {
          icon: <WalletIcon {...icon} />,
          name: lang === 'ar' ? "صفحة الحجوزات لمالكي الشاليهات" : "Reservation Page Of Chalets Owners Page",
          path: "/ChaletsOwners",
          element: <ChaletsOwnersPage/>,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: lang === 'ar' ? "صفحة المستخدمين لمالكي الشاليهات" : "Users page",
          path: "/Users",
          element: <UsersPage/>,
        },
        {
          icon: <UserCircleIcon {...icon} />,
          name: lang === 'ar' ? "صفحة الحجوزات" : "Reservations page",
          path: "/ReservationsPage",
          element: <ReservationePage/>,
        },
      ] : []),
    ],
  },
];

export default routes;
