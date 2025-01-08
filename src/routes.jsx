import { HomeIcon, TagIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { Home, Products } from "@/pages/dashboard";
import HomeAdminPage from "./Admin DashBoard/HomeAdminPage";
import ReservationsPage from "./Admin DashBoard/ReservationsPage";
import HomeChaletOwners from "./ChaletsOwners DashBoard/HomeChaletOwners";
import ChaletsPage from "./Admin DashBoard/ChaletsPage";
import React, { useState, useEffect } from "react";

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
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "مالكي الشاليهات" : "Chalets Owners Page",
                path: "/HomeAdmin",
                element: <HomeAdminPage />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "صفحة الحجوزات" : "Reservations Page",
                path: "/reservationsPage",
                element: <ReservationsPage />,
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
                  ? "الصفحة الرئيسية لمالكي الشاليهات"
                  : "Home Chalets Owners Page",
                path: "/HomeChaletsOwners",
                element: <HomeChaletOwners />,
              },
            ]
          : []),
        ...(userRole === "5"
          ? [
              {
                icon: <HomeIcon {...icon} />,
                name: lang === "ar" ? "الرئيسية" : "Home",
                path: "/home",
                element: <Home />,
              },
              {
                icon: <TagIcon {...icon} />,
                name: lang === "ar" ? "صفحة الشاليهات" : "Chalets Page",
                path: "/Chalets",
                element: <ChaletsPage />,
              },
            ]
          : []),
      ],
    },
  ];

  return routes;
};

export default useRoutes;
