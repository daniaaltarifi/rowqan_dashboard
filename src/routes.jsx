import { HomeIcon, TagIcon,StopCircleIcon,EnvelopeIcon  ,PhotoIcon,BellIcon,UsersIcon,ClockIcon,Cog6ToothIcon ,ArrowDownCircleIcon,ArrowUpCircleIcon ,ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { Home } from "@/pages/dashboard";
import React, { useState, useEffect } from "react";
import Chalets from "./pages/dashboard/Chalets/Chalets";
import ChaletsOwners from "./ChaletsOwners DashBoard/ChaletsOwners";

import Users from "./Admin DashBoard/UsersPage";
import Abouts from "./pages/dashboard/About/Abouts";
import FooterData from "./pages/dashboard/Footer/FooterData";
import RightTimeChalets from "./pages/dashboard/TimeAndStatus/RightTimeChalets";
import Header from "./pages/dashboard/Header/Header";
import Contact from "./pages/dashboard/Contact/Contact";
import MessagesChaletOwners from "./ChaletsOwners DashBoard/MessagesChaletOwners";
import ContactUsPage from "./Admin DashBoard/ContactUsPage";
import ReservationsPage from "./Admin DashBoard/ReservationsPage";
import GetAllPayments from "./Admin DashBoard/GetAllPayments";
import ReserveChalet from "./Admin DashBoard/ReserveChalet";

const lang = Cookies.get("lang") || "en"; 

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const useRoutes = () => {
  const [userRole, setUserRole] = useState(null); 
  const [isRoleLoaded, setIsRoleLoaded] = useState(false); 

  useEffect(() => {
    const role = Cookies.get("userRole"); 
    if (role) {
      setUserRole(role);
    }
    setIsRoleLoaded(true); 
  }, []);

 
  if (!isRoleLoaded) {
    return null;
  }

 
  const routes = [
    {
      layout: "dashboard",
      pages: [
        ...(userRole === "1"
          ? [
              {
                icon: <HomeIcon {...icon} />,
                name: lang === "ar" ? "الرئيسية" : "Home",
                path: "/home",
                element: <Home />,
              },
              {
                icon: <PhotoIcon {...icon} />,
                name:lang ==='ar'? "الشاليهات" : "Chalets",
                path: "/chalets",
                element: <Chalets />,
              },  
              {
                icon: <StopCircleIcon  {...icon} />,
                name: lang === "ar" ? "الحجوزات" : "Reservations",
                path: "/reservations",
                element: <ReservationsPage />,
              },
              {
                icon: <StopCircleIcon  {...icon} />,
                name: lang === "ar" ? "المدفوعات" : "Payments Users",
                path: "/GetAllPayments",
                element: <GetAllPayments />,
              },
              {
                icon: <StopCircleIcon  {...icon} />,
                name: lang === "ar" ? "احجز الان" : "Reserve Now",
                path: "/reservechalet",
                element: <ReserveChalet />,
              },
              // {
              //   icon: <PhotoIcon {...icon} />,
              //   name:lang ==='ar'? "خصائص الشاليهات" : "Properties Chalets",
              //   path: "/propertieschalets",
              //   element: <Properties />,
              // },
              // {
              //   icon: <TagIcon {...icon} />,
              //   name: lang === "ar" ? "مالكي الشاليهات" : "Chalets Owners",
              //   path: "/ChaletsOwners",
              //   element: <ChaletsOwnersPage />,
              // },
              {
                icon: <EnvelopeIcon  {...icon} />,
                name: lang === "ar" ? "الرسائل" : "Messages",
                path: "/messages",
                element: <MessagesChaletOwners />,
              },
              {
                icon: <UsersIcon {...icon} />,
                name: lang === "ar" ? "صفحة المستخدمين" : "Users",
                path: "/usersAdmin",
                element: <Users />,
              },
              {
                icon: <Cog6ToothIcon  {...icon} />,
                name: lang === "ar" ? "الاعدادات" : "Setting",
                path: "/setting",
                element: <Abouts />,
              },
            
            ]
          : []),
        ...(userRole === "4"
          ? [
              {
                icon: <HomeIcon {...icon} />,
                name: lang === "ar" ? "الرئيسية" : "Home",
                path: "/home",
                element: <Home />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar"
                  ? "مالكي الشاليهات"
                  : "Chalets Owners",
                path: "/ChaletsOwners",
                element: <ChaletsOwners />,
              },
              {
                icon: <PhotoIcon {...icon} />,
                name: lang === "ar"
                  ? " الشاليهات"
                  : "Chalets",
                path: "/chalets",
                element: <Chalets />,
              },
              {
                icon: <ChatBubbleOvalLeftEllipsisIcon {...icon} />,
                name: lang === "ar"
                  ? "رسائل الشاليهات"
                  : "Messages",
                path: "/messages",
                element: <MessagesChaletOwners />,
              },
            ]
          : []),
        ...(userRole === "5"
          ?  [
            {
              icon: <HomeIcon {...icon} />,
              name: lang === "ar" ? "الرئيسية" : "Home",
              path: "/home",
              element: <Home />,
            },
            {
              icon: <PhotoIcon {...icon} />,
              name:lang ==='ar'? "الشاليهات" : "Chalets",
              path: "/chalets",
              element: <Chalets />,
            },  
            {
              icon: <StopCircleIcon  {...icon} />,
              name: lang === "ar" ? "الحجوزات" : "Reservations",
              path: "/reservations",
              element: <ReservationsPage />,
            },
            {
              icon: <StopCircleIcon  {...icon} />,
              name: lang === "ar" ? "المدفوعات" : "Payments",
              path: "/GetAllPayments",
              element: <GetAllPayments />,
            },
            {
              icon: <StopCircleIcon  {...icon} />,
              name: lang === "ar" ? "احجز الان" : "Reserve Now",
              path: "/reservechalet",
              element: <ReserveChalet />,
            },
            {
              icon: <EnvelopeIcon  {...icon} />,
              name: lang === "ar" ? "الرسائل" : "Messages",
              path: "/messages",
              element: <MessagesChaletOwners />,
            },
            {
              icon: <UsersIcon {...icon} />,
              name: lang === "ar" ? "صفحة المستخدمين" : "Users",
              path: "/usersAdmin",
              element: <Users />,
            },
            {
              icon: <Cog6ToothIcon  {...icon} />,
              name: lang === "ar" ? "الاعدادات" : "Setting",
              path: "/setting",
              element: <Abouts />,
            },
            {
              icon: <ClockIcon {...icon} />,
              name: lang === "ar" ? "التواصل" : "Status",
              path: "/status",
              element: <RightTimeChalets />,
            },
            
            {
              icon: <ArrowUpCircleIcon  {...icon} />,
              name: lang === "ar" ? "اعلى الصفحة" : "Header",
              path: "/header",
              element: <Header />,
            },
            {
              icon: <ArrowDownCircleIcon {...icon} />,
              name: lang === "ar" ? "أسفل الصفحة" : "Footer",
              path: "/footer",
              element: <FooterData />,
            },
           
            {
              icon: <ChatBubbleOvalLeftEllipsisIcon  {...icon} />,
              name: lang === "ar" ? "التواصل" : "Contact",
              path: "/contact",
              element: <Contact />,
            },
            {
              icon: <ChatBubbleOvalLeftEllipsisIcon  {...icon} />,
              name: lang === "ar" ? "التواصل" : "Contact Us",
              path: "/contactUs",
              element: <ContactUsPage />,
            },
            
          ]
          : []),
      ],
    },
  ];

  return routes;
};

export default useRoutes;
